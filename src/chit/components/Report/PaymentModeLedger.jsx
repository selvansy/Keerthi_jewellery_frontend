import React, { useEffect, useState } from 'react';
import Table from '../common/Table';
import { useMutation } from '@tanstack/react-query'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addedtype, allschemestatus, getallschemetypes, getallbranchscheme, getallbranchclassification, getemployeebybranch, getallbranch } from '../../api/Endpoints'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ExportToExcel } from '../common/Dropdown/Excelexport';
import { ExportToPDF } from '../common/Dropdown/ExportPdf';
import { useSelector } from 'react-redux';
import { getpaymentmodesummary } from "../../api/Endpoints"
import { toast } from 'react-toastify';

function ModeWisePayment() {
    
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);
    const id_branch = roledata?.branch;
   

    const [paymentMode, setpaymentMode] = useState([])
    
    const [isLoading,setisLoading] = useState(true)


    
     const [branchfilter, setBranch] = useState([]);  
     const [branchId,setbranchId] = useState("")
     const [classifyfilter, setClassify] = useState([]);
     const [employeefilter, setEmployee] = useState([]);
     const [schemetypefilter, setSchemeType] = useState([]);
     const [schemefilter, setScheme] = useState([]);
     const [addedbyfilter, setAddedby] = useState([]);
     const [schemestatusfilter, setSchemestatus] = useState([]);
    
    const [search, setSearch] = useState('')
 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
     const [totalPages, setTotalPages] = useState(0);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from_date, setFromdate] = useState('');
  const [to_date, setTodate] = useState('');
  const [filters, setFilters] = useState({
    from_date: from_date,
    to_date: to_date,
    added_by: '',
    id_branch: branchId,
  });

  useEffect(() => {
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: "",
      id_branch: id_branch,
    };
    getpaymentModeMutate(filterTosend);
  }, [currentPage, itemsPerPage, search])


  useEffect(() => {
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: "",
      id_branch: id_branch,
    };
    getpaymentModeMutate(filterTosend);
  }, [])


  const applyfilterdatatable = () => {
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,

    };

    getpaymentModeMutate(filterTosend);
    setIsFilterOpen(false)

  };



  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response) {
        setBranch(response.data);
      }
    },
  });




  const columns = [
    {
      header: 'PAYMENT MODE',
      cell: (row) => `${row?.mode_name}`,
    },
    {
      header: 'COLLECTION',
      cell: (row) => `${row?.collection_amount}`,
    }
  ]

  const paginationButtons = [];

  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`p-2 w-10 h-10 rounded-md  ${currentPage === i ? ' text-white' : 'text-slate-400'}`}
        style={{ backgroundColor: layout_color }} >
        {i}
      </button>
    );
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: date
    }));
  };

  //mutation to get scheme type
  const { mutate: getpaymentModeMutate } = useMutation({
    mutationFn: (payload)=>
       getpaymentmodesummary(payload),
    onSuccess: (response) => {

      setpaymentMode(response.data)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error:', error);
      setisLoading(false)
    }
  });


  const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setFilters(() => ({
      from_date: from_date,
      to_date: to_date,
      added_by: '',
      id_branch: branchId,
    }));
    toast.success("Filter is cleared");

    getpaymentModeMutate({
      from_date: from_date,
      to_date: to_date,
      added_by: '',
      id_branch: branchId,
    });
  }

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Payment Mode Ledger Report</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
          />
        </div>

        <div className="flex flex-row items-center justify-end gap-2">
          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: layout_color }}>
            <SlidersHorizontal size={20} />
          </button>

          <button
            id="filter"
            className="text-white bg-[#023453] w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => handleReset()}
          >
            <RefreshCcw size={20} />
          </button>

          <ExportToExcel apiData={paymentMode} fileName="paymentMode Report" />
          <ExportToPDF apiData={paymentMode} fileName="paymentMode Report" />
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
            <form className='overflow-y-auto  scrollbar-hide'>
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
                  <label className="block text-sm font-medium text-gray-700">
                    Branch Name
                  </label>
                  <div className="relative">
                    <select name="id_branch" onChange={(e) => setbranchId(e.target.value)} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                      <option value='' >--Select--</option>
                      {branchfilter.map((branch) => (
                        <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
                      ))
                      }
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
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
      </div>
      <div className="mt-4">
        <Table
          data={paymentMode}
          columns={columns}
          isLoading={isLoading}
        />
      </div>

    </div>
  )
}

export default ModeWisePayment