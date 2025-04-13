import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";

import {
  getActiveScheme,
  getallbranch,
  getbranchbyid,
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

function PaymentLedger() {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_role = roleData?.id_role?.id_role;
  const id_branch = roleData?.id_branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const accessBranch = roleData?.branch;

  const [isLoading, setisLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();
  const [branches, setBranches] = useState([]);
  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState();

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getAllScheme();
    }
  }, [roleData]);

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getPaymentData({
        limit: itemsPerPage,
        page: currentPage,
        from_date,
        to_date,
        id_scheme:selectedScheme
      });
    } else {
      getPaymentData({
        limit: itemsPerPage,
        page: currentPage,
        id_branch,
        from_date,
        to_date,
        id_scheme:selectedScheme
      });
    }
  }, [currentPage, itemsPerPage, roleData, from_date, to_date,selectedScheme]);

  const { mutate: getAllScheme } = useMutation({
    mutationFn: () => getActiveScheme(),
    onSuccess: (response) => {
      setSchemeList(
        response.data.map((item) => ({
          label: item.scheme_name,
          value: item._id,
        }))
      );
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });
  const { mutate: getAllSchemeById } = useMutation({
    mutationFn: (data) => getSchemeByBrachId(data),
    onSuccess: (response) => {
      setPaymentData(response.data);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  // Mutation to get payment data
  const { mutate: getPaymentData } = useMutation({
    mutationFn: (data) => getPaymentLedger(data),
    onSuccess: (response) => {
      setPaymentData(response.data);
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
      header: "SCHEME NAME",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "Payment Mode",
      cell: (row) => row?.payment_mode,
    },
    {
      header: "Amount",
      cell: (row) => row?.totalAmount,
    },
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
          { label: "Payment Ledger Report", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border-2 border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
              <Select
                className="mt-2 w-[219px]"
                styles={customSelectStyles(true)}
                options={schemeList || []}
                value={schemeList.find(
                  (option) => option.value === selectedScheme
                )}
                onChange={(option) => {
                 setSelectedScheme(option.value)
                }}
              />
            </div>
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              <ExportDropdown
                apiData={paymentData}
                fileName={`Overall report ${new Date().toLocaleDateString(
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

export default PaymentLedger;
