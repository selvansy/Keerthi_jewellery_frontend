import React, { useState, useEffect } from "react";
import Table from "../../common/Table";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getallgiftvendor,
  getallbranch,
  getallgiftitemtable,
  changegiftitemStatus,
  deletegiftitem,
  getgiftitemById,
  updategiftitem,
  addgiftitem,
} from "../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../../redux/modalSlice";
import { eventEmitter } from "../../../../utils/EventEmitter";
import ModelOne from "../../common/Modelone";
import Modal from "../../../components/common/Modal";
import { useDebounce } from "../../../hooks/useDebounce";
import GiftHandOverForm from "./GiftItemForm";
import Loading from "../../common/Loading";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";

const GiftHandOver = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isviewOpen, setIsviewOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [id, setId] = useState("");

  const [giftitemData, setgiftitemData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [entries, Setentries] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 500);
  const limit = 10;

  useEffect(() => {
    getallgiftitemtableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [currentPage, debouncedSearch, itemsPerPage]);

  const refetchTable = () => {
    getallgiftitemtableMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
    });
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

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getallgiftitemtableMutate } = useMutation({
    mutationFn: (payload) => getallgiftitemtable(payload),
    onSuccess: (response) => {
      if (response) {
        setgiftitemData(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalDocuments(response.totalDocument);
        Setentries(response.totalDocument);
      }
      setisLoading(false);
    },
    onError: () => {
      setisLoading(false);
      setgiftitemData([]);
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changegiftitemStatus(id);
      toast.success(response.message);

      setgiftitemData((prevData) =>
        prevData.map((giftitem) =>
          giftitem._id === id
            ? { ...giftitem, active: currentStatus === true ? false : true }
            : giftitem
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleEdit = (id) => {
    setId(id);
    setIsviewOpen(true);
  };

  const handleAddgiftitem = () => {
    setIsviewOpen(true);
  };

  const handleDelete = (id) => {
    setId(id);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete giftitem",
        formData: {
          message: "Are you sure you want to delete this giftitem?",
          giftitemId: id,
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
  const { mutate: deleteGiftItem } = useMutation({
    mutationFn: (id) => deletegiftitem(id),
    onSuccess: (response) => {
      if (response.message === "Gift deleted successfully") {
        const isLastItemOnPage = giftitemData.length === 1;

        const isNotFirstPage = currentPage > 1;
        if (isLastItemOnPage && isNotFirstPage) {
          setCurrentPage((prev) => prev - 1);
        } else {
          getallgiftitemtableMutate({
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
      deleteGiftItem(data.giftitemId);
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

  const nextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Gift Name",
      cell: (row) => row?.gift_name || "N/A",
    },
    {
      header: "Vendor Name",
      cell: (row) => row?.gift_vendor?.vendor_name || "N/A",
    },
    {
      header: "Create Date",
      cell: (row) => formatDate(row?.createdAt),
    },
    {
      header: "Status",
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
              row?.active === true
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
          data={giftitemData}
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

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="flex flex-col p-4 relative">
      {isLoading ? (
        <div className="flex justify-center items-center mt-[150px]">
          <Loading />
        </div>
      ) : (
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Gift Item</h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
            <div className="relative w-full lg:w-1/3 min-w-[200px]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-500" />
              </div>
              <input
                onChange={handleSearch}
                placeholder="Search..."
                className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
              />
            </div>
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                onClick={handleAddgiftitem}
                style={{ backgroundColor: layout_color }}
              >
                + Add Gift Item
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Table
              data={giftitemData}
              columns={columns}
              isLoading={isLoading}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalDocuments}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </>
      )}
      <ModelOne
        title={id ? "Edit GiftItem" : "Add GiftItem"}
        extraClassName="max-w-[75%] "
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
      >
        <GiftHandOverForm
          setId={setId}
          id={id}
          refetchTable={refetchTable}
          isviewOpen={isviewOpen}
          setIsOpen={setIsviewOpen}
        />
      </ModelOne>
      <Modal />
    </div>
  );
};

export default GiftHandOver;
