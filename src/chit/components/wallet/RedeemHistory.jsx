import React, { useEffect, useState } from 'react'
import usePagination from "../../../chit/hooks/usePagination";
import SpinLoading from "../../components/common/spinLoading";
import { eventEmitter } from "../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import { useDebounce } from "../../../chit/hooks/useDebounce"
import Table from "../../components/common/Table";
import { Search } from "lucide-react";
import Modal from '../common/Modelone';
function RedeemHistory() {
     const [walletData, setwalletData] = useState([]);
       const [currentPage, setCurrentPage] = useState(1);
       const [totalPages, setTotalPages] = useState(0);
       const [itemsPerPage, setItemsPerPage] = useState(10);
  
  
       const [activeDropdown, setActiveDropdown] = useState(null);
       const [searchInput, setSearchInput] = useState("");
       const debouncedSearch = useDebounce(searchInput, 500);
       const [id, setId] = useState("");
       const limit = 10;
       const [isviewOpen, setIsviewOpen] = useState(false);

       const [isLoading, setisLoading] = useState(false);
       const [searchLoading, setSearchLoading] = useState(false);
       const [totalDocuments,setTotalDocuments]=useState(0)

     

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
    

     const columns = [
        {
          header: "S.No",
          cell: (_, index) => index + 1 + (currentPage - 1) * limit,
        },
       
        {
          header: "Transaction ID",
          cell: (row) => `${row?.purity_name}`,
        },
        {
            header: "Payment Date",
            cell: (row) => `${row?.purity_name}`,
          },
          {
            header: "A/C name",
            cell: (row) => `${row?.purity_name}`,
          },
          {
            header: "Mobile",
            cell: (row) => `${row?.purity_name}`,
          },
          {
            header: "Scheme A/C no",
            cell: (row) => `${row?.purity_name}`,
          },
          {
            header: "Scheme name",
            cell: (row) => `${row?.purity_name}`,
          },
          {
            header: "Scheme Type",
            cell: (row) => `${row?.purity_name}`,
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
        </div>

        <div className="mt-4">
          <Table
            data={walletData}
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
                disabled={currentPage === 1}x
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
      <Modal />
    </div>
    </div>
  )
}

export default RedeemHistory