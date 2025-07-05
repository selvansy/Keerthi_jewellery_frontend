import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  SlidersHorizontal,
  Search,
  X,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  dashboardCardsData,
  getpaymentmodesummary,
  getallbranch,
  schemepaymentdatatable,
  schemepaymenttodayrate,
} from "../../../api/Endpoints";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import customer from "../../../../assets/Total_Customer.svg";
import Total_Account from "../../../../assets/Total_Account.svg";
import Completed_Account from "../../../../assets/Completed_Account.svg";
import Closed_Account from "../../../../assets/Closed_Account.svg";

import whatsapp from "../../../../assets/whatsapp.svg";
import sms from "../../../../assets/sms.svg";
import email from "../../../../assets/email.svg";
import gold from "../../../../assets/Gold 22.svg";
import gold24 from "../../../../assets/Gold 24.svg";
import gold18 from "../../../../assets/Gold 18.svg";
import silver from "../../../../assets/SilverImg.svg";
import platinum from "../../../../assets/Platinum.svg";
import diamond from "../../../../assets/Dimond 1.svg";
import plus from "../../../../assets/plus.svg";
import Table from "../../common/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import Select from "react-select";
import AccountStatus from "./accountReview/accountStatus";

const options = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

const tableData = [
  {
    id: 1,
    customerName: "John",
    schemeName: "Gold Plan",
    paidAmount: "1000",
    paidDate: "2025-02-28",
  },
  {
    id: 2,
    customerName: "Jane",
    schemeName: "Silver Plan",
    paidAmount: "800",
    paidDate: "2025-02-27",
  },
  {
    id: 3,
    customerName: "Michael",
    schemeName: "Diamond Plan",
    paidAmount: "1500",
    paidDate: "2025-02-26",
  },
  {
    id: 4,
    customerName: "Alice",
    schemeName: "End Weight",
    paidAmount: "1900",
    paidDate: "2025-02-26",
  },
];

