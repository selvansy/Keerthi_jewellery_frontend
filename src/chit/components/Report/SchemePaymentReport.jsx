import { useEffect, useState, useCallback } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import {
  schemePayment,
  getActiveScheme,
  getallpaymentmode,
} from "../../../chit/api/Endpoints";
import { Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { formatNumber } from "../../utils/commonFunction";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import DateRangeSelector from "../common/calender";
import { formatDate } from "../../../utils/FormatDate";
import Select from "react-select";
import { debounce } from "lodash";

function AccountSummaryReport() {
  const roleData = useSelector((state) => state.clientForm.roledata);

  const accessBranch = roleData?.branch;
  const id_branch = roleData?.id_branch;

  const id_role = roleData?.id_role?.id_role;
  const id_client = roleData?.id_client;
  // const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [from_date, setfrom_date] = useState(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  return tomorrow;
});
  const [to_date, setto_date] = useState(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  return tomorrow;
});
  const [searchLoading, setSearchLoading] = useState(false);
  const [processData, setProcessData] = useState([]);
  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState();
  const [selectedPaymentMode, setSelectedPaymentMode] = useState();
  const [branchOptions, setBranchOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchLoading(true);
      getPaymentData({
        from_date,
        to_date,
        page: 1,
        limit: itemsPerPage,
        search: searchValue,
        id_scheme: selectedScheme,
        payment_mode: selectedPaymentMode,
      });
    }, 500),
    [from_date, to_date, itemsPerPage, selectedScheme, selectedPaymentMode]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const customSelectStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      backgroundColor: "white",
      border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
      "&:hover": {
        color: "#e2e8f0",
      },
      pointerEvents: !isReadOnly ? "none" : "auto",
      opacity: !isReadOnly ? 1 : 1,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#858293",
      fontWeight: "thin",
      // fontStyle: "bold",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#232323",
      "&:hover": {
        color: "#232323",
      },
    }),
  });

  useEffect(() => {
    getPaymentData({
      from_date,
      to_date,
      page: currentPage,
      limit: itemsPerPage,
      search: searchInput,
      id_scheme: selectedScheme,
      payment_mode: selectedPaymentMode,
    });
  }, [
    from_date,
    to_date,
    currentPage,
    itemsPerPage,
    selectedScheme,
    selectedPaymentMode,
  ]);

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

  const { mutate: getAllbranch } = useMutation({
    mutationFn: () => getallpaymentmode(),
    onSuccess: (response) => {
      setBranchOptions(
        response.data.map((branch) => ({
          value: branch._id,
          label: branch.mode_name,
        }))
      );
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  const { mutate: getPaymentData } = useMutation({
    mutationFn: ({
      from_date,
      to_date,
      page,
      limit,
      id_scheme,
      search,
      payment_mode,
    }) =>
      schemePayment({
        from_date,
        to_date,
        page,
        limit,
        id_scheme,
        search,
        payment_mode,
      }),
    onSuccess: (response) => {
      const { data } = response;
      setPaymentData(data);
      setisLoading(false);
      setSearchLoading(false);
      setTotalPages(response.totalPages);
      setTotalDocuments(response.totalDocuments);
    },
    onError: (error) => {
      setisLoading(false);
      setSearchLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  useEffect(() => {
    const process = paymentData?.map((item, index) => {
      const baseData = {
        "S.No": index + 1 + (currentPage - 1) * itemsPerPage,
        "Receipt No": item.payment_receipt,
        "Transaction ID": item.id_transaction,
        "Payment Date": item.createdAt ? formatDate(item.createdAt) : "",
        Customer: item.customer_name,
        "Mobile Number": item.customer_mobile,
        "Accounter Name": item.accounter_name,
        "Scheme Name": item.scheme_name,
        "Scheme A/c No": item.schemeAccNo,
        Classification: item.classification_name,
        "Paid Amount": item.payment_amount,
        "Payment mode": item.payment_mode || "Cash Free",
      };

      const isInstallmentVisible =
        item.schemeType !== 10 && item.schemeType !== 14;

      return {
        ...baseData,
        "Paid Installment": isInstallmentVisible
          ? `${item.totalPaidInstallment}/${item.total_installments}`
          : `${item.totalPaidInstallment}`,
      };
    });

    setProcessData(process);
  }, [paymentData, currentPage, itemsPerPage]);

  // useEffect(() => {
  //   if (!roleData) return;
  //   if (accessBranch == 0) {
  //     getAllScheme();
  //   }
  // }, [roleData]);

  // useEffect(() => {
  //   if (!roleData) return;
  //   if (accessBranch == 0) {
  //     getAllbranch();
  //   }
  // }, [roleData]);
  
  useEffect(()=>{
    getAllScheme();
    getAllbranch();
  },[])

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Receipt No",
      cell: (row) => row?.payment_receipt,
    },
    {
      header: "Transaction ID",
      cell: (row) => row?.id_transaction,
    },
    {
      header: "Payment Date",
      cell: (row) => formatDate(row?.createdAt),
    },
    {
      header: "Customer",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Mobile Number",
      cell: (row) => row?.customer_mobile,
    },
    // {
    //   header: "Payment Date",
    //   cell: (row) => formatDate(row?.createdAt)
    // },
    {
      header: "Accounter Name",
      cell: (row) => row?.accounter_name,
    },
    {
      header: "Scheme Name",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "scheme A/c No",
      cell: (row) => row?.schemeAccNo,
    },
    {
      header: "Classification",
      cell: (row) => row?.classification_name,
    },
    {
      header: "Paid Amount",
      cell: (row) =>
        formatNumber({ value: row?.payment_amount, decimalPlaces: 0 }),
    },
    {
      header: "Payment mode",
      cell: (row) => row?.payment_mode || "Cash Free",
    },
    {
      header: "Paid Installment",
      cell: (row) => {
        if(row?.schemeType == 10 || row?.schemeType == 14){
          return `${row?.totalPaidInstallment}`
        }else{
           return `${row?.totalPaidInstallment}/${row?.total_installments}`
        }
      },
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
      // return;
    }

    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Scheme Reports" },
          { label: "Scheme Payment", active: true },
        ]}
      />
      <div className="flex flex-col p-4 bg-white border border-[#F2F2F9] rounded-[16px] ">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 w-full">
          <div className="flex justify-start">
            <div className="w-60">
              <Select
                styles={customSelectStyles(true)}
                placeholder="Schemes"
                isClearable={true}
                options={schemeList || []}
                value={
                  schemeList.find(
                    (option) => option.value === selectedScheme
                  ) || null
                }
                onChange={(option) => {
                  setSelectedScheme(option ? option.value : null);
                }}
              />
            </div>
          </div>
        </div>
        <hr className="mt-2" />
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 w-full">
          <div className="flex justify-start">
            <div className="w-60">
              <Select
                styles={customSelectStyles(true)}
                placeholder="Payment Mode"
                options={branchOptions || []}
                isClearable={true}
                value={
                  branchOptions.find(
                    (option) => option.value === selectedPaymentMode
                  ) || null
                }
                onChange={(option) => {
                  setSelectedPaymentMode(option ? option.value : null);
                }}
              />
            </div>
            <div className="relative w-90 sm:w-[228px] ml-5">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                ) : (
                  <Search className="text-[#6C7086] h-5 w-5" />
                )}
              </div>
              <input
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search"
                className="pl-8 pr-4 py-2 border-2 border-[#F2F2F9] rounded-[8px] w-full"
              />
            </div>
          </div>
          <div className="flex justify-end items-center w-full">
            <div className="flex justify-end items-center gap-4">
              <DateRangeSelector
                onChange={(range) => {
                  setfrom_date(range.startDate);
                  setto_date(range.endDate);
                }}
              />
              {/* <DateRangeSelector
  fromDate={from_date}  // Pass your from_date state
  toDate={to_date}      // Pass your to_date state
  onChange={(range) => {
    setfrom_date(range.startDate);
    setto_date(range.endDate);
  }}
/> */}
              <ExportDropdown
                apiData={processData}
                fileName={`Scheme Payment Report ${new Date().toLocaleDateString(
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

export default AccountSummaryReport;
