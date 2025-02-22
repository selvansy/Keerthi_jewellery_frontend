import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { addedtype, allschemestatus, getallschemetypes, getallbranchscheme, getallbranchclassification, getemployeebybranch, getallbranch, schemeaccounttable, changeschemeaccountStatus, deleteschemeaccount } from '../../../api/Endpoints'
import { toast } from 'react-toastify'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { setScemeAccountId } from "../../../../redux/clientFormSlice"
import { openModal } from '../../../../redux/modalSlice';
import { eventEmitter } from '../../../../utils/EventEmitter';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../common/Modal';
import ModelOne from '../../common/Modelone';
import { ExportToExcel } from '../../common/Dropdown/Excelexport';
import { ExportToPDF } from '../../common/Dropdown/ExportPdf';
import { useDebounce } from '../../../hooks/useDebounce';
import Ledgerdetails from "./ledgerdetails"
import usePagination from '../../../hooks/usePagination'


const DigiGold = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [isLoading, setisLoading] = useState(true)
  const [filtered, SetFiltered] = useState(false)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 600)
  const [schemeaccount, setschemeaccount] = useState([])
  const [schaccExp, setschaccExp] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [from_date, setFromdate] = useState('');
  const [to_date, setTodate] = useState('');
  const [branchfilter, setBranch] = useState([]);
  const [classifyfilter, setClassify] = useState([]);
  const [employeefilter, setEmployee] = useState([]);
  const [schemetypefilter, setSchemeType] = useState([]);
  const [schemefilter, setScheme] = useState([]);
  const [addedbyfilter, setAddedby] = useState([]);
  const [schemestatusfilter, setSchemestatus] = useState([]);
  const [displaysetting, setDiplaySetting] = useState(0);
  const [ispayable, setIspayable] = useState(false);
  const [isviewOpen, setIsviewOpen] = useState(false);

  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;
  const id_branch = roledata?.branch;



  const [filters, setFilters] = React.useState({

    from_date: from_date,
    to_date: to_date,
    added_by: '',
    scheme_status: '',
    id_branch: id_branch,
    type: 0,
    id_classification: '',
    collectionuserid: '',
    id_scheme: '',
    scheme_type: 2
  });


  const handlePageChange = (page) => {

    const pageNumber = Number(page);
      if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
        return;
      }
   
      setCurrentPage(pageNumber);
    
  };


    const nextPage = () => {
      setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };
  
    const prevPage = () => {
      setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
  

  const paginationData = {totalItems:totalPages,currentPage:currentPage,itemsPerPage:itemsPerPage,handlePageChange:handlePageChange}
  const paginationButtons = usePagination(paginationData)

  const handleReset = () => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev, added_by: '',
      scheme_status: '',
      id_branch: id_branch,
      type: 0,
      id_classification: '',
      collectionuserid: '',
      id_scheme: '',
      scheme_type:2
    }));

    SetFiltered(false)
    toast.success("Filter is cleared");
    getschemeaccountMutate({
      page: currentPage,
      limit: itemsPerPage,
      added_by: '',
      search: debouncedSearch,
      scheme_status: '',
      id_branch: id_branch,
      type: 0,
      id_classification: '',
      collectionuserid: '',
      id_scheme: '',
      scheme_type: 2
    });

  }

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name === "id_branch") {
      handleClassifyChange(e);
      handleemployeebyBranch(e);
      handleemployeebyBranch(e);
      handlebranchscheme(e);
    }
  };

  function closeIncommingModal() {
    setIsviewOpen(false);
    setIsSettingOpen(false);
  }

  //state to save ledger data
  const handleOpenLedger = async (data) => {
    if (!data) return;
    setPopuptitle('View Details');
    setDiplaySetting(1);
    setIsviewOpen(true);
    dispatch(setScemeAccountId(data))
  };




  const applyfilterdatatable = (e) => {

    e.preventDefault();
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: debouncedSearch,
      added_by: filters.added_by,
      scheme_status: filters.scheme_status,
      type: 0,
      id_classification: filters.id_classification,
      collectionuserid: filters.collectionuserid,
      id_scheme: filters.id_scheme,
      id_branch: filters.id_branch,
      scheme_type: filters.scheme_type
    };

    setIsFilterOpen(false)
    SetFiltered(true)

    getschemeaccountMutate(filterTosend);

  };


  const handleClickfilter = (e) => {
    getallbranchMutate();
    handleAddedtypeChange();
    handleSchemetypeChange();
    handleSchemestatusChange();
    setIsFilterOpen(true);
  }


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
    const response = await getemployeebybranch({ "id_branch": e.target.value });
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


  //mutation to get scheme type
  const { mutate: getschemeaccountMutate } = useMutation({
    mutationFn: (payload) => schemeaccounttable(payload),
    onSuccess: (response) => {
      setschemeaccount(response.data)
      setTotalPages(response.totalPages);

      let arrayData = [];
      if (response.data.length !== 0) {
        for (var i = 0; i < response.data.length; i++) {
          arrayData.push({
            scheme_acc_number: response.data[i].scheme_acc_number,
            account_name: response.data[i].account_name,
            mobile: response.data[i].mobile,
            total_paidinstallments: response.data[i].total_paidinstallments,
            total_paidamount: response.data[i].total_paidamount,
            total_weight: response.data[i].total_weight,
            start_date: response.data[i].start_date,
            maturity_date: response.data[i].maturity_date,
            branch_name: response.data[i].branch_name

          });
        }
      }

      setschaccExp(arrayData)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error fetching countries:', error);
      setisLoading(false)
    }
  });

  useEffect(() => {

    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: debouncedSearch,
      added_by: filters.added_by,
      scheme_status: filters.scheme_status,
      type: 0,
      id_classification: filters.id_classification,
      collectionuserid: filters.collectionuserid,
      id_scheme: filters.id_scheme,
      id_branch: filters.id_branch,
      scheme_type: filters.scheme_type
    };

    getschemeaccountMutate(filterTosend)
  }, [currentPage, itemsPerPage, debouncedSearch])


  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/manageaccount/addschemeaccount');
  }

  const handleStatusToggle = async (id) => {

    let response = await changeschemeaccountStatus(id);
    if (response) {
      toast.success(response.message);
      getschemeaccountMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch })
    }
  };

  const handleDelete = async (id) => {
    let response = await deleteschemeaccount(id);
    if (response) {
      toast.success(response.message);
      getschemeaccountMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch })
    }
  };

  const handleEdit = (id) => {
    navigate(`/manageaccount/addschemeaccount/${id}`);
  };

  
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

 

  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Actions',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative group  right-0 z-20 bg-white">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row?._id);
              setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          <div
            className={`absolute transform z-50 ${activeDropdown === row?._id ? '' : 'hidden'} `}
            style={{
              top: rowIndex >= schemeaccount.length - 2 ? 'auto' : '72%',
              bottom: rowIndex >= schemeaccount.length - 2 ? '-74%' : 'auto',
            }}
          >
            <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">

                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    handleOpenLedger(row?._id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Ledger
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    handleDelete(row?._id);
                    setActiveDropdown(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setActiveDropdown(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
   
    {
      header: 'Account Name',
      cell: (row) => row?.account_name,
    },
    {
      header: "Mobile",
      cell: (row) => row?.mobile
    },

    {
      header: 'Scheme',
      cell: (row) => {
        if (row?.scheme_type === 0 || row?.scheme_type === 1 || row?.scheme_type === 2) {
          return `${row?.scheme_name} (₹ ${row?.amount})`;
        } else if (row?.scheme_type === 3) {
          return `${row?.scheme_name} (GRM ${row?.min_weight} - ${row?.max_weight})`;
        } else {
          return `${row?.scheme_name} (₹  ${row?.min_amount} - ${row?.max_amount})`;
        }
      }
    },
    {
      header: 'Metal Name',
      cell: (row) => {
        return row?.id_metal === 1 ? 'Gold' :
          row?.id_metal === 2 ? 'Silver' :
            row?.id_metal === 3 ? 'Diamond' :
              row?.id_metal === 4 ? 'Platinum' : 'Gold Coins';
      }
    },
    {
      header: 'Purity Name',
      cell: (row) => {
        return row?.id_purity === 1 ? '24CT' :
          row?.id_purity === 2 ? '22CT' :
            row?.id_purity === 3 ? '20CT' :
              row?.id_purity === 4 ? '18CT' :
                row?.id_purity === 5 ? 'Gold coin' :
                  row?.id_purity === 6 ? 'Platinum' :
                    row?.id_purity === 7 ? 'Diamond' : 'Silver'
      }
    },
    {
      header: "A/c No",
      cell: (row) => row?.scheme_acc_number === "" ? 'Not Allocated' : row?.scheme_acc_number
    },
    {
      header: "Start Date",
      cell: (row) => {
        const date = new Date(row?.start_date);
        return date.toLocaleDateString('en-GB');
      }
    },
    {
      header: "Maturity Date",
      cell: (row) => {
        const date = new Date(row?.maturity_date);
        return date.toLocaleDateString('en-GB');
      }
    },

    {
      header: "Total Ins",
      cell: (row) => row?.total_installments
    },
    {
      header: "Paid Ins",
      cell: (row) => row?.total_paidinstallments
    },
    {
      header: "Paid Amt",
      cell: (row) => row?.total_paidamount
    },
    {
      header: "Paid Wgt",
      cell: (row) => row?.total_weight
    },
    {
      header: 'Scheme Type',
      cell: (row) => {
        if (row?.scheme_type === 1) {
          return `Amount End Weight`;
        } else if (row?.scheme_type === 2) {
          return `Amount To Weight`;
        } else if (row?.scheme_type === 3) {
          return `Weight`;
        } else if (row?.scheme_type === 4) {
          return `Flexible Amount To Bonus`;
        } else if (row?.scheme_type === 5) {
          return `Flexiable Amount To Weight`;
        } else if (row?.scheme_type === 6) {
          return `Fixed Amount To Weight`;
        } else if (row?.scheme_type === 7) {
          return `Fixed Amount End Weight`;
        } else if (row?.scheme_type === 8) {
          return `Fixed Amount To Bonus`;
        } else if (row?.scheme_type === 9) {
          return `Flexible Amount End Weight`;
        } else if (row?.scheme_type === 10) {
          return `Digi Gold`;
        } else {
          return `Amount To Bonus`;
        }
      }
    },
    {
      header: "Classification Name",
      cell: (row) => row?.classification_name
    },
    {
      header: "Branch Name",
      cell: (row) => row?.branch_name
    },
    {
      header: "Added By",
      cell: (row) => row?.created_through
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString('en-GB');
      }
    }

  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Digi Gold Account</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">



          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }} >
            + Add Account
          </button>
          <div className="flex flex-row items-center justify-end gap-2">

            <ExportToExcel apiData={schemeaccount} fileName="SchemeAccount Report" />
            <ExportToPDF apiData={schaccExp} fileName="scheme account" />
          </div>




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
          ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
          {/* getallbranchMutate,handleVendorChange,handleGiftChange */}
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
                  <select name="id_branch" onChange={(e) => { filterInputchange(e); }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  CLassification
                </label>
                <div className="relative">
                  <select name="id_classification" onChange={(e) => { filterInputchange(e); handlePageChange(e) }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {classifyfilter.map((classify) => (
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
                  <select name="collectionuserid" onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {employeefilter.map((employee) => (
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
                  <select name="id_scheme" onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {schemefilter.map((scheme) => (
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
                  Added By
                </label>
                <div className="relative">
                  <select name="added_by" onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {addedbyfilter.map((addedby) => (
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
                  <select name="scheme_status" onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {schemestatusfilter.map((schemestatus) => (
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
      <div className="mt-4 overflow-x-auto">
        <Table
          data={schemeaccount}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
      {schemeaccount.length > 0 && (
        <div className="flex justify-between mt-4 p-2">
        <div className={`flex flex-row items-center justify-center gap-2  `}>
          <div className="flex items-center gap-4">
            <button
              onClick={prevPage}
              readOnly={currentPage === 1}
             
              className={`p-2 text-gray-500 rounded-md ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"} `}
            >
              Previous
            </button>
          </div>
  
          <div className="flex flex-row items-center justify-center gap-2">
            {paginationButtons}
          </div>
  
          <div className="flex items-center">
            <button
              onClick={nextPage}
              readOnly={currentPage === totalPages}
              
              className={`p-2 text-gray-500 rounded-md  ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
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
      )}
      {displaysetting === 1 && (
        <ModelOne
          title={popuptitle}
          extraClassName='max-w-5xl w-full '
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >

          <Ledgerdetails
            setIsOpen={setIsviewOpen}
          />

        </ModelOne>
      )}
      <Modal />
    </div>
  )
}

export default DigiGold