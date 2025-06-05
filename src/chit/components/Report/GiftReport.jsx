import React, { useEffect, useState } from 'react'
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from 'react-redux';
import { getgiftStock, getAllBranch, giftaccountcount } from "../../api/Endpoints";
import ExportDropdown from "../../components/common/Dropdown/Export";
import usePagination from "../../hooks/usePagination";
import Select from "react-select";
import { customSelectStyles } from "../Setup/purity";
import totalGift from "../../../assets/icons/totalgift.svg"
import nonchitReceived from "../../../assets/icons/nonchitReceived.svg"
import chitReceivedGift from "../../../assets/icons/chitReceivedGift.svg"
import totalbal from "../../../assets/icons/totalbal.svg"
import { Breadcrumb } from '../common/breadCumbs/breadCumbs';

import { useDebounce } from '../../hooks/useDebounce';
import { Search, CalendarDays, Eye } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
import plus from "../../../assets/plus.svg";

function GiftReport() {

  const roleData = useSelector((state) => state.clientForm.roledata);

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const accessBranch = roleData?.branch;
  const branchId = roleData?.id_branch;

  const [isLoading, setisLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(search, 600)
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [giftissues, setGiftissues] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());


  const [GiftStockData, setGiftStockData] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [giftcount, setGiftcount] = useState({});
  const [branch, setBranch] = useState(branchId)
  const navigate = useNavigate()

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch === "0") {
      getAllBranches();
    } else {
      setBranch(branchId)
    }
  }, [roleData]);


  useEffect(() => {
    giftaccountcountMutate({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
    });
  }, [])



  useEffect(() => {
    if (!branch) return;
    getGiftStockData({
      limit: itemsPerPage,
      page: currentPage,
      id_branch: branch,
      search:debouncedSearch
    });
  }, [currentPage, itemsPerPage, branch,debouncedSearch]);


  const { mutate: getGiftStockData } = useMutation({
    mutationFn: (data) => getgiftStock(data),
    onSuccess: (response) => {
      setGiftStockData(response.data);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalCount);
      setSearchLoading(false);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      setGiftStockData([]);
      console.error("Error fetching data:", error);
    },
  });

  const { mutate: giftaccountcountMutate } = useMutation({
    mutationFn: giftaccountcount,
    onSuccess: (response) => {
      if (response) {
        setGiftcount(response?.data);
      }
    },
  });


  // Mutation to get all branches
  const { mutate: getAllBranches } = useMutation({
    mutationFn: () => getAllBranch(),
    onSuccess: (response) => {
      const options = response.data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));

      setBranchOptions(options);
    },
    onError: (error) => {
      console.error("Error fetching all branches:", error);
    },
  });


  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Gift Name",
      cell: (row) => row?.name,
    },
    {
      header: "Purchase",
      cell: (row) => row?.totalPurchased,
    },
    {
      header: "Handover",
      cell: (row) => row?.totalHandovered,
    },
    {
      header: "Pending Gifts",
      cell: (row) => row?.pendingGifts,
    },
  ];

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);
  };

  const paginationData = {
    totalItems: totalPages,
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
    handlePageChange: handlePageChange,
  };

  const paginationButtons = usePagination(paginationData);

  // const handleApplyFilter = () => {
  //   getPaymentData({
  //     limit: itemsPerPage,
  //     page: currentPage,
  //     from_date: startDate,
  //     to_date: endDate,
  //     id_branch: selectedBranch
  //   });
  // };

  const handleBranchChange = (option) => {
    setBranch(option.value);
  };



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

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/gift/giftissues/creategiftissue');
  }



  return (
    <>
      <Breadcrumb
        items={[{ label: "Gift" }, { label: "Gift Stock Report", active: true }]}
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
                      <h5 className="text-xl font-semibold">
                        {e.countValue || 0}
                      </h5>
                      <h5 className="text-[#6C7086] font-[500] text-[14px] pt-1" style={{ fontFamily: "Inter, sans-serif" }} >{e.label}</h5>
                    </div>
                  </div>
                </div>
              ))
            }

          </div>
        </div>
      </div>

      <div className="flex flex-col p-7  bg-white border-[1px] border-[#F2F2F9]  rounded-[16px]">

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
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] rounded-[8px] w-full h-[36px]"
            />
          </div>

          <div className="flex justify-between items-center gap-3">

            {/* Export Button */}
            <div className="ml-auto flex justify-between items-center gap-2">
              <ExportDropdown
                apiData={GiftStockData}
                fileName={`Gift Stock Data ${new Date().toLocaleDateString('en-GB')}`}
  
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
        </div>

        <div className="mt-4">
          <Table
            data={GiftStockData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
          />
        </div>

      </div>
    </>
  )
}

export default GiftReport