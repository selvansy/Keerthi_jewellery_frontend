import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import {getallgiftinwardtable, changegiftinwardStatus, deletegiftinward } from '../../../api/Endpoints'
import { toast } from 'react-toastify'
import "react-datepicker/dist/react-datepicker.css";
import { openModal } from '../../../../redux/modalSlice';
import Modal from '../../common/Modal';
import ModelOne from "../../../components/common/Modelone";
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from '../../../hooks/useDebounce';
import { eventEmitter } from '../../../../utils/EventEmitter';
import Action from '../../common/action'
import ActiveDropdown from '../../common/ActiveDropdown'
import GiftPurchaseForm from './GiftPurchaseForm'



const GiftPurchase = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const dispatch = useDispatch();


  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 600)
  const [isLoading, setisLoading] = useState(true)
  const [giftinward, setGiftinward] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null)

  const [id, setId] = useState("");

  const roledata = useSelector((state) => state.clientForm.roledata);



  function closeIncommingModal() {
    setIsviewOpen(false);
  }


  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };


  //mutation to get scheme type
  const { mutate: getgiftinwardMutate } = useMutation({
    mutationFn: (payload) => getallgiftinwardtable(payload),
    onSuccess: (response) => {
      setGiftinward(response.data)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      setisLoading(false)
      setTotalDocuments(response.totalDocument)
      setSearchLoading(false)

    },
    onError: (error) => {
      console.error('Error:', error);
      setSearchLoading(false)
      setisLoading(false)
    }
  });

  const filterTosend = {
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    active:activeFilter
  };


  useEffect(() => {
    getgiftinwardMutate(filterTosend)
  }, [currentPage, itemsPerPage, debouncedSearch,activeFilter])

  const refetchTable = () => {
    setIsviewOpen(false);
    getgiftinwardMutate({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      active:activeFilter
    })
  }


  const handleClick = (e) => {
    setIsviewOpen(true);
    e.preventDefault();
  }

  const handleStatusToggle = async (id) => {
    let response = await changegiftinwardStatus(id);
    if (response) {
      toast.success(response.message);
      getgiftinwardMutate({ page: currentPage, limit: itemsPerPage, search: debouncedSearch,active:activeFilter })
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
        getgiftinwardMutate({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          active:activeFilter
        })
      }
      toast.success(response.message);
      eventEmitter.off('CONFIRMATION_SUBMIT');
    },
    onError: (error) => {
      eventEmitter.off('CONFIRMATION_SUBMIT');
      console.error("Error:", error);
    },
  });


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


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
      header: "Sell price",
      cell: (row) => row?.cus_sellprice
    },
    {
      header: "Created Date",
      cell: (row) =>formatDate(row?.gift_vendorid?.createdAt)
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
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          {/* Search Input - Full width on mobile, moves to right side on desktop */}
          <div className="relative w-full sm:mb-0 sm:order-2 sm:w-auto">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-black" />
              )}
            </div>
            <input
              onChange={(e) => {
                setSearchLoading(true);
                setSearch(e.target.value);
              }}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full sm:w-[228px]"
            />
          </div>

          {/* Container for ActiveDropdown and Add Category button */}
          <div className="flex flex-row w-full sm:order-1 sm:w-auto sm:mr-auto md:order-1 md:w-auto md:mr-auto">
            {/* ActiveDropdown - half width on mobile */}

            <div className="w-1/2 sm:w-auto me-1">
              <ActiveDropdown setActiveFilter={setActiveFilter} />
            </div>

            {/* Button - half width on mobile, moves to right on desktop */}
            <div className="w-1/2 sm:hidden">

              <button className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                onClick={handleClick}
                style={{ backgroundColor: layout_color }} >
                Add Purchase
              </button>


            </div>
          </div>

          {/* Desktop-only button - appears on the right side */}
          <div className="hidden sm:block sm:order-3">
            <button className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"

              onClick={handleClick}
              style={{ backgroundColor: layout_color }} >
              Add Purchase
            </button>
          </div>
        </div>

        <div className="bg-white p-3">
          <Table data={giftinward} columns={columns} isLoading={isLoading} currentPage={currentPage} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments} handleItemsPerPageChange={handleItemsPerPageChange} />
        </div>

        <ModelOne
          title={id ? "Edit GiftPurchase" : "Add GiftPurchase"}
          extraClassName='p-7 w-[601px] xs:w-[50px] max-h-[90vh] overflow-y-auto'
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <GiftPurchaseForm
            isviewOpen={isviewOpen}
            setIsviewOpen={setIsviewOpen}
            id={id}
            setId={setId}
            refetchTable={refetchTable}
          />
        </ModelOne>

  
      <Modal />
    </div>
  )
}

export default GiftPurchase