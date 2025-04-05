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
import totalGift from "../../../../../../neehar/src/public/uploads/icons/totalgift.svg"
import nonchitReceived from "../../../../../../neehar/src/public/uploads/icons/nonchitReceived.svg"
import chitReceivedGift from "../../../../../../neehar/src/public/uploads/icons/chitReceivedGift.svg"
import totalbal from "../../../../../../neehar/src/public/uploads/icons/totalbal.svg"


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


  const { mutate: giftaccountcountMutate } = useMutation({
    mutationFn: giftaccountcount,
    onSuccess: (response) => {
      if (response) {
        setGiftcount(response?.data);
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


  let cardData = [
    {
      img: totalGift,
      countValue: giftcount?.total_gift,
      label: "Total Gifts",
    },
    {
      img: chitReceivedGift,
      countValue: giftcount?.chit_gift,
      label: "Chit Received Gift",
    },
    {
      img: nonchitReceived,
      countValue: giftcount?.nonchit_gift,
      label: "Non-Chit Received Gift",
    },
    {
      img: totalbal,
      countValue: giftcount?.balance_gift,
      label: "Total Balance",
    },
  ];
  

  return (
    <div className="flex flex-col p-4">
      <div className='flex flex-col gap-3'>
        <h2 className="text-2xl text-gray-900 font-bold">Gift HandOver</h2>
             {/* Cards Section */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                  cardData.map((e)=>(
                    <div className="bg-white border-2 border-[#F5F5F5] rounded-[16px] px-[12px]" key={e.label}>
                    <div className="rounded-md py-5">
                      <img
                        src={e.img}
                        alt="totalGift"
                        className="h-[40px] w-[40px]"
                      />
                      <div className="flex flex-col  ms-1 mt-2 pt-4">
                      <h5 className="text-2xl font-semibold">
                       {e.countValue || 0}
                      </h5>
                      <h5 className="text-[#6C7086] font-[500] text-[16px] pt-1" style={{fontFamily:"Inter, sans-serif"}} >{e.label}</h5>
                    </div>
                    </div>
                    
                  </div>
                  ))
                }
              
              </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-row items-center justify-end gap-2">
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