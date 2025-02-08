import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportDropdown from '../common/Dropdown/Export';
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw} from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const AgenReferralReport = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    schemename: '',
    schemetype: '',
    metaltype: ''
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

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

  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(reportData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Agent Referral Report');
  //   XLSX.writeFile(wb, 'AgentReferralReport.xlsx');
  // };

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      
      if (!reportData || reportData.length === 0) {
        alert('No data to export');
        return;
      }

      const doc = new jsPDF();
      
      doc.text('Agent Referral Report', 14, 15);
      
      const tableData = reportData.map(item => [
        item.scheme_id,
        item.scheme_name,
        item.customer_name,
        item.mobile_no,
      ]);

      doc.autoTable({
        head: [['Scheme ID', 'Scheme Name', 'Customer Name', 'Mobile No']],
        body: tableData,
        startY: 20,
        margin: { top: 20 },
        styles: { fontSize: 8 },
      });

      doc.save('agent-referral-report.pdf');
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

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(dateRange && { date: dateRange.toISOString() }),
        ...(filters.schemename && { schemeName: filters.schemename }),
        ...(filters.schemetype && { schemeType: filters.schemetype }),
        ...(filters.metaltype && { metalType: filters.metaltype })
      });

      const response = await fetch(`/api/agent-referral-report?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setReportData(data.items || []);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [currentPage, itemsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = async () => {
    setCurrentPage(1);
    await fetchReportData();
    setIsFilterOpen(false);
  };

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

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Agent Referral Report</h2>
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
            style={{ backgroundColor: layout_color }}>
            <SlidersHorizontal size={20} />
          </button>
          {/* <ExportDropdown 
            onExportExcel={exportToExcel} 
            onExportPDF={exportToPDF} 
          /> */}
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
            {/* Scheme Name Filter */}
            <div className="space-y-2">
            <label className='text-gray-700 text-sm font-medium'>Date Range<span className='text-red-400'>*</span></label>
              <div className="relative">
                <DatePicker
                  selected={dateRange}    
                  onChange={(date) => setDateRange(date)}
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
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <span>Loading...</span>
          </div>
        ) : (
          <Table data={reportData} />
        )}
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

export default AgenReferralReport;