import React from "react";
import Select from "react-select";

const PayableDetails = ({ formik, scheme_type, layout_color, gstTypeData, wastageType }) => {
  // Options for react-select dropdowns
  const gstTypeOptions = gstTypeData.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const wastageOptions = wastageType.map((data) => ({
    value: data.id,
    label: data.name,
  }));

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      {(scheme_type < 3) && (
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
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              INR
            </span>
          </div>
          {formik.touched.amount && formik.errors.amount && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.amount}</span>
          )}
        </div>
      )}

      {(scheme_type >= 4 || scheme_type <= 10) && (
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
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              INR
            </span>
          </div>
          {formik.touched.min_amount && formik.errors.min_amount && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.min_amount}</span>
          )}
        </div>
      )}

      {(scheme_type >= 4 || scheme_type <= 10) && (
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
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              INR
            </span>
          </div>
          {formik.touched.max_amount && formik.errors.max_amount && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.max_amount}</span>
          )}
        </div>
      )}

      {(scheme_type === 3) && (
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Min Weight <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="min_weight"
              value={formik.values.min_weight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Min Weight"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              GRM
            </span>
          </div>
          {formik.touched.min_weight && formik.errors.min_weight && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.min_weight}</span>
          )}
        </div>
      )}

      {(scheme_type === 3) && (
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Max Weight <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="max_weight"
              value={formik.values.max_weight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Max Weight"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              GRM
            </span>
          </div>
          {formik.touched.max_weight && formik.errors.max_weight && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.max_weight}</span>
          )}
        </div>
      )}

      <div className="flex flex-col lg:mt-2">
        <label className="text-black mb-2 font-normal">
          Buy GST
        </label>
        <div className="relative">
          <input
            type="number"
            name="buy_gst"
            value={formik.values.buy_gst}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Buy GST"
          />
          <span
            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
            style={{ backgroundColor: layout_color }}
          >
            %
          </span>
        </div>
        {formik.touched.buy_gst && formik.errors.buy_gst && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.buy_gst}</span>
        )}
      </div>

      <div className="flex flex-col lg:mt-2">
        <label className="text-black mb-1 font-medium">
          Buy GST Type
        </label>
        <div className="relative">
          <select
            name="buytgsttype"
            value={formik.values.buytgsttype}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="cursor-pointer appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
          >
            <option value="" className="text-gray-700">
              --Select--
            </option>
            {gstTypeData.map((type) => (
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
        {formik.touched.buytgsttype && formik.errors.buytgsttype && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.buytgsttype}</span>
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
        />
        {formik.touched.min_installments && formik.errors.min_installments && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.min_installments}</span>
        )}
      </div>

      <div className="flex flex-col lg:mt-2">
        <label className="text-black mb-1 font-medium">
          Benefit Wastage
        </label>
        <div className="relative">
          <select
            name="wastagebenefit"
            value={formik.values.wastagebenefit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="cursor-pointer appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700"
          >
            <option value="" className="text-gray-700">
              --Select--
            </option>
            {wastageType.map((data) => (
              <option key={data._id} value={data.id}>
                {data.name}
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
        {formik.touched.wastagebenefit && formik.errors.wastagebenefit && (
          <span className="text-red-500 text-sm mt-1">{formik.errors.wastagebenefit}</span>
        )}
      </div>
    </div>
  );
};

export default PayableDetails;