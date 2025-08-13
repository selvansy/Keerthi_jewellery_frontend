import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import { dueReportSummary } from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";

function OverDueReport() {
  const roledata = localStorage.getItem("decoded");
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [overDueData, setOverDueData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  
  // Set initial dates to current date
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const { mutate: getDueReport } = useMutation({
    mutationFn: ({ from_date, to_date, page, limit }) => 
      dueReportSummary({ 
        from_date, 
        to_date,
        page,
        limit
      }),
    onSuccess: (response) => {
      const { data } = response;
      setOverDueData(data.data);
      setisLoading(false);
      setTotalPages(data.totalPages || 0);
      setTotalDocuments(data.totalDocuments || 0);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  useEffect(() => {
    getDueReport({
      from_date: dateRange.startDate,
      to_date: dateRange.endDate,
      page: currentPage,
      limit: itemsPerPage
    });
  }, [currentPage, itemsPerPage, dateRange]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
      header: "scheme A/c No",
      cell: (row) => row?.scheme_acc_number,
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
      header: "Joined Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      header: "Maturity date",
      cell: (row) => row?.maturity_date,
    },
    {
      header: "Total Paid Installments",
      cell: (row) => `${row?.paid_installments}/${row?.total_installments}`,
    },
    {
      header: "Total Paid Amount",
      cell: (row) => `₹ ${row?.amount}`
    },
    {
      header: "Total Paid Weight",
      cell: (row) => `${row?.weight} g`,
    },
    {
      header: "pending installments ",
      cell: (row) => row?.installmentDue,
    },
    {
      header: "Last Paid Date",
      cell: (row) => formatDate(row?.createdAt),
    },
  ];

  const handlePageChange = (page) => {
    const pageNumber = Number(page);
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setCurrentPage(1); // Reset to first page when date range changes
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Overdue ", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start"></div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                initialStartDate={dateRange.startDate}
                initialEndDate={dateRange.endDate}
                onChange={handleDateRangeChange}
              />
              <ExportDropdown
                apiData={overDueData}
                fileName={`Overdue report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={overDueData}
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

export default OverDueReport;