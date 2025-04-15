import React, { useEffect, useState } from "react";
import AccountStatus from "./accountStatus";
import plus from "../../../../../assets/plus.svg";
import newJoine from "../../../../../assets/dashboard/newJoine.svg";
import newAcc from "../../../../../assets/dashboard/newAcc.svg";
import completedAcc from "../../../../../assets/dashboard/completedAcc.svg";
import closedAcc from "../../../../../assets/dashboard/closedAcc.svg";
import receiveAmt from "../../../../../assets/dashboard/receivedAmt.svg";
import receiveWgt from "../../../../../assets/dashboard/receivedWgt.svg";
import Select, { components } from "react-select";
import { customSelectStyles } from "../../../Setup/purity";
import { CalendarDays } from "lucide-react";
import { formatDecimal, formatNumber } from "../../../../utils/commonFunction";
import { getAccountReview } from "../../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";

const CustomControl = (props) => (
  <components.Control {...props}>
    <CalendarDays className="ml-2 mr-2 text-gray-500 w-4 h-4" />
    {props.children}
  </components.Control>
);

// Helper function to get start of day (midnight 00:00:00)
const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Helper function to get end of day (23:59:59)
const getEndOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

const now = new Date();

const options = [
  {
    label: "Today",
    value: new Date().toISOString(),
  },
  {
    label: "Last Week",
    value: new Date(new Date().setDate(now.getDate() - 7)).toISOString(),
  },
  {
    label: "This Month",
    value: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
  },
  {
    label: "This Year",
    value: new Date(now.getFullYear(), 0, 1).toISOString(),
  },
  // {
  //   label: "Custom",
  //   value: "",
  // },
];

function AccountReview({id_branch}) {
  const initialState = {
    newCustomer: 0,
    receivedWeights: 0,
    receivedAmounts: 0,
    newAccounts: 0,
    completedAccount: 0,
    closedAccount: 0,
  };

  const [accountDataCount, setAccountDataCount] = useState(initialState);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [dateRange, setDateRange] = useState({
    startDate: getStartOfDay(new Date()), 
    endDate: getEndOfDay(new Date()),     
  });
  
  useEffect(() => {
    getAccount({id_branch, startDate: dateRange.startDate, endDate: dateRange.endDate});
  }, [id_branch, dateRange]);

  const { mutate: getAccount } = useMutation({
    mutationFn: ({id_branch, startDate, endDate}) => getAccountReview({id_branch, startDate, endDate}),
    onSuccess: (response) => {
      setAccountDataCount(response.data);
      console.log(response.data)
    },
    onError: (error) => {
      setAccountDataCount(initialState);
    },
  });

  const accountData = [
    { title: "New Joinee", value: accountDataCount.newCustomer, img: newJoine },
    { title: "New Accounts", value: accountDataCount.newAccounts, img: newAcc },
    {
      title: "Completed Accounts",
      value: accountDataCount.completedAccount,
      img: completedAcc,
    },
    {
      title: "Closed Accounts",
      value: accountDataCount.closedAccount,
      img: closedAcc,
    },
    {
      title: "Received Amounts",
      value: formatNumber({
        value: accountDataCount.receivedAmounts,
        decimalPlaces: 0,
      }),
      img: receiveAmt,
    },
    {
      title: "Received Weights",
      value:  `${accountDataCount.receivedWeights} g`,
      img: receiveWgt,
    },
  ];

  const handleDateChange = (option) => {
    setSelectedOption(option);

    const currentDate = new Date();
    let startDate;
    let endDate;

    switch (option.label) {
      case "Today":
        startDate = getStartOfDay(currentDate); 
        endDate = getEndOfDay(currentDate);   
        break;
      case "Last Week":
        const lastWeek = new Date(currentDate);
        lastWeek.setDate(currentDate.getDate() - 7);
        startDate = getStartOfDay(lastWeek);    
        endDate = getEndOfDay(currentDate);     
        break;
      case "This Month":
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startDate = getStartOfDay(startDate);   
        endDate = getEndOfDay(currentDate);     
        break;
      case "This Year":
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        startDate = getStartOfDay(startDate);   
        endDate = getEndOfDay(currentDate);     
        break;
      case "Custom":
        startDate = null;
        endDate = null;
        break;
      default:
        break;
    }

    setDateRange({ startDate, endDate });
  };

  return (
    <div className="bg-white rounded-lg p-5 lg:col-span-3 border-2 border-[#F5F5F5]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-xl">Account Overview</h2>
        <div className="flex items-center gap-2">
          <div className="text-[#004181]">
            <Select
              options={options}
              value={selectedOption}
              onChange={handleDateChange}
              placeholder="Select Date"
              className="react-select-container"
              classNamePrefix="react-select"
              styles={customSelectStyles(true)}
              components={{ Control: CustomControl }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {accountData.map((data, index) => (
          <div
            key={index}
            className="py-[20px] rounded-lg border-2 border-[#F0F7FE]"
          >
            <img src={data.img} alt={data.title} className="h-12 w-[70px] " />
            <div className="flex flex-col items-start px-[12px]">
              <p className="text-2xl font-semibold  pt-[24px] pb-[8px] ">
                {data.value}
              </p>
              <p className="text-[#6C7086] text-sm font-medium pt-[5px]">
                {data.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountReview;