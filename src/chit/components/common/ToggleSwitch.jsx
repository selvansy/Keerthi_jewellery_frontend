import React from "react";

const ToggleSwitch = ({ status, toggle_status }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        aria-checked={status}
        onClick={toggle_status}
        className={`relative flex items-center rounded-md w-14 h-8 transition-colors duration-300 border border-gray-400 ${
          status ? 'bg-[#015173]' : "bg-gray-400"
        }`}
      >
        <span
          className={`absolute flex items-center rounded-md justify-center w-6 h-6 text-xs font-medium  bg-white transform transition-transform duration-300 ${
            status ? "translate-x-7" : "translate-x-1"
          }`}
        >
          {status ? "Yes" : "No"}
        </span>
      </button>
    </div>
  );
};

export default ToggleSwitch;