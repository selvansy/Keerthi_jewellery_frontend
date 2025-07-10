// import React, { useEffect, useState } from 'react'
// import Table from '../../common/Table'
// import { useNavigate,useParams } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query'
// import { SlidersHorizontal, Search, X } from 'lucide-react'
// import { addedtype,allschemestatus,getallschemetypes,getallbranchscheme,getallbranchclassification,getemployeebybranch,getallbranchcustomer,getallbranch,schemepaymentdatatable, changeschemeaccountStatus, deleteschemepayment  } from '../../../api/Endpoints'
// import { toast } from 'react-toastify'
// import { CalendarDays, RefreshCcw} from 'lucide-react'
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
// import { useSelector } from 'react-redux'

// const SchemePayment = () => {
//   const roledata = useSelector((state) => state.clientForm.roledata);
//   const branch = roledata?.branch;
//   const layout_color = useSelector((state) => state.clientForm.layoutColor);
  
//   const navigate = useNavigate()
  
//   const [search, setSearch] = useState('')
//   const [isLoading,setisLoading] = useState(true)
  
//   const [paymentaccount, setPaymentaccount] = useState([])
//    const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [selectedRow, setSelectedRow] = useState(null)
//   const [activeDropdown, setActiveDropdown] = useState(null)
//   const [isFilterOpen, setIsFilterOpen] = React.useState(false);
//   const [from_date, setFromdate] = useState(new Date());
//   const [to_date, setTodate] = useState(new Date());
//   const [branchfilter, setBranch] = useState([]);  
//   const [classifyfilter, setClassify] = useState([]);
//   const [employeefilter, setEmployee] = useState([]);
//   const [schemetypefilter, setSchemeType] = useState([]);
//   const [schemefilter, setScheme] = useState([]);
//   const [addedbyfilter, setAddedby] = useState([]);
//   const [schemestatusfilter, setSchemestatus] = useState([]);




//   const [filters, setFilters] = React.useState({
//     from_date:from_date,
//     to_date:to_date,
//     added_by:'',
//     scheme_status:'',
//     id_classification: '',
//     collectionuserid: '',
//     id_scheme: '',
//     id_branch: branch,
//     scheme_type:''
//   });

  
//   const handleReset = (e) => {
//     setFromdate("");
//     setTodate("");
//     setFilters(prev => ({
//       ...prev, 
//       from_date:"",
//       to_date:"",
//       added_by:'',
//       scheme_status:'',
//       id_classification: '',
//       collectionuserid: '',
//       id_scheme: '',
//       id_branch: branch,
//       scheme_type:''
//     }));
//       toast.success("Filter is cleared");
//     const filterTosend = {
//       page:currentPage,
//       from_date:"",
//       to_date:"",
//       limit: itemsPerPage,
//       search: search,
//       added_by:"",
//       scheme_status:"",
//       id_classification: "",
//       collectionuserid: "",
//       id_scheme: "",
//       id_branch: branch,
//       scheme_type:""
//     };
     
//     getschemepaymentMutate(filterTosend);
//   };

  
 
//   const handleClickfilter = (e) => {
//     handleClassifyChange(e); 
//     getallbranchMutate();
//     handleAddedtypeChange();
//     handleSchemetypeChange();
//     handleSchemestatusChange();
//     handlebranchscheme(e);
//     setIsFilterOpen(true);
//   }

//   const filterInputchange = (e) =>{
//     const {name, value} = e.target;
//     setFilters(prev=>({...prev,[name]:value}));
//     if(name === "id_branch"){
//       handleClassifyChange(e); 
//       handleemployeebyBranch(e); 
//       handlebranchscheme(e);
//       getallbranchMutate();
//       handleAddedtypeChange();
//       handleSchemetypeChange();
//       handleSchemestatusChange();
//     }
//   };

  
//   const applyfilterdatatable = (e) =>{
//     e.preventDefault();   
//       const filterTosend = {
//         page:currentPage,
//         from_date:from_date,
//         to_date:to_date,
//         limit: itemsPerPage,
//         search: search,
//         added_by:filters.added_by,
//         scheme_status:filters.scheme_status,
//         id_classification: filters.id_classification,
//         collectionuserid: filters.collectionuserid,
//         id_scheme: filters.id_scheme,
//         id_branch: filters.id_branch,
//         scheme_type:filters.scheme_type
//       };
       
     
//         setIsFilterOpen(false)
//         getschemepaymentMutate(filterTosend);
      
