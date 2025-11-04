import React, { useState, useEffect } from "react";
import {
  rewardType,
  commissionTriggerType,
  referralCommissionType,
} from "../../../../utils/Constants";
import Select from "react-select";

export const customStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "42px", //42px
    backgroundColor: "white",
    color: "#232323",
    // fontWeight:600,
    border: state.isFocused ? "1px solid #f2f2f9" : "1px solid #f2f2f9",
    boxShadow: state.isFocused ? "0 0 0 1px #004181" : "none",
    borderRadius: "0.5rem",
    "&:hover": {
      color: "#e2e8f0",
    },
    pointerEvents: !isReadOnly ? "none" : "auto",
    opacity: !isReadOnly ? 1 : 1,
    cursor: isReadOnly ? "pointer" : "default",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6C7086",
    // fontWeight: "thin",
    fontSize: "14px",
    // fontStyle: "bold",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#232323",
    fontSize: "14px",
    "&:hover": {
      color: "#232323",
    },
  }),
  input: (base) => ({
    ...base,
    "input[type='text']:focus": { boxShadow: "none" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#F0F7FE"
      : state.isFocused
      ? "#F0F7FE"
      : "white",
    color: "#232323",
    fontWeight: "500",
    fontSize: "14px",
  }),
});

const AdvancedSettings = ({ formik, layout_color, installment_type }) => {
  const header = ["0", "Monthly", "Weekly", "Daily", "Yearly"];
  const [reward, setReward] = useState([]);
  const [commissionTrigger,setCommissionTriggerType] = useState([])
  const [referralCommission,setReferralCommission] = useState([])

  useEffect(() => {
    const data = rewardType.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setReward(data);

    const commissionData =  commissionTriggerType.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setCommissionTriggerType(commissionData);

    const referralType =  referralCommissionType.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setReferralCommission(referralType);
  }, [rewardType,commissionTriggerType,referralCommissionType]);

  return (
    <>
      <div className="grid grid-rows-2 md:grid-cols-3 gap-5">
        {/* Monthly Limit Installment */}
        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium mb-1">
            {!installment_type
              ? "Monthly Installment Limit"
              : `${header[installment_type]} Limit Installment`}{" "}
            <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="limit_installment"
              onWheel={(e) => e.target.blur()}
              value={formik.values.limit_installment}
              // onChange={formik.handleChange}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10) || "";
                const totalInstallments = formik.values.total_installments || "";

                if (value > totalInstallments) {
                  formik.setFieldError(
                    "limit_installment",
                    `Installment cannot exceed total installments ${totalInstallments}`
                  );
                } else {
                  formik.setFieldValue("limit_installment", value);
                  formik.setFieldError("limit_installment", "");
                }
              }}
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
          {formik.touched.limit_customer && formik.errors.limit_customer && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.limit_customer}
            </span>
          )}
        </div>

        <div className="flex flex-col mt-2">
          <label className="block text-sm font-medium mb-1">
            Minimum Paid Installment (for gift){" "}
            <span className="text-red-400"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="gift_minimum_paid_installment"
              onWheel={(e) => e.target.blur()}
              value={formik.values.gift_minimum_paid_installment}
              // onChange={formik.handleChange}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10) || "";
                const totalInstallments = formik.values.total_installments || "";

                if (value > totalInstallments) {
                  formik.setFieldError(
                    "gift_minimum_paid_installment",
                    `Installment cannot exceed total installments ${totalInstallments}`
                  );
                } else {
                  formik.setFieldValue("gift_minimum_paid_installment", value);
                  formik.setFieldError("gift_minimum_paid_installment", "");
                }
              }}
              onBlur={formik.handleBlur}
              className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
              placeholder="Enter Paid Installment"
            />
          </div>
          {formik.touched.gift_minimum_paid_installment &&
            formik.errors.gift_minimum_paid_installment && (
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
          {formik.touched.convenience_fees &&
            formik.errors.convenience_fees && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.convenience_fees}
              </span>
            )}
        </div>
      </div>
      <div className="grid md:grid-cols-3 w-full mt-3 gap-x-5">
        <p className="text-md  mb-4 border-b pb-2 mt-3 font-medium col-span-3">
          Referral
        </p>
        {/* <div className="flex flex-col mt-2">
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
      </div> */}
        <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1">
            Commission Trigger Type
          </label>
          <Select
                styles={{
                  ...customStyles(true),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                options={commissionTrigger || []}
                isClearable={true}
                placeholder= "Commission Trigger"
                value={commissionTrigger.find(
                  (option) => option.value === formik.values.referralTriggerType
                )}
                onChange={(option) =>
                  formik.setFieldValue("referralTriggerType", option ? option.value : "")
                }
                onBlur={() => formik.setFieldTouched("referralTriggerType", true)}
                menuPortalTarget={document.body}
              />
        </div>

        <div className="flex flex-col mt-2">
        <label className="block text-sm font-medium mb-1">
            Referral Commission Type
          </label>
          <Select
                styles={{
                  ...customStyles(true),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                options={referralCommission || []}
                isClearable={true}
                placeholder= "Referral Commission Type"
                value={referralCommission.find(
                  (option) => option.value === formik.values.commissionType
                )}
                isDisabled={!formik.values.referralTriggerType}
                onChange={(option) =>{
                  formik.setFieldValue("commissionType", option ? option.value : "");
                  formik.setFieldValue("referralAmount","");
                  formik.setFieldValue("referralPercentage","")
                 } }
                onBlur={() => formik.setFieldTouched("commissionType", true)}
                menuPortalTarget={document.body}
              />
        </div>

        {formik.values.commissionType !== 1 ? (
        <div className="">
       <label className="block text-sm font-medium mb-1 mt-2">
         Benefit Bonus Amount
        </label>
        <div className="relative">
        <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                ₹
              </span>
          <input
            type="number"
            name="referralAmount"
            onWheel={(e) => e.target.blur()}
            value={formik.values.referralAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border-[1px] border-[#f2f3f8] pl-10 rounded-md px-3 py-2"
            placeholder="Enter referral amount"
          />
        </div>
        {formik.touched.referralAmount && formik.errors.referralAmount && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.referralAmount}
          </span>
        )}
      </div>
      ):(
        <div className="">
          <label className="block text-sm font-medium mb-1 mt-2">
        Benefit  Bonus Percentage
        </label>
        <div className="relative">
          <input
            type="number"
            max={100}
            name="referralPercentage"
            onWheel={(e) => e.target.blur()}
            value={formik.values.referralPercentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
            placeholder="Enter Bonus Percent"
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
      )}

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
          {formik.touched.display_referral &&
            formik.errors.display_referral && (
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
