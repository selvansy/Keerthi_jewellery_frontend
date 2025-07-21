import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import {
    amountPayble,
  dueReportSummary,
  getOverAllSummary,
  preCloseSummary,
} from "../../api/Endpoints";
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

  const navigate =useNavigate()
  // const id_role = roledata?.id_role?.id_role;
  // const id_client = roledata?.id_client;
  // const id_branch = roledata?.branch;
  // const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [paybleData, setPaybleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages,  setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date,setfrom_date]=useState(new Date())
  const [to_date,setto_date]=useState(new Date())
  const type= "amount"

  useEffect(() => {
    getAmountPayble({page:currentPage,limit:itemsPerPage,from_date,to_date});
  }, [from_date,to_date,currentPage,itemsPerPage]);

  const { mutate: getAmountPayble } = useMutation({
    mutationFn:({page,limit,from_date,to_date})=> amountPayble({page,limit,from_date,to_date,type}),
    onSuccess: (response) => {
      setPaybleData(response.data);
      setisLoading(false);
      setTotalDocuments(response.totalCount)
      setTotalPages(response.totalPages)
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
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
      cell: (row) => 
      <span
          className="cursor-pointer hover:underline font-semibold"
          onClick={() => 
            handleSchemeClick(row)}
        >
          {row?.schemeName}
        </span>
    },
    {
      header: "Classification",
      cell: (row) => row?.classificationName,
    },
      {
        header: "Total Paid Amount",
        cell: (row) => formatNumber({value:row?.totalCollectedAmount,decimalPlaces:0}),
      },
  ];


  const handlePageChange = (page) => {
    console.log(page)
    const pageNumber = Number(page);
    if (
      !pageNumber ||
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }
console.log(pageNumber)
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
          { label: "Amount Payable", active: true },
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

export default AmountPaybleParent;