//     };


//     const { mutate: getallbranchMutate } = useMutation({
//       mutationFn: getallbranch,
//       onSuccess: (response) => {
        
//         if (response) {
//           setBranch(response.data);
//         }
//       },
//     });

    
//     const handleClassifyChange = async (e) => {  
//       if (!e.target.value) return;
//       const response = await getallbranchclassification({ "id_branch": e.target.value });
//       if (response) {
//         setClassify(response.data);
//       }
//     };


  
    
//     const handleemployeebyBranch = async (e) => {  
//       if (!e.target.value) return;
//       const response = await getemployeebybranch({ "id_branch": e.target.value });
//       if (response) {
//         setEmployee(response.data);
//       }
//     };


  
//     const handlebranchscheme = async (e) => {  
//       if (!e.target.value) return;
//       const response = await getallbranchscheme({ "id_branch": e.target.value });
//       if (response) {
//         setScheme(response.data);
//       }
//     };

    
//     const handleSchemetypeChange = async (e) => {
  
//       const response = await getallschemetypes();
//       if (response) {
//         setSchemeType(response.data);
//       }
//     };
  
//     const handleAddedtypeChange = async (e) => {
  
//       const response = await addedtype();
//       if (response) {
//         setAddedby(response.data);
//       }
//     };
  
//     const   handleSchemestatusChange = async (e) => {  

//       const response = await allschemestatus();
//       if (response) {
//         setSchemestatus(response.data);
//       }
//     };
  

//   //mutation to get scheme type
//   const { mutate: getschemepaymentMutate } = useMutation({
//     mutationFn: (payload)=> schemepaymentdatatable(payload),
//     onSuccess: (response) => {

//       setPaymentaccount(response.data)
//       setTotalPages(response.totalPages)
//       setisLoading(false)
//     },
//     onError: (error) => {
//       console.error('Error:', error);
//       setisLoading(false)
//     }
//   });

//   useEffect(() => {
 
//     const filterTosend = {
//       page:currentPage,
//       from_date:from_date,
//       to_date:to_date,
//       limit: itemsPerPage,
//       search: search,
//       added_by:filters.added_by,
//       scheme_status:filters.scheme_status,
//       id_classification: filters.id_classification,
//       collectionuserid: filters.collectionuserid,
//       id_scheme: filters.id_scheme,
//       id_branch: filters.id_branch,
//       scheme_type:filters.scheme_type
//     };
     
//     getschemepaymentMutate(filterTosend)
//   }, [currentPage, itemsPerPage, search])

//   useEffect(() => {
 
//     const filterTosend = {
//       page:currentPage,
//       from_date:from_date,
//       to_date:to_date,
//       limit: itemsPerPage,
//       search: search,
//       added_by:filters.added_by,
//       scheme_status:filters.scheme_status,
//       id_classification: filters.id_classification,
//       collectionuserid: filters.collectionuserid,
//       id_scheme: filters.id_scheme,
//       id_branch: filters.id_branch,
//       scheme_type:filters.scheme_type
//     };
     
//     getschemepaymentMutate(filterTosend)
//   }, [])



//   const handleSearch = (e) => {
//     setSearch(e.target.value)
//   }

//   const handleClick = (e) => {
//     e.preventDefault();
//     navigate('/payment/addschemepayment');
//   }

//   const handleStatusToggle = async (id) => {
//     ;
//     let response = await changeschemeaccountStatus(id);
//     if (response) {
//       toast.success(response.message);
//       getschemepaymentMutate({ page: currentPage, limit: itemsPerPage, search: search })
//     }
//   };