function TEST() {
  const { id } = useParams();

  let navigate = useNavigate();
  const [search, setSearch] = useState("");

  const roledata = useSelector((state) => state.clientForm.roledata);
  // const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch || roledata?.id_branch;

  let [data, setData] = useState([]);

  let [paymentData, setPaymentData] = useState([]);
  let [cardData, setCardData] = useState(null);
  let [metalRate, setMetalRate] = useState([]);

  const [branchList, setBranchList] = useState([]);

  const [paymentMode, setpaymentMode] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const date = new Date();
  const todayDate = date.toISOString();

  const [from_date, setFromdate] = useState("");
  const [to_date, setTodate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    from_date: null,
    to_date: null,
    limit: itemsPerPage,
    id_branch: id_branch,
  });

  const handleReset = (e) => {
    setFromdate("");
    setTodate("");
    setIsFilterOpen(false);
    setFilters((prev) => ({
      ...prev,
      id_branch: id_branch,
      type: 1,
    }));
    toast.success("Filter is cleared");
    getTodaysMetalRate({ id_branch: id_branch, date: todayDate });

    let payload = {
      from_date: "",
      to_date: "",
      limit:"",
      id_branch: id_branch,
    };
    PaymentMode(payload);
    CardSummary(payload);
    getschemePaymentMutate(payload);
  };



  useEffect(() => {
    if (!roledata) return;

    if (id_branch === "0") {
      getTodaysMetalRate({ id_branch: roledata.id_branch, date: todayDate });
    } else {
      getTodaysMetalRate({ id_branch: roledata?.branch, date: todayDate });
    }

    let payload = {
      from_date: "",
      to_date: "",
      id_branch: id_branch,
    };

    getschemePaymentMutate(payload);
  }, [roledata]);

  const handleallbranch = async (e) => {
    const response = await getallbranch();
    if (response) {
      setBranchList(response.data);
    }
  };

  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // const applyfilterdatatable = (e) => {
  //   e.preventDefault();
  //   setData([]);
  //   setpaymentMode([]);
  //   setCardData(null);
  //   const filterTosend = {
  //     from_date: from_date,
  //     to_date: to_date,
  //     limit: itemsPerPage,
  //     id_branch: filters.id_branch,
  //     type: filters.type,
  //   };

  //   getschemePaymentMutate(filterTosend);
  //   PaymentMode(filterTosend);
  //   CardSummary(filterTosend);
  //   setIsFilterOpen(false);
  //   setFromdate("");
  //   setTodate("");
  //   setFilters({
  //     from_date: null,
  //     to_date: null,
  //     limit: itemsPerPage,
  //     id_branch: id_branch,
  //   });
  // };

  const { mutate: PaymentMode } = useMutation({
    mutationFn: (payload) => getpaymentmodesummary(payload),

    onSuccess: (response) => {
      setpaymentMode(response.data);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
    },
  });

  const { mutate: CardSummary } = useMutation({
    mutationFn: dashboardCardsData,
    onSuccess: (response) => {
      setCardData(response.data);
    },
  });

  //mutation to get scheme type
  const { mutate: getschemePaymentMutate } = useMutation({
    mutationFn: (payload) => schemepaymentdatatable(payload),
    onSuccess: (response) => {
      setData(response.data);
      setTotalPages(response.totalPages);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
    },
  });

  const { mutate: getTodaysMetalRate } = useMutation({
    mutationFn: ({id_branch,date})=>schemepaymenttodayrate({id_branch,date}),
    onSuccess: (response) => {
      setMetalRate(response.data);
    },
    onError: (error) => {},
  });

  // useEffect(() => {
  //   const parsedData = {
  //     page: 1,
  //     limit: 10,
  //     added_by: "",
  //     from_date: from_date,
  //     to_date: to_date,
  //     id_branch: id_branch,
  //     id_scheme: "",
  //     id_classification: "",
  //     collectionuserid: "",
  //     search: "",
  //   };
  //   handleallbranch();

  //   getschemePaymentMutate(parsedData);
  // }, [currentPage, itemsPerPage, search]);

  //useEffects
  useEffect(()=>{
    let payload = {
      from_date: "",
      to_date: "",
      limit:"",
      id_branch: id_branch,
    };
    PaymentMode(payload);
    CardSummary(payload);
    getschemePaymentMutate(payload);
    getTodaysMetalRate({ id_branch: id_branch, date: todayDate });
  },[id_branch])

  const PaymentColumns = [
    {
      header: "PAYMENT MODE",
      cell: (row) => `${row?.mode_name}`,
    },
    {
      header: "COLLECTION",
      cell: (row) => `${row?.collection_amount}`,
    },
  ];

  const columns = [
    {
      header: "Scheme name",
      cell: (row) => `${row?.id_scheme?.scheme_name}`,
    },
    {
      header: "Paid Date",
      cell: (row) => {
        const paidDate = new Date(row?.date_payment);
        return paidDate.toLocaleDateString();
      },
    },
    {
      header: "Paid Amount",
      cell: (row) => `${row?.payment_amount}`,
    },
  ];

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`p-2 w-10 h-10 rounded-md  ${
          currentPage === i ? " text-white" : "text-slate-400"
        }`}
        style={{ backgroundColor: layout_color }}
      >
        {i}
      </button>
    );
  }

  const total = cardData?.total_account;

  const chartData = [
    {
      status: "Open account",
      percentage: (cardData?.total_open / total) * 100,
      color: "#00A550",
    },
    {
      status: "Completed",
      percentage: (cardData?.total_complete / total) * 100,
      color: "#800080",
    },
    {
      status: "Close",
      percentage: (cardData?.close / total) * 100,
      color: "#FF5733",
    },
    {
      status: "Refund",
      percentage: (cardData?.refund / total) * 100,
      color: "#FFBF00",
    },
    {
      status: "Partial Close",
      percentage: (cardData?.partaiclose / total) * 100,
      color: "#FFA500",
    },
    {
      status: "Partial Preclose",
      percentage: (cardData?.partaipreclose / total) * 100,
      color: "#002D62",
    },
  ];

  const statusColors = {
    digiGold: "#3E1C96",
    open: "#A91897",
    close: "#FFB800",
    preclosed: "#FF3D6F",
    completed: "#E2B0E2",
    refund: "#2D7FF9",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.onload = () => {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.body.appendChild(script);

    function drawChart() {
      if (!window.google) {
        return;
      }

      const data = window.google.visualization.arrayToDataTable([
        ["Account Status", "Percentage"],
        ...chartData.map((item) => [item.status, item.percentage]),
      ]);

      const options = {
        title: "",
        is3D: true,
        slices: chartData.reduce((acc, item, index) => {
          acc[index] = { color: item.color };
          return acc;
        }, {}),
        legend: { position: "bottom" },
      };

      const chartContainer = document.getElementById("piechart_3d");
      if (!chartContainer) {
        return;
      }

      const chart = new window.google.visualization.PieChart(chartContainer);
      chart.draw(data, options);
    }
  }, [chartData]);

  // const metals = [
  //   { name: metalRate., key: "goldrate_24ct", img: gold24 },
  //   { name: "Gold (22CT)", key: "goldrate_22ct", img: gold },
  //   { name: "Gold (18CT)", key: "goldrate_18ct", img: gold18 },
  //   { name: "Silver", key: "silverrate_1gm", img: silver },
  //   { name: "Platinum", key: "platinumrate_1gm", img: platinum },
  //   { name: "Diamond", key: "diamondrate_1gm", img: diamond },
  // ];
  const metals = [
    0,
   gold24,
   silver,
   diamond,
   platinum,
     gold,
    gold18,
  ];

  const statusData = [
    { label: "Digi Gold", color: "#3A0CA3", percentage: 15 },
    { label: "Open", color: "#B5179E", percentage: 20 },
    { label: "Close", color: "#FFC300", percentage: 10 },
    { label: "Preclosed", color: "#F72585", percentage: 15 },
    { label: "Completed", color: "#D99FE7", percentage: 12 },
    { label: "Refund", color: "#317BFF", percentage: 8 },
  ];

  const totalAccounts = { count: 173, percentage: 77 };

  return (
    <>
      <div className="flex flex-col gap-5 px-4 py-6  min-h-screen overflow-y-scroll scrollbar-hide">
        {/* Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px]">
            <div className="rounded-md">
              <img
                src={customer}
                alt="customer"
                className="h-[40px] w-[40px]"
              />
            </div>
            <div className="flex flex-col py-[12px] ms-1">
              <h5 className="text-2xl font-semibold">
                {cardData?.total_customer || 0}
              </h5>
              <h5 className="text-[#6C7086] text-md mt-2 ">Total Customer</h5>
            </div>
          </div>

          <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px]">
            <div className="rounded-md">
              <img
                src={Total_Account}
                alt="customer"
                className="h-[40px] w-[40px]"
              />
            </div>
            <div className="flex flex-col py-[12px] ms-1">
              <h5 className="text-2xl font-semibold">
                {cardData?.total_account || 0}
              </h5>
              <h5 className="text-[#6C7086] text-md mt-2 ">Total Account</h5>
            </div>
          </div>

          <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px]">
            <div className="rounded-md">
              <img
                src={Completed_Account}
                alt="customer"
                className="h-[40px] w-[40px]"
              />
            </div>
            <div className="flex flex-col py-[12px] ms-1">
              <h5 className="text-2xl font-semibold">
                {cardData?.total_complete || 0}
              </h5>
              <h5 className="text-[#6C7086] text-md mt-2 ">
                Completed Account
              </h5>
            </div>
          </div>

         
        </div>

  

        {/* mode of payment and  limits  */}
        <div className="grid  md:grid-cols-12 gap-4">
          {/* Left Section (3/5 of the screen) */}
          <div className="col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px]">
                <div className="rounded-md">
                  <img
                    src={whatsapp}
                    alt="whatsapp"
                    className="h-[40px] w-[40px]"
                  />
                </div>
                <div className="flex flex-col py-[12px] ms-1">
                  <h5 className="text-2xl font-semibold">
                    {cardData?.total_whatsapp || 0}
                  </h5>
                  <h5 className="text-[#6C7086] text-md mt-2">
                    WhatsApp Limit
                  </h5>
                </div>
              </div>

              <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px]">
                <div className="rounded-md">
                  <img src={sms} alt="sms" className="h-[40px] w-[40px]" />
                </div>
                <div className="flex flex-col py-[12px] ms-1">
                  <h5 className="text-2xl font-semibold">
                    {cardData?.total_sms || 0}
                  </h5>
                  <h5 className="text-[#6C7086] text-md mt-2">SMS Limit</h5>
                </div>
              </div>

              <div className="bg-white rounded-[16px] pt-[20px] pb-[25px] px-[12px]">
                <div className="rounded-md">
                  <img src={email} alt="email" className="h-[40px] w-[40px]" />
                </div>
                <div className="flex flex-col py-[12px] ms-1">
                  <h5 className="text-2xl font-semibold">
                    {cardData?.total_email || 0}
                  </h5>
                  <h5 className="text-[#6C7086] text-md mt-2">Email Limit</h5>
                </div>
              </div>
            </div>

           
          </div>

          {/* Right Section (2/5 of the screen) */}
          <div className="col-span-5 ">
            
            <div className="bg-[#FFFFFF] pt-4 px-4 rounded-[16px]">
              <div className="flex justify-between items-center mb-[15px] ">
                <h2 className="text-[#2F1C6A] font-semibold text-xl">
                  Mode of Payment
                </h2>

                <Select
                  options={options}
                  defaultValue={options[1]}
                  className="w-[150px]"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "white",
                      borderRadius: "6px",
                      borderColor: "#e2e8f0",
                      padding: "2px",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Payment Mode
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Bank Transfer
                      </th>
                      <td className="px-6 py-4">1500</td>
                    </tr>

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Gpay
                      </th>
                      <td className="px-6 py-4">1000</td>
                    </tr>

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Credit Card
                      </th>
                      <td className="px-6 py-4">1000</td>
                    </tr>

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Debit Card
                      </th>
                      <td className="px-6 py-4">5000</td>
                    </tr>
                    <tr className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Razor Pay
                      </th>
                      <td className="px-6 py-4">1200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>

              <div className="bg-white rounded-lg shadow-md  lg:col-span-3  mt-6">
                <div className="flex justify-between items-center mb-4 px-5 py-3">
                  <h2 className="text-xl font-bold ">New User Joined</h2>
                  <Select
                    options={options}
                    defaultValue={options[1]}
                    className="w-[250px]"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "white",
                        borderRadius: "6px",
                        borderColor: "#e2e8f0",
                        padding: "2px",
                        cursor: "pointer",
                      }),
                    }}
                  />
                </div>

                <div class="relative overflow-x-auto  sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 p-5">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          S.no
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Customer Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Scheme name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Paid Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr
                          key={item.id}
                          className="bg-white  dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">{item.customerName}</td>
                          <td className="px-6 py-4">{item.schemeName}</td>
                          <td className="px-6 py-4">{item.paidDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <nav
                    class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
                    aria-label="Table navigation"
                  >
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                      Showing{" "}
                      <span class="font-semibold text-gray-900 dark:text-white">
                        1-10
                      </span>{" "}
                      of{" "}
                      <span class="font-semibold text-gray-900 dark:text-white">
                        1000
                      </span>
                    </span>
                    <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                      <li>
                        <a class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          Previous
                        </a>
                      </li>
                      <li>
                        <a class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          1
                        </a>
                      </li>
                      <li>
                        <a class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          2
                        </a>
                      </li>
                      <li>
                        <a
                          aria-current="page"
                          class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        >
                          3
                        </a>
                      </li>

                      <li>
                        <a class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TEST;
