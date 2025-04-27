import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { getSchemeDetailedView } from "../../api/Endpoints";
import { useLocation } from "react-router-dom";
import { schemeColumns } from "../../../utils/DrillDownColums";

function DrilldownTable({
  fetchDataFunction,
  columns,
  breadcrumbItems,
  exportFileName,
  
  // Optional props with defaults
  tableTitle = "Account Summary",
  initialItemsPerPage = 10,
  showDateRange = false,
  showExport = false,
  showBreadcrumb = false,
  containerClassName = "flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px]",
  headerClassName = "flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4",
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [setData,dataToPass]= useState([])
  const [column,setColumn] = useState()

  const location = useLocation();
  const { id, type } = location.state || {};
 
  useEffect(()=>{
    const fetchData =async()=>{
        switch (type) {
            case "scheme":
              const Data = await getSchemeDetailedView(
                {
                   id: id,
                    page:currentPage,
                    limit:itemsPerPage,
                    search:''
                }
              );
              if(Data.data.length > 0){
                dataToPass(Data.data)
                setIsLoading(false)
                setCurrentPage(Data.currentPage)
                setTotalPages(Data.totalPages)
                setTotalDocuments(Data.totalCount)
                setColumn(schemeColumns)
              }
              break;
          
            case "weight":
              await callSecondApi();
              break;
          
            default:
              console.log("Invalid type provided");
              break;
          }
    }
    fetchData()
  },[type])
  

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

  return (
    <>
      {showBreadcrumb && breadcrumbItems && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      
      <div className={containerClassName}>
        <div className={headerClassName}>
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
              {tableTitle && <h2 className="text-xl font-semibold">{tableTitle}</h2>}
            </div>
            <div className="flex justify-end items-center gap-4">
              {showDateRange && (
                <DateRangeSelector
                  onChange={(range) => {
                    setFromDate(range.startDate);
                    setToDate(range.endDate);
                  }}
                />
              )}
              {showExport && tableData.length > 0 && (
                <ExportDropdown
                  apiData={tableData}
                  fileName={`${exportFileName} ${new Date().toLocaleDateString("en-GB")}`}
                />
              )}
            </div>
          </div>
        </div>
        <div>{console.log(setData)}</div>
        <div className="mt-4">
          <Table
            data={setData}
            columns={schemeColumns(currentPage, itemsPerPage)}
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

export default DrilldownTable;