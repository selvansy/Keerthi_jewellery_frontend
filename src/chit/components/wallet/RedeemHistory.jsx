import React, { useEffect, useState } from 'react'
import usePagination from "../../../chit/hooks/usePagination";
import SpinLoading from "../../components/common/spinLoading";
import { eventEmitter } from "../../../utils/EventEmitter";
import { useSelector, useDispatch } from "react-redux";
import { redeemHistory, getallbranch } from "../../api/Endpoints"
import { useDebounce } from "../../../chit/hooks/useDebounce"
import Table from "../../components/common/Table";
import { Search,CalendarDays } from "lucide-react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatNumber } from "../../utils/commonFunction"
import { Breadcrumb } from '../common/breadCumbs/breadCumbs';
import ExportDropdown from '../common/Dropdown/Export';
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";



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


function RedeemHistory() {


  const [redeemData, setRedeemData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [redeemedPoint, setRedeemPoint] = useState(0)
  const [redeemedAmt, setRedeemAmt] = useState(0)
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch, setBranch] = useState("")
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const limit = 10;

  const [isLoading, setisLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0)

  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_role = roleData?.id_role?.id_role;
  const id_client = roleData?.id_client;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_branch = roleData?.branch;

  useEffect(() => {
    getallRedeemData({ search: debouncedSearch, page: currentPage, limit: itemsPerPage });
  }, [currentPage, debouncedSearch, itemsPerPage]);

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
    // {
    //   header: "Wallet Points",
    //   cell: (row) => {
    //     return row?.credited_point !== undefined ? Math.abs(row.credited_point) : "-";
    //   }
    // },
    {
      header: "Amount",
      cell: (row) => {
        return row?.credited_amount !== undefined ? formatNumber({ value: Math.abs(row.credited_amount) }) : "-";
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
    <>
     <Breadcrumb
        items={[{ label: "Wallet" }, { label: "Redeem History", active: true }]}
      />
      <div className="p-4 bg-white border border-[#F2F2F9] rounded-[16px] shadow-sm">
        {/* Header Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Left Side Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <Select
              options={branchOptions}
              value={
                id_branch !== '0'
                  ? branchOptions.find((b) => b.value === id_branch) || ''
                  : branchOptions.find((b) => b.value === branch) || ''
              }
              onChange={(selected) => setBranch(selected.value)}
              className="min-w-[250px]"
              styles={customSelectStyles(true)}
              isLoading={loadingbranch}
              isDisabled={id_branch !== '0'}
              placeholder="Select"
            />

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
          <div className="ml-auto flex justify-between items-center">
            
          <div className="relative flex items-center gap-2">
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <div className="flex items-center pl-8 border border-[#F2F2F9] rounded-[8px] px-3 py-2 bg-white text-sm">
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
              apiData={redeemData}
              fileName={`Redeem Data ${new Date().toLocaleDateString('en-GB')}`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4">
          <Table
            data={redeemData}
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

export default RedeemHistory