import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import {
  preCloseSummary,
} from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";
import { formatDecimal } from "../../utils/commonFunction";

function PreCloseReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [preCloseData, setPreCloseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [from_date,setfrom_date]=useState(new Date())
  const [to_date,setto_date]=useState(new Date())
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    getPreCloseData({from_date,to_date});
  }, []);

  useEffect(() => {
    getPreCloseData({from_date,to_date});
  }, [from_date,to_date]);

  const { mutate: getPreCloseData } = useMutation({
    mutationFn:({from_date,to_date})=> preCloseSummary({from_date,to_date}),
    onSuccess: (response) => {
      if(response){
        setPreCloseData(response?.data);
      setCurrentPage(response.currentPage)
      setTotalDocuments(response.totalDocuments)
      setisLoading(false);
      }
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

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
      header: "Accounter Name",
      cell: (row) => row?.account_name,
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
      // cell: (row) => row?.totalPaidAmount,
      cell: (row) => (
        <div style={{ textAlign: 'right' }}>
          {formatNumber({value:row?.totalPaidAmount,decimalPlaces:0})}
        </div>
      ),
    },
    {
      header: "Paid Weight",
      cell: (row) => `${formatDecimal(row?.totalPaidWeight)} g`,
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
      header: "Last paid Date",
      // cell: (row) => row?.last_paid_date,
      cell: (row) => {
        const date = new Date(row?.last_paid_date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    {
      header: "Closed Date",
      cell: (row) => {
        return new Date(row.closed_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
    },
    {
      header: "Bill No ",
      cell: (row) => row?.bill_no,
    },
    {
      header: "Bill Date",
      cell: (row) => {
        return new Date(row.bill_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      }
    },
    {
      header: "Gift Handover",
      cell: (row) => (
        <div style={{ textAlign: 'right' }}>
          {row?.gift_issues}
        </div>
      ),
    },
    {
      header: "Closed By",
      cell: (row) => row?.closed_by,
    },
   
      
  ];

  return (
    <>
    <Breadcrumb
      items={[
        { label: "Scheme Reports" },
        { label: "Preclose Summary", active: true },
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
        />
      </div>
    </div>
  </>
  );
}

export default PreCloseReport;
