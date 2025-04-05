import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import {
  dueReportSummary,
  getOverAllSummary,
  preCloseSummary,
} from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

function overallReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [overAllData, setOverAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalDocuments,setTotalDocuments]=useState(0)
  useEffect(() => {
    getOverAllReport();
  }, []);

  const { mutate: getOverAllReport } = useMutation({
    mutationFn: getOverAllSummary,
    onSuccess: (response) => {
      setOverAllData(response);
      setisLoading(false);
      // setTotalDocuments(response.)
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
      header: "Scheme",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "Total Accounts",
      cell: (row) => row?.totalAccounts,
    },
    {
      header: "Total Open Account",
      cell: (row) => row?.totalOpenAccount,
    },
    {
      header: "Total Closed Account",
      cell: (row) => row?.totalCloseAccount,
    },
    {
      header: "Total PreClosed Account",
      cell: (row) => row?.totalPreCloseAccount,
    },
    {
      header: "Total Refund Account",
      cell: (row) => row?.totalRefundAccount,
    },
    {
      header: "Total Closed Amount",
      cell: (row) => row?.totalCloseAmount,
    },
    {
      header: "Total PreClosed Amount",
      cell: (row) => row?.totalPreCloseAccount,
    },
    {
      header: "Total Refund Amount",
      cell: (row) => row?.totalRefundAmount,
    },
  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">Over All Report</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
          />
        </div>
      </div>
      <div className="mt-4">
        <Table
          data={overAllData}
          columns={columns}
          loading={isLoading}
          // currentPage={currentPage}
          // handleItemsPerPageChange={handleItemsPerPageChange}
          // handlePageChange={handlePageChange}
          // itemsPerPage={itemsPerPage}
          // totalItems={totalDocuments}

        />
      </div>
    </div>
  );
}

export default overallReport;
