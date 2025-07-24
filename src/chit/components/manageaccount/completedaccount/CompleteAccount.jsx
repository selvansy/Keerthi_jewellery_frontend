import React, { useEffect, useState } from "react";
import Table from "../../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../../components/common/Dropdown/Export";
import { ExportToExcel } from "../../common/Dropdown/Excelexport";
import { ExportToPDF } from "../../common/Dropdown/ExportPdf";
import {
  completedAccount,
  dueReportSummary,
  preCloseSummary,
} from "../../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../../common/calender";
import { formatDecimal, formatNumber } from "../../../utils/commonFunction";

function CompleteAccount() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [preCloseData, setPreCloseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Set initial dates to current date
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  const [from_date, setfrom_date] = useState(formattedDate);
  const [to_date, setto_date] = useState(formattedDate);
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    getCompletedData({ from_date, to_date, page: currentPage, limit: itemsPerPage });
  }, [from_date, to_date, currentPage, itemsPerPage]);

  const { mutate: getCompletedData } = useMutation({
    mutationFn: ({ from_date, to_date, page, limit }) =>
      completedAccount({ from_date, to_date, page, limit }),
    onSuccess: (response) => {
      const { data } = response;
      setPreCloseData(data);
      setisLoading(false);
      setTotalDocuments(response.totalDocuments);
      setTotalPages(Math.ceil(response.totalDocuments / itemsPerPage));
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

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
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
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
      cell: (row) => row?.account_name,
    },
    {
      header: "Total Paid Amount",
      cell: (row) => formatNumber({value:row?.totalPaidAmount,decimalPlaces:0}),
    },
    {
      header: "total Paid Weight",
      cell: (row) => `${formatDecimal(row?.totalPaidWeight)}g`,
    },
    {
      header: "Classification",
      cell: (row) => row?.classification_name,
    },
    {
      header: "Started date",
      cell: (row) => {
        const date = new Date(row.createdAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },  
    {
      header: "Maturity Date",
      cell: (row) => row?.maturity_date,
    },
    {
      header: "Completed date",
      cell: (row) => {
        return new Date(row.completedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      },
    },
    {
      header: "Gift Issue",
      cell: (row) => row?.gift_issues,
    },
    {
      header: "Crated Through",
      cell: (row) => row?.added_by,
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Completed Account", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start"></div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                  setCurrentPage(1); // Reset to first page when date range changes
                }}
                initialStartDate={formattedDate}
                initialEndDate={formattedDate}
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

export default CompleteAccount;