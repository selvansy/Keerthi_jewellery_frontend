import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";

import {
  getActiveScheme,
  getallbranch,
  getbranchbyid,
  getEmployeeRefferal,
  getPaymentLedger,
  getSchemeByBrachId,
} from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import usePagination from "../../hooks/usePagination";
import { getAllBranch } from "../../api/Endpoints";
import Select from "react-select";
import { customSelectStyles } from "../Setup/purity";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatNumber } from "../../utils/commonFunction";

function EmployeeRefferal() {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;


  const [isLoading, setisLoading] = useState(true);
  const [employeeRefData, setEmployeeRefData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();



  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getEmployeeData({
        limit: itemsPerPage,
        page: currentPage,
        from_date,
        to_date,
      });
    } else {
      getEmployeeData({
        limit: itemsPerPage,
        page: currentPage,
        id_branch,
        from_date,
        to_date,
      });
    }
  }, [currentPage, itemsPerPage, roleData, from_date, to_date]);




  // Mutation to get payment data
  const { mutate: getEmployeeData } = useMutation({
    mutationFn: (data) => getEmployeeRefferal(data),
    onSuccess: (response) => {
      setEmployeeRefData(response.data);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Reffer ID",
      cell: (row) => row?.referral_code,
    },
    {
      header: "Employee Name",
      cell: (row) => row?.employee_name,
    },
    {
      header: "customer name",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Customer Contact",
      cell: (row) => row?.customer_mobile,
    },
    {
      header: "Referred Date",
      cell: (row) =>{
        return new Date(row.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
      }
    },
    {
        header: "Referral Bonus Amount",
        cell: (row) => {
          return formatNumber({ value: row?.ReferralBonusAmount, decimalPlaces: 0 });
        }
      }
      
  ];



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

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Account Reports" },
          { label: "Employee Referral", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown

                apiData={employeeRefData}
                fileName={`Overall report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={employeeRefData}
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

export default EmployeeRefferal;


