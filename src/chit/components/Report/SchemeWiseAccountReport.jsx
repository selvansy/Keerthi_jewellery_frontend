import React, { useState } from 'react';
import Table from '../common/Table';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportDropdown from '../common/Dropdown/Export';

const SchemeWiseAccountReport = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [reportData, setReportData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

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
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(reportData.length / itemsPerPage);

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

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Scheme Wise Account Report</h2>
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

        {/* <div className="flex flex-row items-center justify-end gap-2">
          <ExportDropdown 
            onExportExcel={exportToExcel} 
            onExportPDF={exportToPDF} 
          />
        </div> */}
      </div>
      <div className="mt-4">
        <Table data={currentItems} isLoading={isLoading}/>
      </div>

      <div className="flex justify-between mt-4 p-2">
        <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            readOnly={currentPage === 1}
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
          readOnly={currentPage === totalPages}
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

export default SchemeWiseAccountReport;
