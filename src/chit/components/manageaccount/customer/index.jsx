import React, { useState, useEffect } from 'react'
import Table from '../../common/Table'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getcustomertable, getallbranch, changecustomerStatus, deletecustomer } from '../../../api/Endpoints'
import { ExportToExcel } from '../../common/Dropdown/Excelexport';
import { ExportToPDF } from '../../common/Dropdown/ExportPdf';
import { toast } from 'react-toastify';

import { eventEmitter } from '../../../../utils/EventEmitter';
import { openModal } from '../../../../redux/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../common/Modal';
import { useDebounce } from '../../../hooks/useDebounce'
import DatePicker from "react-datepicker";
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import usePagination from '../../../hooks/usePagination'
import ExportDropdown from '../../common/Dropdown/Export'
import Action from '../../common/action'


const ExistingCusTable = () => {

 
  const [isLoading, setisLoading] = useState(true)
 
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalDocument,setTotalDoc] = useState(0)

  const [filtered, SetFiltered] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [customerData, setcustomerData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [search, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const roledata = useSelector((state) => state.clientForm.roledata);
 
  const id_branch = roledata?.branch;
  const [branchList, setBranchList] = useState([]);

  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [filters, setFilters] = React.useState({
    from_date: "",
    to_date: "",
    search: debouncedSearch,
    limit: itemsPerPage,
    id_branch: id_branch,
    type: "",
  });


  const handlePageChange = (page) => {

    const pageNumber = Number(page);
      if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
        return;
      }
   
      setCurrentPage(pageNumber);
    
  };

  



  useEffect(() => {
    const payload={
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      from_date: "",
      to_date: "",
      id_branch: filters.id_branch
    }
    getcustomertableMutate(payload);
  }, [currentPage, itemsPerPage, debouncedSearch]);



  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    setIsFilterOpen(false)
    SetFiltered(true)
    const payload = {
       page: currentPage, 
      limit: itemsPerPage, 
      search: debouncedSearch, 
      from_date: from_date,
       to_date: to_date, 
       id_branch: filters.id_branch }
    
    getcustomertableMutate(payload);

  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddcustomerClick = () => {
    navigate('/managecustomers/addcustomer')
  }

  const { mutate: getcustomertableMutate } = useMutation({
    mutationFn: (payload) => getcustomertable(payload),
    onSuccess: (response) => {
  
      if (response?.data) {
        setcustomerData(response.data);
        setTotalPages(response.totalPages);
        setTotalDoc(response.totalDocument)
      }
      setisLoading(false)
    },
    onError: () => {
      setisLoading(false)
    }
  });

 


  const handleReset = () => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({ ...prev, id_branch: id_branch }));
    SetFiltered(false)
    toast.success("Filter is cleared");
    getcustomertableMutate({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      from_date: "",
      to_date: "",
      id_branch: filters.id_branch
    });
  }
  const handleClickfilter = (e) => {
    getallbranchmutate();
    setIsFilterOpen(true);
  }

  const { mutate: getallbranchmutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

 

  const handleEdit = (id) => {
  
    navigate(`/managecustomers/editcustomer/${id}`);
  }


    const handleDelete = (id) => {

      setActiveDropdown(null);
      dispatch(openModal({
        modalType: 'CONFIRMATION',
        header: 'Delete Scheme',
        formData: {
          message: 'Are you sure you want to delete?',
          customerId: id
        },
        buttons: {
          cancel: {
            text: 'Cancel'
          },
          submit: {
            text: 'Delete'
          }
        }
      }));
  
  
    };

     const { mutate: deletecustomerMutate } = useMutation({
        mutationFn:(id)=> deletecustomer(id),
        onSuccess: (response) => {
        
            const isLastItemOnPage = customerData.length === 1;
            const isNotFirstPage = currentPage > 1;
            if (isLastItemOnPage && isNotFirstPage) {
              setCurrentPage(prev => prev - 1);
            } else {
              const payload = {
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch,
                from_date: from_date,
                to_date: to_date,
                id_branch: filters.id_branch
            }
              getcustomertableMutate(payload);
            
          }
            toast.success(response.message);
            eventEmitter.off("CONFIRMATION_SUBMIT");
  
          },
        onError: (error) => {
          console.error("Error:", error);
          toast.error("Failed to delete");
        },
      });
    
      useEffect(() => {
        const handleDelete = (data) => {
          deletecustomerMutate(data.customerId);
        };
    
        eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);
    
        return () => {
          eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
        };
      }, []);


  const handleStatusToggle = async (id) => {
    let response = await changecustomerStatus(id);
    if (response) {
      toast.success(response.message);
      setcustomerData((prevData) =>
        prevData.map((customer) =>
          customer._id === id
            ? { ...customer, active: customer.active === true ? false : true }
            : customer
        )
      );
      getcustomertableMutate({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        from_date: from_date,
        to_date: to_date,
        id_branch: filters.id_branch
      });
    }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };
  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };
 
  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Customer Name',
      cell: (row) => `${row?.firstname} ${row?.lastname}`,
    },
    {
      header: "Mobile",
      cell: (row) => `${row?.mobile}`,
    },
    {
      header: "Create Date",
      cell: (row) => formatDate(row?.date_add)
    },
    {
      header: 'Active',
      accessor: 'active',
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
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}          ></div>
        </label>
      )
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={customerData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },

  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Existing Customers</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
            ) : (
              <Search className="text-gray-500" />
            )}
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex flex-row items-center justify-end gap-2">

          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleAddcustomerClick}
            style={{ backgroundColor: layout_color }}  >
            + Add Customer
          </button>

          
          <ExportDropdown apiData={customerData} fileName="customer Report"/>
         

          {
            filtered ?
              <>
                <button
                  id="filter"
                  className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                  onClick={() => handleReset()}
                  style={{ backgroundColor: layout_color }}>
                  <RefreshCcw size={20} />
                </button>
              </>
              :
              <>
                <button
                  id="filter"
                  className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                  onClick={(e) => {
                    handleClickfilter(e);
                  }}
                  style={{ backgroundColor: layout_color }}>
                  <SlidersHorizontal size={20} />
                </button>
              </>

          }

        </div>


      </div>
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
                ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
                <label className='text-gray-700 text-sm font-medium'>From Date<span className='text-red-400'>*</span></label>
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
                <label className='text-gray-700 text-sm font-medium'>To Date<span className='text-red-400'>*</span></label>
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
                {
                  id_branch === "0" && (
                    <div className="flex flex-col lg:mt-2">
                      <label className="text-black mb-1 font-medium">
                        Branch<span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="id_branch"
                          className={`appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!id_branch !== "0" ? "cursor-not-allowed bg-gray-100" : ""
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
      <Table
            data={customerData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
      </div>
    
      <Modal />
    </div>
  )
}

export default ExistingCusTable