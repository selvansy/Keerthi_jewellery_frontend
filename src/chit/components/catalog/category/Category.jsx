import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { useSelector, useDispatch } from "react-redux";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
  const [from_date,setFromdate]=useState('')
  const [to_date,setTodate]=useState('')
  const [totalDocuments,setTotalDocuments]=useState(0)


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
      limit,
      from_date,
      to_date
    });
  }, [currentPage, itemsPerPage, debouncedSearch]);

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
      console.log(response)
      setCategoryData(response?.data);
      setTotalPages(response.totalPages);
      setIsLoading(false);
      setSearchLoading(false)
      setTotalDocuments(response.totalDocuments)
    },
    onError: (error) => {
      console.error("Error:", error);
      setCategoryData([]);
      setIsLoading(false);
      setSearchLoading(false)
    },
  });

  // mutation for delete category
  const { mutate: deleteCategory } = useMutation({
    mutationFn:({CategoryId})=> deletecategory(CategoryId),
    onSuccess: (response) => {
      toast.success(response.message);
      getCategory({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
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

  const handleClickfilter = () => {
    setIsFilterOpen(true);
  };

  // edit handler
  const handleEdit = (id) => {
    navigate(`/catalog/editcategory/${id}`);
  };

  // delete handler
  const handleDelete = (id) => {
    setActiveDropdown(null);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Category",
        formData: {
          message: "Are you sure you want to delete?",
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
      header: "Actions",
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row?._id);
              setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {activeDropdown === row?._id && (
            <div
              className="absolute"
              style={{
                top: rowIndex >= categoryData.length - 2 ? "auto" : "72%",
                bottom: rowIndex >= categoryData.length - 2 ? "-84%" : "auto",
                zIndex: 9999,
                marginBottom: "8px",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
              }}
            >
              <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleEdit(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleDelete(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Category Name",
      cell: (row) => row?.category_name,
    },
    {
      header: "Metal Name",
      cell: (row) => row.id_metal.metal_name
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${
              row?.active === true
                ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      ),
    },
  ];
  return (
    <>
      <div className="flex flex-col p-4">
        <h2 className="text-2xl text-gray-900 font-bold">Category</h2>
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="relative w-full lg:w-1/3 min-w-[200px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-gray-500" />
              )}
            </div>
            <input
              placeholder="Search..."
              className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
              onChange={(e) => {
                setSearchLoading(true);
                setSearchInput(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <button
              type="button"
              className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 transition-colors"
              onClick={() => navigate("/catalog/addcategory")}
              style={{ backgroundColor: layout_color }}
            >
              + Create category
            </button>

            <button
              id="filter"
              className="text-white w-10 h-10 flex items-center justify-center rounded-md  transition-colors flex-shrink-0"
              // onClick={() => handleReset()}
              style={{ backgroundColor: layout_color }}
            >
              <RefreshCcw size={20} />
            </button>

            <button
              id="filter"
              className="text-white w-10 h-10 flex items-center justify-center rounded-md  transition-colors flex-shrink-0"
              onClick={(e) => {
                handleClickfilter(e);
              }}
              style={{ backgroundColor: layout_color }}
            >
              <SlidersHorizontal size={20} />
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
          <Table data={categoryData} columns={columns} isLoading={isLoading} />
        </div>

        <div className="flex  justify-between mt-4 p-2">
          <div className="mt-4 flex gap-2 justify-center items-center">
            <span className="text-gray-500">Show</span>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
            <span className="text-gray-500">entries {totalDocuments} </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}x
                className={`p-2 text-gray-500 rounded-md ${currentPage==1?'cursor-not-allowed':'cursor-pointer'}`}
              >
                Previous
              </button>
            </div>

            <div className="flex flex-row items-center justify-center gap-2">
              {paginationButtons}
            </div>

            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 text-gray-500 rounded-md ${currentPage === totalPages?'cursor-not-allowed':'cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <Modal />
      </div>
    </>
  );
};

export default Category;
