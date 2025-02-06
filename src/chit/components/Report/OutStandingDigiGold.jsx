import React, { useState } from 'react';
import Table from '../common/Table';
import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportDropdown from '../common/Dropdown/Export';
import { SlidersHorizontal, Search, X } from 'lucide-react'

const OutStandingDigiGold = () => {  
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [, setIsExporting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    schemename: '',
    schemetype: '',
    metaltype: ''
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

  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(tableData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Scheme Wise Report');
  //   XLSX.writeFile(wb, 'SchemeWiseAccountReport.xlsx');
  // };

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

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Outstanding DigiGold Weight Summary</h2>
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
              <label className="block text-sm font-medium text-gray-700">
               Scheme Name
              </label>
              <select
                name="schemename"
                value={filters.schemename}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--select--</option>
                <option value="scheme1">scheme1</option>
                <option value="scheme2">scheme2</option>
                <option value="scheme3">scheme3</option>
              </select>
            </div>
            {/* Scheme Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scheme Type
              </label>
              <select
                name="schemetype"
                value={filters.schemetype}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--select--</option>
                <option value="scheme1">scheme1</option>
                <option value="scheme2">scheme2</option>
                <option value="scheme3">scheme3</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Metal Type
              </label>
              <select
                name="metaltype"
                value={filters.metaltype}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--select--</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div className="p-4 borde">
            <div className="bg-yellow-300 flex justify-center gap-3">
              {/* <button
                onClick={() => setFilters({ metalType: '', branch: '' })}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear All
              </button> */}
              <button
                onClick={() => setIsFilterOpen(false)}
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
        <Table data={currentItems} />
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <span className="text-gray-500">entries</span>
        </div>
      </div>
    </div>
  );
};

export default OutStandingDigiGold;