//   const handleDelete = async (id) => {
//     let response = await deleteschemepayment(id);
//     if (response) {
//       toast.success(response.message);
//       getschemepaymentMutate({ page: currentPage, limit: itemsPerPage, search: search })
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/payment/addschemepayment/${id}`);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };


//   const paginationButtons = [];
//   for (let i = 1; i <= totalPages; i++) {
//     paginationButtons.push(
//       <button
//         key={i}
//         onClick={() => handlePageChange(i)}
//         className={`p-2 w-10 h-10 rounded-md  ${currentPage === i ? ' text-white' : 'text-slate-400'}`}
//         style={{ backgroundColor: layout_color }} >
//         {i}
//       </button>
//     );
//   }



//   const columns = [
//     {
//       header: 'S.No',
//       cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
//     },
//     {
//       header: 'TXT Id',
//       cell: (row) => row?.id_transaction,
//     },
//     {
//       header: "Paid Date",
//       cell: (row) => {
//         const paidDate = new Date(row?.date_payment);
//         return paidDate.toLocaleDateString();
//       }
//     },

//     {
//       header: "Scheme Name",
//       cell: (row) => {
//         let scheme_name = "";
//         if (row?.id_scheme?.scheme_type === 0 || row?.id_scheme?.scheme_type === 1 || row?.id_scheme?.scheme_type === 2) {
//           scheme_name = row?.id_scheme.scheme_name + "(₹. " + row?.id_scheme.amount + ")";
//         } else if (row?.id_scheme?.scheme_type === 3) {
//           scheme_name = row?.id_scheme.scheme_name + "(" + row?.id_scheme?.min_weight + " Grm - " + row?.id_scheme.max_weight + " Grm)";
//         } else {
//           scheme_name = row?.id_scheme?.scheme_name + "(₹" + row?.id_scheme?.min_amount + " - " + row?.id_scheme?.max_amount + ")";
//         }
//         return scheme_name;
//       }
//     },
    
//     {
//       header: "Customer Name",
//       cell: (row) => row?.id_scheme_account?.account_name
//     },
//     {
//       header: "Mobile",
//       cell: (row) => row?.id_customer?.mobile
//     },
//     {
//       header: "A/c Number",
//       cell: (row) => row?.id_scheme_account?.scheme_acc_number === "" ? 'Not Allocated' : row?.id_scheme_account?.scheme_acc_number
//     },
//     {
//       header: "Start Date",
//       cell: (row) => {
//         const startDate = new Date(row?.id_scheme_account?.start_date);
//         return startDate.toLocaleDateString();
//       }
//     },
//     {
//       header: "Maturity Date",
//       cell: (row) => {
//         const maturityDate = new Date(row?.id_scheme_account?.maturity_date);
//         return maturityDate.toLocaleDateString();
//       }
//     },
//     {
//       header: "Total Installment",
//       cell: (row) => row?.id_scheme_account?.total_installments
//     },
//     {
//       header: "Paid Installment",
//       cell: (row) => row?.paid_installments
//     },
//     {
//       header: "GST AMT",
//       cell: (row) => row?.gst_amount 
//     },
//     {
//       header: "Fine AMT",
//       cell: (row) => row?.fine_amount
//     },
//     {
//       header: "Total Paid",
//       cell: (row) => row?.total_amt
//     },
//     {
//       header: "Paid Weight",
//       cell: (row) => row?.metal_weight
//     },
//     {
//       header: "Metal Rate",
//       cell: (row) => row?.metal_rate
//     },
//     {
//       header: "Cash",
//       cell: (row) => row?.cash_amount
//     },
//     {
//       header: "Card Amount",
//       cell: (row) => row?.card_amount
//     },
//     {
//       header: "Gpay",
//       cell: (row) => row?.gpay_amount
//     },
//     {
//       header: "Phonepay",
//       cell: (row) => row?.phonepay_amount
//     },
    
//     {
//       header: "Payment Mode",
//       cell: (row) => row?.payment_mode?.mode_name
//     },
//     {
//       header: "Payment Type",
//       cell: (row) => row?.payment_type === 1 ? "OFFLINE" : "ONLINE"
//     },
//     {
//       header: "Classification Name",
//       cell: (row) => row?.id_scheme_account?.id_classification?.classification_name
//     },
//     {
//       header: 'Scheme Type',
//       cell: (row) => {
//         if (row?.id_scheme?.scheme_type === 1) {
//           return `Amount End Weight`;
//         } else if (row?.id_scheme?.scheme_type === 2) {
//           return `Amount To Weight`;
//         } else if (row?.id_scheme?.scheme_type === 3) {
//           return `Weight`;
//         }  else if (row?.id_scheme?.scheme_type === 4) {
//           return `Flexible Amount To Bonus`;
//         }  else if (row?.id_scheme?.scheme_type === 5) {
//           return `Flexiable Amount To Weight`;
//         }  else if (row?.id_scheme?.scheme_type === 6) {
//           return `Fixed Amount To Weight`;
//         }  else if (row?.id_scheme?.scheme_type === 7) {
//           return `Fixed Amount End Weight`;
//         }  else if (row?.id_scheme?.scheme_type === 8) {
//           return `Fixed Amount To Bonus`;
//         }  else if (row?.id_scheme?.scheme_type === 9) {
//           return `Flexible Amount End Weight`;
//         }  else if (row?.id_scheme?.scheme_type === 10) {
//           return `Digi Gold`;
//         } else {
//           return `Amount To Bonus`;
//         }
//       }
//     },
//     {
//       header: "Added BY",
//       cell: (row) => row?.added_by === 0 ? "ADMIN" : row?.added_by === 1 ? "WEB APP" : "MOBILE APP"
//     },
//     {
//       header: "Branch Name",
//       cell: (row) => row?.id_branch?.branch_name
//     },
    
    
//     {
//       header: 'Actions',
//       cell: (row, rowIndex) => (
//         <div className="dropdown-container relative">
//           <button
//             className="p-1 hover:bg-gray-100 rounded-full"
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedRow(row?._id);
//               setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
//             }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
//             </svg>
//           </button>

//           {activeDropdown === row?._id && (
//             <div
//               className="absolute right-[47px] lg:right-[163px] md:right-[150px] sm:right-[100px] transform -translate-x-8"
//               style={{
//                 top: rowIndex >= paymentaccount.length - 2 ? 'auto' : '72%',
//                 bottom: rowIndex >= paymentaccount.length - 2 ? '-74%' : 'auto',
//                 // top: 'auto',
//                 // bottom: '-440%',
//                 zIndex: 9999,
//                 marginBottom: '8px',
//                 filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
//               }}
//             >
//               <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
//                 <div className="py-1">
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//                     onClick={() => {
//                       handleEdit(row?._id);
//                       setActiveDropdown(null);
//                     }}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     </svg>
//                     Edit
//                   </button>
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
//                     onClick={() => {
//                       handleDelete(row?._id);
//                       setActiveDropdown(null);
//                     }}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     Delete
//                   </button>

//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       ),

//     }
//   ];

//   return (
//     <div className="flex flex-col p-4">
//       <h2 className="text-2xl text-gray-900 font-bold">Scheme Payment</h2>
//       <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
//         <div className="relative w-full lg:w-1/3 min-w-[200px]">
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//             <Search className="text-gray-500" />
//           </div>
//           <input
//             placeholder="Search..."
//             className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
//             onChange={handleSearch}
//           />
//         </div>
//         <div className="flex flex-row items-center justify-end gap-2">
//         <button
//             className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
//             onClick={handleClick}
//             style={{ backgroundColor: layout_color }} >
//             + Add Payment
//           </button>
//            <button
//               id="filter"
//               className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
//               onClick={() => handleReset()}
//               style={{ backgroundColor: layout_color }}
//             >
//               <RefreshCcw size={20} />
//             </button>
//           <button
//             id="filter"
//             className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
//             o onClick={(e) => {
//               handleClickfilter(e);
//             }}
//             style={{ backgroundColor: layout_color }}>
//             <SlidersHorizontal size={20} />
//           </button>
          
//         </div>
//       </div>
//       <div
//         className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
//           ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex justify-between items-center p-3">
//             <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//             <button
//               onClick={() => setIsFilterOpen(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X size={20} />
//             </button> 
//           </div>
//           {/* getallbranchMutate,handleVendorChange,handleGiftChange */}
//           <form className='overflow-y-scroll scroll-hide'>
//           <div className="p-3 space-y-4 flex-1 overflow-y-auto filterscroll"> 
//             <div className="flex flex-col border-t"></div>
//             <div className="space-y-2">
//               <label className='text-gray-700 text-sm font-medium'>From Date<span className='text-red-400'>*</span></label>
//               <div className="relative">
//                 <DatePicker
//                   selected={from_date}
//                   onChange={(date) => setFromdate(date)}
//                   dateFormat="dd-MM-yyyy"
//                   placeholderText="Select Date"
//                   className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                   showMonthDropdown
//                   showYearDropdown
//                   dropdownMode="select"
//                   wrapperClassName="w-full"
//                 />
//                 <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
//                   <CalendarDays size={20} />
//                 </span>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className='text-gray-700 text-sm font-medium'>To Date<span className='text-red-400'>*</span></label>
//               <div className="relative">
//                 <DatePicker
//                   selected={to_date}
//                   onChange={(date) => setTodate(date)}
//                   dateFormat="dd-MM-yyyy"
//                   placeholderText="Select Date"
//                   className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//                   showMonthDropdown
//                   showYearDropdown
//                   dropdownMode="select"
//                   wrapperClassName="w-full"
//                 />
//                 <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
//                   <CalendarDays size={20} />
//                 </span>
//               </div>
//             </div>   

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Branch Name
//               </label>
//               <div className="relative">
//                 <select  name="id_branch" onChange={(e)=>{filterInputchange(e);   }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {branchfilter.map((branch)=>(
//                     <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//             CLassification
//               </label>
//               <div className="relative">
//                 <select  name="id_classification"  onChange={(e)=>{filterInputchange(e); handleGiftChange(e)}} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {classifyfilter.map((classify)=>(
//                     <option key={classify._id} value={classify._id}>{classify.classification_name}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                Agent Collection
//               </label>
//               <div className="relative">
//                 <select  name="collectionuserid" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {employeefilter.map((employee)=>(
//                     <option key={employee._id} value={employee._id}>{employee.firstname + " " + employee.lastname}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                Scheme
//               </label>
//               <div className="relative">
//                 <select  name="id_scheme" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {schemefilter.map((scheme)=>(
//                     <option key={scheme._id} value={scheme._id}>{scheme.scheme_name}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                Scheme Type
//               </label>
//               <div className="relative">
//                 <select  name="scheme_type" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {schemetypefilter.map((schemetype)=>(
//                     <option key={schemetype._id} value={schemetype._id}>{schemetype.scheme_typename}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                Added By
//               </label>
//               <div className="relative">
//                 <select  name="added_by" onChange={filterInputchange}  className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {addedbyfilter.map((addedby)=>(
//                     <option key={addedby.id} value={addedby.id}>{addedby.name}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//               Status
//               </label>
//               <div className="relative">
//                 <select  name="scheme_status" onChange={filterInputchange}   className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
//                   <option value='' >--Select--</option>
//                   {schemestatusfilter.map((schemestatus)=>(
//                     <option key={schemestatus._id} value={schemestatus._id}>{schemestatus.status_name}</option>
//                   ))
//                   }
//                 </select>
//                 <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                   <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
//                     <path d="M19 9l-7 7-7-7"></path>
//                   </svg>
//                 </div>
//               </div>
//             </div>
//             <div className="p-4 borde">
//               <div className="bg-yellow-300 flex justify-center gap-3">
//                 <button
//                   onClick={applyfilterdatatable}
//                   className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//           </form>
//         </div>
//       </div>
//       {isFilterOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsFilterOpen(false)}
//         />
//       )}
//       <div className="mt-4">
//         <Table
//           data={paymentaccount}
//           columns={columns}
//           isLoading={isLoading}
//         />
//       </div>
//       {paymentaccount.length > 0 && (
//          <div className="flex justify-between mt-4 p-2">
//          <div className="flex flex-row items-center justify-center gap-2">
//            <div className="flex items-center gap-4">
//              <button
//                onClick={() => handlePageChange(currentPage - 1)}
//                readOnly={currentPage === 1}
//                className="p-2 text-gray-500 rounded-md"
//              >
//                Previous
//              </button>
//            </div>
 
//            <div className="flex flex-row items-center justify-center gap-2">
//              {paginationButtons}
//            </div>
 
//            <div className="flex items-center">
//              <button
//                onClick={() => handlePageChange(currentPage + 1)}
//                readOnly={currentPage === totalPages}
//                className="p-2 text-gray-500 rounded-md"
//              >
//                Next
//              </button>
//            </div>
//          </div>
 
//          <div className="mt-4 flex gap-2 justify-center items-center">
//            <span className="text-gray-500">Show</span>
//            <select
//              id="itemsPerPage"
//              value={itemsPerPage}
//              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//              className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300"
//            >
//               <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                   <option value={250}>250</option>
//                   <option value={500}>500</option>
//                   <option value={1000}>1000</option>
//            </select>
//            <span className="text-gray-500">entries</span>
//          </div>
//        </div>
//       )}
//     </div>
//   )
// }

// export default SchemePayment