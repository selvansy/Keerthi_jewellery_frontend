import Table from "../../components/common/Table";
import { useState,useEffect} from "react";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import "react-datepicker/dist/react-datepicker.css";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { getSchemeDetailedView } from "../../api/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/FormatDate";
// import { schemeColumns } from "../../../utils/DrillDownColums";

function DrilldownTable({
  fetchDataFunction,
  columns,
  // breadcrumbItems,
  exportFileName,
  
  // Optional props with defaults
  tableTitle = "Account Summary",
  initialItemsPerPage = 10,
  showDateRange = false,
  showExport = false,
  // showBreadcrumb = false,
  containerClassName = "flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px]",
  headerClassName = "flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4",
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);


    const location = useLocation();
  const { id, type,showBreadcrumb,breadcrumbItems,fromdate,todate} = location.state || {};
  const navigate = useNavigate()


  const [fromDate, setFromDate] = useState(fromdate || new Date());
  const [toDate, setToDate] = useState(todate || new Date());
  const [setData,dataToPass]= useState([])
  const [column,setColumn] = useState()



  useEffect(()=>{
    const fetchData =async()=>{
    try{
        switch (type) {
            case "scheme":
              const Data = await getSchemeDetailedView(
                {
                   id: id,
                    page:currentPage,
                    limit:itemsPerPage,
                    search:'',
                    fromdate:fromDate.toISOString(),
                    todate:toDate.toISOString()
                }
              );
              if(Data?.data?.length > 0){
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
              ;
              break;
            }
        }
    catch (error) {
      console.error("Error fetching data:", error);
      dataToPass([]); 
    } finally {
      setIsLoading(false); 
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

  const handleClick =(row)=>{
    navigate(`/managecustomers/customer/${row._id}`)
  }

const schemeColumns = (currentPage, itemsPerPage, handleClick) => [
  {
    header: "S.No",
    cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
  },
  {
    header: "Customer name and Mobile",
    cell: (row) => (
      <span
        className="cursor-pointer hover:underline font-semibold"
        onClick={() => handleClick?.(row)}
      >
        {row?.customerName}
      </span>
    ),
  },
  {
    header: "Scheme Accounter Name",
    cell: (row) => `${row?.accounter_fname} ${row?.accounter_lname}`,
  },
  {
    header: "Scheme Acc No",
    cell: (row) => row?.schemeAccNumber,
  },
  {
    header: "Paid Installments",
    cell: (row) => row?.paidInstallments,
  },
  {
    header: "Start Date",
    cell: (row) => formatDate(row?.startDate),
  },
  {
    header: "Maturity Date",
    cell: (row) => formatDate(row?.maturityDate),
  },
  {
    header: "Overdues",
    cell: (row) => row?.due_months,
  },
];

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
        <div>{}</div>
        <div className="mt-4">
          <Table
            data={setData}
            columns={schemeColumns(currentPage, itemsPerPage,handleClick)}
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