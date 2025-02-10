import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { getgiftvendorbranchById,getgiftitemvendorById,getallbranch,getallgiftinwardtable, changegiftinwardStatus, deletegiftinward } from '../../../api/Endpoints'
import { toast } from 'react-toastify'
import { CalendarDays, RefreshCcw} from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from 'react-redux';

const Giftinwards = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [isLoading,setisLoading] = useState(false)
  const [giftinward, setGiftinward] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [from_date, setFromdate] = useState('');
  const [to_date, setTodate] = useState('');
  const [vendorfilter, setVendor] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  // const [id_branch, setIdrancbh] = useState('676e4a9dd3e747cfc70968a2');
  const [giftitemfilter, setGiftitem] = useState([]);

  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;

  const [filters, setFilters] = React.useState({
    from_date:from_date,
    to_date:to_date,
    id_branch: id_branch ===0 && '',
    gift_vendorid:'',
    id_gift:''
  });

  const filterInputchange = (e) =>{
    const {name, value} = e.target;
    setFilters(prev=>({...prev,[name]:value}));
  };

  
  const applyfilterdatatable = (e) =>{
      const filterTosend = {
        page:currentPage,
        from_date:from_date,
        to_date:to_date,
        limit: itemsPerPage,
        search: search,
        id_branch:filters.id_branch,
        gift_vendorid:filters.gift_vendorid,
        id_gift:filters.id_gift
      };
      
      if(from_date!=="" && to_date!=="" && id_branch!=="" && gift_vendorid!=="" && id_gift!==""){
        setIsFilterOpen(false)
        getgiftinwardMutate(filterTosend);
      }
    };

   useEffect(() => {
      getallbranchMutate();
    }, []);

    const { mutate: getallbranchMutate } = useMutation({
      mutationFn: getallbranch,
      onSuccess: (response) => {
        console.log('jut')
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
  
    const   handleGiftChange = async (e) => {
  
      if (!e.target.value) return;
      const response = await getgiftitemvendorById({ "gift_vendorid": e.target.value });
      if (response) {
        setGiftitem(response.data);
      }
    };
  

  //mutation to get scheme type
  const { mutate: getgiftinwardMutate } = useMutation({
    mutationFn: ()=>{
      setisLoading(true)

     getallgiftinwardtable
    },
    onSuccess: (response) => {
      setGiftinward(response.data)
      setTotalPages(response.totalPages)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error:', error);
      setisLoading(false)
    }
  });

  useEffect(() => {
    const filterTosend = {
      page:currentPage,
      from_date:from_date,
      to_date:to_date,
      limit: itemsPerPage,
      search: search,
      id_branch:filters.id_branch,
      gift_vendorid:filters.gift_vendorid,
      id_gift:filters.id_gift
    };

    getgiftinwardMutate(filterTosend)
  }, [currentPage, itemsPerPage, search])


  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/gift/addgiftinwards');
  }

  const handleStatusToggle = async (id) => {
    let response = await changegiftinwardStatus(id);
    if (response) {
      toast.success(response.message);
      getgiftinwardMutate({ page: currentPage, limit: itemsPerPage, search: search })
    }
  };

  const handleDelete = async (id) => {
    let response = await deletegiftinward(id);
    if (response) {
      toast.success(response.message);
      getgiftinwardMutate({ page: currentPage, limit: itemsPerPage, search: search })
    }
  };

  const handleEdit = (id) => {
    navigate(`/gift/addgiftinwards/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
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


  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: 'Invoice No',
      cell: (row) => row?.invoice_no,
    },
    {
      header: "Barcode",
      cell: (row) => row?.barcode
    },
    {
      header: "Gift Name",
      cell: (row) => row?.id_gift.gift_name
    },
    {
      header: "Vendor Name",
      cell: (row) => row?.gift_vendorid.vendor_name
    },
    {
      header: "Qty",
      cell: (row) => row?.qty
    },
    {
      header: "Price",
      cell: (row) => row?.price
    },
    {
      header: "Gst",
      cell: (row) => row?.gst_percenty
    },
    {
      header: "Total",
      cell: (row) => row?.price
    },
    {
      header: "Sell Price",
      cell: (row) => row?.cus_sellprice
    },
    {
      header: "Branch Name",
      cell: (row) => row?.id_branch.branch_name
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString('en-GB'); // 'en-GB' gives the d-m-Y format
      }
    },
    {
      header: 'Active',
      accessor: 'active',
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id)}
          />
          <div
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row.active === true
                ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]'
                : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      )
    },
    {
      header: 'Actions',
      cell: (row, rowIndex) => (
        <div className="dropdown-container relative">
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

          {activeDropdown === row?._id && (
            <div
              className="absolute right-[47px] lg:right-[163px] md:right-[150px] sm:right-[100px] transform -translate-x-8"
              style={{
                top: rowIndex >= giftinward.length - 2 ? 'auto' : '72%',
                bottom: rowIndex >= giftinward.length - 2 ? '-74%' : 'auto',
                // top: 'auto',
                // bottom: '-440%',
                zIndex: 9999,
                marginBottom: '8px',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
              }}
            >
              <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleEdit(row?._id);
                      setActiveDropdown(null);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
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

                </div>
              </div>
            </div>
          )}
        </div>
      ),

    }
  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Gift Inwards</h2>
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
                      id="filter"
                      className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                      onClick={() => handleReset()}
                      style={{ backgroundColor: layout_color }} >
                      <RefreshCcw size={20} />
                    </button>
          
          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: layout_color }}>
            <SlidersHorizontal size={20} />
          </button>
          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }} >
            + Add Account
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
                Branch Name
              </label>
              <div className="relative">
                <select  name="id_branch" onChange={(e)=>{filterInputchange(e); handleVendorChange(e)}} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
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
                Gift Vendor
              </label>
              <div className="relative">
                <select  name="gift_vendorid"  onChange={(e)=>{filterInputchange(e); handleGiftChange(e)}} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                  <option value='' >--Select--</option>
                  {vendorfilter.map((vendor)=>(
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
                <select  name="id_gift" onChange={(e)=>{filterInputchange(e);}}  className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                  <option value='' >--Select--</option>
                  {giftitemfilter.map((giftitem)=>(
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
      <div className="mt-4">
        <Table
          data={giftinward}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
      {giftinward.length > 0 && (
      <div className="flex justify-between mt-4 p-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 rounded-md"
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
      )}
    </div>
  )
}

export default Giftinwards