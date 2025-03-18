import React, { useEffect, useState } from 'react'
import usePagination from "../../../chit/hooks/usePagination";
import SpinLoading from "../../components/common/spinLoading";
import { eventEmitter } from "../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import {walletHistory} from "../../api/Endpoints"
import { useDebounce } from "../../../chit/hooks/useDebounce"
import Table from "../../components/common/Table";
import { Search } from "lucide-react";
import { useMutation } from '@tanstack/react-query';

function WalletHistory() {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [walletData, setwalletData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [redeemedPoint,setRedeemPoint] = useState(0)
  const [balPoint,setbalPoint] = useState(0)
  

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const limit = 10;


  const [isLoading, setisLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0)

 
   useEffect(() => {
      getallWalletData({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
    }, [currentPage, debouncedSearch, itemsPerPage]);

    const { mutate: getallWalletData } = useMutation({
      mutationFn: (payload) => walletHistory(payload),
      onSuccess: (response) => {
        setwalletData(response.data)
        setRedeemPoint(response.totalRedeemedPoint)
        setbalPoint(response.totalBalancePoint)
        setTotalPages(response.totalPages)
        setCurrentPage(response.currentPage)
        setTotalDocuments(response.totalDocuments)
        setisLoading(false)
      },
      onError: (error) => {
        console.log(error)
        setisLoading(false)
        setwalletData([])
      }
    });
  

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearchInput(e.target.value);
  };

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

  const redeemTypes = {
    "1": "Direct",
    "2": "Purchase",
    "3": "Referral",
    "4": "Incentives",
  };


  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: "Customer name",
      cell: (row) => `${row?.id_customer?.firstname || ""} ${row?.id_customer?.lastname || ""}`.trim() || "-",
    },
    {
      header: "mobile",
      cell: (row) => `${row?.id_customer?.mobile || "-"}`,
    },
    {
      header: "Wallet Points",
      cell: (row) => (
        <span style={{ color: row?.credited_point < 0 ? "red" : "inherit" }}>
          {row?.credited_point !== undefined ? Math.abs(row.credited_point) : "-"}
        </span>
      ),
    },
    {
      header: "Amount",
      cell: (row) => (
        <span style={{ color: row?.credited_amount < 0 ? "red" : "inherit" }}>
          {row?.credited_amount !== undefined ? Math.abs(row.credited_amount) : "-"}
        </span>
      ),
    },       
    {
      header: "Type",
      cell: (row) => redeemTypes[row?.redeem_type] || "-",
    },
    {
      header: "Date",
      cell: (row) => {
        if (!row?.createdAt) return "-";
        const date = new Date(row?.createdAt);
        const formattedDate = date.toISOString().split("T")[0];
        return formattedDate;
      }
    },
  ];

  return (
    
     <div className="flex flex-col p-4 relative">
  <h2 className="text-2xl text-gray-900 font-bold">Wallet History</h2>
  
  <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
    <div className="relative w-full lg:w-1/3 min-w-[200px]">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {searchLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
        ) : (
          <Search className="text-gray-500" />
        )}
      </div>
      <input
        onChange={handleSearch}
        placeholder="Search..."
        className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
      />
    </div>
    <div className="flex justify-end">
    <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 w-full max-w-md">
      {[{ label: "Total Redeemed Points", value: redeemedPoint }, { label: "Balance Redeemed Points", value: balPoint }].map((item, index) => (
        <div key={index} className="flex flex-row items-center justify-between bg-white rounded-lg p-2 h-16 shadow-md text-sm">
          <div className="flex flex-col justify-center">
            <h5 className="text-[#67748E]">{item.label}</h5>
            <h5 className="text-lg font-semibold">{item.value}</h5>
          </div>
          
        </div>
      ))}
    </div>
  </div>
  </div>
 

  <div className="mt-4">
    <Table
      data={walletData}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      handleItemsPerPageChange={handleItemsPerPageChange}
      handlePageChange={handlePageChange}
      itemsPerPage={itemsPerPage}
      totalItems={totalDocuments}
      loading={isLoading}
    />
  </div>




</div>

  )
}

export default WalletHistory