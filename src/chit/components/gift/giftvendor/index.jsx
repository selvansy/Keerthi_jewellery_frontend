import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { Search } from "lucide-react";
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
import { toast } from "sonner";
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
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
// import { customSelectStyles } from "../../Setup/purity";
import plus from "../../../../assets/plus.svg";



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
  const [searchLoading, setSearchLoading] = useState(false);

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const [searchInput, setSearch] = useState("");
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
      limit: itemsPerPage,
      active: activeFilter
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
      setSearchLoading(false)
      setisLoading(false);
    },
    onError: () => {
      setgiftvendorData([]);
      setSearchLoading(false)
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
            active: activeFilter
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



  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Gift" }, { label: "Gift Vendor", active: true }]}
      />

      <div className="flex flex-col p-4  bg-white border border-[#F2F2F9]  rounded-[16px]">

        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          {/* Search Input - Full width on mobile, moves to right side on desktop */}
          <div className="relative w-full  sm:mb-0 sm:order-2 sm:w-auto">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-[#6C7086] h-5 w-5" />
              )}
            </div>
            <input
              onChange={(e) => {
                setSearchLoading(true);
                setSearch(e.target.value);
              }}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] text-[#6C7086] text-md rounded-[8px] h-[36px] w-full sm:w-[228px]"
            />
          </div>

          {/* Container for ActiveDropdown and Add Category button */}
          <div className="flex flex-row w-full sm:order-1 sm:w-auto sm:mr-auto">
            {/* ActiveDropdown - half width on mobile */}
            <div className="w-1/2 sm:w-auto me-1">
              <ActiveDropdown  setActiveFilter={setActiveFilter} />
            </div>

            {/* Button - half width on mobile, moves to right on desktop */}
            <div className="w-1/2 sm:hidden">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"

                style={{ backgroundColor: layout_color }}
                onClick={handleAddgiftvendor}
              >
                + Add Gift Vendor
              </button>
            </div>
          </div>

          {/* Desktop-only button - appears on the right side */}
          <div className="hidden sm:block sm:order-3 items-center">
            <button
              type="button"
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto" style={{ backgroundColor: layout_color }}
              onClick={handleAddgiftvendor}
            >
              <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
               Add Gift Vendor
            </button>
          </div>
        </div>

        <div className="mt-4">
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
    </>
  );
};

export default Giftvendor;
