import React, { useEffect, useState } from "react";
import Select from "react-select";
import { benefiMakingCharge, rewardType } from "../../../../utils/Constants";
import { formatNumber } from "../../../utils/commonFunction";

const PayableDetails = ({
  formik,
  layout_color,
  wastagedata,
  classType,
  scheme_type,
  customStyle,
}) => {
  const [benefitMaking, setMaking] = useState([]);

  const header = ["0", "Monthly", "Weekly", "Daily", "Yearly"];
  const [reward, setReward] = useState([]);

  useEffect(() => {
    const data = rewardType.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setReward(data);
  }, [rewardType]);

  useEffect(() => {
    const data = benefiMakingCharge.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setMaking(data);
  }, [benefiMakingCharge]);

  const inputHeight = "42px";

  const isSpecialSchemeType = [12, 3, 4].includes(scheme_type);

  const showWeightFields = !classType && isSpecialSchemeType;
  const showAmountFields = !classType && !isSpecialSchemeType;

  return (
    <div className="grid grid-rows-2 md:grid-cols-3 lg:grid-col-3 gap-5 text-[#232323]">
      {showWeightFields ? (
        <>
          <div className="flex flex-col lg:mt-2">
          <label className="block text-sm font-medium mb-1">
              Min Weight <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="min_weight"
                value={formik.values.min_weight}
                onChange={formik.handleChange}
                onWheel={(e) => e.target.blur()}
                onBlur={formik.handleBlur}
                className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter Min Weight"
                style={{ height: inputHeight }}
              />
              <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
                Gm
              </span>
            </div>
            {formik.touched.min_weight && formik.errors.min_weight && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.min_weight}
              </span>
            )}
          </div>
          <div className="flex flex-col lg:mt-2">
          <label className="block text-sm font-medium mb-1">
              Max Weight <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="max_weight"
                value={formik.values.max_weight}
                onWheel={(e) => e.target.blur()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter Max Weight"
                style={{ height: inputHeight }}
              />
               <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
                Gm
              </span>
              {/* <span
                className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                style={{ backgroundColor: layout_color }}
              >
                GRM
              </span> */}
            </div>
            {formik.touched.max_weight && formik.errors.max_weight && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.max_weight}
              </span>
            )}
          </div>
        </>
      ) : showAmountFields ? (
        <>
          <div className="flex flex-col lg:mt-2">
            <label className="block text-sm font-medium mb-1">
              Min Amount <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                ₹
              </span>
              <input
                type="number"
                name="min_amount"
                value={formik.values.min_amount}
                onChange={(e) => {
                  if (e.target.value.length <= 11) {
                    // focus:ring-1 custom-height focus:ring-[#004181] outline-none
                    formik.handleChange(e);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                onBlur={formik.handleBlur}
                className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full text-start pl-10 focus:outline-none focus:ring-1  focus:ring-[#004181]"
                placeholder="Enter Min Amount"
                style={{ height: inputHeight }}
              />
            </div>
            {formik.touched.min_amount && formik.errors.min_amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.min_amount}
              </span>
            )}
          </div>
          <div className="flex flex-col lg:mt-2">
            <label className="block text-sm font-medium mb-1">
              Max Amount <span className="text-red-400"> *</span>
            </label>
            <div className="relative">
              <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                ₹
              </span>
              <input
                type="number"
                name="max_amount"
                value={formik.values.max_amount}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  if (e.target.value.length <= 11) {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                className="border-[1px] border-[#f2f3f8] rounded-md w-full pl-10  focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
                placeholder="Enter Max Amount"
                style={{ height: inputHeight }}
              />
            </div>
            {formik.touched.max_amount && formik.errors.max_amount && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.max_amount}
              </span>
            )}
          </div>
        </>
      ) : (
        // Empty placeholders to maintain grid layout when neither weight nor amount fields are shown
        <>
          {/* <div></div>
        <div></div> */}
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 mt-2">
          Benefit Wastage<span className="text-red-500">*</span>
        </label>
        <Select
          styles={{
            ...customStyle(true),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          options={wastagedata || []}
          placeholder="Select wastage type"
          isClearable={true}
          value={
            wastagedata.find(
              (option) => option.value === formik.values.wastagebenefit
            ) || null
          }
          onChange={(option) => {
            formik.setFieldValue(
              "wastagebenefit",
              option ? option.value : null
            );
            formik.setFieldTouched("wastagebenefit", true, false);
          }}
          onBlur={() => formik.setFieldTouched("wastagebenefit", true)}
          onMenuClose={() => formik.setFieldTouched("wastagebenefit", true)}
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
        {formik.touched.wastagebenefit && formik.errors.wastagebenefit && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.wastagebenefit}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 mt-2">
          Benefit Making Charge<span className="text-red-500">*</span>
        </label>
        <Select
          styles={{
            ...customStyle(true),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          options={benefitMaking || []}
          placeholder="Select benefit making charge"
          isClearable={true}
          value={
            benefitMaking.find(
              (option) => option.value === formik.values.benefit_making
            ) || ""
          }
          onChange={(option) =>
            formik.setFieldValue("benefit_making", option ? option.value : "")
          }
          onBlur={() => formik.setFieldTouched("benefit_making", true)}
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />

        {formik.touched.benefit_making && formik.errors.benefit_making && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.benefit_making}
          </div>
        )}
      </div>

      <div>
      <label className="block text-sm font-medium mb-1 mt-2">
          Bonus Type
        </label>
        <Select
          styles={{
            ...(typeof customStyle === "function" ? customStyle(true) : {}),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
          menuPortalTarget={document.body}
          isClearable
          options={reward ?? []} 
          placeholder="Select bonus type"
          value={
            reward?.find(
              (option) => option.value === formik.values.bonus_type
            ) || ""
          }
          onChange={(option) =>
            formik.setFieldValue("bonus_type", option?.value ?? "")
          }
          onBlur={() => formik.setFieldTouched("bonus_type", true)}
        />
        {formik.touched.bonus_type && formik.errors.bonus_type && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.bonus_type}
          </div>
        )}
      </div>

      {formik.values.bonus_type !== 2 ? (
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
            name="bonus_amount"
            onWheel={(e) => e.target.blur()}
            value={formik.values.bonus_amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border-[1px] border-[#f2f3f8] pl-10 rounded-md px-3 py-2"
            placeholder="Enter bonus amount"
          />
        </div>
        {formik.touched.bonus_amount && formik.errors.bonus_amount && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.bonus_amount}
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
            name="bonus_percent"
            onWheel={(e) => e.target.blur()}
            value={formik.values.bonus_percent}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
            placeholder="Enter Bonus Percent"
          />
           <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-l">
            %
          </span>
        </div>
        {formik.touched.bonus_percent && formik.errors.bonus_percent && (
          <span className="text-red-500 text-sm mt-1">
            {formik.errors.bonus_percent}
          </span>
        )}
      </div>
      )}

      <div className="flex flex-col lg:mt-2">
        <label className="block text-sm font-medium mb-1">
         Minimum Installment For Benefit
        </label>
        <input
          type="number"
          name="benefit_min_installment_wst_mkg"
          value={formik.values.benefit_min_installment_wst_mkg}
          onWheel={(e) => e.target.blur()}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] focus:border-transparent"
          placeholder="Enter Min Installments"
          style={{ height: inputHeight }}
        />
        {formik.touched.benefit_min_installment_wst_mkg &&
          formik.errors.benefit_min_installment_wst_mkg && (
            <span className="text-red-500 text-sm mt-1">
              {formik.errors.benefit_min_installment_wst_mkg}
            </span>
          )}
      </div>
    </div>
  );
};

export default PayableDetails;
