import React, { useState, useEffect } from "react";
import Select from "react-select";
import { graceType } from "../../../../utils/Constants";
import ToggleSwitch from "../../common/ToggleSwitch";

const Grace = ({ formik, layout_color, maturity_period }) => {
  const [fine, setFine] = useState(false);

  const graceData = graceType.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleToggle = () => {
    setFine(!fine);
  };

  const validateGracePeriod = () => {
    const isMonthWise = formik.values.grace_type === "month";
    const gracePeriod = Number(formik.values.grace_period);

    if (gracePeriod > maturity_period) {
      return `Grace period cannot be more than ${maturity_period} ${
        isMonthWise ? "months" : "days"
      }.`;
    }
    return "";
  };

  // Validate when maturity_period or grace_type changes
  useEffect(() => {
    if (formik.values.grace_period) {
      const error = validateGracePeriod();
      formik.setFieldError("grace_period", error);
      formik.setFieldTouched("grace_period", Boolean(error));
    }
  }, [maturity_period, formik.values.grace_type]);

  // Validate on component mount
  useEffect(() => {
    if (formik.values.grace_period) {
      const error = validateGracePeriod();
      formik.setFieldError("grace_period", error);
    }
  }, []);

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300">
      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1 mt-2">
          Grace Type<span className="text-red-500">*</span>
        </label>
        <Select
          options={graceData}
          isClearable={true}
          placeholder="Select grace type"
          value={
            graceData.find(
              (option) => option.value === formik.values.grace_type
            ) || null
          }
          onChange={(option) => {
            formik.setFieldValue("grace_type", option ? option.value : "");
            setTimeout(() => {
              const error = validateGracePeriod();
              formik.setFieldError("grace_period", error);
              formik.setFieldTouched("grace_period", true);
            }, 0);
          }}
          onBlur={() => formik.setFieldTouched("grace_type", true)}
        />
        {formik.touched.grace_type && formik.errors.grace_type && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.grace_type}
          </div>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1 mt-2">
          Grace Period <span className="text-red-400"> *</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="grace_period"
            value={formik.values.grace_period}
            onChange={(e) => {
              formik.handleChange(e);
              const error = validateGracePeriod();
              formik.setFieldError("grace_period", error);
              formik.setFieldTouched("grace_period", true);
            }}
            onBlur={formik.handleBlur}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Grace Period"
          />
        </div>
        {formik.touched.grace_period && formik.errors.grace_period && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.grace_period}
          </span>
        )}
      </div>

      <div className="flex flex-col lg:mt-2">
        <label className="text-black mb-2 font-normal">
          Fine amount <span className="text-red-400"> *</span>
        </label>
        <ToggleSwitch
          status={fine}
          layout_color={layout_color}
          toggle_status={handleToggle}
        />
      </div>

      {fine && (
        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium mb-1 mt-2">
            Fine Amount <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="grace_fine"
              value={formik.values.grace_fine}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Grace Fine Amount"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
          </div>
          {formik.touched.grace_fine && formik.errors.grace_fine && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.grace_fine}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Grace;