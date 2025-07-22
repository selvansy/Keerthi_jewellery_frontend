import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { closedSummary } from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";
import { formatDecimal } from "../../utils/commonFunction";
import { formatDate } from "../../../utils/FormatDate";

function RedemptionReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [closeData, setCloseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [from_date, setfrom_date] = useState(new Date());
  const [to_date, setto_date] = useState(new Date());
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [processData, setProcessData] = useState([]);

  useEffect(() => {
    getCloseData({ 
      from_date, 
      to_date,
      page: currentPage,
      limit: itemsPerPage
    });
  }, [from_date, to_date, currentPage, itemsPerPage]);

  const { mutate: getCloseData } = useMutation({
    mutationFn: ({ from_date, to_date, page, limit }) => 
      closedSummary({ 
        from_date, 
        to_date,
        page,
        limit
      }),
    onSuccess: (response) => {
      const { data } = response;
      setCloseData(data);
      setTotalDocuments(response?.totalDocuments || 0);
      setTotalPages(response?.totalPages || 1);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  useEffect(() => {
    const process = closeData.map((item, index) => ({
      "Customer Name": item.customer_name,
      "Mobile": item.customer_mobile,
      "Scheme Name": item.scheme_name,
      "Scheme Acc No": item.scheme_acc_number,
      "Installments": `${item.total_paid_installments}/${item.total_installments}`,
      "Total Amount": item.totalPaidAmount,
      "Total Weight": `${formatDecimal(item.totalPaidWeight)} g`,
      "Maturity Date": item.maturity_date ? formatDate(item.maturity_date) : "-",
      "Closed Date": item.closed_date ? formatDate(item.closed_date) : "-",
      "Closed By": item.closed_by,
    }));
    setProcessData(process);
  }, [closeData]);

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
      cell: (row) => formatNumber({ value: row?.totalPaidAmount, decimalPlaces: 0 }),
    },
    {
      header: "Paid Weight",
      cell: (row) => `${formatDecimal(row?.totalPaidWeight)} g`,
    },
    {
      header: "Maturity Date",
      cell: (row) => row?.maturity_date,
    },
    {
      header: "Closed Date",
      cell: (row) => row?.closed_date ? formatDate(row.closed_date) : "-",
    },
    {
      header: "Closed By",
      cell: (row) => row?.closed_by,
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
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Closed Summary", active: true },
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
                  setCurrentPage(1); // Reset to first page when date changes
                }}
              />
              <ExportDropdown
                apiData={processData}
                fileName={`Closed Summary Report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={closeData}
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

export default RedemptionReport;