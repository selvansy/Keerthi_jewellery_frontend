import React, { useState } from 'react';
import Table from '../../common/Table';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportDropdown from '../../common/Dropdown/Export';
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw} from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const Wallet = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    schemename: '',
    schemetype: '',
    metaltype: '',
    dateRange: null
  });

  const tableData = [
    { scheme: 'Scheme 1', account: 'Account 1', amount: 1000 },
    { scheme: 'Scheme 2', account: 'Account 2', amount: 2000 },
    { scheme: 'Scheme 3', account: 'Account 3', amount: 3000 },
    { scheme: 'Scheme 4', account: 'Account 4', amount: 4000 },
    { scheme: 'Scheme 5', account: 'Account 5', amount: 5000 },
    { scheme: 'Scheme 6', account: 'Account 6', amount: 6000 },
    { scheme: 'Scheme 7', account: 'Account 7', amount: 7000 },
    { scheme: 'Scheme 8', account: 'Account 8', amount: 8000 },
    { scheme: 'Scheme 9', account: 'Account 9', amount: 9000 },
    { scheme: 'Scheme 10', account: 'Account 10', amount: 10000 },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scheme Wise Report');
    XLSX.writeFile(wb, 'SchemeWiseAccountReport.xlsx');
  };

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      
      if (!reportData || reportData.length === 0) {
        alert('No data to export');
        return;
      }

      const doc = new jsPDF();
      
      doc.text('Scheme Wise Account Report', 14, 15);
      
      const chunkSize = 100;
      const tableData = [];
      
      for (let i = 0; i < reportData.length; i += chunkSize) {
        const chunk = reportData.slice(i, i + chunkSize).map(item => [
          item.scheme_id,
          item.scheme_name,
          item.customer_name,
          item.mobile_no,
        ]);
        tableData.push(...chunk);
      }

      doc.autoTable({
        head: [['Scheme ID', 'Scheme Name', 'Customer Name', 'Mobile No']],
        body: tableData,
        startY: 20,
        margin: { top: 20 },
        styles: { fontSize: 8 },
      });

      doc.save('scheme-wise-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`p-2 w-10 h-10 rounded-md ${currentPage === i ? ' text-white' : 'bg-gray-300 text-gray-900'}`}
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

  const handleApplyFilters = () => {
    // Here you can implement the filtering logic
    console.log('Applying filters:', filters);
    setIsFilterOpen(false);
  };

  
  // const columns = [
  //   {
  //     header: 'S.No',
  //     cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
  //   },
  //   {
  //     header: 'Account Name',
  //     cell: (row) => row?.account_name,
  //   },
  //   {
  //     header: "Mobile",
  //     cell: (row) => row?.mobile
  //   },
  //   {
  //     header: "Scheme Name",
  //     cell: (row) => row?.scheme_name
  //   },
  //   {
  //     header: "A/c No",
  //     cell: (row) => row?.scheme_acc_number===""?'Not Allocated':row?.scheme_acc_number
  //   },
  //   {
  //     header: "Start Date",
  //     cell: (row) => row?.start_date
  //   },
  //   {
  //     header: "Maturity Date",
  //     cell: (row) => row?.maturity_date
  //   },
  //   {
  //     header: "Paid Installment",
  //     cell: (row) => row?.total_paidinstallments
  //   },
  //   {
  //     header: "Paid Amount",
  //     cell: (row) => row?.total_paidamount
  //   },
  //   {
  //     header: "Paid Weight",
  //     cell: (row) => row?.total_weight
  //   },

  //   {
  //     header: "Branch Name",
  //     cell: (row) => row?.branch_name
  //   },
  
  // ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Wallet</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
          />
        </div>

        <div className="flex flex-row items-center justify-end gap-2">
        <button 
            id="filter" 
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: layout_color }} >
            <SlidersHorizontal size={20} />
          </button>
          <ExportDropdown 
            onExportExcel={exportToExcel} 
            onExportPDF={exportToPDF} 
          />
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
          <div className="p-3 space-y-4 flex-1 overflow-y-auto">
            <div className="flex flex-col border-t"></div>
            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className='text-gray-700 text-sm font-medium'>Date Range<span className='text-red-400'>*</span></label>
              <div className="relative">
                <DatePicker
                  selected={filters.dateRange}    
                  onChange={handleDateChange}
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

            {/* Scheme Name Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scheme Name
              </label>
              <div className="relative">
                <select 
                  name="schemename"
                  value={filters.schemename}
                  onChange={handleFilterChange}
                  className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                >
                  <option value=''>--Select--</option>
                  <option value='1'>first option</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Scheme Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scheme Type<span className='text-red-400'>*</span>
              </label>
              <div className="relative">
                <select 
                  name="schemetype"
                  value={filters.schemetype}
                  onChange={handleFilterChange}
                  className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                >
                  <option value=''>--Select--</option>
                  <option value='1'>first option</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Metal Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Metal Type
              </label>
              <div className="relative">
                <select 
                  name="metaltype"
                  value={filters.metaltype}
                  onChange={handleFilterChange}
                  className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                >
                  <option value=''>--Select--</option>
                  <option value='1'>first option</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 borde">
              <div className="bg-yellow-300 flex justify-center gap-3">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      </div>
      {console.log(">>",tableData)}
      <div className="mt-4">
        <Table data={tableData} />
      </div>

      <div className="flex justify-between mt-4 p-2">
        <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2  text-gray-500 rounded-md"
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
          className="p-2 text-gray-500 rounded-md"
        >
          Next
        </button>
      </div>
        </div>
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
          <span className="text-gray-500">entries</span>
        </div>
      </div>
    </div>
  );
};

export default Wallet;