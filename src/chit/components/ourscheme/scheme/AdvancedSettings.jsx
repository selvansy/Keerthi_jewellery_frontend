import React from "react";
import Select from "react-select";

const AdvancedSettings = ({ formik, layout_color }) => {
  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      {/* Monthly Limit Installment */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Monthly Limit Installment <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="limit_installment"
            onWheel={(e) => e.target.blur()}
            value={formik.values.limit_installment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Limit Installment"
          />
        </div>
        {formik.touched.limit_installment && formik.errors.limit_installment && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.limit_installment}</span>
        )}
      </div>

      {/* Pending Due Limit Installment */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Pending Due Limit Installment <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="pending_due_installment"
            onWheel={(e) => e.target.blur()}
            value={formik.values.pending_due_installment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Pending Due Installment"
          />
        </div>
        {formik.touched.pending_due_installment && formik.errors.pending_due_installment && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.pending_due_installment}</span>
        )}
      </div>

      {/* Paid Installment (greater or equal to) */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
         Minimum Paid Installment (for gift)
          <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="paid_installment"
            onWheel={(e) => e.target.blur()}
            value={formik.values.paid_installment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Paid Installment"
          />
        </div>
        {formik.touched.paid_installment && formik.errors.paid_installment && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.paid_installment}</span>
        )}
      </div>

      {/* Scheme Customer Limit */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Scheme Customer Limit<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="scheme_customer_limit"
            onWheel={(e) => e.target.blur()}
            value={formik.values.scheme_customer_limit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Scheme Customer Limit"
          />
        </div>
        {formik.touched.scheme_customer_limit && formik.errors.scheme_customer_limit && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.scheme_customer_limit}</span>
        )}
      </div>

      {/* Number of Gifts */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Number of Gifts<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="number_of_gifts"
            onWheel={(e) => e.target.blur()}
            value={formik.values.number_of_gifts}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Number of Gifts"
          />
        </div>
        {formik.touched.number_of_gifts && formik.errors.number_of_gifts && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.number_of_gifts}</span>
        )}
      </div>

      {/* Reward Amount */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Reward Amount<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="reward_amount"
            onWheel={(e) => e.target.blur()}
            value={formik.values.reward_amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Reward Amount"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            INR
          </span>
        </div>
        {formik.touched.reward_amount && formik.errors.reward_amount && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.reward_amount}</span>
        )}
      </div>

      {/* Not Paid Limit Installment */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Not Paid Limit Installment<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="not_paid_installment"
            onWheel={(e) => e.target.blur()}
            value={formik.values.not_paid_installment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Not Paid Installment"
          />
        </div>
        {formik.touched.not_paid_installment && formik.errors.not_paid_installment && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.not_paid_installment}</span>
        )}
      </div>

      {/* Convenience Fee */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Convenience Fee<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="convenience_fee"
            onWheel={(e) => e.target.blur()}
            value={formik.values.convenience_fee}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Convenience Fee"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.convenience_fee && formik.errors.convenience_fee && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.convenience_fee}</span>
        )}
      </div>

      {/* Fine Amount */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Fine Amount<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="fine_amount"
            onWheel={(e) => e.target.blur()}
            value={formik.values.fine_amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Fine Amount"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            INR
          </span>
        </div>
        {formik.touched.fine_amount && formik.errors.fine_amount && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.fine_amount}</span>
        )}
      </div>

      {/* Cumulative Fine Amount */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Cumulative Fine Amount<span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="cumulative_fine_amount"
            onWheel={(e) => e.target.blur()}
            value={formik.values.cumulative_fine_amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Cumulative Fine Amount"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            INR
          </span>
        </div>
        {formik.touched.cumulative_fine_amount && formik.errors.cumulative_fine_amount && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.cumulative_fine_amount}</span>
        )}
      </div>

      {/* Display Referral */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Display Referral<span className="text-red-400"> *</span>
        </label>
        <div className="flex flex-row border border-gray-300 rounded-lg overflow-hidden w-32 h-10 items-center">
          <div
            onClick={() => formik.setFieldValue("display_referral", true)}
            className={`${
              formik.values.display_referral
                ? "text-white"
                : "bg-white text-[#888888]"
            } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
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
            } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
            style={{ backgroundColor: layout_color }}
          >
            No
          </div>
        </div>
        {formik.touched.display_referral && formik.errors.display_referral && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.display_referral}</span>
        )}
      </div>

      {/* Display Weight In Ledger */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Display Weight In Ledger<span className="text-red-400"> *</span>
        </label>
        <div className="flex flex-row border border-gray-300 rounded-lg overflow-hidden w-32 h-10 items-center">
          <div
            onClick={() => formik.setFieldValue("display_weight_in_ledger", true)}
            className={`${
              formik.values.display_weight_in_ledger
                ? "text-white"
                : "bg-white text-[#888888]"
            } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
            style={{ backgroundColor: layout_color }}
          >
            Yes
          </div>
          <div className="w-px bg-gray-300" />
          <div
            onClick={() => formik.setFieldValue("display_weight_in_ledger", false)}
            className={`${
              !formik.values.display_weight_in_ledger
                ? "text-white"
                : "bg-white text-[#888888]"
            } p-3 w-full cursor-pointer transition-colors duration-200 text-center`}
            style={{ backgroundColor: layout_color }}
          >
            No
          </div>
        </div>
        {formik.touched.display_weight_in_ledger && formik.errors.display_weight_in_ledger && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.display_weight_in_ledger}</span>
        )}
      </div>
    </div>
  );
};

export default AdvancedSettings;