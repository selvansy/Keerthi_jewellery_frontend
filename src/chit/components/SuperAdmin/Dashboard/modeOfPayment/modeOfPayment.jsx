import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import {
  getAccountReview,
  paymentModeHistory,
} from "../../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { customSelectStyles } from "../../../Setup/purity";
import { CalendarDays } from "lucide-react";
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
  {
    label: "Custom",
    value: "",
  },
];

const CustomControl = (props) => (
  <components.Control {...props}>
    <CalendarDays className="ml-2 mr-2 text-gray-500 w-4 h-4" />
    {props.children}
  </components.Control>
);

function ModeOfPayment({ id_branch }) {
  const [dateRange, setDateRange] = useState({
    startDate: getStartOfDay(new Date()),
    endDate: getEndOfDay(new Date()),
  });

  useEffect(() => {
    getPaymentMode({
      id_branch,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  }, [id_branch, dateRange]);

  const [paymentModeData, setPaymentModeData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const { mutate: getPaymentMode } = useMutation({
    mutationFn: ({ id_branch, startDate, endDate }) =>
      paymentModeHistory({ id_branch, startDate, endDate }),
    onSuccess: (response) => {
      setPaymentModeData(response.data);
      console.log(response.data);
    },
    onError: (error) => {
      //   setAccountDataCount(initialState);
    },
  });

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
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
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
    <div className="">
      <div className="bg-[#FFFFFF] pt-4  px-4 rounded-[16px]">
        <div className="flex justify-between items-center mb-[15px] ">
          <h2 className="text-[#2F1C6A] font-semibold text-xl">
            Mode of Payment
          </h2>

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
              {paymentModeData.length > 0 ? (
                paymentModeData.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.payment_mode}
                    </th>
                    <td className="px-6 py-4">{item.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No data available for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default ModeOfPayment;
