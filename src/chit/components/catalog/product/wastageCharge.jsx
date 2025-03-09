import { useState } from "react";
import { useSelector } from "react-redux";

export default function WastageChargeForm({ onChange,initialState }) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  

  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value };
      
      if (
        updatedFormData.actualValue &&
        updatedFormData.discountedValue &&
        updatedFormData.discountedPercentage
      ) {
        onChange(updatedFormData);
      }

      return updatedFormData;
    });
  };

  const handleActualValueChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    handleInputChange("actualValue", value);

    if (value && formData.discountedValue) {
      const percentage = (((Number(value) - Number(formData.discountedValue)) / Number(value)) * 100).toFixed(2);
      handleInputChange("discountedPercentage", percentage);
    }
  };

  const handleDiscountedChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (formData.actualValue && Number(value) > Number(formData.actualValue)) return;
    
    handleInputChange("discountedValue", value);

    if (formData.actualValue && value) {
      const percentage = (((Number(formData.actualValue) - Number(value)) / Number(formData.actualValue)) * 100).toFixed(2);
      handleInputChange("discountedPercentage", percentage);
    } else {
      handleInputChange("discountedPercentage", "");
    }
  };

  const handlediscountedPercentageChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
    handleInputChange("discountedPercentage", value);

    if (formData.actualValue && value) {
      const discounted = (Number(formData.actualValue) * (1 - Number(value) / 100)).toFixed(2);
      handleInputChange("discountedValue", discounted);
    } else {
      handleInputChange("discountedValue", "");
    }
  };

  const unit = formData.mode === "amount" ? "INR" : "gms";

  return (
    <div>
      <h2 className="text-xl text-[#023453] font-bold justify-between mb-3">Making Charge</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Mode</label>
          <select
            className="border-2 border-gray-300 rounded-md p-3 w-full mb-2"
            value={formData.mode}
            onChange={(e) => handleInputChange("mode", e.target.value)}
          >
            <option value="amount">Amount</option>
            <option value="weight">Weight</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Discount Percentage</label>
          <div className="relative">
            <input
              type="number"
              value={formData.discountedPercentage}
              onChange={handlediscountedPercentageChange}
              className="border-2 border-gray-300 rounded-md p-3 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Here"
              onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            />
            <span className="absolute right-0 top-0 h-[47.6px] w-16 flex items-center justify-center text-white rounded-r-md mb-2" style={{ backgroundColor: layout_color }}>
              %
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Actual Value</label>
          <div className="relative">
            <input
              type="number"
              value={formData.actualValue}
              onChange={handleActualValueChange}
              className="border-2 border-gray-300 rounded-md p-3 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Here"
              onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            />
            <span className="absolute right-0 top-0 h-[47.6px] w-16 flex items-center justify-center text-white rounded-r-md mb-2" style={{ backgroundColor: layout_color }}>
              {unit}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Discounted Value</label>
          <div className="relative">
            <input
              type="number"
              value={formData.discountedValue}
              onChange={handleDiscountedChange}
              className="border-2 border-gray-300 rounded-md p-3 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Here"
              onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            />
            <span className="absolute right-0 top-0 h-[47.6px] w-16 flex items-center justify-center text-white rounded-r-md mb-2" style={{ backgroundColor: layout_color }}>
              {unit}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.discountView}
            onChange={() => handleInputChange("discountView", !formData.discountView)}
            className="w-3 h-3"
          />
          Discount View
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.wastageView}
            onChange={() => handleInputChange("wastageView", !formData.wastageView)}
            className="w-3 h-3"
          />
          Wastage View
        </label>
      </div>
    </div>
  );
}
