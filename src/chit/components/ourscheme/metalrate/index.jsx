import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { setid } from "../../../../redux/clientFormSlice";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  getmetalratetable,
  deletemetalrate,
  getallbranch,
} from "../../../api/Endpoints";
import { eventEmitter } from "../../../../utils/EventEmitter";
import Modal from "../../common/Modal";
import { openModal } from "../../../../redux/modalSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useDebounce } from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import { div } from "framer-motion/client";

const MetalRate = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const roledata = useSelector((state) => state.clientForm.roledata);

  let admin = roledata?.id_role?.id_role;
  const id_branch = roledata?.branch;
  const branchId = roledata?.id_branch;

  useEffect(() => {
    if (id_branch === "0" && admin === 2) {
      getallbranchmuate();
    }
  }, [id_branch]);

  const [isLoading, setisLoading] = useState(true);
  const [metalRate, setMetalRate] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filtered, SetFiltered] = useState(false);
  const [id, setId] = useState("");
  const [totalDocuments,setTotalDocuments]=useState(0)
  const [activeDropdown, setActiveDropdown] = useState(null);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [filters, setFilters] = React.useState({
    from_date: "",
    to_date: "",
    search: debouncedSearch,
    limit: itemsPerPage,
    id_branch: branchId,
    type: "",
  });

  
  const handleViewDetails = (row) => {
    setSelectedData(row);
    setIsModalOpen(true);
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
    const payload = {
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      id_branch: branchId,
    };
    getmetalratetablemutate(payload);
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleReset = () => {
    setFromdate("");
    setTodate("");
    SetFiltered(false);
    toast.success("Filter is cleared");
    getmetalratetablemutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      from_date: "",
      to_date: "",
      id_branch: branchId,
    });
  };

  // mutation functions
  const { mutate: getallbranchmuate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    setIsFilterOpen(false);
    SetFiltered(true);
    getmetalratetablemutate({
      search: debouncedSearch,
      page: currentPage,
      limit: itemsPerPage,
      from_date: from_date,
      to_date: to_date,
      id_branch: filters.id_branch,
    });
  };

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  //mutation to get metals
  const { mutate: getmetalratetablemutate } = useMutation({
    mutationFn: (payload) => getmetalratetable(payload),
    onSuccess: (response) => {
      if (response) {
        const groupedData = response.data.reduce((acc, curr) => {
          const existingGroup = acc.find(
            (group) => group.createdAt === curr.createdAt
          );

          if (existingGroup) {
            existingGroup.items.push(curr);
          } else {
            acc.push({
              createdAt: curr.createdAt,
              items: [curr],
            });
          }

          return acc;
        }, []);

        setMetalRate(groupedData);
        setTotalPages(response.totalPages);
        setTotalDocuments(Math.round(response.totalDocument-response.totalDocument/2));
      }
      setisLoading(false);
    },

    onError: (error) => {
      setisLoading(false);
      console.error("Error:", error);
    },
  });

  ;

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/masters/metalrate/add");
  };

  const handleClickfilter = () => {
    setIsFilterOpen(true);
    if (id_branch === "0" && isFilterOpen === true) {
      getallbranchmuate();
    }
  };

  const handleEdit = (id) => {
    navigate(`/masters/metalrate/edit/${id}`);
  };

 const dynamicColumns = [];

  const metalPurityKeys = new Set();

  metalRate.forEach((group) => {
    group.items.forEach((item) => {
      const metalKey = `${item.material_type_id?.metal_name} ${item.purity_id?.purity_name}`;
      metalPurityKeys.add(metalKey);
    });
  });

  // Step 2: Build the columns array
  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Branch Name",
      cell: (row) => (
        <>
          <div>{row.id_branch?.branch_name}</div>
          <div className="text-gray-500 text-sm">Vadavalli</div>
        </>
      ),
    },
    ...[...metalPurityKeys].slice(0,3).map((key) => ({
      header: key,
      cell: (row) => {
        const metalEntry = row.items.find(
          (item) =>
            `${item.material_type_id?.metal_name} ${item.purity_id?.purity_name}` ===
            key
        );
        return metalEntry ? metalEntry.rate : "-";
      },
    })),
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <button
        className="p-1 hover:bg-gray-100 rounded-full"
        onClick={() => handleViewDetails(row)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      ),
    },
    {
      header: "Update Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB");
      },
    },
  ];

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
      <h2 className="text-2xl text-gray-900 font-bold">Metal Rate</h2>
        <div className="flex flex-row items-center justify-end gap-2">
          <button
            type="button"
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }}
          >
            + Create metalrate
          </button>

          {filtered ? (
            <>
              <button
                id="filter"
                className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                onClick={() => handleReset()}
                style={{ backgroundColor: layout_color }}
              >
                <RefreshCcw size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                id="filter"
                className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                onClick={(e) => {
                  handleClickfilter(e);
                }}
                style={{ backgroundColor: layout_color }}
              >
                <SlidersHorizontal size={20} />
              </button>
            </>
          )}
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
                  </div>
                )}
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
      <Table data={metalRate} columns={columns} isLoading={isLoading}  currentPage={currentPage} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments} handleItemsPerPageChange={handleItemsPerPageChange} />

      </div>
   


{isModalOpen && selectedData && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Metal Details</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Updated At:</strong> {new Date(selectedData.createdAt).toLocaleDateString('en-GB')}</p>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Rates:</h4>
        <div className="space-y-2">
          {selectedData.items.map((item, index) => (
            <div key={index} className="flex justify-between text-gray-600">
              <span>{item.material_type_id?.metal_name} {item.purity_id?.purity_name}</span>
              <span className="font-medium">{item.rate}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition-all"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default MetalRate;
