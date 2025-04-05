import React from "react";

const CustomerDetails = ({ formik, layout_color}) => {
 
  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5">
        <div className="flex flex-col mt-2">
          <label className="text-black mb-2 font-normal">
            Referral Rate 
          </label>
          <div className="relative">
            <input
              type="number"
              name="customer_referral_per"
              value={formik.values.customer_referral_per}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
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
          {formik.touched.customer_referral_per && formik.errors.customer_referral_per && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.customer_referral_per}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Incentive Rate 
          </label>
          <div className="relative">
            <input
              type="number"
              name="customer_incentive_per"
              value={formik.values.customer_incentive_per}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Incentive rate"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
               %
            </span>
          </div>
          {formik.touched.customer_incentive_per && formik.errors.customer_incentive_per && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.customer_incentive_per}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Remarks 
          </label>
          <div className="relative">
            <input
              type="text"
              name="customer_ref_remarks"
              value={formik.values.customer_ref_remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Remark"
            />
          </div>
          {formik.touched.customer_ref_remarks && formik.errors.customer_ref_remarks && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.customer_ref_remarks}</span>
          )}
        </div>
    </div>
  );
};

export default CustomerDetails;