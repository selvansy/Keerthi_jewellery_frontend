// commonFunctions.js

import { useState } from "react";

// Hook for Mobile Number Validation
export const useMobileNumber = (maxLength = 10) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    ;

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

export const emptyToZero = (value) => {
  if (value === undefined || value === null || value === "" ) {
    return 0.00;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.includes(",")) {
    return parseFloat(value.replace(/,/g, ""));
  }

  return isNaN(value) ? 0.00 : parseFloat(value);
};


// { value: 1234567.89, locale: "en-IN", currency: "INR" }
export const formatNumber = ({
  value,
  decimalPlaces = 2,
  locale = "en-IN",
  // locale = "en-US",
  // currency = null,
  currency = "INR",
} = {}) => {

  value = emptyToZero(value);
  

  const options = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };

  if (currency) {
    options.style = "currency";
    options.currency = currency;
  }

  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDecimal = (value, decimalPlaces = 3) => {
  value = emptyToZero(value);
  return parseFloat(value).toFixed(decimalPlaces);
};
