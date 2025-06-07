import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { getOverAllSummary } from "../../../chit/api/Endpoints";

function AccountSummaryReport() {
  const roledata = JSON.parse(localStorage.getItem("decoded"));
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [overAllData, setOverAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Fetch data when any of these dependencies change
  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, currentPage, itemsPerPage]);

  const { mutate: fetchData } = useMutation({
    mutationFn: () => 
      getOverAllSummary({ 
        from_date: fromDate, 
        to_date: toDate,
        page: currentPage,
        limit: itemsPerPage
      }),
    onSuccess: (response) => {
      setOverAllData(response.data);
      setTotalDocuments(response.totalDocs);
      setTotalPages(Math.ceil(response.totalDocs / itemsPerPage));
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    },
  });

  const handleSchemeClick = (row) => {
    navigate("/report/table", {
      state: {
        id: row._id,
        type: "scheme",
        showBreadcrumb: true,
        breadcrumbItems: [
          { label: "Scheme Reports" },
          { label: "Account Summary", active: true },
        ]
      }
    });
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "SCHEME NAME",
      cell: (row) => (
        <span
          className="cursor-pointer hover:underline font-semibold"
          onClick={() => handleSchemeClick(row)}
        >
          {row?.scheme_name}
        </span>
      ),
    },    
    {
      header: "Scheme Code",
      cell: (row) => row?.code,
    },
    {
      header: "OPEN ACCOUNTS",
      cell: (row) => row?.totalOpenAccount,
    },
    {
      header: "CLOSE ACCOUNT",
      cell: (row) => row?.totalCloseAccount,
    },
    {
      header: "PAID ACCOUNT",
      cell: (row) => row?.totalPaidAccounts,
    },
    {
      header: "REFUND ACCOUNT",
      cell: (row) => row?.totalRefundAccount,
    },
  ];

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleDateRangeChange = (range) => {
    setFromDate(range.startDate);
    setToDate(range.endDate);
    setCurrentPage(1); // Reset to first page when date range changes
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Account Summary", active: true },
        ]}
      />
      
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start"></div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector 
                onChange={handleDateRangeChange} 
              />
              <ExportDropdown
                apiData={overAllData}
                fileName={`Account-Summary-Report-${new Date().toISOString().split('T')[0]}`}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={overAllData}
            columns={columns}
            loading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
            handleItemsPerPageChange={handleItemsPerPageChange}
            noDataMessage="No account summary data available"
          />
        </div>
      </div>
    </>
  );
}

export default AccountSummaryReport;