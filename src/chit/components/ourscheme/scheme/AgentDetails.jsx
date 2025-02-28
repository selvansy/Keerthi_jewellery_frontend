import React, { useState } from "react";
import ToggleSwitch from "../../common/ToggleSwitch";

const AgentDetails = ({ formik,layout_color}) => {

 const handleToggle =()=>{
    if(formik.values.agent_restriction){
      formik.setFieldValue('agent_restriction',false)
    }else{
      formik.setFieldValue('agent_restriction',true)
    }
 }
 

  return (
    <div className="grid grid-rows-2 md:grid-cols-2 gap-5">
        <div className="flex flex-col mt-2">
          <label className="text-black mb-2 font-normal">
            Agent Referral 
          </label>
          <div className="relative">
            <input
              type="number"
              name="agent_referral"
              value={formik.values.agent_referral}
              onWheel={(e) => e.target.blur()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Agent Referral"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
          </div>
          {formik.touched.agent_referral && formik.errors.agent_referral && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.agent_referral}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Agent Incentive 
          </label>
          <div className="relative">
            <input
              type="number"
              name="agent_incentive"
              value={formik.values.agent_incentive}
              onChange={formik.handleChange}
              onWheel={(e) => e.target.blur()}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Incentive Rate"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
          </div>
          {formik.touched.agent_incentive && formik.errors.agent_incentive && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.agent_incentive}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Agent Restriction 
          </label>
          <ToggleSwitch
          status={formik.values.agent_restriction}
          layout_color={layout_color}
          toggle_status={handleToggle}
          />
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Remarks 
          </label>
          <div className="relative">
            <input
              type="text"
              name="cus_remarks"
              value={formik.values.cus_remarks}
              onChange={formik.handleChange}
              onWheel={(e) => e.target.blur()}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Remark"
            />
          </div>
          {formik.touched.cus_remarks && formik.errors.cus_remarks && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.cus_remarks}</span>
          )}
        </div>
        {formik.values.agent_restriction && (
            <>
            <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Agent Target 
          </label>
          <div className="relative">
            <input
              type="number"
              name="agent_target"
              value={formik.values.agent_target}
              onChange={formik.handleChange}
              onWheel={(e) => e.target.blur()}
              onBlur={formik.handleBlur}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Agent Target"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
          </div>
          {formik.touched.agent_target && formik.errors.agent_target && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.agent_target}</span>
          )}
        </div>
        <div className="flex flex-col lg:mt-2">
          <label className="text-black mb-2 font-normal">
            Partial Commission 
          </label>
          <div className="relative">
            <input
              type="number"
              name="partial_commission"
              value={formik.values.partial_commission}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onWheel={(e) => e.target.blur()}
              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter Partial commission"
            />
            <span
              className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
            >
              %
            </span>
          </div>
          {formik.touched.partial_commission && formik.errors.partial_commission && (
            <span className="text-red-500 text-sm mt-1">{formik.errors.partial_commission}</span>
          )}
        </div>
            </>
        )}
    </div>
  );
};

export default AgentDetails;