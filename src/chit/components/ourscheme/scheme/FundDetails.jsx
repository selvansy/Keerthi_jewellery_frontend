import React from "react";
import Select from "react-select";

const FundDetails = ({ formik, layout_color, fundtype }) => {

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      

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
            onWheel={(e) => e.target.blur()}
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
            onWheel={(e) => e.target.blur()}
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