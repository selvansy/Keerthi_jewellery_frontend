import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import {
  dueReportSummary,
  getActiveScheme,
  getallScheme,
  getOverAllSummary,
  preCloseSummary,
} from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { customSelectStyles } from "../Setup/purity";

function overallReport() {
  const [isLoading, setisLoading] = useState(true);
  const [overAllData, setOverAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();

  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;

  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState();

  useEffect(() => {
    getOverAllReport({ from_date, to_date, id_branch,id_scheme:selectedScheme });
  }, [from_date, to_date,selectedScheme]);
  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getAllScheme();
    }
  }, [roleData]);

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
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  const { mutate: getOverAllReport } = useMutation({
    mutationFn: ({ from_date, to_date,id_branch,id_scheme:selectedScheme }) =>
      getOverAllSummary({ from_date, to_date,id_branch,id_scheme:selectedScheme }),
    onSuccess: (response) => {
      setOverAllData(response.data);
      setisLoading(false);
      setTotalDocuments(response.totalDocs);
      setTotalPages(response.totalDocs);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

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

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Overall Report", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
              <Select
                className="mt-2 w-[219px]"
                styles={customSelectStyles(true)}
                options={schemeList || []}
                value={schemeList.find(
                  (option) => option.value === selectedScheme
                )}
                onChange={(option) => {
                  setSelectedScheme(option.value);
                }}
              />
            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={overAllData}
                fileName={`Overall report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
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
          />
        </div>
      </div>
    </>
  );
}

export default overallReport;
