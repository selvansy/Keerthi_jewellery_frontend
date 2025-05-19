import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import { schemePayment } from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X, Eye } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { formatNumber } from "../../utils/commonFunction";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatDate } from "../../../utils/FormatDate";

function AccountSummaryReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();

  useEffect(() => {
    getPaymentData({
      from_date,
      to_date,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [from_date, to_date, currentPage, itemsPerPage]);
  

  const { mutate: getPaymentData } = useMutation({
    mutationFn: ({ from_date, to_date ,page,limit}) =>
      schemePayment({ from_date, to_date,page,limit}),
    onSuccess: (response) => {
      const { data } = response;
      setPaymentData(data);
      setisLoading(false);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
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
      header: "Receipt No",
      cell: (row) => row?.payment_receipt,
    },
    {
      header: "Transaction ID",
      cell: (row) => row?.id_transaction,
    },
    {
      header: "Payment Date",
      cell: (row) =>formatDate(row?.createdAt),
    },
    {
      header: "Customer",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Mobile Number",
      cell: (row) => row?.customer_mobile,
    },
    // {
    //   header: "Payment Date",
    //   cell: (row) => formatDate(row?.createdAt)
    // },
    {
      header: "Accounter Name",
      cell: (row) => row?.accounter_name,
    },
    {
      header: "Scheme Name",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "scheme A/c No",
      cell: (row) => row?.schemeAccNo,
    },
    {
      header: "Classification",
      cell: (row) => row?.classification_name,
    },
    {
      header: "Paid Amount",
      cell: (row) =>
        formatNumber({ value: row?.payment_amount, decimalPlaces: 0 }),
    },
    {
      header: "Payment mode",
      cell: (row) => row?.payment_mode ||  "Cash Free",
    },
    {
      header: "Paid Installment",
      cell: (row) => `${row?.totalPaidInstallment}/${row?.total_installments}`,
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
      // return;
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
          { label: "Scheme Payment", active: true },
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
                apiData={paymentData}
                fileName={`Scheme Payment ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={paymentData}
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

export default AccountSummaryReport;
