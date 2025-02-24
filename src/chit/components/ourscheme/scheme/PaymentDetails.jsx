import React from "react";
import Select from "react-select";

const PaymentDetails = ({ formik, layout_color }) => {
  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      {/* First Payment Percentage */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          First Payment Percentage <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="first_paid_percentage"
            value={formik.values.first_paid_percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter First Payment Percentage"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.first_paid_percentage && formik.errors.first_paid_percentage && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.first_paid_percentage}</span>
        )}
      </div>

      {/* Second Payment Percentage */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Second Payment Percentage <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="second_paid_percentage"
            value={formik.values.second_paid_percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Second Payment Percentage"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.second_paid_percentage && formik.errors.second_paid_percentage && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.second_paid_percentage}</span>
        )}
      </div>

      {/* Third Payment Percentage */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Third Payment Percentage <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="third_paid_percentage"
            value={formik.values.third_paid_percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Third Payment Percentage"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.third_paid_percentage && formik.errors.third_paid_percentage && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.third_paid_percentage}</span>
        )}
      </div>

      {/* Fourth Payment Percentage */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Fourth Payment Percentage <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="fourth_paid_percentage"
            value={formik.values.fourth_paid_percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Fourth Payment Percentage"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.fourth_paid_percentage && formik.errors.fourth_paid_percentage && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.fourth_paid_percentage}</span>
        )}
      </div>

      {/* Fifth Payment Percentage */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Fifth Payment Percentage <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="fifth_paid_percentage"
            value={formik.values.fifth_paid_percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Fifth Payment Percentage"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.fifth_paid_percentage && formik.errors.fifth_paid_percentage && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.fifth_paid_percentage}</span>
        )}
      </div>

      {/* First Payment Below Days */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          First Payment Below Days <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="first_paid_belowdays"
            value={formik.values.first_paid_belowdays}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter First Payment Below Days"
          />
        </div>
        {formik.touched.first_paid_belowdays && formik.errors.first_paid_belowdays && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.first_paid_belowdays}</span>
        )}
      </div>

      {/* Second Payment Below Days */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Second Payment Below Days <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="second_paid_belowdays"
            value={formik.values.second_paid_belowdays}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Second Payment Below Days"
          />
        </div>
        {formik.touched.second_paid_belowdays && formik.errors.second_paid_belowdays && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.second_paid_belowdays}</span>
        )}
      </div>

      {/* Third Payment Below Days */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Third Payment Below Days <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="third_paid_belowdays"
            value={formik.values.third_paid_belowdays}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Third Payment Below Days"
          />
        </div>
        {formik.touched.third_paid_belowdays && formik.errors.third_paid_belowdays && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.third_paid_belowdays}</span>
        )}
      </div>

      {/* Fourth Payment Below Days */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Fourth Payment Below Days <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="fourth_paid_belowdays"
            value={formik.values.fourth_paid_belowdays}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Fourth Payment Below Days"
          />
        </div>
        {formik.touched.fourth_paid_belowdays && formik.errors.fourth_paid_belowdays && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.fourth_paid_belowdays}</span>
        )}
      </div>

      {/* Fifth Payment Below Days */}
      <div className="flex flex-col mt-2">
        <label className="text-black mb-2 font-normal">
          Fifth Payment Below Days <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="fifth_paid_belowdays"
            value={formik.values.fifth_paid_belowdays}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Fifth Payment Below Days"
          />
        </div>
        {formik.touched.fifth_paid_belowdays && formik.errors.fifth_paid_belowdays && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.fifth_paid_belowdays}</span>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;