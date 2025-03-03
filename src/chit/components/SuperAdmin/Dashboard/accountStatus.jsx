import React, { useState } from "react";
import Select from "react-select";
import { MoreHorizontal } from "lucide-react";

const AccountStatus = ({ statusData, totalAccounts, options }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  let offset = 0; // To manage segment positioning

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-lg max-w-lg lg:col-span-2">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-[#2F1C6A] font-semibold text-xl">Account</h2>

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

      <div className="flex">
        <div className="relative w-56 h-72 mx-auto">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full transform -rotate-90"
          >
            {/* Background Circle */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#F5F5F5" strokeWidth="16" />
            
            {/* Dynamic Status Segments */}
            {statusData.map(({ label, color, percentage }, index) => {
              const dashValue = (percentage / 100) * 251; // Convert to strokeDasharray scale
              const circleElement = (
                <circle
                  key={label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={color}
                  strokeWidth="16"
                  strokeDasharray={`${dashValue} 251`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredSegment(label)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
              offset -= dashValue; // Move next segment
              return circleElement;
            })}
            
            {/* Transparent overlay circles for better hover detection */}
          <>
          </>
          </svg>

          {/* Center Percentage */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            {hoveredSegment ? (
              <>
                <span className="text-sm text-gray-500">{hoveredSegment}</span>
                <span className="text-4xl font-medium text-gray-400">
                  {statusData.find(item => item.label === hoveredSegment)?.percentage}%
                </span>
              </>
            ) : (
              <span className="text-4xl font-medium text-gray-400">
                {totalAccounts.percentage}%
              </span>
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
                style={{ cursor: 'pointer' }}
              >
                <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: color }}></div>
                <span className="text-sm">{label}</span>
                <span className="text-sm ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {percentage}%
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
            <p className="text-lg font-bold">{totalAccounts.count} New Account</p>
          </div>
        </div>

        <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
          <MoreHorizontal size={20} className="text-blue-800" />
        </div>
      </div>
    </div>
  );
};

export default AccountStatus;