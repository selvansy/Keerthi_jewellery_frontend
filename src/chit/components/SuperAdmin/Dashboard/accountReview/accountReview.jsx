import React, { useState } from "react";
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

const CustomControl = (props) => (
  <components.Control {...props}>
    <CalendarDays className="ml-2 mr-2 text-gray-500 w-4 h-4" />
    {props.children}
  </components.Control>
);

function AccountReview() {
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
    {
      label: "Custom",
      value: "",
    },
  ];

  const accountData = [
    { title: "New Joinee", value: 427, img: newJoine },
    { title: "New Accounts", value: 427, img: newAcc },
    { title: "Completed Accounts", value: 427, img: completedAcc },
    { title: "Closed Accounts", value: 427, img: closedAcc },
    { title: "Received Amounts", value: 427, img: receiveAmt },
    { title: "Received Weights", value: 427, img: receiveWgt },
  ];

  return (
    <div className="bg-white rounded-lg p-5 lg:col-span-3 border-2 border-[#F5F5F5]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-xl">Account Overview</h2>
        <div className="flex items-center gap-2">
          <div className="text-[#004181]">
            <Select
              options={options}
              defaultValue={options[0]}
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
          <div key={index} className="py-[20px] rounded-lg border-2 border-[#F0F7FE]">
            <img src={data.img} alt={data.title} className="h-12 w-[70px] " />
            <div className="flex flex-col items-start px-[12px]">
              <p className="text-2xl font-semibold  pt-[24px] pb-[8px] ">{data.value}</p>
              <p className="text-[#6C7086] text-sm font-medium pt-[5px]">{data.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountReview;
