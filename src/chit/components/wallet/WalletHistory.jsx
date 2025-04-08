import React, { useEffect, useState } from 'react'
import usePagination from "../../../chit/hooks/usePagination";
import SpinLoading from "../../components/common/spinLoading";
import { eventEmitter } from "../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import {walletHistory,getallbranch } from "../../api/Endpoints"
import { useDebounce } from "../../../chit/hooks/useDebounce"
import Table from "../../components/common/Table";
import { Search,CalendarDays  } from "lucide-react";
import Select from "react-select";
import { useMutation, useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../common/breadCumbs/breadCumbs';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ExportDropdown from '../common/Dropdown/Export';
import Action from '../common/action';

const customSelectStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    backgroundColor: "white",
    border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    borderRadius: "0.375rem",
    "&:hover": {
      color: "#e2e8f0",
    },
    pointerEvents: !isReadOnly ? "none" : "auto",
    opacity: !isReadOnly ? 1 : 1,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#858293",
    fontWeight: "thin",
    // fontStyle: "bold",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#232323",
    "&:hover": {
      color: "#232323",
    },
  }),
});


function WalletHistory() {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [walletData, setwalletData] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch, setBranch] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [redeemedAmt,setRedeemAmt] = useState(0)
  const [balAmt,setbalAmt] = useState(0)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
    const [activeDropdown, setActiveDropdown] = useState(null);
  
  

  const [searchInput, setSearchInput] = useState(""); 
  const debouncedSearch = useDebounce(searchInput, 500);

  const limit = 10;

  const [isLoading, setisLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0)

    const roleData = useSelector((state) => state.clientForm.roledata);
    const id_role = roleData?.id_role?.id_role;
    const id_client = roleData?.id_client;
    const id_branch = roleData?.branch;


  useEffect(() => {
    if (!roleData) return
    if (id_branch !== "0") {
      setBranch(id_branch)
    }
  }, [roleData]);



  const { data: branchresponse, isLoading: loadingbranch } = useQuery({
    queryKey: ["branch"],
    queryFn: getallbranch,
  });


  useEffect(() => {
    if (branchresponse) {
      const data = branchresponse.data
      const branch = data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchOptions(branch);
    }

  }, [branchresponse])

 
   useEffect(() => {
      getallWalletData({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
    }, [currentPage, debouncedSearch, itemsPerPage]);

    const { mutate: getallWalletData } = useMutation({
      mutationFn: (payload) => walletHistory(payload),
      onSuccess: (response) => {
        setwalletData(response.data)
        setRedeemAmt(response.totalRedeemedAmt)
        setbalAmt(response.totalBalanceAmt)
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



  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };

  
  const handleEdit = (id) => {
    setIsviewOpen(true);
    setId(id);
  };



   useEffect(() => {
      const handleClickOutside = (event) => {
        if (activeDropdown && !event.target.closest(".dropdown-container")) {
          setActiveDropdown(null);
        }
      };
  
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [activeDropdown]);
  


  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * limit,
    },
    {
      header: "Name",
      cell: (row) => {
        const emp = row?.id_employee;
        const cust = row?.id_customer;
    
        if (emp) {
          return `${emp.firstname || ""} ${emp.lastname || ""} ${emp.mobile || "-"}`.trim();
        }
    
        if (cust) {
          return `${cust.firstname || ""} ${cust.lastname || ""} ${cust.mobile || "-"}`.trim();
        }
    
        return "-";
      }
    },         
    {
      header: "Wallet Amount",
      cell: (row) => `${row?.total_reward_amt || "-"}`,
    },
    {
      header: "Wallet Redeemption",
      cell: (row) => (
        <span style={{ color: row?.redeem_amt < 0 ? "red" : "inherit" }}>
          {row?.redeem_amt !== undefined ? Math.abs(row.redeem_amt) : "-"}
        </span>
      ),
    },  
    {
      header: "Balance Reward",
      cell: (row) => `${row?.balance_amt || "-"}`,
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={walletData}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={null}
          handleDelete={null}
          handleView={row}
         
        />
      ),
      sticky: "right",
    },
   
  ];


  return (
    <>
     <Breadcrumb
        items={[{ label: "Wallet" }, { label: "Wallet History", active: true }]}
      />
      <div className="p-4 bg-white border border-[#F2F2F9] rounded-[16px] shadow-sm">
        {/* Header Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Left Side Controls */}
          <div className="flex flex-wrap gap-2 items-center">
          
            <div className="relative">
              {searchLoading ? (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
              )}
              <input
                onChange={(e) => {
                  setSearchLoading(true);
                  setSearchInput(e.target.value);
                }}
                placeholder="Search"
                className="pl-9 pr-4 py-2 border-2 border-[#F2F2F9] rounded-[8px] w-[200px]"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="ml-auto flex justify-between items-center gap-2">
            
          <div className="relative flex items-center gap-2">
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <div className="flex items-center pl-8 border-2 border-[#F2F2F9] rounded-[8px] px-3 py-2 bg-white text-sm">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  className="outline-none w-[100px]"
                  placeholderText="From"
                />
                <span className="mx-2 text-gray-500">to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  className="outline-none w-[100px]"
                  placeholderText="To"
                />
              </div>
            </div>

            <ExportDropdown
              apiData={walletData}
              fileName={`Wallet History ${new Date().toLocaleDateString('en-GB')}`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <Table
            data={walletData}
            columns={columns}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </>
  
  )
}

export default WalletHistory