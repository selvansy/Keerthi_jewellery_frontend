import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getnewarrivalsTable,
  getallbranch,
  getBranchById,
  getallmetal,
  deletenewarrivals,
  activatecategory,
  allofferstype,
  activatenewarrivals,
} from "../../../api/Endpoints";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { setid } from "../../../../redux/clientFormSlice";
import { useSelector, useDispatch } from "react-redux";
import { eventEmitter } from "../../../../utils/EventEmitter";
import { openModal } from "../../../../redux/modalSlice";
import Modal from "../../../components/common/Modal";
import usePagination from "../../../hooks/usePagination";
import { useDebounce } from "../../../hooks/useDebounce";
import Action from "../../common/action";

const NewArrivals = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  let dispatch = useDispatch();
  const [branchList, setBranchList] = useState([]);
  let [branch, setbranch] = useState("");
  const [newarrivalsData, setnewarrivalsData] = useState([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filtertype, setOfferstype] = useState([]);
  const [filtermetaltype, setMetaltype] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [filters, setFilters] = React.useState({
    from_date: "",
    to_date: "",
    limit: itemsPerPage,
    id_branch: id_branch,
    type: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setFilters((prev) => ({
      ...prev,
      added_by: "",
      id_branch: id_branch,
      type: "",
    }));
    toast.success("Filter is cleared");
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: "",
      type: "",
      id_branch: id_branch,
    };

    getnewarrivalsData({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      id_branch: id_branch,
    });
  };

  useEffect(() => {
    if (id_branch === "0") {
      branchbyClient();
    }
    if (id_branch !== "0") {
      setFilters({ ...filters, id_branch: id_branch });
    }
  }, [id_branch]);

  const { mutate: branchbyClient } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const { mutate: branchbyId } = useMutation({
    mutationFn: getBranchById,
    onSuccess: (response) => {
      setbranch(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    const filterTosend = {
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      type: filters.type,
    };

    setIsFilterOpen(false);
    getnewarrivalsData(filterTosend);
  };

  //mutation to get offers type
  const { mutate: getallofferstype } = useMutation({
    mutationFn: allofferstype,
    onSuccess: (response) => {
      setOfferstype(response.data);
    },
    onError: (error) => {
      console.error("Errors:", error);
    },
  });

  //mutation to get category type
  const { mutate: getallMetals } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetaltype(response.data);
    },
    onError: (error) => {
      console.error("Errors:", error);
    },
  });

  useEffect(() => {
    if (isFilterOpen === true) {
      getallMetals();
      getallofferstype();
    }
  }, [isFilterOpen]);

  //mutation to get scheme type
  const { mutate: getnewarrivalsData } = useMutation({
    mutationFn: (data) => getnewarrivalsTable(data),
    onSuccess: (response) => {
      setnewarrivalsData(response.data);
      setSearchLoading(false);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
      setisLoading(false);
    },
    onError: (err) => {
      setSearchLoading(false);
    },
  });

  useEffect(() => {
    getnewarrivalsData({
      page: currentPage,
      limit: itemsPerPage,
      search: search,
      id_branch: id_branch,
    });
  }, [currentPage, itemsPerPage, search]);

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearch(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/catalog/addnewarrivals");
  };

  const handleStatusToggle = async (id) => {
    let response = await activatenewarrivals(id);
    if (response.message) {
      toast.success(response.message);
      setnewarrivalsData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, active: !item.active } : item
        )
      );
    }
  };

  useEffect(() => {
    const handleDelete = (id) => {
      deleteNewArrivals(id);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  const handleDelete = (id) => {
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete New Arrivals",
        formData: {
          message: "Are you sure you want to delete?",
          newArrivalsId: id,
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

  //mutation to get purity type
  const { mutate: deleteNewArrivals } = useMutation({
    mutationFn: ({ newArrivalsId }) => deletenewarrivals(newArrivalsId),
    onSuccess: (response) => {
      const isLastItemOnPage = newarrivalsData.length === 1;
      const isNotFirstPage = currentPage > 1;
      if (isLastItemOnPage && isNotFirstPage) {
        setCurrentPage((prev) => prev - 1);
      } else {
        getnewarrivalsData({
          page: currentPage,
          limit: itemsPerPage,
          search: search,
          id_branch: id_branch,
        });
      }
      toast.success(response.message);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleEdit = (id) => {
    dispatch(setid(id));
    navigate(`/catalog/editnewarrivals/${id}`);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Title",
      cell: (row) => row?.title,
    },
    {
      header: "Product Name",
      cell: (row) => row?.id_product.product_name,
    },
    {
      header: "Start Date",
      cell: (row) => {
        const date = new Date(row?.start_date);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      header: "End Date",
      cell: (row) => {
        const date = new Date(row?.end_date);
        return date.toLocaleDateString("en-GB");
      },
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
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={newarrivalsData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },
  ];

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
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

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">New Arrivals</h2>
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
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }}
          >
            + Create newarrivals
          </button>
          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => handleReset()}
            style={{ backgroundColor: layout_color }}
          >
            <RefreshCcw size={20} />
          </button>

          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => setIsFilterOpen(true)}
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
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-3">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form>
            <div className="p-3 space-y-4 flex-1 overflow-y-auto filterscroll">
              <div className="flex flex-col border-t"></div>
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">
                  From Date<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    selected={from_date}
                    onChange={(date) => setFromdate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                    <CalendarDays size={20} />
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">
                  To Date<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    selected={to_date}
                    onChange={(date) => setTodate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                    <CalendarDays size={20} />
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {id_branch === "0" && (
                  <div className="flex flex-col lg:mt-2">
                    <label className="text-black mb-1 font-medium">
                      Branch<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="id_branch"
                        className={`appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${
                          !id_branch !== "0"
                            ? "cursor-not-allowed bg-gray-100"
                            : ""
                        }`}
                        defaultValue=""
                        onChange={filterInputchange}
                        value={filters.id_branch}
                      >
                        <option value="" className="text-gray-700">
                          --Select--
                        </option>
                        {branchList.map((branch) => (
                          <option
                            className="text-gray-700"
                            key={branch._id}
                            value={branch._id}
                          >
                            {branch.branch_name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="black"
                        >
                          <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    {formErrors.branch && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.branch}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    Type<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={filters.type}
                      onChange={filterInputchange}
                      className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">--Select---</option>
                      {filtertype.map((type) => (
                        <option
                          name="type"
                          className="text-gray-700"
                          key={type.id}
                          value={type.id}
                        >
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="black"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {formErrors.type && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.type}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 borde">
                <div className="bg-yellow-300 flex justify-center gap-3">
                  <button
                    onClick={applyfilterdatatable}
                    className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <div className="mt-4">
        <Table data={newarrivalsData} columns={columns} loading={isLoading} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments}  />
      </div>

 

      <Modal />
    </div>
  );
};

export default NewArrivals;
