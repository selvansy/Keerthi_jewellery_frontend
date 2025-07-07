import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { useSelector, useDispatch } from "react-redux";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getcategoryTable,
  getallbranch,
  getBranchById,
  getallmetal,
  deletecategory,
  activatecategory,
} from "../../../api/Endpoints";
import { setid } from "../../../../redux/clientFormSlice";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { openModal } from "../../../../redux/modalSlice";
import Modal from "../../../components/common/Modal";
import usePagination from "../../../hooks/usePagination";
import { useDebounce } from "../../../hooks/useDebounce";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import AddCategory from "./AddCategory";
import ModelOne from "../../common/Modelone";
import ActiveDropdown from "../../common/ActiveDropdown";
import plus from "../../../../assets/plus.svg";


const Category = () => {
  const limit = 10;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const branchAccess = roledata?.branch;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [id, setId] = useState();
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null)

  function closeIncommingModal() {
    setIsviewOpen(false);
    setId("");
  }

  const clearId = () => {
    setId("");
  };
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

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };
  const paginationButtons = usePagination(paginationData);

  useEffect(() => {
   
    getCategory({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      from_date,
      to_date,
      active:activeFilter??""
    });
  }, [currentPage, itemsPerPage, debouncedSearch, isviewOpen,activeFilter]);

  useEffect(() => {
    const handleDelete = (id) => {
      setDeleteId(id);
      deleteCategory(id);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  //mutation to get scheme type
  const { mutate: getCategory } = useMutation({
    mutationFn: (payload) => getcategoryTable(payload),
    onSuccess: (response) => {
      ;
      setCategoryData(response?.data);
      setTotalPages(response.totalPages);
      setIsLoading(false);
      setSearchLoading(false);
      setTotalDocuments(response.totalDocuments);
    },
    onError: (error) => {
      console.error("Error:", error);
      setCategoryData([]);
      setIsLoading(false);
      setSearchLoading(false);
    },
  });

  // mutation for delete category
  const { mutate: deleteCategory } = useMutation({
    mutationFn: ({ CategoryId }) => deletecategory(CategoryId),
    onSuccess: (response) => {
      toast.success(response.message);
      getCategory({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        active:activeFilter
      });

      setDeleteId(null);
      eventEmitter.off("CONFIRMATION_SUBMIT");
    },
    onError: (error) => {
      setDeleteId(null);
      console.error("Error fetching countries:", error);
      eventEmitter.off("CONFIRMATION_SUBMIT");
    },
  });

  // edit handler
  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };

  // delete handler
  const handleDelete = (id) => {
    setActiveDropdown(null);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Category",
        formData: {
          message: "Are you sure you want to delete this category? This will also delete all products related to this category, and this action cannot be undone.",
          CategoryId: id,
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

  // active and block handler
  const handleStatusToggle = async (id) => {
    let response = await activatecategory(id);
    if (response) {
      setCategoryData((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, active: !cat.active } : cat
        )
      );
      getCategory({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
        active:activeFilter
      });
      toast.success(response.message);
    }
  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();

    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: debouncedSearch,
      // id_metal: filters.id_metal,
      // id_branch: filters.id_branch,
    };

    getCategory(filterTosend);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },

    {
      header: "Category Name",
      cell: (row) => row?.category_name,
    },
    {
      header: "Metal Name",
      cell: (row) => row.id_metal?.metal_name || "N/A",
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB"); // 'en-GB' gives the d-m-Y format
      },
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
            onChange={() => handleStatusToggle(row?._id)}
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
          data={categoryData}
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

  const handleaddmetal = () => {
    setIsviewOpen(true);
  };
  return (
    <>
      <Breadcrumb
        items={[{ label: "Catalogue" }, { label: "Category", active: true }]}
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
                setSearchInput(e.target.value);
              }}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] text-md w-full h-[36px] sm:w-[228px]"
            />
          </div>

          {/* Container for ActiveDropdown and Add Category button */}
          <div className="flex flex-row w-full sm:order-1 sm:w-auto sm:mr-auto">
            {/* ActiveDropdown - half width on mobile */}
            <div className="w-1/2 sm:w-auto me-1">
              <ActiveDropdown setActiveFilter={setActiveFilter} />
            </div>

            {/* Button - half width on mobile, moves to right on desktop */}
            <div className="w-1/2 sm:hidden">
              <button
                className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                onClick={handleaddmetal}
                style={{ backgroundColor: layout_color }}
              >
                 
                 + Add Category
              </button>
            </div>
          </div>

          {/* Desktop-only button - appears on the right side */}
          <div className="hidden sm:block sm:order-3">
            <button
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
              onClick={handleaddmetal}
              style={{ backgroundColor: layout_color }}
            >
               <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
              Add Category
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
          ${isFilterOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full ">
            <div className="flex justify-between items-center p-3">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={categoryData}
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
          title={id ? "Edit Category" : "Create Category"}
          extraClassName="w-[450px]"
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <AddCategory setIsOpen={setIsviewOpen} id={id} clearId={clearId} />
        </ModelOne>
        <Modal />
      </div>
    </>
  );
};

export default Category;
