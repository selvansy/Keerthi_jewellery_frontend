import React, { useEffect, useState } from 'react';
import Table from '../../components/common/Table';
import { useMutation } from '@tanstack/react-query'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addedtype,allschemestatus,getallschemetypes,getallbranchscheme,getallbranchclassification,getemployeebybranch,getallbranch,getpaymentmodesummary } from '../../api/Endpoints'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { CalendarDays, RefreshCcw} from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ExportToExcel } from '../common/Dropdown/Excelexport';
import { ExportToPDF } from '../common/Dropdown/ExportPdf';
import { useSelector } from 'react-redux';

function ModeWisePayment() {
    
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const [paymentMode, setpaymentMode] = useState([])
    const [paymentExp,setpaymentExp] = useState([]);
     const [branchfilter, setBranch] = useState([]);  
     const [classifyfilter, setClassify] = useState([]);
     const [employeefilter, setEmployee] = useState([]);
     const [schemetypefilter, setSchemeType] = useState([]);
     const [schemefilter, setScheme] = useState([]);
     const [addedbyfilter, setAddedby] = useState([]);
     const [schemestatusfilter, setSchemestatus] = useState([]);
    
      const [search, setSearch] = useState('')
 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [, setIsExporting] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = React.useState(false); 
    const [from_date, setFromdate] = useState('');
    const [to_date, setTodate] = useState('');
     const [filters, setFilters] = React.useState({
       from_date:from_date,
       to_date:to_date,
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
         
        getpaymentModeMutate(filterTosend)
      }, [currentPage, itemsPerPage, search])
  
    useEffect(()=>{
          getpaymentModeMutate();
        
          },[])
 
    

  const exportToExcel = () => {
    console.log("dfghjk")
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scheme Wise Report');
    XLSX.writeFile(wb, 'SchemeWiseAccountReport.xlsx');
  };

  const exportToPDF = async () => {
    console.log("fvbnm,")
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

  const currentItems = paymentMode.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(paymentMode.length / itemsPerPage);

    const filterInputchange = (e) =>{
      const {name, value} = e.target;
      setFilters(prev=>({...prev,[name]:value}));
      if(name === "id_branch"){
        handleClassifyChange(e); 
        handleemployeebyBranch(e); 
        getemployeebyBranch(e); 
        handlebranchscheme(e);
      }
    };

    
  const applyfilterdatatable = (e) =>{
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
     
    if(from_date!=="" && to_date!=="" && filters.added_by!=="" && filters.scheme_status!=="" && filters.id_classification!=="" && filters.collectionuserid!==""  && filters.id_scheme!==""  && filters.id_branch!=="" && filters.scheme_type!==""){
      setIsFilterOpen(false)
      getpaymentModeMutate(filterTosend);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };


  const { mutate: getallbranchMutate } = useMutation({
        mutationFn: getallbranch,
        onSuccess: (response) => {
          if (response) {
            setBranch(response.data);
          }
        },
      });
  
      
      const handleClassifyChange = async (e) => {  
        if (!e.target.value) return;
        const response = await getallbranchclassification({ "id_branch": e.target.value });
        if (response) {
          setClassify(response.data);
        }
      };
  
      
      const handleemployeebyBranch = async (e) => {  
        if (!e.target.value) return;
        const response = await getemployeebyBranch({ "id_branch": e.target.value });
        if (response) {
          setEmployee(response.data);
        }
      };
  
  
    
      const handlebranchscheme = async (e) => {  
        if (!e.target.value) return;
        const response = await getallbranchscheme({ "id_branch": e.target.value });
        if (response) {
          setScheme(response.data);
        }
      };
  
      
      const handleSchemetypeChange = async (e) => {
    
        const response = await getallschemetypes();
        if (response) {
          setSchemeType(response.data);
        }
      };
    
      const handleAddedtypeChange = async (e) => {
    
        const response = await addedtype();
        if (response) {
          setAddedby(response.data);
        }
      };

       
          const handleSchemestatusChange = async (e) => {  
      
            const response = await allschemestatus();
            if (response) {
              setSchemestatus(response.data);
            }
          };

      useEffect(() => {
            getallbranchMutate();
            handleAddedtypeChange();
            handleSchemetypeChange();
            handleSchemestatusChange();
          }, []);

 const columns = [
            {
              header: 'PAYMENT MODE',
              cell: (row) => `${row.mode_name}`,
            },
            {
              header: 'COLLECTION',
              cell: (row) => `${row.collection_amount}`,
            }
          ]

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
  const { mutate: getpaymentModeMutate } = useMutation({
    mutationFn: getpaymentmodesummary,
    onSuccess: (response) => {

      setpaymentMode(response.data)
    let arrayData = [];
      if(response.data.length !==0){
            for(var i=0;i<response.data.length;i++){
                arrayData.push({
                    scheme_acc_number:response.data[i].scheme_acc_number,
                    account_name:response.data[i].account_name,
                    mobile:response.data[i].mobile,
                    total_paidinstallments:response.data[i].total_paidinstallments,
                    total_paidamount:response.data[i].total_paidamount,
                    total_weight:response.data[i].total_weight,
                    start_date:response.data[i].start_date,
                    maturity_date:response.data[i].maturity_date,
                    total_paidinstallments:response.data[i].total_paidinstallments,
                    total_paidamount:response.data[i].total_paidamount,
                    total_weight:response.data[i].total_weight,
                    branch_name:response.data[i].branch_name
            
                  });
            }
      }
 
     console.log(arrayData)
      setpaymentExp(arrayData)
      
    //   setTotalPages(response.totalPages)
    },
    onError: (error) => {
      console.error('Error fetching countries:', error);
    }
  });

 

  return (
    <div className="flex flex-col p-4">
    <h2 className="text-2xl text-gray-900 font-bold">Scheme Account Report</h2>
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
        <ExportToExcel apiData={paymentMode} fileName="paymentMode Report" />
        <ExportToPDF  apiData={paymentExp} fileName="scheme account"/>
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
                       <select  name="id_branch" onChange={(e)=>{filterInputchange(e);   }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {branchfilter.map((branch)=>(
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
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                   CLassification
                     </label>
                     <div className="relative">
                       <select  name="id_classification"  onChange={(e)=>{filterInputchange(e); handleFilterChange(e)}} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {classifyfilter.map((classify)=>(
                           <option key={classify._id} value={classify._id}>{classify.classification_name}</option>
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
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                      Agent Collection
                     </label>
                     <div className="relative">
                       <select  name="collectionuserid" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {employeefilter.map((employee)=>(
                           <option key={employee._id} value={employee._id}>{employee.firstname + " " + employee.lastname}</option>
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
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                      Scheme
                     </label>
                     <div className="relative">
                       <select  name="id_scheme" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {schemefilter.map((scheme)=>(
                           <option key={scheme._id} value={scheme._id}>{scheme.scheme_name}</option>
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
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                      Scheme Type
                     </label>
                     <div className="relative">
                       <select  name="scheme_type" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {schemetypefilter.map((schemetype)=>(
                           <option key={schemetype._id} value={schemetype._id}>{schemetype.scheme_typename}</option>
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
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                      Added By
                     </label>
                     <div className="relative">
                       <select  name="added_by" onChange={filterInputchange}  className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {addedbyfilter.map((addedby)=>(
                           <option key={addedby.id} value={addedby.id}>{addedby.name}</option>
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
                   <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                     Status
                     </label>
                     <div className="relative">
                       <select  name="scheme_status" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                         <option value='' >--Select--</option>
                         {schemestatusfilter.map((schemestatus)=>(
                           <option key={schemestatus._id} value={schemestatus._id}>{schemestatus.status_name}</option>
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
        />
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
  )
}

export default ModeWisePayment