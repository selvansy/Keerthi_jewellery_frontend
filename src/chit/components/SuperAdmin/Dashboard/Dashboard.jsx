import React, { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getpaymentDashboard } from "../../../api/Endpoints"
import { getpaymentmodesummary,schemepaymentdatatable,todayMetalRate} from "./dasApi"
import customer from "../../../../assets/customer.svg";
import completedacc from '../../../../assets/completedacc.svg'
import account from '../../../../assets/account.svg';
import closedacc from '../../../../assets/closedacc.svg';
import gold from "../../../../assets/gold.svg";
import silver from "../../../../assets/silver.svg"
import plus from "../../../../assets/plus.svg"
import Table from '../../common/Table'
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  let navigate = useNavigate();

  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;


  let [data,setData] = useState([]);
  console.log("Data",data)
  let [paymentData,setPaymentData] = useState([])
  let [cardData,setCardData] = useState(null)
  let [metalRate,setMetalRate] = useState({})
    
  const [paymentMode, setpaymentMode] = useState([])

 
    const { mutate: PaymentMode } = useMutation({
    mutationFn: (payload)=>getpaymentmodesummary(payload),
    onSuccess: (response) => {
      setpaymentMode(response.data);
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
       mutationFn: schemepaymentdatatable,
       onSuccess: (response) => {
         setData(response.data)
       },
       onError: (error) => {
         console.error('Error fetching countries:', error);
       }
     });

       const { mutate: getTodaysMetalRate } = useMutation({
         mutationFn: todayMetalRate,
         onSuccess: (response) => {
     
          setMetalRate(response.data)
   
         },
         onError: (error) => {
           console.error('Error fetching countries:', error);
         }
       });


  useEffect(() => {
    const parsedData = {
      page: 1,
      limit: 10,
      added_by: "",
      from_date: "",
      to_date: "",
      id_branch: "",
      id_scheme: "",
      id_classification: "",
      collectionuserid: "",
      search: ""
    };
    
    CardSummary();
    getschemePaymentMutate(parsedData);
    }, [])

    useEffect(()=>{
      console.log("idBranch",id_branch)
      if(id_branch){
        getTodaysMetalRate(id_branch)
      }
    },[id_branch])

    console.log("metalRate",metalRate)

 useEffect(() => {
  let payload = {
    from_date:"",
    to_date:"",
    id_branch: id_branch
}
  PaymentMode(payload);
 }, [id_branch])
 


  const PaymentColumns = [
    {
      header: 'PAYMENT MODE',
      cell: (row) => `${row.mode_name}`,
    },
    {
      header: 'COLLECTION',
      cell: (row) => `${row.collection_amount}`,
    }
  ]

  console.log("Data",data)

  const columns = [
    {
      header: 'Scheme name',
      cell: (row) => `${row?.id_scheme?.scheme_name}`,
    },
    {
      header: 'Paid Date',
      cell: (row) => {
        const paidDate = new Date(row.date_payment)
        return paidDate.toLocaleDateString();
      }
    },
    {
      header: 'Paid Amount',
      cell: (row) => `${row.payment_amount}`,
    },
   
  ]

  // todayMetalRate 

  const chartData = [
    { status: "Digi Gold", percentage: 41.7, color: "#FFBF00" },
    { status: "Open", percentage: 31.3, color: "#00A550" },
    { status: "Close", percentage: 10.4, color: "#FF5733" },
    { status: "Preclosed", percentage: 10.4, color: "#002D62" },
    { status: "Completed", percentage: 2.4, color: "#800080" },
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
              <button className=" text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: layout_color }}>
                Add
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Rate */}
              <div className="p-4 rounded-lg bg-[#E8B9233D] border border-gray-200">
                <img src={gold} alt="Gold (22CT)" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-2xl font-medium text-center mb-1">{metalRate?.goldrate_22ct?.$numberDecimal }</h3>
                <p className="text-sm text-center text-gray-600">Gold (22CT)</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>
              {/* Silver Rate */}
              <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                <img src={silver} alt="Silver" className="h-20 w-20 mx-auto mb-2" />
                <h3 className="text-xl font-medium text-center mb-1"> {metalRate?.silverrate_1gm?.$numberDecimal }</h3>
                <p className="text-sm text-center text-gray-600">Silver</p>
                {/* <p className="text-xs text-blue-500 text-center mt-1">+5% from yesterday</p> */}
              </div>
            </div>
          </div>

          <div className="rounded-lg  shadow-md  bg-white p-3 whitespace-normal">
          <div className='p-2 flex justify-between items-center w-full'>
              <h2 className="text-lg font-bold px-3">Most Payment Collection</h2>
            </div>
            <div className="rounded-lg p-5 overflow-y-scroll scrollbar-hide h-64">
            <Table data={paymentMode}  columns={PaymentColumns}/>
          
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
              <div className="flex items-center justify-center p-3 rounded-md">
                <img src={plus} alt="plus" className="w-6 h-6" /> 
                <h6 className='text-gray-900 text-md font-medium px-2 font- cursor-pointer' onClick={()=>navigate("/payment/addschemepayment")}>Add Payment</h6>
              </div>
            </div>
            <Table data={data}  columns={columns}/>
          </div>
          {/* Pie chart Section */}
          <div className="flex flex-col bg-white items-center justify-between mb-2">
            {/* Title Section */}
            <div className='p-2 flex justify-between items-center w-full'>
              <h2 className="text-lg font-bold px-3">Account</h2>
              <div className="flex items-center justify-center p-3 rounded-md">
                <img src={plus} alt="plus" className="w-6 h-6" /> 
                <h6 className='text-gray-900 text-md font-medium px-2 font-'>Add Account</h6>
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