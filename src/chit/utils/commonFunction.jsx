// commonFunctions.js

import { useState } from "react";

// Hook for Mobile Number Validation
export const useMobileNumber = (maxLength = 10) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    console.log(newValue);
    
    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    setValue(newValue);
  };

  return {
    value,
    keyDown: handleChange,
    maxLength,
    inputMode: "numeric",
    pattern: "[0-9]*",
  };
};

// ✅ HOC for Mobile Number Validation
export const withMobileNumberValidation = (Component, maxLength = 10) => {
  return (props) => {
    const handleChange = (e) => {
      let newValue = e.target.value.replace(/\D/g, ""); // Keep only digits
      if (newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }
      props.onChange && props.onChange(newValue);
    };

    return <Component {...props} onChange={handleChange} maxLength={maxLength} inputMode="numeric" pattern="[0-9]*" />;
  };
};
