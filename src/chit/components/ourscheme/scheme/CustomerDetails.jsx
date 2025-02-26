import React from "react";
import Select from "react-select";
const CustomerDetails = ({ formik, layout_color}) => {
 
  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
        <div className="flex flex-col mt-2">
          <label className="text-black mb-2 font-normal">
            Referral Rate <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="referral_rate"
              value={formik.values.referral_rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Referral rate"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
          </div>
          {formik.touched.referral_rate && formik.errors.referral_rate && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.referral_rate}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Incentive Rate <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="incentive_rate"
              value={formik.values.incentive_rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Incentive rate"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              INR
            </span>
          </div>
          {formik.touched.incentive_rate && formik.errors.incentive_rate && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.incentive_rate}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Remarks <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="cus_remarks"
              value={formik.values.cus_remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Remark"
            />
          </div>
          {formik.touched.cus_remarks && formik.errors.cus_remarks && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.cus_remarks}</span>
          )}
        </div>
    </div>
  );
};

export default CustomerDetails;