import React, { useState } from "react";

const ToggleSwitch = ({ layout_color,toggle_status}) => {
  const [isYes, setIsYes] = useState(true);

  const handleToggle = () => {
    toggle_status()
    setIsYes(!isYes);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">
        {isYes ? "Yes" : "No"}
      </span>
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none bg-gray-300"
        style={{ backgroundColor: isYes ? layout_color : "gray" }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isYes ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
