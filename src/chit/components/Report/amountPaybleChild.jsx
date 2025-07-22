import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import "jspdf-autotable";
import ExportDropdown from "../common/Dropdown/Export";

import {
  getSchemewiseAmount,
} from "../../api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";
import { formatDate } from "../../../utils/FormatDate";

function AmountPaybleChild() {
  const roledata = localStorage.getItem("decoded");

  const location = useLocation();
  const { id, type } = location.state || {};

  const [isLoading, setisLoading] = useState(true);
  const [paybleData, setPaybleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState(new Date());
  const [to_date, setto_date] = useState(new Date());

  const navigate = useNavigate()

  // Fetch data whenever any of these dependencies change
  useEffect(() => {
    getAmountPayble({ 
      id: id, 
      page: currentPage, 
      limit: itemsPerPage, 
      from_date, 
      to_date 
    });
  }, [id, currentPage, itemsPerPage, from_date, to_date]);

  const { mutate: getAmountPayble } = useMutation({
    mutationFn: ({id, page, limit, from_date, to_date}) => 
      getSchemewiseAmount({id, page, limit, from_date, to_date}),
    onSuccess: (response) => {
      setPaybleData(response.data);
      setisLoading(false);
      setTotalDocuments(response.totalCount);
      setTotalPages(response.totalPages);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  const handleClick =(row)=>{
    
    navigate(`/managecustomers/customer/${row.customerId}`)
  }

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Customer",
      cell: (row) => {
        const customer = row?.customer || "";
        const mobile = row?.mobile || "";
        const customerName =mobile ? `${customer} (${mobile})` : customer;

        return (
          <span
            className="cursor-pointer hover:underline font-semibold"
            onClick={() => handleClick?.(row)}
          >
            {customerName}
          </span>
        );
      },
    },   
    {
      header: "Accounter Name",
      cell: (row) => {
        const fname = row?.accounter_fname || "";
        const lname = row?.accounter_lname || "";
        return lname ? `${fname} ${lname}` : fname;
      },
    },
    {
      header: "scheme A/c No ",
      cell: (row) => row?.schemeAccNumber,
    },
    {
      header: "Total Paid Amount",
      cell: (row) => formatNumber({ value: row?.totalValue, decimalPlaces: 0 }),
    },
    {
      header: "Maturity Date ",
      cell: (row) => row?.maturityDate,
    },
    {
      header: "Paid Installment",
      cell: (row) => row?.paidInstallments,
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
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Amount Payable", active: true },
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
                apiData={paybleData}
                fileName={`Overall report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={paybleData}
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

export default AmountPaybleChild;