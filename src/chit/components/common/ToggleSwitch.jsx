import React from "react";

const ToggleSwitch = ({ status, layout_color, toggle_status }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        aria-checked={status}
        onClick={toggle_status}
        className={`relative flex items-center w-14 h-8 transition-colors duration-300 focus:outline-none ${
          status ? 'bg-[#015173]' : "bg-gray-400"
        }`}
      >
        <span
          className={`absolute flex items-center justify-center w-6 h-6 bg-white shadow-md transform transition-transform duration-300 p-2 ${
            status ? "translate-x-6" : "translate-x-1"
          }`}
        >
          {status ? "Yes" : "No"}
        </span>
      </button>
    </div>
  );
};

export default ToggleSwitch;