import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { giftaccountcount, getgiftvendorbranchById, giftissuetype, getgiftitemvendorById, getallbranch, giftissuesdatatable, changegiftinwardStatus, deletegiftinward, deletegiftissues } from '../../../api/Endpoints'
import { toast } from 'react-toastify'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaGifts } from "react-icons/fa";
import chitrcvd from '../../../../assets/chitrcvd.svg';
import nonchitrcvd from '../../../../assets/nonchitrcvd.svg';
import balancegift from '../../../../assets/giftblnc.svg';
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../common/Modal';
import { useDispatch, useSelector } from 'react-redux'
import { eventEmitter } from '../../../../utils/EventEmitter';
import { setbranchId } from '../../../../redux/clientFormSlice';
import usePagination from '../../../hooks/usePagination'
import { useDebounce } from '../../../hooks/useDebounce';


const GiftIssued = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;
  const [isLoading, setisLoading] = useState(true)
  const [filtered, SetFiltered] = useState(false)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 600)
  const [giftissues, setGiftissues] = useState([])
 

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [entries,Setentries] = useState(0)
  const [totalDocument,setTotalDocuments]=useState(0)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [from_date, setFromdate] = useState('');
  const [to_date, setTodate] = useState('');
  const [vendorfilter, setVendor] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [giftitemfilter, setGiftitem] = useState([]);
  const [giftcount, setGiftcount] = useState({});
  const [issuetype, setIssuetype] = useState([]);

  const [filters, setFilters] = React.useState({
    from_date: '',
    to_date: '',
    id_branch: id_branch,
    gift_vendorid: '',
    id_gift: '',
    search:debouncedSearch
  });



  const handleReset = () => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev,
      id_branch: id_branch,
      gift_vendorid: "",
      id_gift: "",
      search:debouncedSearch
    }));
    toast.success("Filter is cleared");
    SetFiltered(false)
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: debouncedSearch,
      id_branch: filters.id_branch,
      gift_vendorid: "",
      id_gift: ""
    };
    giftaccountcountMutate(filterTosend);
    giftissuesMutate(filterTosend)
  }


  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const { mutate: getallissuetypeMutate } = useMutation({
    mutationFn: giftissuetype,
    onSuccess: (response) => {

      if (response) {
        setIssuetype(response.data);
      }
    },
  });

  const applyfilterdatatable = (e) => {
    e.preventDefault()
    const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: debouncedSearch,
      id_branch: filters.id_branch,
      gift_vendorid: filters.gift_vendorid,
      id_gift: filters.id_gift
    };

    setbranchId(filters.id_branch);
    setIsFilterOpen(false)
    SetFiltered(true)
    giftissuesMutate(filterTosend);

    giftaccountcountMutate(filterTosend);
  };

  useEffect(() => {
    if (isFilterOpen === true) {
      getallbranchMutate();
      getallissuetypeMutate()
    }
  }, [isFilterOpen]);



  const { mutate: giftaccountcountMutate } = useMutation({
    mutationFn: giftaccountcount,
    onSuccess: (response) => {
      if (response) {
        setGiftcount(response?.data);
      }
    },
  });



  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response) {
        setBranch(response.data);
      }
    },
  });



  const handleVendorChange = async (e) => {

    if (!e.target.value) return;
    const response = await getgiftvendorbranchById({ "id_branch": e.target.value });
    if (response) {
      setVendor(response.data);
    }
  };

  const handleGiftChange = async (e) => {

    if (!e.target.value) return;
    const response = await getgiftitemvendorById({ "gift_vendorid": e.target.value });
    if (response) {
      setGiftitem(response.data);
    }
  };


  //mutation to get scheme type
  const { mutate: giftissuesMutate } = useMutation({
    mutationFn: (payload) => giftissuesdatatable(payload),
    onSuccess: (response) => {

      setGiftissues(response.data)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      Setentries(response.totalDocument)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error fetching countries:', error);
      setGiftissues([])
      setisLoading(false)
    }
  });

      const filterTosend = {
      page: currentPage,
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      search: debouncedSearch,
      id_branch: id_branch,
      gift_vendorid: '',
      id_gift: ''
    };


  useEffect(() => {

    giftissuesMutate(filterTosend)
    giftaccountcountMutate(filterTosend);

  }, [currentPage, itemsPerPage, debouncedSearch])

 

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/gift/giftissues/creategiftissue');
  }

  const handleStatusToggle = async (id) => {
    let response = await changegiftinwardStatus(id);
    if (response) {
      toast.success(response.message);
      giftissuesMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch })
    }
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





  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Customer Name',
      cell: (row) => row?.id_customer?.firstname,
    },
    {
      header: "Mobile",
      cell: (row) => row?.id_customer?.mobile
    },
    {
      header: "Gift Name",
      cell: (row) => {
        const gift_names = row?.gifts?.map((val) => val.id_gift.gift_name);
        return gift_names.join(", ");
      }
    },
    {
      header: "No.Of Gifts",
      cell: (row) => {
       const gifts = row?.gifts?.reduce((acc, curr) => acc + curr.qty, 0);
        return gifts;
      }
    },
    {
      header: "Issue Type",
      cell: (row) => row?.issue_type === 1 ? 'Scheme Gift' : 'Non Scheme Gift'
    },
    {
      header: "Issues Date",
      cell: (row) => format(new Date(row?.create_date), 'dd/MM/yyyy')
    },
    {
      header: "Branch Name",
      cell: (row) => row?.id_branch.branch_name
    }

  ];

  return (
    <div className="flex flex-col p-4">
      <div className='flex flex-col gap-3'>
        <h2 className="text-2xl text-gray-900 font-bold">Gift HandOver</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='flex flex-row items-center justify-between bg-white rounded-lg p-3 h-20 shadow-md'>
            <div className='flex flex-col justify-center'>
              <h5 className="text-[#67748E]">Total Gift</h5>
              <h5 className="text-xl font-semibold">{giftcount?.total_gift || 0}</h5>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex rounded-md p-3 items-center justify-center'
                style={{ backgroundColor: layout_color }}>
                <FaGifts size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className='flex flex-row items-center justify-between bg-white rounded-lg p-3 h-20 shadow-md'>
            <div className='flex flex-col justify-center'>
              <h5 className="text-[#67748E]">Chit Received Gift</h5>
              <h5 className="text-xl font-semibold">{giftcount?.chit_gift || 0}</h5>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex rounded-md p-3 items-center justify-center'
                style={{ backgroundColor: layout_color }}>
                <img src={chitrcvd} alt="chitrcvd" className='w-6 h-6' />
              </div>
            </div>
          </div>
          <div className='flex flex-row items-center justify-between bg-white rounded-lg p-3 h-20 shadow-md'>
            <div className='flex flex-col justify-center'>
              <h5 className="text-[#67748E]">Non-Chit Received Gift</h5>
              <h5 className="text-xl font-semibold">{giftcount?.nonchit_gift || 0}</h5>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex rounded-md p-3 items-center justify-center'
                style={{ backgroundColor: layout_color }}>
                <img src={nonchitrcvd} alt="nonchitrcvd" className='w-6 h-6' />
              </div>
            </div>
          </div>
          <div className='flex flex-row items-center justify-between bg-white rounded-lg p-3 h-20 shadow-md'>
            <div className='flex flex-col justify-center'>
              <h5 className="text-[#67748E]">Balance Gift</h5>
              <h5 className="text-xl font-semibold">{giftcount?.balance_gift || 0}</h5>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex rounded-md p-3 items-center justify-center'
                style={{ backgroundColor: layout_color }}>
                <img src={balancegift} alt="balancegift" className='w-6 h-6' />
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  onClick={() => setIsFilterOpen(true)}
                  style={{ backgroundColor: layout_color }}>
                  <SlidersHorizontal size={20} />
                </button>
              </>

          }
          
          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }} >
            + Add GiftHandOver
          </button>
        </div>
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
          {/* getallbranchMutate,handleVendorChange,handleGiftChange */}
          <form>
            <div className="p-3 space-y-4 flex-1 overflow-y-auto">
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
                  Issue Type
                </label>
                <div className="relative">
                  <select name="issue_type" className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' selected>--Select--</option>
                    {issuetype.map((istype) => (
                      <option key={istype.id} value={istype.id}>{istype.name}</option>
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
              {id_branch === "0" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <div className="relative">
                    <select name="id_branch" onChange={(e) => { filterInputchange(e); handleVendorChange(e) }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'>
                      <option value='' selected >--Select--</option>
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
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gift Vendor
                </label>
                <div className="relative">
                  <select name="gift_vendorid" onChange={(e) => { filterInputchange(e); handleGiftChange(e) }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' selected >--Select--</option>
                    {vendorfilter.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>{vendor.vendor_name}</option>
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
                  Gift Item
                </label>
                <div className="relative">
                  <select name="id_gift" onChange={(e) => { filterInputchange(e); }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' selected>--Select--</option>
                    {giftitemfilter.map((giftitem) => (
                      <option key={giftitem._id} value={giftitem._id}>{giftitem.gift_name}</option>
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
                  type='button'
                    onClick={(e)=>applyfilterdatatable(e)}
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
      <div className="mt-4">
        <Table
          data={giftissues}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={entries}
        />
      </div>
    </div>
  )
}

export default GiftIssued