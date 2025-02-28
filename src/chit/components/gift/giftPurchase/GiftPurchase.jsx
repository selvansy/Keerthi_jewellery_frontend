import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { getgiftvendorbranchById, getgiftitemvendorById, getallbranch, getallgiftinwardtable, changegiftinwardStatus, deletegiftinward } from '../../../api/Endpoints'
import { toast } from 'react-toastify'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import usePagination from '../../../hooks/usePagination'
import { useDebounce } from '../../../hooks/useDebounce';
import { eventEmitter } from '../../../../utils/EventEmitter';



const GiftPurchase = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 600)
  const [isLoading, setisLoading] = useState(true)
  const [giftinward, setGiftinward] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [entries, Setentries] = useState(0)
  const [selectedRow, setSelectedRow] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [from_date, setFromdate] = useState('');
  const [to_date, setTodate] = useState('');
  const [vendorfilter, setVendor] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [filtered, SetFiltered] = useState(false)

  const [giftitemfilter, setGiftitem] = useState([]);

  const roledata = useSelector((state) => state.clientForm.roledata);

  const id_branch = roledata?.branch;

  const [filters, setFilters] = React.useState({
    from_date: from_date,
    to_date: to_date,
    id_branch: id_branch,
    gift_vendorid: '',
    id_gift: ''
  });


  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };



  const handleReset = () => {
    setFromdate("");
    setTodate("");
    setFilters(prev => ({
      ...prev,
      id_branch: id_branch,
      gift_vendorid: "",
      id_gift: ""
    }));
    SetFiltered(false)
    toast.success("Filter is cleared");
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
    getgiftinwardMutate(filterTosend);
  }


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


    setIsFilterOpen(false)
    SetFiltered(true)
    getgiftinwardMutate(filterTosend);

  };

  useEffect(() => {
    if (isFilterOpen == true) {
      getallbranchMutate();
    }

    if (id_branch !== "0") {
      handleVendorChange(id_branch);
    }

  }, [isFilterOpen]);

  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response) {
        setBranch(response.data);
      }
    },
  });


  const handleVendorChange = async (selectedBranchId) => {

    if (!selectedBranchId) return;
    const response = await getgiftvendorbranchById({ "id_branch": selectedBranchId });
    if (response) {
      setVendor(response.data);
    }
  };

  const handleGiftChange = async (gift_vendorid) => {
    console.log("GiftVendorId", gift_vendorid)
    if (!gift_vendorid) return;
    const response = await getgiftitemvendorById({ "gift_vendorid": gift_vendorid });
    if (response) {
      setGiftitem(response.data);
    }
  };

  //mutation to get scheme type
  const { mutate: getgiftinwardMutate } = useMutation({
    mutationFn: (payload) => getallgiftinwardtable(payload),
    onSuccess: (response) => {
      setGiftinward(response.data)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      Setentries(response.totalDocument)
      setisLoading(false)
      SetFiltered(false)
    },
    onError: (error) => {
      console.error('Error:', error);
      SetFiltered(false)
      setisLoading(false)
    }
  });

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


  useEffect(() => {
    getgiftinwardMutate(filterTosend)
  }, [currentPage, itemsPerPage, debouncedSearch])

  const refetchTable = () => {
    getgiftinwardMutate(filterTosend)
  }

  const handleFilter = () => {

    setIsFilterOpen(true)
  }

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
      getgiftinwardMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch })
    }
  };

  const handleDelete = (id) => {

    dispatch(openModal({
      modalType: 'CONFIRMATION',
      header: 'Delete GiftPurchase',
      formData: {
        message: 'Are you sure you want to delete this Giftpurchase?',
        giftInwardId: id
      },
      buttons: {
        cancel: {
          text: 'Cancel'
        },
        submit: {
          text: 'Delete'
        }
      }
    }))
  };



  useEffect(() => {
    const handleDelete = (data) => {
      deleteGiftInward(data.giftInwardId);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);


  const { mutate: deleteGiftInward } = useMutation({
    mutationFn: (id) => deletegiftinward(id),
    onSuccess: (response, deletedId) => {

      const deletedData = giftinward.filter(e => e._id !== deletedId)

      setGiftinward(deletedData)

      const isLastItemOnPage = giftinward.length === 1;
      const isNotFirstPage = currentPage > 1;

      if (isLastItemOnPage && isNotFirstPage) {
        setCurrentPage(prev => prev - 1);
      } else {
        refetchTable()
      }
      toast.success(response.message);
      eventEmitter.off('CONFIRMATION_SUBMIT');
    },
    onError: (error) => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
      console.error("Error:", error);
    },
  });

  const handleEdit = (id) => {
    navigate(`/gift/addgiftinwards/${id}`);
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


  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };


  const paginationData = { totalItems: totalPages, currentPage: currentPage, itemsPerPage: itemsPerPage, handlePageChange: handlePageChange }
  const paginationButtons = usePagination(paginationData)


  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
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
              className="absolute"
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
          )}
        </div>
      ),

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
        if (!row?.createdAt) return "-";
        const date = new Date(row?.createdAt);
        const formattedDate = date.toISOString().split("T")[0];
        return formattedDate;
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
    }

  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Gift Purchase</h2>
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
                  style={{ backgroundColor: layout_color }} >
                  <RefreshCcw size={20} />
                </button>
              </>
              :
              <>

                <button
                  id="filter"
                  className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                  onClick={handleFilter}
                  style={{ backgroundColor: layout_color }}>
                  <SlidersHorizontal size={20} />
                </button>
              </>

          }


          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }} >
            + Add Purchase
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
                  <select
                    name="id_branch"
                    onChange={(e) => {

                      filterInputchange(e)
                      handleVendorChange(e.target.value)
                    }}
                    className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
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
                  Gift Vendor
                </label>
                <div className="relative">
                  <select name="gift_vendorid" onChange={
                    (e) => {
                      e.preventDefault()
                      filterInputchange(e)
                      handleGiftChange(e.target.value)
                    }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                    <option value='' >--Select--</option>
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
                  <select name="id_gift" onChange={
                    (e) => {
                      e.preventDefault()
                      filterInputchange(e)
                    }}
                    className={`appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${giftitemfilter.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
                    defaultValue=''>
                    <option value='' >--Select--</option>
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
              <div className="p-4 border">
                <div className="bg-yellow-300 flex justify-center gap-3">
                  <button
                    onClick={(e) => applyfilterdatatable(e)}
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
                onClick={prevPage}
                readOnly={currentPage === 1}
                className={`p-2 text-gray-500 rounded-md ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
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
                className={`p-2 text-gray-500 rounded-md ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
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
          <Modal />
        </div>
      )}
    </div>
  )
}

export default GiftPurchase