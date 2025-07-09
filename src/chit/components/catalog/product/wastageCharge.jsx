import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { customSelectStyles } from "../../Setup/purity";
import Select from "react-select"
import { customStyles } from "../../ourscheme/scheme/AddScheme";
export default function WastageChargeForm({ onChange,initialState }) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  

  const [formData, setFormData] = useState({}); 

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

   useEffect(()=>{
      if(!initialState) return
      setFormData(initialState)
    },[initialState])

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

  const options = [
    { label: "Amount", value: "amount" },
    { label: "Weight", value: "weight" },
  ];

  const unit = formData.mode === "amount" ? " ₹" : "g";

  return (
    <div >
      <h2 className="text-xl text-[#023453] font-bold justify-between mb-3">Wastage</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mode */}
        <div className="flex flex-col justify-end">
          <label className="text-gray-700 font-medium mb-2">
            Mode 
          </label>
          <div className="h-[44px]">
            <Select
              styles={customStyles(true)}
              options={options}
              value={options.find((option) => option.value === formData.mode)}
              onChange={(selectedOption) =>
                setFormData((prev) => ({ ...prev, mode: selectedOption.value }))
              }
            />
          </div>
        </div>

       

        {/* Actual Value */}
        <div className="flex flex-col justify-end">
          <label className="text-gray-700 mb-2 font-medium">
            Actual Value 
          </label>
          <div className="flex items-center border-2 border-[#F2F2F9] rounded-md h-[44px]">
          {formData.mode=="amount"&&(
               <div className="h-[44px] border-e-2 border-[#DEDEDE] flex items-center">
               <span className="px-[14px] flex items-center justify-center h-full">
                 {unit}
               </span>
             </div>
            )}
            <input
              type="number"
              value={formData.actualValue}
              onChange={handleActualValueChange}
              className="w-full focus:outline-none pl-2 pr-3 h-full"
              placeholder="Actual Value"
              onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            />
             {formData.mode=="weight"&&(
               <div className="h-[44px] border-s-2 border-[#DEDEDE] flex items-center">
               <span className="px-[14px] flex items-center justify-center h-full">
                 {unit}
               </span>
             </div>
            )}
          </div>
        </div>

         {/* Discount Percentage */}
         <div className="flex flex-col justify-end">
          <label className="text-gray-700 font-medium mb-2">
            Discount Percentage 
          </label>
          <div className="relative h-[44px]">
            <input
              type="number"
              value={formData.discountedPercentage}
              onChange={handlediscountedPercentageChange}
              className="border-2 border-[#F2F2F9] rounded-md pr-14 pl-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-full"
              placeholder="Discount Percentage"
              onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            />
            <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center border-s-2 border-[#F2F2F9] rounded-r-md">
              %
            </span>
          </div>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="flex flex-col  ">
          <label className="text-gray-700 mb-1.5 font-medium">
            Discounted Value
          </label>
          <div className="flex items-center border-2 border-[#F2F2F9] rounded-[8px] h-[44px] ">
            {formData.mode=="amount"&&(
               <div className="h-[44px] border-e-2 border-[#DEDEDE] flex items-center">
               <span className="px-[14px] flex items-center justify-center h-full">
                 {unit}
               </span>
             </div>
            )}

            <input
              type="number"
              value={formData.discountedValue}
              onChange={handleDiscountedChange}
              className="w-full focus:outline-none ml-2 "
              placeholder="Actual Value"
              onKeyDown={(e) => e.key === "e" && e.preventDefault()}
            />
            {formData.mode=="weight"&&(
               <div className="h-[44px] border-s-2 border-[#DEDEDE] flex items-center">
               <span className="px-[14px] flex items-center justify-center h-full">
                 {unit}
               </span>
             </div>
            )}
          </div>
        </div>

        <div className="flex items-center  gap-6 mt-6 mb-2 w-full">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.discountView}
              onChange={() => handleInputChange("discountView", !formData.discountView)}
              className="hidden"
              id="discountView"
            />
            <div
              className={`w-[16px] h-[16px] border-2 rounded-sm flex items-center justify-center ${
                formData.discountView
                  ? "bg-[#004181] border-[#004181]"
                  : "border-gray-400"
              }`}
            >
              {formData.discountView && (
                <svg
                  className=" text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span>Discount View</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.wastageView}
              onChange={() => handleInputChange("wastageView", !formData.wastageView)}
              className="hidden"
              id="wastageView"
            />
            <div
              className={`w-[16px] h-[16px] border-2 rounded-sm flex items-center justify-center ${
                formData.wastageView
                  ? "bg-[#004181] border-[#004181]"
                  : "border-gray-400"
              }`}
            >
              {formData.wastageView && (
                <svg
                  className=" text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span> Wastage View</span>
          </label>
        </div>
      </div>

      
    </div>
  );
}
