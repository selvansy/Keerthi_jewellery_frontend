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
  preCloseSummary,
} from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

function PreCloseReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [preCloseData, setPreCloseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getPreCloseData();
  }, []);

  const { mutate: getPreCloseData } = useMutation({
    mutationFn: preCloseSummary,
    onSuccess: (response) => {
      const { data } = response;
      setPreCloseData(data);
      setisLoading(false);
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
      header: "Classification",
      cell: (row) => row?.classification_name,
    },
    {
      header: "Customer",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Mobile",
      cell: (row) => row?.customer_mobile,
    },
    {
      header: "Total Chit Value",
      cell: (row) => row?.totalChitValue,
    },
    {
      header: "Total Paid Amount",
      cell: (row) => row?.totalPaidAmount,
    },
    {
      header: "Closed By",
      cell: (row) => row?.closedBy,
    },
    {
        header: "Closed Date",
        cell: (row) => {
          return new Date(row.closed_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
        }
      }
      
  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">
        Pre Close Summary
      </h2>
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
        <Table data={preCloseData} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default PreCloseReport;
