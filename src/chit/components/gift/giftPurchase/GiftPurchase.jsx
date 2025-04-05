import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SlidersHorizontal, Search, Plus } from 'lucide-react'
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
import Action from '../../common/action'
import ActiveDropdown from '../../common/ActiveDropdown'



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
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [giftitemfilter, setGiftitem] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null)

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
      setTotalDocuments(response.totalDocument)
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


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      header: 'S.No',
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Branch Name",
      cell: (row) => row?.id_branch.branch_name
    },
    {
      header: 'Invoice No',
      cell: (row) => row?.invoice_no,
    },
    {
      header: "Gift Code",
      cell: (row) => row?.id_gift?.gift_code
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
      header: "Gst(%)",
      cell: (row) => row?.gst_percenty
    },
    {
      header: "Total",
      cell: (row) => row?.price
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${row?.active === true
                ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
              } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}          ></div>
        </label>
      )
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={giftinward} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown} handleEdit={handleEdit} handleDelete={handleDelete} />
      ),
      sticky: "right",
    },

  ];
  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Gift Purchase</h2>

      <div className=" relative shadow-sm rounded-lg overflow-hidden mt-8">
        <div className="bg-white flex flex-col  items-center gap-4 lg:flex-row md:flex-row lg:justify-between lg:items-center p-2">

          <div className="mt-4">
            <ActiveDropdown setActiveFilter={setActiveFilter} />
          </div>

          <div className="flex flex-row items-center justify-end gap-4 mt-3">
            <div className="flex justify-end">
              <div className="relative ">
                <input
                  type="text"
                  onChange={handleSearch}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 pr-10 p-2.5 w-60"
                  placeholder="Search"
                />
                <div className="absolute inset-y-0 right-[204px] pl-1 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end relative mr-2">
              <button className="rounded-lg p-8  py-2 text-white text-center whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"

                onClick={handleClick}
                style={{ backgroundColor: layout_color }} >
                Add Purchase
              </button>
              <div className="text-white absolute inset-y-0 left-[1px] pl-2 flex items-center pr-8 pointer-events-none">
                <Plus size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-3">
          <Table data={giftinward} columns={columns} isLoading={isLoading} currentPage={currentPage} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments} handleItemsPerPageChange={handleItemsPerPageChange} />
        </div>
      </div>

    </div>
  )
}

export default GiftPurchase