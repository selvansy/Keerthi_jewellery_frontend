import React from "react";
import Select from "react-select";

const FundDetails = ({ formik, layout_color, fundtype }) => {
  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      <div className="flex flex-col mt-2">
        <label className="text-black mb-1 font-medium">
          Saving Type<span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <select
            name="saving_type"
            value={formik.values.saving_type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="cursor-pointer appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
          >
            <option value="" className="text-gray-700">
              --Select--
            </option>
            {(fundtype || []).map((type) => (
              <option key={type._id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="black"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        {formik.touched.saving_type && formik.errors.saving_type && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.saving_type}</span>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Min Fund <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="min_fund"
            value={formik.values.min_fund}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Min Fund"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            INR
          </span>
        </div>
        {formik.touched.min_fund && formik.errors.min_fund && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.min_fund}</span>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Max Fund <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="max_fund"
            value={formik.values.max_fund}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Max Fund"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            INR
          </span>
        </div>
        {formik.touched.max_fund && formik.errors.max_fund && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.max_fund}</span>
        )}
      </div>
    </div>
  );
};

export default FundDetails;