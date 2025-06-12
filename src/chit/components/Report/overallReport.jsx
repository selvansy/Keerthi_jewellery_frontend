import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { customSelectStyles } from "../Setup/purity";
import { customStyles } from "../ourscheme/scheme/AddScheme";
import { getActiveScheme, getOverAllSummary } from "../../../chit/api/Endpoints";

function OverallReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [overAllData, setOverAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const idBranch = roleData?.id_branch;

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch === 0) {
      getAllScheme();
    }
  }, [roleData]);

  useEffect(() => {
    fetchOverallReport();
  }, [fromDate, toDate, selectedScheme, currentPage, itemsPerPage]);

  const { mutate: getAllScheme } = useMutation({
    mutationFn: () => getActiveScheme(),
    onSuccess: (response) => {
      setSchemeList(
        response.data.map((item) => ({
          label: item.scheme_name,
          value: item._id,
        }))
      );
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  const { mutate: fetchOverallReport } = useMutation({
    mutationFn: () =>
      getOverAllSummary({
        from_date: fromDate,
        to_date: toDate,
        id_branch: idBranch,
        id_scheme: selectedScheme,
        page: currentPage,
        limit: itemsPerPage,
      }),
    onSuccess: (response) => {
      setOverAllData(response.data);
      setTotalDocuments(response.totalDocs);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error fetching report data:", error);
    },
  });

  const handleRefresh = () => {
    setIsLoading(true);
    fetchOverallReport();
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

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "SCHEME NAME",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "NEW JOIN",
      cell: (row) => row?.totalOpenAccount,
    },
    {
      header: "PAID ACCOUNT",
      cell: (row) => row?.totalPaidAccounts,
    },
    {
      header: "PAID Amount",
      cell: (row) => row?.totalOpenAmount,
    },
    {
      header: "CLOSE ACCOUNT",
      cell: (row) => row?.totalCloseAccount,
    },
    {
      header: "CLOSE Amount",
      cell: (row) => row?.totalCloseAmount,
    },
    {
      header: "CLOSE WGT",
      cell: (row) => row?.closedWeight,
    },
    {
      header: "PRE-CLOSE ACCOUNT",
      cell: (row) => row?.totalPreCloseAccount,
    },
    {
      header: "PRE-CLOSE AMOUNT",
      cell: (row) => row?.totalPreCloseAmount,
    },
    {
      header: "REFUND ACCOUNT ",
      cell: (row) => row?.totalRefundAccount,
    },
    {
      header: "REFUND Amount ",
      cell: (row) => row?.totalRefundAmount,
    },
    {
      header: "BRANCH NAME",
      cell: (row) => row?.Branch_name,
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Overall Report", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
              <Select
                className="mt-2 w-[219px]"
                styles={customSelectStyles(true)}
                options={schemeList || []}
                isClearable={true}
                value={
                  schemeList.find(
                    (option) => option.value === selectedScheme
                  ) || null
                }
                onChange={(option) => {
                  setSelectedScheme(option ? option.value : null);
                }}
              />
            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setFromDate(range.startDate);
                  setToDate(range.endDate);
                  setCurrentPage(1);
                }}
              />
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                title="Refresh"
              >
                <RefreshCcw size={18} />
              </button>
              <ExportDropdown
                apiData={overAllData}
                fileName={`Overall_report_${new Date().toISOString().slice(0, 10)}`}
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
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
}

export default OverallReport;