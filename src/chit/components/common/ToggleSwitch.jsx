import React, { useState } from "react";

const ToggleSwitch = ({status, layout_color,toggle_status}) => {

  const handleToggle = () => {
    toggle_status()
    setIsYes(!status);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">
        {status ? "Yes" : "No"}
      </span>
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-gray-300"
        style={{ backgroundColor: status ? layout_color : "gray" }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            status ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
