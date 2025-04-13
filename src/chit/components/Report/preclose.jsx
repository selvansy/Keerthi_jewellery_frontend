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
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";

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
  const [from_date,setfrom_date]=useState()
  const [to_date,setto_date]=useState()

  useEffect(() => {
    getPreCloseData({from_date,to_date});
  }, [from_date,to_date]);

  const { mutate: getPreCloseData } = useMutation({
    mutationFn:({from_date,to_date})=> preCloseSummary({from_date,to_date}),
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
      header: "Customer",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Mobile",
      cell: (row) => row?.customer_mobile,
    },
    {
      header: "Accounter Name",
      cell: (row) => row?.account_name,
    },
    {
      header: "Scheme Name",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "scheme A/c No",
      cell: (row) => row?.scheme_acc_number,
    },
    {
      header: "Paid Installments",
      cell: (row) => `${row?.total_paid_installments}/${row?.total_installments}`,
    },
    {
      header: "Paid Amount",
      cell: (row) => row?.totalPaidAmount,
    },
    {
      header: "Paid Weight",
      cell: (row) => row?.totalPaidWeight,
    },
    {
      header: "Classification",
      cell: (row) => row?.classification_name,
    },
    {
      header: "Started date",
      cell: (row) => {
        return new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
    },
    {
      header: "Maturity Date",
      cell: (row) => row?.maturity_date,
    },
    {
      header: "Last paid Date",
      cell: (row) => row?.last_paid_date,
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
    },
    {
      header: "Bill No ",
      cell: (row) => row?.bill_no,
    },
    {
      header: "Bill Date",
      cell: (row) => {
        return new Date(row.bill_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
    },
    
    {
      header: "Gift Handover",
      cell: (row) => row?.gift_issues,
    },
    {
      header: "Closed By",
      cell: (row) => row?.closed_by,
    },
   
      
  ];

  return (
    <>
    <Breadcrumb
      items={[
        { label: "Scheme Reports" },
        { label: "Preclose Report", active: true },
      ]}
    />
    <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start"></div>
          <div className="flex justify-end items-center gap-4">
            <DateRangeSelector
              onChange={(range) => {
                setfrom_date(range.startDate);
                setto_date(range.endDate);
              }}
            />
            <ExportDropdown
              apiData={preCloseData}
              fileName={`Overdue report ${new Date().toLocaleDateString(
                "en-GB"
              )}`}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Table
          data={preCloseData}
          columns={columns}
          loading={isLoading}
          // currentPage={currentPage}
          // handlePageChange={handlePageChange}
          // itemsPerPage={itemsPerPage}
          // totalItems={totalDocuments}
          // handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  </>
  );
}

export default PreCloseReport;
