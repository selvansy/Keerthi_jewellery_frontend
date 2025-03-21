import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";

import {
  getbranchbyid,
  getPaymentLedger,
} from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import usePagination from "../../hooks/usePagination";
import { getAllBranch } from "../../api/Endpoints";
import Select from "react-select";
import { customSelectStyles } from "../Setup/purity";

function PaymentLedger() {
  
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_role = roleData?.id_role?.id_role;
  const id_client = roleData?.id_client;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const accessBranch = roleData?.branch;

  const [isLoading, setisLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Branch state management
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [currentBranch, setCurrentBranch] = useState(null);

  useEffect(() => {
    getPaymentData({
      limit: itemsPerPage,
      page: currentPage,
    });
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (!roleData) return;
    
    if (accessBranch === "0") {
      // Admin with access to all branches
      getAllBranches();
    } else {
      // User with specific branch access
      getBranchData({ id: accessBranch });
    }
  }, [roleData, accessBranch]);

  // Mutation to get payment data
  const { mutate: getPaymentData } = useMutation({
    mutationFn: (data) => getPaymentLedger(data),
    onSuccess: (response) => {
      setPaymentData(response.data);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  // Mutation to get branch by id
  const { mutate: getBranchData } = useMutation({
    mutationFn: (data) => getbranchbyid(data),
    onSuccess: (response) => {
      const { data } = response;
      const branchData = {
        _id: data._id,
        branch_name: data.branch_name,
      };
      
      setCurrentBranch(branchData);
      setSelectedBranch(data._id);
    },
    onError: (error) => {
      console.error("Error fetching branch data:", error);
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
      header: "Mode",
      cell: (row) => row?.mode_name,
    },
    {
      header: "Total Amount",
      cell: (row) => row?.totalAmount,
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

  const handleApplyFilter = () => {
    getPaymentData({
      limit: itemsPerPage,
      page: currentPage,
      from_date: startDate,
      to_date: endDate,
      id_branch: selectedBranch
    });
  };

  const handleBranchChange = (option) => {
    setSelectedBranch(option.value);
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Payment Ledger</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 z-20">
        
      <div className="flex flex-col min-w-[350px]">
              {accessBranch === "0" ? (
                <div>
                  <label className="block text-sm font-medium">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <Select
                    styles={customSelectStyles}
                    options={branchOptions}
                    placeholder="Select Branch"
                    onChange={handleBranchChange}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-500 font-medium mb-1 mt-5">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentBranch?.branch_name || ""}
                    className="w-full border rounded-md px-3 py-2 text-gray-500"
                  />
                </div>
              )}
            </div>
        <div className="relative w-full hidden lg:flex md:justify-end">
          <div className="flex flex-col md:flex-row gap-3 ">
          
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                startDate={startDate}
                endDate={endDate}
                className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select start date"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 z-50"
                placeholderText="Select end date"
              />
            </div>
            <button
              className={`text-white font-medium py-2 px-4 mb-0.5 rounded-md mt-auto bg-[${layout_color}]`}
              onClick={handleApplyFilter}
            >
              Apply
            </button>
          <div className="flex flex-col w-full mt-6">
            <ExportDropdown apiData={paymentData} fileName={`Payment Ledger ${new Date().toLocaleDateString('en-GB')}`}/>
          </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Table data={paymentData} columns={columns} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments}/>
      </div>
    </div>
  );
}

export default PaymentLedger;