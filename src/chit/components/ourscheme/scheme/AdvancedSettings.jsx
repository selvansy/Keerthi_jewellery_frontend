import React, { useState, useEffect } from "react";
import Select from "react-select";
import { rewardType } from "../../../../utils/Constants";


const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    border: state.isFocused ? "1px solid black" : "1px solid #e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    borderRadius: "0.375rem",
  }),
};

const AdvancedSettings = ({ formik, layout_color, installment_type }) => {
  const header = ["0", "Monthly", "Weekly", "Daily", "Yearly"];
  const [reward, setReward] = useState([]);

  useEffect(() => {
    const data = rewardType.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setReward(data);
  }, [rewardType]);

  return (
    <>
    <div className="grid grid-rows-2 md:grid-cols-3 gap-5">
      {/* Monthly Limit Installment */}
      <div className="flex flex-col mt-2">
      <label className="block text-sm font-medium mb-1">
          {!installment_type ? 'Monthly Installment Limit' : `${header[installment_type]} Limit Installment`} <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="limit_installment"
            onWheel={(e) => e.target.blur()}
            value={formik.values.limit_installment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
            placeholder="Enter Limit Installment"
          />
        </div>
        {formik.touched.limit_installment &&
          formik.errors.limit_installment && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.limit_installment}
            </span>
          )}
      </div>

      {/* Scheme Customer Limit */}
      <div className="flex flex-col mt-2">
      <label className="block text-sm font-medium mb-1">
          Scheme Customer Limit
        </label>
        <div className="relative">
          <input
            type="number"
            name="limit_customer"
            onWheel={(e) => e.target.blur()}
            value={formik.values.limit_customer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
            placeholder="Enter Scheme Customer Limit"
          />
        </div>
        {formik.touched.limit_customer &&
          formik.errors.limit_customer && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.limit_customer}
            </span>
          )}
      </div>

      <div className="flex flex-col mt-2">
      <label className="block text-sm font-medium mb-1">
          Minimum Paid Installment (for gift) <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="gift_minimum_paid_installment"
            onWheel={(e) => e.target.blur()}
            value={formik.values.gift_minimum_paid_installment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
            placeholder="Enter Paid Installment"
          />
        </div>
        {formik.touched.gift_minimum_paid_installment && formik.errors.gift_minimum_paid_installment && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.gift_minimum_paid_installment}
          </span>
        )}
      </div>

      {/* Number of Gifts */}
      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1">
          Number of Gifts
        </label>
        <div className="relative">
          <input
            type="number"
            name="no_of_gifts"
            onWheel={(e) => e.target.blur()}
            value={formik.values.no_of_gifts}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
            placeholder="Enter Number of Gifts"
          />
        </div>
        {formik.touched.no_of_gifts && formik.errors.no_of_gifts && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.no_of_gifts}
          </span>
        )}
      </div>

     

      {/* Convenience Fee */}
      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1">
          Convenience Fee
        </label>
        <div className="relative">
          <input
            type="number"
            name="convenience_fees"
            onWheel={(e) => e.target.blur()}
            value={formik.values.convenience_fees}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
            placeholder="Enter Convenience Fee"
          />
          <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
                %
              </span>
        </div>
        {formik.touched.convenience_fees && formik.errors.convenience_fees && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.convenience_fees}
          </span>
        )}
      </div>
    </div>
    <div className="grid md:grid-cols-3 w-full mt-3 gap-x-5">
    <p className="text-md  mb-4 border-b pb-2 mt-3 font-medium col-span-3">Referral</p>
    <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1">
        Referral Percentage (Monthly)
        </label>
        <div className="relative">
          <input
            type="number"
            name="referralPercentage"
            onWheel={(e) => e.target.blur()}
            value={formik.values.referralPercentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
            placeholder="Enter Referral Percentage"
          />
          <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
                %
              </span>
        </div>
        {formik.touched.referralPercentage && formik.errors.referralPercentage && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.referralPercentage}
          </span>
        )}
      </div>
      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1">
          Display Referral
        </label>
        <div className="flex flex-row border border-gray-300 rounded-lg overflow-hidden w-32 h-10 items-center">
          <div
            onClick={() => formik.setFieldValue("display_referral", true)}
            className={`${
              formik.values.display_referral
                ? "text-white"
                : "bg-white text-[#888888]"
            } p-3 w-full cursor-pointer transition-colors duration-200 text-center font-medium`}
            style={{ backgroundColor: layout_color }}
          >
            Yes
          </div>
          <div className="w-px bg-gray-300" />
          <div
            onClick={() => formik.setFieldValue("display_referral", false)}
            className={`${
              !formik.values.display_referral
                ? "text-white"
                : "bg-white text-[#888888]"
            } p-3 w-full cursor-pointer transition-colors duration-200 text-center font-medium`}
            style={{ backgroundColor: layout_color }}
          >
            No
          </div>
        </div>
        {formik.touched.display_referral && formik.errors.display_referral && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.display_referral}
          </span>
        )}
      </div>
   </div>
    </>
  );
};

export default AdvancedSettings;