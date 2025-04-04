import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getallgiftvendor,
  getallbranch,
  getAllgiftvendors,
  changegiftvendorStatus,
  deletegiftvendor,
  getgiftvendorById,
  updategiftvendor,
  addgiftvendor,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useDispatch, useSelector } from "react-redux";
import ModelOne from "../../../components/common/Modelone";
import Modal from "../../../components/common/Modal";
import { useDebounce } from "../../../hooks/useDebounce";
import { setid } from "../../../../redux/clientFormSlice";
import GiftVendorForm from "./GiftVendorForm";
import Loading from "../../common/Loading";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";
import ActiveDropdown from "../../common/ActiveDropdown";
// import { customSelectStyles } from "../../Setup/purity";



const Giftvendor = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [giftvendorData, setgiftvendorData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const [activeFilter, setActiveFilter] = useState(null)
  const [totalPages, setTotalPages] = useState(0);
  const [entries, Setentries] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [id, setId] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);


  useEffect(() => {

    let payload = {
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage
    }

    if (activeFilter !== null) {
      payload.active = activeFilter
    }

    getAllgiftvendorsMutate(payload);

  }, [currentPage, debouncedSearch, itemsPerPage, activeFilter]);

  const refetchTable = () => {
    getAllgiftvendorsMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage
    });
  };

  const { mutate: getAllgiftvendorsMutate } = useMutation({
    mutationFn: (payload) => getAllgiftvendors(payload),
    onSuccess: (response) => {
      if (response) {
        setgiftvendorData(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalDocuments(response.totalDocument);
        Setentries(response.totalDocument);
      }
      setisLoading(false);
    },
    onError: () => {
      setgiftvendorData([]);
      setisLoading(false);
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changegiftvendorStatus(id);
      toast.success(response.message);

      setgiftvendorData((prevData) =>
        prevData.map((giftvendor) =>
          giftvendor._id === id
            ? { ...giftvendor, active: currentStatus === true ? false : true }
            : giftvendor
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };

  const handleAddgiftvendor = () => {
    setIsviewOpen(true);
  };

  const handleDelete = (id) => {
    setId(id);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete giftvendor",
        formData: {
          message: "Are you sure you want to delete this giftvendor?",
          giftvendorId: id,
        },
        buttons: {
          cancel: {
            text: "Cancel",
          },
          submit: {
            text: "Delete",
          },
        },
      })
    );
  };
  const { mutate: deleteGiftVendor } = useMutation({
    mutationFn: (id) => deletegiftvendor(id),
    onSuccess: (response) => {
      if (response.message === "Vendor deleted successfully") {
        const isLastItemOnPage = giftvendorData.length === 1;
        const isNotFirstPage = currentPage > 1;
        if (isLastItemOnPage && isNotFirstPage) {
          setCurrentPage((prev) => prev - 1);
        } else {
          getAllgiftvendorsMutate({
            search: debouncedSearch,
            page: currentPage,
            limit: itemsPerPage,
          });
        }
      }
      toast.success(response.message);
      eventEmitter.off("CONFIRMATION_SUBMIT");
      setId("");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to delete");
    },
  });

  useEffect(() => {
    const handleDelete = (data) => {
      deleteGiftVendor(data.giftvendorId);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Vendor Name",
      accessor: "vendor_name",
      cell: (row) => row?.vendor_name || "N/A",
    },
    {
      header: "Mobile Number",
      cell: (row) => row?.mobile || "N/A",
    },
    {
      header: "Address",
      cell: (row) => row?.address || "N/A",
    },
    {
      header: "Gst",
      cell: (row) => row?.gst || "N/A",
    },
    {
      header: "Active",
      accessor: "active",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id, row?.active)}
          />
          <div
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${row?.active === true
              ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
              : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}
          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={giftvendorData}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ),
      sticky: "right",
    },
  ];

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };
  
  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  return (
    <div className="flex flex-col p-4 relative">
      {isLoading ? (
        <div className="flex justify-center items-center mt-[150px]">
          <Loading />
        </div>
      ) : (
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Gift Vendor</h2>
          <div className="relative shadow-sm rounded-lg overflow-hidden mt-8">

            <div className="bg-white p-4 lg:justify-between  grid grid-cols-12 gap-4 items-center">

              {/* Dropdown - full width on small, 3 cols on lg */}
              <div className=" col-span-12 lg:col-span-4 md:col-span-6">
                <ActiveDropdown setActiveFilter={setActiveFilter} />
              </div>

              {/* Search + Button */}
              <div className=" col-span-12 lg:col-span-8 md:col-span-6 flex flex-col lg:flex-row justify-end items-center lg:items-center gap-2">

                {/* Search Input */}
                <div className="relative w-full lg:w-auto">
                  <input
                    type="text"
                    onChange={handleSearch}
                    className="w-full min-w-[220px] max-w-[300px] border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 pr-10 p-2.5"
                    placeholder="Search"
                  />
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                </div>

                {/* Add Gift Vendor Button */}
                <div className="w-full lg:w-auto">
                  <button
                    type="button"
                    className="w-full lg:w-[179px] text-[14px] font-medium text-white rounded-lg px-5 py-[12px] inline-flex items-center justify-center"
                    style={{ backgroundColor: layout_color }}
                    onClick={handleAddgiftvendor}
                  >
                    <Plus size={20} strokeWidth={2.5} className="me-2" />
                    Add Gift Vendor
                  </button>
                </div>

              </div>
            </div>




            <div className="bg-white p-3">
              <Table
                data={giftvendorData}
                columns={columns}
                isLoading={isLoading}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalDocuments}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </div>


        </>
      )}
      <ModelOne
        title={id ? "Edit Gift Vendor" : "Add Gift Vendor"}
        extraClassName='w-1/3'
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
      >
        <GiftVendorForm
          isviewOpen={isviewOpen}
          setIsOpen={setIsviewOpen}
          id={id}
          setId={setId}
          refetchTable={refetchTable}
        />
      </ModelOne>
      <Modal />
    </div>
  );
};

export default Giftvendor;
