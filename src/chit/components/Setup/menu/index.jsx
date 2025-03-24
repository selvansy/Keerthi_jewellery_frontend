import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { openModal } from "../../../../redux/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../common/Table";
import { setid } from "../../../../redux/clientFormSlice";
import {
  getallmenudatatable,
  changeMenuStatus,
  deleteMenu,
} from "../../../api/Endpoints";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { useDebounce } from "../../../hooks/useDebounce";
import ModelOne from "../../common/Modelone";
import MenuForm from "./MenuForm";
import Modal from "../../../components/common/Modal";
import usePagination from "../../../hooks/usePagination";
import Action from "../../common/action";

const MenuComp = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const [MenuData, setMenuData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [totalDocuments,setTotalDocuments]=useState(0)

  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  const { mutate: getAllMenusMutate } = useMutation({
    mutationFn: (payload) => getallmenudatatable(payload),
    onSuccess: (response) => {
      if (response) {
        setMenuData(response.data);
        setTotalPages(response.totalPages);
        setTotalDocuments(response.totalDocuments)
      }
      setisLoading(false);
    },
    onError: () => {
      setisLoading(false);
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      let response = await changeMenuStatus(id);
      toast.success(response.message);
      setMenuData((prevData) =>
        prevData.map((Menu) =>
          Menu._id === id
            ? { ...Menu, active: currentStatus === true ? false : true }
            : Menu
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getAllMenusMutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen]);

  const handleEdit = async (id) => {
    dispatch(setid(id));
    setIsviewOpen(true);
  };

  const handleAddMenu = () => {
    setIsviewOpen(true);
  };

  const handleDelete = (id) => {
    setActiveDropdown(null);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Menu",
        formData: {
          message: "Are you sure you want to delete this menu?",
          menuId: id,
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

  const { mutate: deleteMenuMutation } = useMutation({
    mutationFn: (id) => deleteMenu(id),
    onSuccess: () => {
      toast.success("Menu deleted successfully");
      getAllMenusMutate({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
      });
    },
    onError: (error) => {
      toast.error("Failed to delete menu");
      console.error("Delete error:", error);
    },
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      getAllMenusMutate({ search: debouncedSearch, page, limit: itemsPerPage });
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  useEffect(() => {
    const handleConfirmationSubmit = async (data) => {
      if (data && data.menuId) {
        deleteMenuMutation(data.menuId);
      }
    };
    eventEmitter.on("CONFIRMATION_SUBMIT", handleConfirmationSubmit);
    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleConfirmationSubmit);
    };
  }, [eventEmitter]);

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Menu Name",
      accessor: "menu_name",
    },
    {
      header: "Display Order",
      accessor: "display_order",
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
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={MenuData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
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
        <div>Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl text-gray-900 font-bold">Menu</h2>
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
                onClick={handleAddMenu}
                style={{ backgroundColor: layout_color }}
              >
                + Add Menu
              </button>
            </div>
          </div>

          <div className="mt-4">
            <Table
              data={MenuData}
              columns={columns}
              currentPage={currentPage}
              handleItemsPerPageChange={handleItemsPerPageChange}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalDocuments}
              loading={isLoading}
            />
          </div>
        
        </>
      )}
      <Modal />
      <ModelOne
        title={"Add Menu"}
        extraClassName="max-w-lg"
        setIsOpen={setIsviewOpen}
        isOpen={isviewOpen}
        closeModal={closeIncommingModal}
      >
        <MenuForm setIsOpen={setIsviewOpen} />
      </ModelOne>
    </div>
  );
};

export default MenuComp;