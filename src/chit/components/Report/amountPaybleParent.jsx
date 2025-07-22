import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import { amountPayble } from "../../api/Endpoints";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";

function AmountPaybleParent() {
  const roledata = localStorage.getItem("decoded");
  const navigate = useNavigate();
  
  const [isLoading, setisLoading] = useState(true);
  const [paybleData, setPaybleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState(null); // Changed to null initially
  const [to_date, setto_date] = useState(new Date());
  const type = "amount";

  useEffect(() => {
    const payload = {
      page: currentPage,
      limit: itemsPerPage,
      to_date: to_date,
      type: type
    };
    
    // Only add from_date if it exists
    if (from_date) {
      payload.from_date = from_date;
    }

    getAmountPayble(payload);
  }, [from_date, to_date, currentPage, itemsPerPage]);

  const { mutate: getAmountPayble } = useMutation({
    mutationFn: (payload) => amountPayble(payload),
    onSuccess: (response) => {
      setPaybleData(response.data);
      setisLoading(false);
      setTotalDocuments(response.totalCount);
      setTotalPages(response.totalPages);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching amount payable data:", error);
    },
  });

  const handleSchemeClick = (row) => {
    navigate("/report/schemewiseamount", {
      state: { id: row._id, type: "amount" },
    });
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Scheme",
      cell: (row) => (
        <span
          className="cursor-pointer hover:underline font-semibold"
          onClick={() => handleSchemeClick(row)}
        >
          {row?.schemeName}
        </span>
      ),
    },
    {
      header: "Classification",
      cell: (row) => row?.classificationName,
    },
    {
      header: "Total Paid Amount",
      cell: (row) => formatNumber({ value: row?.totalCollectedAmount, decimalPlaces: 0 }),
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

  const handleRefresh = () => {
    setfrom_date(null);
    setto_date(new Date());
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Amount Payable", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <RefreshCcw size={16} />
                Reset
              </button>
            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate || null);
                  setto_date(range.endDate);
                }}
                initialStartDate={null}
                initialEndDate={new Date()}
              />
              <ExportDropdown
                apiData={paybleData}
                fileName={`Amount Payable Report ${new Date().toLocaleDateString(
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

export default AmountPaybleParent;