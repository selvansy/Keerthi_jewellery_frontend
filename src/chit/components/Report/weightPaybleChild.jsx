import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { useMutation } from "@tanstack/react-query";
import { useLocation,useNavigate} from "react-router-dom";
import "jspdf-autotable";
import ExportDropdown from "../common/Dropdown/Export";
import {
  getSchemewiseAmount,
} from "../../api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../../utils/FormatDate";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatDecimal } from "../../utils/commonFunction";

function WeightPaybleChild() {

  const location = useLocation();
  const { id} = location.state || {};

  const [isLoading, setisLoading] = useState(true);
  const [paybleData, setPaybleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages,  setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date,setfrom_date]=useState()
  const [to_date,setto_date]=useState()
  const [processData,setProcessData]=useState([]);
  const type= 'weight'

  const navigate = useNavigate()

  useEffect(() => {
    getAmountPayble({id:id,page:currentPage,limit:itemsPerPage,from_date,to_date});
  }, [from_date,to_date,currentPage,itemsPerPage]);

  const { mutate: getAmountPayble } = useMutation({
    mutationFn:({id,page,limit,from_date,to_date})=> getSchemewiseAmount({id,page,limit,from_date,to_date,type}),
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

  useEffect(() => {
    const process = paybleData?.map((item, index) => ({
      "S.No": index + 1,
      "Customer":item?.customer,
      "Accounter Name":`${item?.accounter_fname} ${item?.accounter_lname}`,
      "scheme A/c No": item?.schemeAccNumber,
      "Total Collectd Weight":item?.totalValue,
      "Maturity Date":formatDate(item?.maturityDate),
      "Paid Installment":item?.paidInstallments,
       
    }));
    setProcessData(process);
  }, [paybleData]);

  const handleClick =(row)=>{
    
    navigate(`/managecustomers/customer/${row.customerId}`)
  }

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    // {
    //   header: "Scheme",
    //   cell: (row) => row?.scheme_name,
    // },
    // {
    //   header: "Classification",
    //   cell: (row) => row?.classification_name,
    // },
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
      header: "Total Collectd Weight",
      cell: (row) => `${formatDecimal(row?.totalValue,3)} g`,
    },
    {
      header: "Maturity Date ",
      cell: (row) => row?.maturityDate,
    },
    // {
    //     header: "joined Date ",
    //     cell: (row) => {
    //       return formatDate(row?.joinedDate)
    //     }
    //   },
      {
        header: "Paid Installment",
        cell: (row) => row?.paidInstallments,
      },
  ];

  function truncateDecimal(value, decimals) {
  const factor = Math.pow(10, decimals);
  const truncated = Math.floor(value * factor) / factor;
  return truncated.toFixed(decimals);
}

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
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Weight Payable", active: true },
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
                apiData={processData}
                fileName={`Per scheme wieght payable ${new Date().toLocaleDateString(
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

export default WeightPaybleChild;