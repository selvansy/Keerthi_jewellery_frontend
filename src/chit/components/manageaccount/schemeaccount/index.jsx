import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SlidersHorizontal, Search, X ,Eye } from 'lucide-react'
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
import Action from '../../common/action'

const Schemeaccount = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;
  const branch = roledata?.branch;
  const id_branch = roledata?.id_branch

  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(true)
  const navigate = useNavigate()
  const [popuptitle, setPopuptitle] = useState(0);
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 600)
  const [filtered, SetFiltered] = useState(false)

  const [schemeaccount, setschemeaccount] = useState([])
  const [schaccExp, setschaccExp] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocument,setTotalDocument]=useState(0)
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
  const [branchList, setBranchList] = useState([]);
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
    scheme_type: 0
  });
 
  const handleReset = (e) => {
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
      scheme_type: 0
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
      scheme_type: 0
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


  const handleClickfilter = () => {
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


  const handleSchemetypeChange = async () => {

    const response = await getallschemetypes();
    if (response) {
      setSchemeType(response.data);
    }
  };

  const handleAddedtypeChange = async () => {

    const response = await addedtype();
    if (response) {
      setAddedby(response.data);
    }
  };

  const handleSchemestatusChange = async () => {

    const response = await allschemestatus();
    if (response) {
      setSchemestatus(response.data);
    }
  };


  //mutation to get scheme type
  const { mutate: getschemeaccountMutate } = useMutation({
    mutationFn: (payload) =>
      schemeaccounttable(payload),
    onSuccess: (response) => {

      setschemeaccount(response.data)
      setTotalPages(response.totalPages);
      setTotalDocument(response.totalDocument)

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



  const handleDelete = (id) => {
    setActiveDropdown(null);
    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete Scheme',
      formData: {
        message: 'Are you sure you want to delete?',
        schAccId: id
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


  //mutation to get purity type
  const { mutate: deleteSchAcc } = useMutation({
    mutationFn: (payload) => deleteschemeaccount(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      getschemeaccountMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch })
      eventEmitter.off('CONFIRMATION_SUBMIT');
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });


  useEffect(() => {
    eventEmitter.on('CONFIRMATION_SUBMIT', async (data) => {
      try {
        deleteSchAcc(data.schAccId);

      } catch (error) {
        console.error('Error:', error);
      }
    });
    return () => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
    };
  }, [eventEmitter]);



  const handleEdit = (id) => {
    navigate(`/manageaccount/addschemeaccount/${id}`);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };


  const handlePageChange = (page) => {

    const pageNumber = Number(page);
    if (!pageNumber || isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setCurrentPage(pageNumber);

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
      header: "Account Name",
      cell: (row) => (
        <div className="flex flex-col gap-2">
          <h6 className='text-nowrap'>{row?.account_name}</h6>
          <span>{row?.mobile}</span>
        </div>
      ),
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
      header: "A/c No",
      cell: (row) => row?.scheme_acc_number === "" ? 'Not Allocated' : row?.scheme_acc_number
    },
    {
      header: "Paid Installments",
      cell: (row) => (
        <div className="bg-green-500 rounded-full p-1 text-white flex justify-center">
          {row?.total_paidinstallments}/{row?.total_installments}
        </div>
      ),
    },  
    {
      header: "Start Date",
      cell: (row) => {
        const date = new Date(row?.start_date);
        return date.toLocaleDateString('en-GB'); // 'en-GB' gives the d-m-Y format
      }
    },
    {
      header: "Maturity Date",
      cell: (row) => row?.maturity_date
    },  
    {
      header: 'Scheme Type',
      cell: (row) => row?.scheme_typename
    },
    {
      header: "Classification",
      cell: (row) => row?.id_classification.name
    },
    branch === '0' && {
      header: "Branch Name",
      cell: (row) => row?.branch_name
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={schemeaccount} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete} handleView={handleOpenLedger}/>
      ),
      sticky: "right",
    }
  ].filter(Boolean); 

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Customer Schemes</h2>
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
                  Scheme Type
                </label>
                <div className="relative">
                  <select name="scheme_type" onChange={filterInputchange} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
                    {schemetypefilter.map((schemetype) => (
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 w-3/4"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      <div className="mt-4 overflow-x-auto">
      <Table
            data={schemeaccount}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
      </div>

      {displaysetting === 1 && (
        <ModelOne
          title={popuptitle}
          extraClassName='w-2/3 max-h-[90vh] overflow-y-auto'
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >

          <Ledgerdetails
            setIsOpen={setIsviewOpen}
          />

        </ModelOne>
      )}
      {/* <Modal /> */}
    </div>
  )
}

export default Schemeaccount