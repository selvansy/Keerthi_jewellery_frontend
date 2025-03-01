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
  getpaymentDashboard,
  getpaymentmodesummary,
  getallbranch,
  schemepaymentdatatable,
  schemepaymenttodayrate,
} from "../../../api/Endpoints";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import customer from "../../../../assets/customer.svg";
import completedacc from "../../../../assets/completedacc.svg";
import account from "../../../../assets/account.svg";
import closedacc from "../../../../assets/closedacc.svg";
import gold from "../../../../assets/Gold 22.svg";
import gold24 from "../../../../assets/Gold 24.svg";
import gold18 from "../../../../assets/Gold 18.svg";
import silver from "../../../../assets/SilverImg.svg";
import platinum from "../../../../assets/Platinum.svg";
import diamond from "../../../../assets/Dimond 1.svg";
import plus from "../../../../assets/plus.svg";
import Table from "../../common/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Select from "react-select";
import AccountStatus from "./accountStatus";

const options = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

function Dashboard() {
  const { id } = useParams();

  let navigate = useNavigate();
  const [search, setSearch] = useState("");

  const roledata = useSelector((state) => state.clientForm.roledata);
  // const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;

  let [data, setData] = useState([]);

  let [paymentData, setPaymentData] = useState([]);
  let [cardData, setCardData] = useState(null);
  let [metalRate, setMetalRate] = useState({});

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
      console.log(roledata);
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

  const applyfilterdatatable = (e) => {
    e.preventDefault();
    setData([]);
    setpaymentMode([]);
    setCardData(null);
    const filterTosend = {
      from_date: from_date,
      to_date: to_date,
      limit: itemsPerPage,
      id_branch: filters.id_branch,
      type: filters.type,
    };

    getschemePaymentMutate(filterTosend);
    PaymentMode(filterTosend);
    CardSummary(filterTosend);
    setIsFilterOpen(false);
    setFromdate("");
    setTodate("");
    setFilters({
      from_date: null,
      to_date: null,
      limit: itemsPerPage,
      id_branch: id_branch,
    });
  };

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
    mutationFn: getpaymentDashboard,
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
    mutationFn: schemepaymenttodayrate,
    onSuccess: (response) => {
      setMetalRate(response.data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    const parsedData = {
      page: 1,
      limit: 10,
      added_by: "",
      from_date: from_date,
      to_date: to_date,
      id_branch: id_branch,
      id_scheme: "",
      id_classification: "",
      collectionuserid: "",
      search: "",
    };
    handleallbranch();

    getschemePaymentMutate(parsedData);
  }, [currentPage, itemsPerPage, search]);

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

  const metals = [
    { name: "Gold (24CT)", key: "goldrate_24ct", img: gold24 },
    { name: "Gold (22CT)", key: "goldrate_22ct", img: gold },
    { name: "Gold (18CT)", key: "goldrate_18ct", img: gold18 },
    { name: "Silver", key: "silverrate_1gm", img: silver },
    { name: "Platinum", key: "platinumrate_1gm", img: platinum },
    { name: "Diamond", key: "diamondrate_1gm", img: diamond },
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
      <div className="flex flex-col gap-5 px-4 py-6 bg-gray-100 min-h-screen overflow-y-scroll scrollbar-hide">
        {/* Cards Section */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card */}
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Customer</h5>
              <h5 className="text-2xl font-semibold">
                {cardData?.total_customer || 0}
              </h5>
            </div>
            <div
              className="flex items-center justify-center p-3 rounded-md"
              style={{ backgroundColor: layout_color }}
            >
              <img src={customer} alt="customer" className="w-6 h-6" />
            </div>
          </div>
          {/* Repeat Cards */}
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Account</h5>
              <h5 className="text-2xl font-semibold">
                {cardData?.total_account || 0}
              </h5>
            </div>
            <div
              className="flex items-center justify-center p-3 rounded-md"
              style={{ backgroundColor: layout_color }}
            >
              <img src={account} alt="account" className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Completed Account</h5>
              <h5 className="text-2xl font-semibold">
                {cardData?.total_complete || 0}
              </h5>
            </div>
            <div
              className="flex items-center justify-center p-3 rounded-md"
              style={{ backgroundColor: layout_color }}
            >
              <img src={completedacc} alt="completedacc" className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Closed Account</h5>
              <h5 className="text-2xl font-semibold">{cardData?.close || 0}</h5>
            </div>
            <div
              className="flex items-center justify-center p-3 rounded-md"
              style={{ backgroundColor: layout_color }}
            >
              <img src={closedacc} alt="closedacc" className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Today's Metal Rate and Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 my-3">
          <div className="bg-white rounded-lg shadow-md p-5 lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#004181]">
                Today's Metal Rate
              </h2>
              <div
                className="flex items-center justify-center p-3 rounded-md cursor-pointer bg-[#F0F7FE]"
                onClick={() => navigate("/ourscheme/createmetalrate")}
              >
                <img src={plus} alt="plus" className="w-6 h-6 cursor-pointer" />
                <div className="text-[#004181] text-md font-medium px-2 font- cursor-pointer">
                  Add Metal
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metals.map((metal, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-200 "
                >
                  <img
                    src={metal.img}
                    alt={metal.name}
                    className="h-12 w-20 mb-2 "
                  />
                  <h3 className="text-2xl font-medium text-[#090909] mt-6">
                    ₹{metalRate?.[metal.key]?.$numberDecimal || 0.0}
                  </h3>
                  <p className="text-sm text-gray-600">{metal.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* donut Chart */}
          <AccountStatus statusData={statusData} totalAccounts={totalAccounts} options={options} />;
        </div>

        {/* Payment Table && Piechart section  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          {/* Table Section */}
          <div className="rounded-lg  shadow-md  bg-white p-3 whitespace-normal">
            <div className="p-2 flex justify-between items-center w-full">
              <h2 className="text-lg font-bold px-3">Today's Payment</h2>
              <div
                className="flex items-center justify-center p-3 rounded-md cursor-pointer"
                onClick={() => navigate("/payment/addschemepayment")}
              >
                <img
                  src={plus}
                  alt="plus"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => navigate("/payment/addschemepayment")}
                />
                <h6
                  className="text-gray-900 text-md font-medium px-2 font- cursor-pointer"
                  onClick={() => navigate("/payment/addschemepayment")}
                >
                  Add Payment
                </h6>
              </div>
            </div>

            <Table data={data} columns={columns} isLoading={isLoading} />

            {data?.length > 0 && (
              <div className="flex justify-between mt-4 p-2">
                <div className="flex flex-row items-center justify-center gap-2">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      readOnly={currentPage === 1}
                      className="p-2 text-gray-500 rounded-md"
                    >
                      Previous
                    </button>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-2">
                    {paginationButtons}
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      readOnly={currentPage === totalPages}
                      className="p-2 text-gray-500 rounded-md"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 justify-center items-center">
                  <span className="text-gray-500">Show</span>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                  </select>
                  <span className="text-gray-500">entries</span>
                </div>
              </div>
            )}
          </div>
          {/* Pie chart Section */}
          <div className="flex flex-col bg-white items-center justify-between mb-2">
            {/* Title Section */}
            <div className="p-2 flex justify-between items-center w-full">
              <h2 className="text-lg font-bold px-3">Account</h2>
              <div className="flex items-center justify-center p-3 rounded-md cursor-pointer">
                <img src={plus} alt="plus" className="w-6 h-6 cursor-pointer" />
                <h6
                  className="text-gray-900 text-md font-medium px-2 font- cursor-pointer"
                  onClick={() => navigate("/manageaccount/addschemeaccount")}
                >
                  Add Account
                </h6>
              </div>
            </div>

            {/* Chart Section */}
            <div
              id="piechart_3d"
              className="w-full max-w-3xl h-[400px] mx-auto shadow-lg border rounded-lg"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
