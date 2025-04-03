import Select from "react-select";
import { graceType } from "../../../../utils/Constants";
import ToggleSwitch from "../../common/ToggleSwitch";
import { useState } from "react";

const Grace = ({ formik, layout_color, maturity_period }) => {
  const [spanText, setSpan] = useState("");
  const [validation, setValidation] = useState({});

  const graceData = graceType.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleToggle = () => {
    if (formik.values.grace_fine_amount) {
      formik.setFieldValue("grace_fine_amount", false);
    } else {
      formik.setFieldValue("grace_fine_amount", true);
    }
  };

  const validateGracePeriod = (value) => {
    if (!value) return "";

    const gracePeriod = Number(value);
    if (gracePeriod > maturity_period) {
      return `Grace period must be less than or equal to maturity date`;
    }
    return "";
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      border: state.isFocused ? "1px solid black" : "1px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5">
      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1 mt-2">
          Grace Type
        </label>
        <Select
          styles={customStyles}
          options={graceData}
          isClearable={true} // Allows clearing selection
          menuPortalTarget={document.body}
          placeholder="Select grace type"
          value={
            graceData.find(
              (option) => option.value === formik.values.grace_type
            ) || null
          }
          onChange={(option) => {
            if (option) {
              formik.setFieldValue("grace_type", option.value);
              setSpan(option.label);
            } else {
              formik.setFieldValue("grace_type", null);
              setSpan("");
            }
          }}
        />
        {formik.touched.grace_type && formik.errors.grace_type && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.grace_type}
          </div>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1 mt-2">
          Grace Period
        </label>
        <div className="relative">
          <input
            type="number"
            name="grace_period"
            max={336}
            value={formik.values.grace_period}
            onChange={(e) => {
              let value = e.target.value;
              if (value > Number(maturity_period)) {
                formik.setFieldError(
                  "grace_period",
                  "Grace period cannot be greater than maturity period"
                );
              }
              if (value.length > 3) {
                value = value.slice(0, 3);
              }
              if (Number(value) > 336) {
                value = "336";
              }
              formik.setFieldValue("grace_period", value);
            }}
            onWheel={(e) => e.target.blur()}
            onBlur={(e) => {
              formik.handleBlur(e);
              const error = validateGracePeriod(e.target.value);
              formik.setFieldError("grace_period", error);
            }}
            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter Grace Period"
          />
          {spanText && (
            <span
              className="absolute right-0 top-0 h-full w-20 flex items-center justify-center text-md text-white rounded-r-md whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ backgroundColor: layout_color }}
            >
              {spanText}
            </span>
          )}
        </div>
        {formik.touched.grace_period && formik.errors.grace_period && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.grace_period}
          </span>
        )}
      </div>

      <div className="flex flex-col lg:mt-2 mt-2">
        <label className="text-black mb-2 font-medium">Fine amount</label>
        <ToggleSwitch
          status={formik.values.grace_fine_amount}
          layout_color={layout_color}
          toggle_status={handleToggle}
        />
      </div>

      {formik.values.grace_fine_amount && (
        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium mb-1 mt-2">
            Fine Amount
          </label>
          <div className="relative">
            <input
              type="number"
              name="grace_fine"
              min={0}
              max={100}
              maxLength={100}
              value={formik.values.grace_fine}
              onWheel={(e) => e.target.blur()}
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
