import React, { useEffect, useState } from 'react'
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from 'react-redux';
import { getgiftStock,getAllBranch} from "../../api/Endpoints";
import ExportDropdown from "../../components/common/Dropdown/Export";
import usePagination from "../../hooks/usePagination";
import Select from "react-select";
import { customSelectStyles } from "../Setup/purity";

function GiftReport() {

  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_role = roleData?.id_role?.id_role;
  const id_client = roleData?.id_client;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const accessBranch = roleData?.branch;
  const branchId = roleData?.id_branch;

  const [isLoading, setisLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [GiftStockData, setGiftStockData] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch,setBranch] = useState(branchId)

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch === "0") {
      getAllBranches();
    } else {
      setBranch(branchId)
    }
  }, [roleData, branchId]);
  
  
  useEffect(() => {
    getGiftStockData({
      limit: itemsPerPage,
      page: currentPage,
      id_branch:branch,
    });
  }, [currentPage, itemsPerPage,branch]);


  const { mutate: getGiftStockData } = useMutation({
    mutationFn: (data) => getgiftStock(data),
    onSuccess: (response) => {
      setGiftStockData(response.data);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalCount);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      setGiftStockData([]);
      console.error("Error fetching data:", error);
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
    setBranch(option.value);
  };


  return (
    <div className="flex flex-col p-4">
    <h2 className="text-2xl text-gray-900 font-bold">Gift StockReport</h2>
    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 z-20">
      
    <div className="flex flex-col min-w-[350px]">
            {accessBranch === "0" && (
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
            )}
          </div>
      <div className="relative w-full hidden lg:flex md:justify-end">
        <div className="flex flex-col md:flex-row gap-3 ">
        <div className="flex flex-col w-full mt-6">
          <ExportDropdown apiData={GiftStockData} fileName={`Payment Ledger ${new Date().toLocaleDateString('en-GB')}`}/>
        </div>
        </div>
      </div>
    </div>

    <div className="mt-4">

      <Table data={GiftStockData} columns={columns} loading={isLoading} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalDocuments}  />
    
       
    </div>
  </div>
  )
}

export default GiftReport