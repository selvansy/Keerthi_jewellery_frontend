import React from "react";

const CheckboxToggle = ({ checked, label = "", onChange }) => {
  return (
    <label className="flex flex-row lg:text-nowrap text-sm items-center gap-2.5 dark:text-black light:text-black cursor-pointer">
      <input
        type="checkbox"
        className="peer hidden"
        checked={checked}
        onChange={()=>onChange()}
      />
      <div
        className={`h-5 w-5 flex items-center justify-center rounded-md border-[1px]  transition
        ${checked ? "bg-[#004181]" : "bg-white"}`}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className={`w-5 h-5 ${checked ? "dark:stroke-white" : "light:stroke-[#e8e8e8]" }`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12.6111L8.92308 17.5L20 6.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </div>
      {label}
    </label>
  );
};

export default CheckboxToggle;
