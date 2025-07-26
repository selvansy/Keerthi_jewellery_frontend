import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation, useQuery } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import {
  getActiveScheme,
  getPaymentLedger,
  getSchemeByBrachId,
  getallpaymentmode
} from "../../../chit/api/Endpoints";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import Select from "react-select";
import { customSelectStyles } from "../Setup/purity";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { customStyles } from "../ourscheme/scheme/AddScheme";
import { formatDecimal,formatNumber } from "../../utils/commonFunction";

function PaymentLedger() {
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;
  const id_role = roleData?.id_role?.id_role;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]); // New state for flattened data
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  const [from_date, setfrom_date] = useState();
  const [to_date, setto_date] = useState();
  const [schemeList, setSchemeList] = useState([]);
  const [selectedMode, setSelectedMode] = useState();
  const [paymentmode, setPaymentmode] = useState([]);

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch == 0) {
      getPaymentData({
        limit: itemsPerPage,
        page: currentPage,
        from_date,
        to_date,
        id_payment: selectedMode
      });
    } else {
      getPaymentData({
        limit: itemsPerPage,
        page: currentPage,
        id_branch,
        from_date,
        to_date,
        id_payment: selectedMode
      });
    }
  }, [currentPage, itemsPerPage, roleData, from_date, to_date, selectedMode]);

  // Flatten the data when paymentData changes
  useEffect(() => {
    if (paymentData && paymentData.length > 0) {
      const flattened = paymentData.flatMap(scheme => 
        scheme.paymentModes?.map(mode => ({
          schemeName: scheme.schemeName,
          payment_mode: mode.modeName,
          totalAmount: mode.totalAmount,
          paymentCount: mode.paymentCount
        }))
      );
      setFlattenedData(flattened);
    } else {
      setFlattenedData([]);
    }
  }, [paymentData]);

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

  const { data: paymentModes } = useQuery({
    queryKey: ["modes"],
    queryFn: getallpaymentmode,
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (paymentModes) {
      const data = paymentModes.data.map((item) => ({
        mode: item.id_mode,
        value: item._id,
        label: item.mode_name,
      }));
      setPaymentmode(data);
    }
  }, [paymentModes]);

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "SCHEME NAME",
      cell: (row) => row?.schemeName,
    },
    {
      header: "Payment Mode",
      cell: (row) => row?.payment_mode,
    },
    {
      header: "Amount",
      cell: (row) => formatNumber({value:row?.totalAmount,decimalPlaces:2}),
    },
    {
      header: "Payment Count",
      cell: (row) => row?.paymentCount,
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
      <div className="flex flex-col p-4 bg-white border-[1px] border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start">
              <Select
                className="mt-2 w-[219px]"
                styles={customStyles(true)}
                options={paymentmode || []}
                value={paymentmode.find(
                  (option) => option.value === selectedMode
                )}
                onChange={(option) => {
                  setSelectedMode(option.value)
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
                apiData={flattenedData} // Use flattenedData for export
                fileName={`Payment Ledger Report ${new Date().toLocaleDateString(
                  "en-GB"
                )}`}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            data={flattenedData} // Use flattenedData instead of paymentData
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