import React, { useEffect, useRef, useState } from 'react'
import usePagination from "../../../chit/hooks/usePagination";
import SpinLoading from "../../components/common/spinLoading";
import { eventEmitter } from "../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import { walletHistory, getallbranch } from "../../api/Endpoints"
import { useDebounce } from "../../../chit/hooks/useDebounce"
import Table from "../../components/common/Table";
import { Search, CalendarDays, Eye } from "lucide-react";
import Select from "react-select";
import { useMutation, useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '../common/breadCumbs/breadCumbs';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ExportDropdown from '../common/Dropdown/Export';
import Action from '../common/action';
import More from "../../../assets/more.svg"
import { createPortal } from 'react-dom';
import refferalicon from "../../../assets/icons/refer-arrow 1.svg"
import eyeIcon from "../../../assets/icons/eye.svg"
import totalGift from "../../../assets/icons/totalgift.svg"
import chitReceivedGift from "../../../assets/icons/chitReceivedGift.svg"
import { formatNumber } from '../../utils/commonFunction';
import RedeemHisCard from './RedeemHisCard';
import ModelOne from "../common/Modelone";
import { useNavigate,useLocation  } from 'react-router-dom';




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
  const [data,setData] = useState([]);
  const [expData,setExpData] = useState([])
  const [branchOptions, setBranchOptions] = useState([]);
  const [giftcount, setGiftcount] = useState({});
  
  const [branch, setBranch] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [redeemedAmt, setRedeemAmt] = useState(0)
  const [balAmt, setbalAmt] = useState(0)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isviewOpen, setIsviewOpen] = useState(false);

  const navigate = useNavigate();
 
  
  
  function closeIncommingModal() {
    setIsviewOpen(false);
    setId("");
  }

  const clearId = () => {
    setId("");
  };

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const dropdownRef = useRef(null);

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
    getallWalletData({ search: debouncedSearch, page: currentPage, limit: itemsPerPage,from_date:startDate,to_date:endDate });
  }, [currentPage, debouncedSearch, itemsPerPage,startDate,endDate]);


  // useEffect(()=>{
  //   if(!walletData) return;
  //    if(walletData.length > 0){
  //     generateExportData();
  //    }else{
  //     setwalletData([])
  //    }
  // },[walletData])
  useEffect(() => {
    if (walletData?.length > 0) {
      generateExportData();
    }
  }, [walletData]);


  const generateExportData = () => {
    let exportData=[]
    if(walletData && walletData.length > 0){
       exportData = walletData?.map((row, index) => {
        const emp = row?.id_employee;
        const cust = row?.id_customer;
    
        const name = emp
          ? `${emp.firstname || ""} ${emp.lastname || ""} ${emp.mobile || "-"}`
          : cust
          ? `${cust.firstname || ""} ${cust.lastname || ""} ${cust.mobile || "-"}`
          : "-";
    
        return {
          sno: index + 1,
          name,
          wallet_amount: row.total_reward_amt ?? "-",
          wallet_redeemption: Math.abs(row.redeem_amt ?? "-"),
          balance_reward: row.balance_amt ?? "-",
        };
      });
    }
  
    setExpData(exportData); 
  };
  

  const { mutate: getallWalletData } = useMutation({
    mutationFn: (payload) => walletHistory(payload),
    onSuccess: (response) => {
      setwalletData(response.data)
      setGiftcount(response.walletCount)
      setRedeemAmt(response.totalRedeemedAmt)
      setbalAmt(response.totalBalanceAmt)
      setTotalPages(response.totalPages)
      setCurrentPage(response.currentPage)
      setTotalDocuments(response.totalDocuments)
      setisLoading(false)
      setSearchLoading(false);
      

    },
    onError: (error) => {
      
      setSearchLoading(false);
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


  const hanldeActiveDropDown = (id, event) => {
    if (id) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 130,
      });
    }
    setActiveDropdown(id);
  };

  const handleRefferalHistory = (data) => {
    setActiveDropdown(data._id);
    navigate(`/wallet/redeemption/:${data._id}`,{
      state:{
        data
      }
    })
  }


  const handleRedeemHistory = (data) => {
    setActiveDropdown(data);
    setIsviewOpen(true);
    setData(data)
    // setId(id);
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
      header: "Action",
      cell: (row) => (
        <>
          <div ref={dropdownRef} className="dropdown-container relative flex items-center">
            <button
              className="p-2 border hover:bg-gray-100 rounded-full flex justify-center"
              onClick={(e) => {
                e.stopPropagation();
                hanldeActiveDropDown(activeDropdown === row?._id ? null : row?._id, e);
              }}
            >
              <img src={More} alt="" className="w-[20px] h-[20px]" />
            </button>
          </div>

          {activeDropdown === row?._id &&
            createPortal(
              <div
                className="absolute"
                style={{
                  top: position.top,
                  left: position.left,
                  zIndex: 9999,
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
                }}
              >
                <div className="w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="w-full text-left text-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => handleRefferalHistory(row)}
                    >
                     <img src={refferalicon} alt="" srcSet="" className='text-black w-4 h-4 mr-1'/>
                      Refferal History
                    </button>

                    <button
                      className="w-full text-left text-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        handleRedeemHistory(row);
                        hanldeActiveDropDown(null);
                      }}
                    >
                      <img src={eyeIcon} alt="" srcSet="" className='text-black w-4 h-4 mr-1'/>
                      Redeem History
                    </button>

                  </div>
                </div>
              </div>,
              document.body
            )}
        </>
      ),
    }


  ];

    let cardData = [
      {
        img: totalGift,
        countValue: formatNumber({value:giftcount?.totalRewardAmt,decimalPlaces: 0 }) ,
        label: "Total Reward Issued",
      },
      {
        img: chitReceivedGift,
        countValue: formatNumber({value:giftcount?.totalRedeemedAmt,decimalPlaces: 0 }),
        label: "Total Redeemed Amount",
      },
     
    ];

  return (
    <>
      <Breadcrumb
        items={[{ label: "Wallet" }, { label: "Wallet History", active: true }]}
      />

         <div className="flex flex-col mb-5">
        <div className='flex flex-col gap-3'>
          {/* Cards Section */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              cardData.map((e) => (
                <div className="bg-white border-2 border-[#F5F5F5] rounded-[16px] px-[12px]" key={e.label}>
                  <div className="rounded-md py-5">
                    <img
                      src={e.img}
                      alt="totalGift"
                      className="h-[40px] w-[40px]"
                    />
                    <div className="flex flex-col ms-1 mt-2 pt-4">
                      <h5 className="text-lg text-[#232323] font-semibold">
                        {e.countValue || 0}
                      </h5>
                      <h5 className="text-[#6C7086] font-[500] text-sm pt-1" style={{ fontFamily: "Inter, sans-serif" }} >{e.label}</h5>
                    </div>
                  </div>

                </div>
              ))
            }

          </div>
        </div>
      </div>

      <div className="p-4 bg-white border border-[#F2F2F9] rounded-[16px] shadow-sm">
        {/* Header Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Left Side Controls */}
          <div className="flex flex-wrap gap-2 items-center">

            <div className="relative">
              {searchLoading ? (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              )}
              <input
                onChange={(e) => {
                  setSearchLoading(true);
                  setSearchInput(e.target.value);
                }}
                placeholder="Search"
                className="px-4 py-2 ps-9 rounded-lg border-2 border-[#F2F2F9] w-full h-[36px] text-md sm:w-[228px]"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="ml-auto flex justify-between items-center gap-2">
            <div className="relative flex items-center gap-2">
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <div className="flex items-center pl-8 border-2 border-[#F2F2F9] rounded-[8px] px-3 py-2 h-[36px] bg-white text-sm">
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
              dynamicRemove={[
                '_id', 'id_employee', 'total_reward_point',
                'redeem_point', 'balance_point', 'payment_mode', 'active',
                'is_deleted', 'created_by', 'modified_by', 'modified_date',
                'createdAt', 'updatedAt', '__v', 'id_customer', 'id_scheme_account'
              ]}
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
        <ModelOne
          title={"Redeem History"}
          extraClassName="w-[650px]"
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          isLoading={isLoading}
          closeModal={closeIncommingModal}
        >
          <RedeemHisCard 
         
          data={data}
          
         />
        </ModelOne>
      </div>
    </>

  )
}

export default WalletHistory