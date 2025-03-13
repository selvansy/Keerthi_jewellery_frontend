import React, { useEffect, useState } from 'react'
import usePagination from "../../../chit/hooks/usePagination";
import SpinLoading from "../../components/common/spinLoading";
import { eventEmitter } from "../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import {redeemHistory} from "../../api/Endpoints"
import { useDebounce } from "../../../chit/hooks/useDebounce"
import Table from "../../components/common/Table";
import { Search } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import {formatNumber} from "../../utils/commonFunction"

function RedeemHistory() {
    
  
    const [redeemData, setRedeemData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [redeemedPoint,setRedeemPoint] = useState(0)
    const [redeemedAmt,setRedeemAmt] = useState(0)
  
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
  
    const limit = 10;
  
    const [isLoading, setisLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [totalDocuments, setTotalDocuments] = useState(0)
       
       
 
   useEffect(() => {
    getallRedeemData({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
  }, [currentPage, debouncedSearch, itemsPerPage]);

  const { mutate: getallRedeemData } = useMutation({
    mutationFn: (payload) => redeemHistory(payload),
    onSuccess: (response) => {
      
      setRedeemData(response.data)
      setRedeemPoint(response.totalRedeemedPoint)
      setRedeemAmt(response.totalRedeemedAmt)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      setTotalDocuments(response.totalDocuments)
      setisLoading(false)
    },
    onError: (error) => {
      console.log(error)
      setisLoading(false)
      setRedeemData([])
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
          cell: (row) => {
            return row?.credited_point !== undefined ? Math.abs(row.credited_point) : "-";
          }
        },
        {
          header: "Amount",
          cell: (row) => {
            return row?.credited_amount !== undefined ? Math.abs(row.credited_amount) : "-";
          }
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
    <div>
         <div className="flex flex-col p-4 relative">
      <>
        <h2 className="text-2xl text-gray-900 font-bold">Redeem History</h2>
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
      {[{ label: "Total Redeemed Points", value:redeemedPoint }, { label: "Total Redeemed Amount", value: formatNumber({value: redeemedAmt}) }].map((item, index) => (
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
            data={redeemData}
            columns={columns}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={limit}
            isLoading={isLoading}
          />
        </div>

        <div className="flex  justify-between mt-4 p-2">
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
            <span className="text-gray-500">entries {totalDocuments} </span>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 text-gray-500 rounded-md ${currentPage==1?'cursor-not-allowed':'cursor-pointer'}`}
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
                className={`p-2 text-gray-500 rounded-md ${currentPage === totalPages?'cursor-not-allowed':'cursor-pointer'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>


      </>
 
    </div>
    </div>
  )
}

export default RedeemHistory