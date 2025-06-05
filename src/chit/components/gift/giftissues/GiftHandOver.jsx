import React, { useEffect, useState } from 'react'
import Table from '../../common/Table'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { giftaccountcount, giftissuesdatatable } from '../../../api/Endpoints'
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux'
import { useDebounce } from '../../../hooks/useDebounce';
import totalGift from "../../../../../src/assets/icons/totalgift.svg"
import nonchitReceived from "../../../../../src/assets/icons/nonchitReceived.svg"
import chitReceivedGift from "../../../../../src/assets/icons/chitReceivedGift.svg"
import totalbal from "../../../../../src/assets/icons/totalbal.svg"
import { Breadcrumb } from '../../common/breadCumbs/breadCumbs';
import plus from "../../../../assets/plus.svg";

// \src\assets\totalbal.svg
const GiftHandOver = () => {

  const navigate = useNavigate()
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);

  const [isLoading, setisLoading] = useState(true)

  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(search, 600)
  const [giftissues, setGiftissues] = useState([])


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [entries, Setentries] = useState(0)



  const [giftcount, setGiftcount] = useState({});


  const { mutate: giftaccountcountMutate } = useMutation({
    mutationFn: giftaccountcount,
    onSuccess: (response) => {
      if (response) {
        setGiftcount(response?.data);
      }
    },
  });



  //mutation to get scheme type
  const { mutate: giftissuesMutate } = useMutation({
    mutationFn: (payload) => giftissuesdatatable(payload),
    onSuccess: (response) => {

      setGiftissues(response.data)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      Setentries(response.totalDocument)
      setSearchLoading(false)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error fetching countries:', error);
      setGiftissues([])
      setSearchLoading(false)
      setisLoading(false)
    }
  });




  useEffect(() => {
    const filterTosend = {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
    };

    giftissuesMutate(filterTosend)

  }, [currentPage, itemsPerPage, debouncedSearch])


  useEffect(() => {
    giftaccountcountMutate({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
    });
  }, [])


  const handleClick = (e) => {
    e.preventDefault();
    navigate('/gift/giftissues/creategiftissue');
  }



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


  const format = (dateString) => {
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
        const gift_names = row?.gifts?.map((val) => val?.id_gift?.gift_name);
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
    <>
      <Breadcrumb
        items={[{ label: "Gift" }, { label: "GiftHandOver", active: true }]}
      />

      <div className="flex flex-col mb-5">
        <div className='flex flex-col gap-3'>
          {/* Cards Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              cardData.map((e) => (
                <div className="bg-white border-[1px] border-[#F5F5F5] rounded-[16px] px-[12px]" key={e.label}>
                  <div className="rounded-md py-5">
                    <img
                      src={e.img}
                      alt="totalGift"
                      className="h-[40px] w-[40px]"
                    />
                    <div className="flex flex-col  ms-1 mt-2 pt-4">
                      <h5 className="text-xl font-bold text-[#232323]">
                        {e.countValue || 0}
                      </h5>
                      <h5 className="text-[#6C7086] font-medium text-[14px] pt-1" style={{ fontFamily: "Inter, sans-serif" }} >{e.label}</h5>
                    </div>
                  </div>

                </div>
              ))
            }

          </div>
        </div>
      </div>

      <div className="flex flex-col p-7  bg-white border border-[#F2F2F9]  rounded-[16px]">

        <div className="flex flex-col sm:flex-row w-full justify-between gap-2 sm:gap-4">
          {/* Search Input */}
          <div className="w-full sm:w-[308px]  relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-[#6C7086] h-5 w-5" />
              )}
            </div>
            <input
              onChange={(e) => {
                setSearchLoading(true);
                setSearchInput(e.target.value);
              }}
              placeholder="Search Customer/ Mobile No"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full h-[36px]"
            />
          </div>

          {/* Add Button */}
          <div className="w-full sm:w-auto">
            <button
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
              onClick={handleClick}
              style={{ backgroundColor: layout_color }}
            >
              <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
               Add GiftHandOver
            </button>
          </div>
        </div>



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
    </>
  )
}

export default GiftHandOver