import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { CalendarSearch, MoreHorizontal } from "lucide-react";
import { CalendarDays } from "lucide-react";
import AddAcc from "../../../../../assets/dashboard/addAcc.svg";
import { useNavigate } from "react-router-dom";
import { accountStats } from "../../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { customStyles } from "../../../ourscheme/scheme/AddScheme";
const CustomControl = (props) => (
  <components.Control {...props}>
    <CalendarSearch className="ml-4 mr-2 text-[#232323] w-5 h-5" />
    {props.children}
  </components.Control>
);

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

const initialState = {
  totalAccounts: 0,
  digiGoldAccounts: 0,
  digiSilverAccounts: 0,
  openAccounts: 0,
  closeAccounts: 0,
  completedAccounts: 0,
  preclosedAccounts: 0,
  refundAccounts: 0,
};

const AccountStatus = ({ id_branch }) => {
  const [accountData, setAccountData] = useState(initialState);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [dateRange, setDateRange] = useState({
    startDate: getStartOfDay(new Date()),
    endDate: getEndOfDay(new Date()),
  });

  useEffect(() => {
    getAccountData({
      id_branch,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  }, [id_branch, dateRange]);

  const { mutate: getAccountData } = useMutation({
    mutationFn: ({ id_branch, startDate, endDate }) =>
      accountStats({ id_branch, startDate, endDate }),
    onSuccess: (response) => {
      setAccountData(response.data);
    },
    onError: (error) => {
      setAccountData(initialState);
    },
  });

  const totalAccounts = {
    count: accountData.totalAccounts,
    percentage: accountData.totalAccounts,
  };

  const statusData = [
    {
      label: "Digi Gold",
      color: "#3A0CA3",
      percentage: accountData.digiGoldAccounts,
    },
    {
      label: "Digi Silver",
      color: "#004181",
      percentage: accountData.digiSilverAccounts,
    },
    { label: "Open", color: "#B5179E", percentage: accountData.openAccounts },
    { label: "Close", color: "#FFC300", percentage: accountData.closeAccounts },
    {
      label: "Preclosed",
      color: "#F72585",
      percentage: accountData.preclosedAccounts,
    },
    {
      label: "Completed",
      color: "#D99FE7",
      percentage: accountData.completedAccounts,
    },
    {
      label: "Refund",
      color: "#317BFF",
      percentage: accountData.refundAccounts,
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

  const [hoveredSegment, setHoveredSegment] = useState(null);
  let offset = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Create starting position for segments
  let startPosition = 0;

  const navigate = useNavigate();
  return (
    <div className="border-[1px] border-[#F5F5F5] p-5 rounded-[20px] lg:col-span-2 bg-white text-[#232323]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-gray-800 font-bold text-lg">Account</h2>
        <Select
          options={options}
          value={selectedOption}
          onChange={handleDateChange}
          defaultValue={options[0]}
          // styles={{
          //   control: (base) => ({
          //     ...base,
          //     backgroundColor: "white",
          //     border: "2px solid #f2f3f8",
          //     borderRadius: "8px",
          //     borderColor: "#F5F5F5",
          //     padding: "2px",
          //     cursor: "pointer",
          //   }),
          //   indicatorSeparator: () => ({
          //     display: "none",
          //   }),
          // }}
          styles={customStyles(true)}
          components={{ Control: CustomControl }}
        />
      </div>

      <div className="flex">
        <div className="relative w-56 h-72 mx-auto">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#F5F5F5"
              strokeWidth="16"
            />

            {/* Dynamic Status Segments */}
            {statusData.map(({ label, color, percentage }, index) => {
              // Skip zero values
              if (percentage <= 0) return null;

              const segmentPercentage =
                totalAccounts.percentage > 0
                  ? (percentage / totalAccounts.percentage) * 100
                  : 0;

              // Calculate the arc length for this segment
              const arcLength = (segmentPercentage / 100) * circumference;

              const circleElement = (
                <circle
                  key={label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={color}
                  strokeWidth="16"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  strokeDashoffset={-startPosition} // Use negative startPosition instead of offset
                  strokeLinecap="round" // Use butt instead of round for better segment joining
                  onMouseEnter={() => setHoveredSegment(label)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ cursor: "pointer" }}
                />
              );

              // Update startPosition for the next segment
              startPosition += arcLength;

              return circleElement;
            })}
          </svg>

          {/* Center Percentage - The Fixed Part */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            {hoveredSegment ? (
              <>
                <span className="text-sm text-gray-500">{hoveredSegment}</span>
                <span className="text-xl font-medium text-gray-400">
                  {
                    statusData.find((item) => item.label === hoveredSegment)
                      ?.percentage
                  }
                </span>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-medium text-gray-400">
                  {totalAccounts.percentage}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="ml-8 flex flex-col justify-center">
          <div className="grid gap-y-2">
            {statusData.map(({ label, color, percentage }) => (
              <div
                key={label}
                className="flex items-center group"
                onMouseEnter={() => setHoveredSegment(label)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="w-4 h-4 rounded-sm mr-2"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-md">{label}</span>
                <span className="text-sm ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {percentage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Count Section */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <div className="flex -space-x-3 mr-3">
            {statusData.map(({ color }, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium">Total Account</p>
            <p className="text-lg font-bold">
              {totalAccounts.count} New Account
            </p>
          </div>
        </div>

        <div
          className="bg-[#004181] px-[24px] py-[12px] rounded-[8px]  flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/managecustomers/addcustomer")}
        >
          <img
            src={AddAcc}
            alt={AddAcc}
            className="h-[22px] w-[22px] me-[10px]"
          />
          <button className="text-white font-semibold">Add Accounts</button>
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;
