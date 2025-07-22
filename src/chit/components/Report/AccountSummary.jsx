import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Modal from "../common/Modal";
import ModelOne from "../common/Modelone";
import "jspdf-autotable";
import Select from "react-select";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import {
  dueReportSummary,
  getActiveScheme,
  getallbranch,
  getOverAllSummary,
  preCloseSummary,
} from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X, Columns3 } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";

const customStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    backgroundColor: "white",
    color: "#232323",
    border: state.isFocused ? "1px solid #f2f2f9" : "1px solid #f2f2f9",
    boxShadow: state.isFocused ? "0 0 0 1px #072D2D" : "none",
    borderRadius: "0.5rem",
    "&:hover": {
      color: "#e2e8f0",
    },
    pointerEvents: !isReadOnly ? "none" : "auto",
    opacity: !isReadOnly ? 1 : 1,
    cursor: isReadOnly ? "pointer" : "default",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6C7086",
    fontSize: "14px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#232323",
    fontSize: "14px",
    "&:hover": {
      color: "#232323",
    },
  }),
  input: (base) => ({
    ...base,
    "input[type='text']:focus": { boxShadow: "none" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#F0F7FE"
      : state.isFocused
      ? "#F0F7FE"
      : "white",
    color: "#232323",
    fontWeight: "500",
    fontSize: "14px",
  }),
});

function AccountSummaryReport() {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;

  const navigate = useNavigate();

  const id_role = roleData?.id_role?.id_role;
  const id_client = roleData?.id_client;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [overAllData, setOverAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();
  const [processData, setProcessData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [column, setcolum] = useState(false);
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedbranch, setSelectedbranch] = useState();
  const [schemetype, setSchemtype] = useState([]);
  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState();

  const closemodal = () => {
    setcolum(false);
  };

  const openmodal = () => {
    setcolum(true);
  };

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

  const { mutate: getAllbranch } = useMutation({
    mutationFn: () => getallbranch(),
    onSuccess: (response) => {
      setBranchOptions(
        response.data.map((branch) => ({
          value: branch._id,
          label: branch.branch_name,
        }))
      );
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  const { mutate: getOverAllReport } = useMutation({
    mutationFn: (payload) => getOverAllSummary(payload),
    onSuccess: (response) => {
      setOverAllData(response.data);
      setisLoading(false);
      setTotalDocuments(response.totalDocs);
      setTotalPages(response.totalPages);
      setSearchLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  useEffect(() => {
    getOverAllReport({
      from_date,
      to_date,
      id_branch: selectedbranch,
      id_scheme: selectedScheme,
      page: currentPage, // Added currentPage to payload
      limit: itemsPerPage // Added itemsPerPage to payload
    });
  }, [from_date, to_date, selectedScheme, selectedbranch, currentPage, itemsPerPage]);

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getAllScheme();
      getAllbranch();
    }
  }, [roleData]);

  const handleSchemeClick = (row) => {
    navigate("/report/table", {
      state: { id: row._id, type: "scheme" },
    });
  };

  useEffect(() => {
    const process = overAllData.map((item, index) => ({
      "S.No": index + 1,
      "Scheme Name": item.scheme_name,
      "Scheme Code": item.code,
      "Open Account":
        item.totalopenAccount !== undefined ? item.totalopenAccount : "0",
      "Close Account":
        item.totalCloseAccount !== undefined ? item.totalCloseAccount : "0",
      "Paid Account":
        item.totalPaidAccounts !== undefined ? item.totalPaidAccounts : "0",
      "Refund Account":
        item.totalRefundAccount !== undefined ? item.totalRefundAccount : "0",
    }));
    setProcessData(process);
  }, [overAllData]);

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
      header: "open Accounts",
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
      header: "PRE-CLOSE ACCOUNT",
      cell: (row) => row?.totalPreCloseAccount,
    },
    {
      header: "REFUND ACCOUNT ",
      cell: (row) => row?.totalRefundAccount,
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
          { label: "Account Summary", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 w-full">
          <div className="flex justify-start">
            <div className="w-60">
              <Select
                styles={customStyles(true)}
                placeholder="Schemes"
                isClearable={true}
                options={schemeList || []}
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
          </div>
        </div>
        <hr className="mt-2" />

        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 w-full">
          <div className="flex justify-start">
            <div className="w-60">
              <Select
                styles={customStyles(true)}
                placeholder="Branches"
                isClearable={true}
                options={branchOptions || []}
                value={
                  branchOptions.find(
                    (option) => option.value === selectedbranch
                  ) || null
                }
                onChange={(option) => {
                  setSelectedbranch(option ? option.value : null);
                }}
              />
            </div>
          </div>
          <div className="flex justify-end items-center w-full">
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={processData}
                fileName={`Account Summary ${new Date().toLocaleDateString(
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
            totalPages={totalPages} // Added totalPages prop
          />
        </div>
      </div>
    </>
  );
}

export default AccountSummaryReport;