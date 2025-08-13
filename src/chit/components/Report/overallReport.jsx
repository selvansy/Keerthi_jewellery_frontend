import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Modal from "../common/Modal";
import ModelOne from "../common/Modelone";
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
import { SlidersHorizontal, Search, X, Columns3 } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { customSelectStyles } from "../Setup/purity";
import { formatDecimal, formatNumber } from "../../utils/commonFunction";
// import Managetables from "./managetables";

function overallReport() {
  const [isLoading, setisLoading] = useState(true);
  const [overAllData, setOverAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();
  const [processData, setProcessData] = useState([]);
  const [column, setcolum] = useState(false);
  const [model, setmodel] = useState([]);

  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;

  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState();

  const closemodal = () => {
    setcolum(false);
  };

  const openmodal = () => {
    setcolum(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getOverAllReport({
      from_date,
      to_date,
      id_branch,
      id_scheme: selectedScheme,
      page:currentPage,
      limit:itemsPerPage
    });
  }, [from_date, to_date, selectedScheme,currentPage]);

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getAllScheme();
    }
  }, [roleData]);

  useEffect(() => {
    const process = overAllData.map((item, index) => ({
      "S.no": index + 1,
      "Scheme Name": item.scheme_name,
      "Total Open Accounts": item.totalOpenAccount,
      "Total Paid Accounts": item.totalPaidAccounts,
      "Toatal Open Amount": item.totalOpenAmount,
      "Total Close Account": item.totalCloseAccount,
      "Total Close Amount": item.totalCloseAmount,
      "Closed Weight": item.closedWeight,
      "Total Pre CLose Account": item.totalPreCloseAccount,
      "Total Pre Close Amount": item.totalPreCloseAmount,
      // "Total Refund Amount":item.totalRefundAccount,
      "Total Refund Amount": item.totalRefundAmount,
      "Branch name": item.Branch_name,
    }));
    setProcessData(process);
  }, [overAllData]);

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
    mutationFn: ({ from_date, to_date, id_scheme: selectedScheme,page,limit}) =>
      getOverAllSummary({ from_date, to_date, id_scheme: selectedScheme,page,limit}),
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
      //   (
      //   <span
      //     className="cursor-pointer hover:underline font-semibold"
      //     onClick={() =>
      //       handleSchemeClick(row)}
      //   >
      //     {row?.scheme_name}
      //   </span>
      // ),
    },
    {
      header: "NEW JOIN",
      cell: (row) => row?.totalOpenAccount,
    },
    {
      header: "PAID ACCOUNT",
      cell: (row) => formatNumber({value:row?.totalPaidAccounts,decimalPlaces:2}),
    },
    {
      header: "PAID Amount",
      cell: (row) => formatNumber({value:row?.totalOpenAmount,decimalPlaces:2}),
    },
    {
      header: "CLOSE ACCOUNT",
      cell: (row) => row?.totalCloseAccount,
    },
    {
      header: "CLOSE Amount",
      cell: (row) => formatNumber({value:row?.totalCloseAmount,decimalPlaces:2}),
    },
    {
      header: "CLOSE WGT",
      cell: (row) => `${formatDecimal( row?.closedWeight)} g`,
    },
    {
      header: "PRE-CLOSE ACCOUNT",
      cell: (row) => row?.totalPreCloseAccount,
    },
    {
      header: "PRE-CLOSE AMOUNT",
      cell: (row) => formatNumber({value:row?.totalPreCloseAmount,decimalPlaces:2}),
    },
    {
      header: "REFUND ACCOUNT ",
      cell: (row) => row?.totalRefundAccount,
    },
    {
      header: "REFUND Amount ",
      cell: (row) => formatNumber({value:row?.totalRefundAmount,decimalPlaces:2}),
    },
    {
      header: "BRANCH NAME",
      cell: (row) => row?.Branch_name,
    },
  ];

  const handleSchemeClick = (row) => {
    navigate("/report/table", {
      state: { id: row._id, type: "scheme" },
    });
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

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Overall Report", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
       
        {/* <hr className="mt-2"/> */}
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
                  ;
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={processData}
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
        <Modal />
        <ModelOne
          title={
            <div>
              <h1 className="text-md font-medium text-black mt-2">
                Want to Manage Tables?
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Please Drag and Drop your column to reorder your table and
                enable see options you want
              </p>
            </div>
          }
          isOpen={column}
          extraClassName="w-1/3"
          setIsOpen={setcolum}
          closeModal={closemodal}
        >
          {/* <div>
            <Managetables setIsOpen={setcolum} />
          </div> */}
        </ModelOne>
      </div>
    </>
  );
}

export default overallReport;