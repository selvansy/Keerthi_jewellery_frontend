import React from "react";
import Select from "react-select";

const PayableDetails = ({
  formik,
  scheme_type,
  layout_color,
  gstTypeData,
  wastagedata,
  install_type,
  classType,
}) => {
  // Customisations for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      border: state.isFocused ? "1px solid black" : "1px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
    }),
  };

  // Common height for all input fields
  const inputHeight = "42px";

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      {!classType && (
        <>
          <div className="flex flex-col mt-2">
            <label className="text-black mb-2 font-normal">
              Amounts <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Amount"
                style={{ height: inputHeight }}
              />
              <span
                className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                style={{ backgroundColor: layout_color }}
              >
                INR
              </span>
            </div>
            {formik.touched.amount && formik.errors.amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.amount}
              </span>
            )}
          </div>
          <div className="flex flex-col lg:mt-2">
            <label className="text-black mb-2 font-normal">
              Min Amount <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="min_amount"
                value={formik.values.min_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Min Amount"
                style={{ height: inputHeight }}
              />
              <span
                className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                style={{ backgroundColor: layout_color }}
              >
                INR
              </span>
            </div>
            {formik.touched.min_amount && formik.errors.min_amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.min_amount}
              </span>
            )}
          </div>
          <div className="flex flex-col lg:mt-2">
            <label className="text-black mb-2 font-normal">
              Max Amount <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="max_amount"
                value={formik.values.max_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Max Amount"
                style={{ height: inputHeight }}
              />
              <span
                className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                style={{ backgroundColor: layout_color }}
              >
                INR
              </span>
            </div>
            {formik.touched.max_amount && formik.errors.max_amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.max_amount}
              </span>
            )}
          </div>
        </>
      )}
      <div className="flex flex-col lg:mt-2">
        <label className="block text-sm font-medium mb-1">
          Installments <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="min_installments"
          value={formik.values.installments}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Installments"
          style={{ height: inputHeight }}
        />
        {formik.touched.Installments && formik.errors.Installments && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.Installments}
          </span>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 mt-2">
          Buy GST Type<span className="text-red-500">*</span>
        </label>
        <Select
          styles={customStyles}
          options={gstTypeData || []}
          placeholder="Select gst type"
          value={gstTypeData.find(
            (option) => option.value === formik.values.buytgsttype
          )}
          onChange={(option) =>
            formik.setFieldValue("buytgsttype", option.value)
          }
          onBlur={() => formik.setFieldTouched("buytgsttype", true)}
        />
        {formik.touched.buytgsttype && formik.errors.buytgsttype && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.buytgsttype}
          </div>
        )}
      </div>
      <div className="flex flex-col lg:mt-2">
        <label className="block text-sm font-medium mb-1">
          Buy GST <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="buy_gst"
            value={formik.values.buy_gst}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter Buy GST"
            style={{ height: inputHeight }}
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.buy_gst && formik.errors.buy_gst && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.buy_gst}
          </span>
        )}
      </div>
      <div className="flex flex-col lg:mt-2">
        <label className="text-black mb-2 font-normal">
          Benefit Minimum Installment
        </label>
        <input
          type="number"
          name="min_installments"
          value={formik.values.min_installments}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Enter Min Installments"
          style={{ height: inputHeight }}
        />
        {formik.touched.min_installments && formik.errors.min_installments && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.min_installments}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 mt-2">
          Benefit Wastage<span className="text-red-500">*</span>
        </label>
        <Select
          styles={{
            ...customStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          options={wastagedata || []}
          placeholder="Select wastage type"
          value={wastagedata.find(
            (option) => option.value === formik.values.wastagetype
          )}
          onChange={(option) =>
            formik.setFieldValue("wastageType", option.value)
          }
          onBlur={() => formik.setFieldTouched("wastageType", true)}
          menuPortalTarget={document.body} 
          menuPosition="fixed"
        />

        {formik.touched.wastageType && formik.errors.wastageType && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.wastageType}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayableDetails;