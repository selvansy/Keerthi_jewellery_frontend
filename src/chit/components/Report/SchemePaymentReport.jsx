import React, { useEffect, useState } from 'react';
import Table from '../../components/common/Table';
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExportDropdown from '../../components/common/Dropdown/Export';
import { ExportToExcel } from '../common/Dropdown/Excelexport';
import { ExportToPDF } from '../common/Dropdown/ExportPdf';
import { schemepaymentdatatable } from '../../api/Endpoints'

import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw} from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from 'react-redux';

function SchemePaymentReport() {
  

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
    
   const [schemepayment, setschemepayment] = useState([])
   const [isLoading,setisLoading] = useState(false)
   const [schaccExp,setschaccExp] = useState([]);
   const [search, setSearch] = useState('')
   const [startDate,setStartDate] = useState(Date.now());

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const currentItems = schemepayment?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(schemepayment?.length / itemsPerPage);
   
    const [, setIsExporting] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
   
      const [from_date, setFromdate] = useState('');
      const [to_date, setTodate] = useState('');
     const [filters, setFilters] = React.useState({
        from_date:null,
        to_date:null,
        added_by:'',
        scheme_status:'',
        id_classification: '',
        collectionuserid: '',
        id_scheme: '',
        id_branch: '',
        scheme_type:''
      });
    
      useEffect(() => {
   
        const filterTosend = {
          page:currentPage,
          from_date:from_date,
          to_date:to_date,
          limit: itemsPerPage,
          search: search,
          added_by:filters.added_by,
          scheme_status:filters.scheme_status,
          id_classification: filters.id_classification,
          collectionuserid: filters.collectionuserid,
          id_scheme: filters.id_scheme,
          id_branch: filters.id_branch,
          scheme_type:filters.scheme_type
        };
         
        getschemepaymentMutate(filterTosend)
      }, [currentPage, itemsPerPage, search])
  
        
          useEffect(()=>{
           if(schaccExp.length !== 0){
              const tableColumn = Object.keys(schaccExp[0]);
              const tableRows = schaccExp.map((item) => Object.values(item));
              console.log("tableColumn",tableColumn)
              console.log("row",tableRows)
           }
          },[schaccExp])   
  
      useEffect(()=>{
       getschemepaymentMutate();
      },[])

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(schemepayment);
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

  //mutation to get scheme type
  const { mutate: getschemepaymentMutate } = useMutation({
    mutationFn: ()=>{
      setisLoading(true)
       schemepaymentdatatable
    },
    onSuccess: (response) => {
      setschemepayment(response.data)
      let arrayData = [];
     
      if(response.data.length !==0){
       
        for (const i in response.data) {
          arrayData.push({
              id_transaction: response.data[i].id_transaction,
              date_payment: response.data[i].date_payment,
              account_name: response.data[i].id_scheme_account.account_name,
              mobile: response.data[i].id_customer.mobile,
              scheme_acc_number: response.data[i].id_scheme_account?.scheme_acc_number,
              start_date: new Date(response.data[i].id_scheme_account.start_date).toLocaleDateString(),
              maturity_date: new Date(response.data[i].id_scheme_account.maturity_date).toLocaleDateString(),
              total_installments: response.data[i].id_scheme_account?.total_installments,
              paid_installments: response.data[i].paid_installments,
              gst_amount: response.data[i].gst_amount,
              fine_amount: response.data[i].fine_amount,
              total_amt: response.data[i].total_amt,
          });
      }
      
      }
      setschaccExp(arrayData)
      setisLoading(false)

    },
    onError: (error) => {
      console.error('Error:', error);
      setisLoading(false)
    }
  });

  
  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'TXT Id',
      cell: (row) => row?.id_transaction,
    },
    {
      header: "Paid Date",
      cell: (row) => {
        const paidDate = new Date(row?.date_payment);
        return paidDate.toLocaleDateString();
      }
    },

    {
      header: "Scheme Name",
      cell: (row) => {
        let scheme_name = "";
        if (row?.id_scheme.scheme_type === 0 || row?.id_scheme.scheme_type === 1 || row?.id_scheme.scheme_type === 2) {
          scheme_name = row?.id_scheme.scheme_name + "(₹. " + row?.id_scheme.amount + ")";
        } else if (row?.id_scheme.scheme_type === 3) {
          scheme_name = row?.id_scheme.scheme_name + "(" + row?.id_scheme.min_weight + " Grm - " + row?.id_scheme.max_weight + " Grm)";
        } else {
          scheme_name = row?.id_scheme.scheme_name + "(₹" + row?.id_scheme.min_amount + " - " + row?.id_scheme.max_amount + ")";
        }
        return scheme_name;
      }
    },
    
    {
      header: "Customer Name",
      cell: (row) => row?.id_scheme_account?.account_name
    },
    {
      header: "Mobile",
      cell: (row) => row?.id_customer?.mobile
    },
    {
      header: "A/c Number",
      cell: (row) => row?.id_scheme_account?.scheme_acc_number === "" ? 'Not Allocated' : row?.id_scheme_account?.scheme_acc_number
    },
    {
      header: "Start Date",
      cell: (row) => {
        const startDate = new Date(row?.id_scheme_account?.start_date);
        return startDate.toLocaleDateString();
      }
    },
    {
      header: "Maturity Date",
      cell: (row) => {
        const maturityDate = new Date(row?.id_scheme_account?.maturity_date);
        return maturityDate.toLocaleDateString();
      }
    },
    {
      header: "Total Installment",
      cell: (row) => row?.id_scheme_account?.total_installments
    },
    {
      header: "Paid Installment",
      cell: (row) => row?.paid_installments
    },
    {
      header: "GST AMT",
      cell: (row) => row?.gst_amount 
    },
    {
      header: "Fine AMT",
      cell: (row) => row?.fine_amount
    },
    {
      header: "Total Paid",
      cell: (row) => row?.total_amt
    },
    {
      header: "Paid Weight",
      cell: (row) => row?.metal_weight
    },
    {
      header: "Metal Rate",
      cell: (row) => row?.metal_rate
    },
    {
      header: "Cash",
      cell: (row) => row?.cash_amount
    },
    {
      header: "Card Amount",
      cell: (row) => row?.card_amount
    },
    {
      header: "Gpay",
      cell: (row) => row?.gpay_amount
    },
    {
      header: "Phonepay",
      cell: (row) => row?.phonepay_amount
    },
    
    {
      header: "Payment Mode",
      cell: (row) => row?.payment_mode?.mode_name
    },
    {
      header: "Payment Type",
      cell: (row) => row?.payment_type === 1 ? "OFFLINE" : "ONLINE"
    },
    {
      header: "Classification Name",
      cell: (row) => row?.id_scheme_account?.id_classification?.classification_name
    },
    {
      header: 'Scheme Type',
      cell: (row) => {
        if (row?.id_scheme?.scheme_type === 1) {
          return `Amount End Weight`;
        } else if (row?.id_scheme?.scheme_type === 2) {
          return `Amount To Weight`;
        } else if (row?.id_scheme?.scheme_type === 3) {
          return `Weight`;
        }  else if (row?.id_scheme?.scheme_type === 4) {
          return `Flexible Amount To Bonus`;
        }  else if (row?.id_scheme?.scheme_type === 5) {
          return `Flexiable Amount To Weight`;
        }  else if (row?.id_scheme?.scheme_type === 6) {
          return `Fixed Amount To Weight`;
        }  else if (row?.id_scheme?.scheme_type === 7) {
          return `Fixed Amount End Weight`;
        }  else if (row?.id_scheme?.scheme_type === 8) {
          return `Fixed Amount To Bonus`;
        }  else if (row?.id_scheme?.scheme_type === 9) {
          return `Flexible Amount End Weight`;
        }  else if (row?.id_scheme?.scheme_type === 10) {
          return `Digi Gold`;
        } else {
          return `Amount To Bonus`;
        }
      }
    },
    {
      header: "Added BY",
      cell: (row) => row?.added_by === 0 ? "ADMIN" : row?.added_by === 1 ? "WEB APP" : "MOBILE APP"
    },
    {
      header: "Branch Name",
      cell: (row) => row?.id_branch?.branch_name
    }   
  
  ];


  const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      from_date:null,
        to_date:null,
        added_by:'',
        scheme_status:'',
        id_classification: '',
        collectionuserid: '',
        id_scheme: '',
        id_branch: '',
        scheme_type:''
    }));
    toast.success("Filter is cleared");
 
    getschemepaymentMutate({
      from_date:null,
        to_date:null,
        added_by:'',
        scheme_status:'',
        id_classification: '',
        collectionuserid: '',
        id_scheme: '',
        id_branch: '',
        scheme_type:''
    });
  }
 

  return (
    <div className="flex flex-col p-4">
    <h2 className="text-2xl text-gray-900 font-bold">Scheme Payment Report</h2>
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
        <button
            id="filter"
            className="text-white bg-[#023453] w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => handleReset()}
          >
            <RefreshCcw size={20} />
          </button>
           <ExportToExcel apiData={schemepayment} fileName="SchemePayment Report" />
                <ExportToPDF  apiData={schaccExp} fileName="schemePayment Report"/>
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
    <div className="mt-4">
      <Table data={schemepayment} columns={columns} isLoading={isLoading}/>
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
        <select name="dataTable_length" aria-controls="dataTable" className=""><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="250">250</option><option value="500">500</option><option value="1000">1,000</option></select>
        <span className="text-gray-500">entries</span>
      </div>
    </div>
  </div>
  )
}

export default SchemePaymentReport