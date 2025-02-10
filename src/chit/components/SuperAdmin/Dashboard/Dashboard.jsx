import React, { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { getpaymentDashboard,getpaymentmodesummary,getallbranch, schemepaymentdatatable, schemepaymenttodayrate } from "../../../api/Endpoints"
import { CalendarDays } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import customer from "../../../../assets/customer.svg";
import completedacc from '../../../../assets/completedacc.svg'
import account from '../../../../assets/account.svg';
import closedacc from '../../../../assets/closedacc.svg';
import gold from "../../../../assets/Gold 22.svg";
import gold22 from "../../../../assets/Vector.svg"
import gold18 from "../../../../assets/gold.svg"
import silver from "../../../../assets/SilverImg.svg";
import platinum from "../../../../assets/Platinum.svg";
import diamond from "../../../../assets/Dimond 1.svg";
import plus from "../../../../assets/plus.svg"
import Table from '../../common/Table'
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  let navigate = useNavigate();
  const [search, setSearch] = useState('')
  const [isLoading,setisLoading] = useState(false)
  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;
  const id_branch  = roledata?.id_branch;


  let [data, setData] = useState([]);

  let [paymentData, setPaymentData] = useState([])
  let [cardData, setCardData] = useState(null)
  let [metalRate, setMetalRate] = useState({})

  const [branchList, setBranchList] = useState([])

  const [paymentMode, setpaymentMode] = useState([])

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

  

  useEffect(() => {
    if(id_branch){
      getTodaysMetalRate({ id_branch: id_branch, date: todayDate })
      
      
    let payload = {
      from_date: "",
      to_date: "",
      id_branch: id_branch
    }
    PaymentMode(payload);
    CardSummary(payload);
  
  }
  }, [roledata])

    const handleallbranch = async (e) => {  
  
      const response = await getallbranch();
      if (response) {
        console.log(response.data)
        setBranchList(response.data);
      }
    };


  const filterInputchange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));

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
      type: filters.type
    };

    getschemePaymentMutate(filterTosend)
    PaymentMode(filterTosend);
    CardSummary(filterTosend);
    setIsFilterOpen(false)
    setFromdate("")
    setTodate("")
    setFilters({
      from_date: null,
      to_date: null,
      limit: itemsPerPage,
      id_branch: id_branch,

    })
  };


  const { mutate: PaymentMode } = useMutation({
   
    mutationFn: (payload) => {
      setisLoading(true)
      getpaymentmodesummary(payload)
    },
    onSuccess: (response) => {
      setpaymentMode(response.data);
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error:', error);
      setisLoading(false)
    }
  });

  const { mutate: CardSummary } = useMutation({
    mutationFn: getpaymentDashboard,
    onSuccess: (response) => {
      setCardData(response.data);
    }
  });

  //mutation to get scheme type
  const { mutate: getschemePaymentMutate } = useMutation({
    mutationFn: ()=> {
      setisLoading(true)
      schemepaymentdatatable
    },
    onSuccess: (response) => {
      setData(response.data)
      setTotalPages(response.totalPages)
      setisLoading(false)
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });

  const { mutate: getTodaysMetalRate } = useMutation({
    mutationFn: schemepaymenttodayrate,
    onSuccess: (response) => {

      setMetalRate(response.data)

    },
    onError: (error) => {
      console.error('Error:', error);
    }
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
      search: ""
    };
    handleallbranch();

    getschemePaymentMutate(parsedData);
  }, [currentPage, itemsPerPage, search])



  const PaymentColumns = [
    {
      header: 'PAYMENT MODE',
      cell: (row) => `${row?.mode_name}`,
    },
    {
      header: 'COLLECTION',
      cell: (row) => `${row?.collection_amount}`,
    }
  ]


  const columns = [
    {
      header: 'Scheme name',
      cell: (row) => `${row?.id_scheme?.scheme_name}`,
    },
    {
      header: 'Paid Date',
      cell: (row) => {
        const paidDate = new Date(row?.date_payment)
        return paidDate.toLocaleDateString();
      }
    },
    {
      header: 'Paid Amount',
      cell: (row) => `${row?.payment_amount}`,
    },

  ]


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
        className={`p-2 w-10 h-10 rounded-md ${currentPage === i ? ' text-white' : 'bg-gray-300 text-gray-900'}`}
        style={{ backgroundColor: layout_color }} >
        {i}
      </button>
    );
  }



  const total = cardData?.total_account;

  const chartData = [
    { status: "Open account", percentage: (cardData?.total_open / total) * 100, color: "#00A550" },
    { status: "Completed", percentage: (cardData?.total_complete / total) * 100, color: "#800080" },
    { status: "Close", percentage: (cardData?.close / total) * 100, color: "#FF5733" },
    { status: "Refund", percentage: (cardData?.refund / total) * 100, color: "#FFBF00" },
    { status: "Partial Close", percentage: (cardData?.partaiclose / total) * 100, color: "#FFA500" },
    { status: "Partial Preclose", percentage: (cardData?.partaipreclose / total) * 100, color: "#002D62" },
  ];


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
        console.error("Google Charts is not loaded yet.");
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
        console.error("Chart container not found!");
        return;
      }

      const chart = new window.google.visualization.PieChart(chartContainer);
      chart.draw(data, options);
    }
  }, [chartData]);


  return (
    <>
      <div className="flex flex-col gap-5 px-4 py-6 bg-gray-100 min-h-screen overflow-y-scroll scrollbar-hide">
        {/* Cards Section */}
        <div className='flex justify-end items-center'>
          <button
            id="filter"
            className="text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: layout_color }}>
            <SlidersHorizontal size={20} />
          </button>

        </div>
        <div
          className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
                ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-3">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form>
              <div className="p-3 space-y-4 flex-1 overflow-y-auto filterscroll">
                <div className="flex flex-col border-t"></div>
                <div className="space-y-2">
                  <label className='text-gray-700 text-sm font-medium'>From Date<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <DatePicker
                      selected={from_date}
                      onChange={(date) => setFromdate(date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select Date"
                      className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      wrapperClassName="w-full"
                    />
                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                      <CalendarDays size={20} />
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className='text-gray-700 text-sm font-medium'>To Date<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <DatePicker
                      selected={to_date}
                      onChange={(date) => setTodate(date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select Date"
                      className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      wrapperClassName="w-full"
                    />
                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                      <CalendarDays size={20} />
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {
                    id_branch === "0" &&

                    <>
                      <div className="flex flex-col lg:mt-2">
                        <label className="text-black mb-1 font-medium">
                          Branch<span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="id_branch"
                            className={`appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!id_branch !== 0 ? "cursor-not-allowed bg-gray-100" : ""
                              }`}
                            defaultValue=""
                            onChange={filterInputchange}
                            value={filters.id_branch}
                          >
                            <option value="" disabled className="text-gray-700">
                              --Select--
                            </option>
                            {branchList.map((branch) => (
                              <option
                                className="text-gray-700"
                                key={branch._id}
                                value={branch._id}
                              >
                                {branch.branch_name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="black"
                            >
                              <path d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </div>

                      </div>
                    </>
                  }
                </div>



                <div className="p-4 borde">
                  <div className="bg-yellow-300 flex justify-center gap-3">
                    <button
                      onClick={applyfilterdatatable}
                      className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsFilterOpen(false)}
          />
        )}


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card */}
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Customer</h5>
              <h5 className="text-2xl font-semibold">{cardData?.total_customer}</h5>
            </div>
            <div className="flex items-center justify-center p-3 rounded-md" style={{ backgroundColor: layout_color }}>
              <img src={customer} alt="customer" className="w-6 h-6" />
            </div>
          </div>
          {/* Repeat Cards */}
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Total Account</h5>
              <h5 className="text-2xl font-semibold">{cardData?.total_account}</h5>
            </div>
            <div className="flex items-center justify-center p-3 rounded-md" style={{ backgroundColor: layout_color }}>
              <img src={account} alt="account" className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Completed Account</h5>
              <h5 className="text-2xl font-semibold">{cardData?.total_complete}</h5>
            </div>
            <div className="flex items-center justify-center p-3 rounded-md" style={{ backgroundColor: layout_color }}>
              <img src={completedacc} alt="completedacc" className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md">
            <div className="flex flex-col">
              <h5 className="text-[#67748E] text-sm">Closed Account</h5>
              <h5 className="text-2xl font-semibold">{cardData?.close}</h5>
            </div>
            <div className="flex items-center justify-center p-3 rounded-md" style={{ backgroundColor: layout_color }}>
              <img src={closedacc} alt="closedacc" className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Today's Metal Rate and Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-3">
          {/* Metal Rate Section */}
          <div className="bg-white rounded-lg shadow-md p-5 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Today's Metal Rate</h2>
              <div className="flex items-center justify-center p-3 rounded-md cursor-pointer" onClick={() => navigate("/ourscheme/createmetalrate")}>
                <img src={plus} alt="plus" className="w-6 h-6 cursor-pointer" onClick={() => navigate("/ourscheme/createmetalrate")}/>
                <h6 className='text-gray-900 text-md font-medium px-2 font- cursor-pointer' onClick={() => navigate("/ourscheme/createmetalrate")} >Add Metal</h6>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold22} alt="Gold (22CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Gold (22CT)</p>
                
              </div>

              {/* Platinum Rate */}
              <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                <img src={platinum} alt="Platinum" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Platinum</p>
              
              </div>

              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold} alt="Gold (20CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_20ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Gold (20CT)</p>
              
              </div>


              {/* Silver Rate */}
              <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                <img src={silver} alt="Silver" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-xl font-medium text-center mb-1"> {metalRate?.silverrate_1gm?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Silver</p>
                
              </div>

              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold18} alt="Gold (22CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Gold COIN</p>
              
              </div>


              {/* Diamond Rate */}
              <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                <img src={diamond} alt="Diamond" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-xl font-medium text-center mb-1"> {metalRate?.silverrate_1gm?.$numberDecimal}</h3>
                <p className="text-sm text-center text-gray-600">Diamond</p>
           
              </div>

            </div>
          </div>

          <div className="rounded-lg  shadow-md  bg-white p-3 whitespace-normal">
            <div className='p-2 flex justify-between items-center w-full'>
              <h2 className="text-lg font-bold px-3">Most Payment Collection</h2>
            </div>
            <div className="rounded-lg p-5 overflow-y-scroll scrollbar-hide h-[35rem]">
              <Table data={paymentMode} columns={PaymentColumns} isLoading={isLoading} />
            </div>
          </div>
          {/* Table Section */}

        </div>

        {/* Payment Table && Piechart section  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          {/* Table Section */}
          <div className="rounded-lg  shadow-md  bg-white p-3 whitespace-normal">
            <div className='p-2 flex justify-between items-center w-full'>
              <h2 className="text-lg font-bold px-3">Today's Payment</h2>
              <div className="flex items-center justify-center p-3 rounded-md cursor-pointer"  onClick={() => navigate("/payment/addschemepayment")} >
                <img src={plus} alt="plus" className="w-6 h-6 cursor-pointer"  onClick={() => navigate("/payment/addschemepayment")} />
                <h6 className='text-gray-900 text-md font-medium px-2 font- cursor-pointer' onClick={() => navigate("/payment/addschemepayment")} >Add Payment</h6>
              </div>
            </div>

           
           <Table data={data} columns={columns} isLoading={isLoading}/>
           

            {data.length > 0 && (
              <div className="flex justify-between mt-4 p-2">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                    disabled={currentPage === totalPages}
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
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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
            <div className='p-2 flex justify-between items-center w-full'>
              <h2 className="text-lg font-bold px-3">Account</h2>
              <div className="flex items-center justify-center p-3 rounded-md cursor-pointer">
                <img src={plus} alt="plus" className="w-6 h-6 cursor-pointer" />
                <h6 className='text-gray-900 text-md font-medium px-2 font- cursor-pointer' onClick={() => navigate("/manageaccount/addschemeaccount")}>Add Account</h6>
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
  )
}

export default Dashboard