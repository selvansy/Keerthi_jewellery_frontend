import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { CalendarDays, Plus, Minus, SquarePen } from "lucide-react";
import { getSchemeClassifications,allinstallmenttype,getallbranch,getallmetal,getallschemetypes,getschemeById
    ,allFundtype,addscheme,updateScheme,puritybymetal,buygsttype,wastagetype,getBranchById
} from "../../../api/Endpoints";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PayableDetails from "./PayableDetails";
import FundDetails from "./FundDetails";
import PaymentDetails from "./PaymentDetails";
import AdvancedSettings from "./AdvancedSettings";
import CustomerDetails from "./CustomerDetails";
import AgentDetails from "./AgentDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import { useAsyncError, useNavigate ,useParams} from "react-router-dom";
import { useSelector } from "react-redux";

const SchemeForm = () => {
   const navigate = useNavigate();

   let {id} = useParams();

   //reduux
   const roleData = useSelector((state) => state.clientForm.roledata);
   const id_branch = roleData?.id_branch;
   const accessBranch = roleData?.branch;

  const formik = useFormik({
    initialValues: {
      // SchemeForm fields
      schemeName: "",
      schemeCode: "",
      metalType: null,
      id_classification: "",
      purity: null,
      instalmentType: null,
      maturityMonth: "",
      schemeType: null,
      totalCount: null,
      incrementRate: null,
      start: null,

      // PayableDetails fields
      amount: "",
      min_amount: "",
      max_amount: "",
      min_weight: "",
      max_weight: "",
      buy_gst: "",
      buytgsttype: "",
      wastagebenefit: "",

      // FundDetails fields
      min_fund: "",
      max_fund: "",

      // PaymentDetails fields
      first_paid_percentage: "",
      second_paid_percentage: "",

      // AdvancedSettings fields
      limit_installment: "",
      pending_due_installment: "",
    },
    validationSchema: Yup.object({
      // SchemeForm validation
      schemeName: Yup.string().required("Scheme name is required"),
      schemeCode: Yup.string().required("Scheme code is required"),
      metalType: Yup.object().required("Metal type is required"),
      id_classification: Yup.string().required("Classification is required"),
      purity: Yup.string().required("Purity is required"),
      instalmentType: Yup.object().required("Instalment type is required"),
      maturityMonth: Yup.date().required("Maturity month is required"),
      schemeType: Yup.object().required("Scheme type is required"),
      totalCount: Yup.number().required("Total count is required"),
      incrementRate: Yup.number().required("Increment rate is required"),
      start: Yup.number().required("Start amount is required"),

      // PayableDetails validation
      amount: Yup.number().when("schemeType", {
        is: (val) => val && val.value < 3,
        then: Yup.number().required("Amount is required"),
      }),
      min_amount: Yup.number().when("schemeType", {
        is: (val) => val && val.value >= 4,
        then: Yup.number().required("Minimum Amount is required"),
      }),
      max_amount: Yup.number().when("schemeType", {
        is: (val) => val && val.value >= 4,
        then: Yup.number().required("Maximum Amount is required"),
      }),
      min_weight: Yup.number().when("schemeType", {
        is: (val) => val && val.value === 3,
        then: Yup.number().required("Minimum Weight is required"),
      }),
      max_weight: Yup.number().when("schemeType", {
        is: (val) => val && val.value === 3,
        then: Yup.number().required("Maximum Weight is required"),
      }),
      buy_gst: Yup.number().required("Buy GST is required"),
      buytgsttype: Yup.string().required("Buy GST Type is required"),
      wastagebenefit: Yup.string().required("Wastage Benefit is required"),

      // FundDetails validation
      min_fund: Yup.number().required("Min Fund is required"),
      max_fund: Yup.number().required("Max Fund is required"),

      // PaymentDetails validation
      first_paid_percentage: Yup.number().required(
        "First Payment Percentage is required"
      ),
      second_paid_percentage: Yup.number().required(
        "Second Payment Percentage is required"
      ),

      // AdvancedSettings validation
      limit_installment: Yup.number().required("Limit Installment is required"),
      pending_due_installment: Yup.number().required(
        "Pending Due Installment is required"
      ),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  // Customisations for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      border: state.isFocused ? "1px solid black" : "1px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      borderRadius: "0.375rem",
    }),
  };

  // State management
  const [classifications, setClassifications] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [scheme_type, setSchemeType] = useState(0);
  const [branch, setBranch] = useState(() => accessBranch === '0' ? [] : {});
  const [layout_color, setLayoutColor] = useState("#015173");
  const [classType, setClass] = useState(false);
  const [amounts, setAmounts] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  // sample data
  const metalOptions = [
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
  ];

  //query and mutations
  const { data: classificationData } = useQuery({
    queryKey: ["projects"],
    queryFn: getSchemeClassifications,
  });

  const { data: clientBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: getallbranch,
    enabled: accessBranch === "0",
  });

  const { data: employeeBranches } = useQuery({
    queryKey: ["branches",id_branch],
    queryFn:()=> getBranchById(id_branch),
    enabled: accessBranch !== "0",
  });

  //useEffects
  useEffect(() => {
    if (classificationData) {
      const data = classificationData.data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setClassifications(data);
    }
  }, [classificationData]);

  useEffect(() => {
    if (formik.values.incrementRate) {
      const incrementRate = formik.values.incrementRate;
      const start = formik.values.start;
      const totalCount = formik.values.totalCount;
      generateAmounts(totalCount, start, incrementRate);
    }
  }, [
    formik.values.incrementRate,
    formik.values.start,
    formik.values.totalCount,
  ]);

  useEffect(()=>{
    if(clientBranches){
        const data = clientBranches.data.map((item)=>({
            value:item._id,
            label:item.branch_name
        }))
        setBranch(data)
    }
    if(employeeBranches){
        setBranch(employeeBranches?.data)
        formik.setFieldValue("id_branch",employeeBranches?.data?._id)
    }
  },[clientBranches,employeeBranches])
  //handler functions
  const handleFileUpload = (e) => {};

  // Handler for adding new amount
  const handleAddAmount = () => {
    if (newAmount && !amounts.includes(Number(newAmount))) {
      setAmounts([...amounts, Number(newAmount)]);
      setNewAmount("");
    }
  };

  //handler to choose the
  const handleClassChange = (selectedOption) => {
    formik.setFieldValue(
      "id_classification",
      selectedOption ? selectedOption.value : ""
    );
    if (selectedOption.label === "Fixed") {
      setClass(true);
    } else {
      setClass(false);
    }
  };

  const handleEnableEdit = () => {
    setIsEditMode(true);
  };
  

  const handleAmountSelect = (index) => {
    setSelectedAmount(index);
    setEditAmount(amounts[index]);
  };

  const handleAmountChange = (e) => {
    setEditAmount(e.target.value);
  };

  // Handler for saving the edited amount
  const handleSaveAmount = (index) => {
    if (editAmount !== "" && !isNaN(editAmount)) {
      const updatedAmounts = [...amounts];
      updatedAmounts[index] = Number(editAmount);
      setAmounts(updatedAmounts);
    }
    setIsEditMode(false);
    setSelectedAmount(null);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      handleSaveAmount(index);
    }
  };

  //helper function
  const generateAmounts = (totalCount, start, incrementRate) => {
    const generatedAmounts = [];
    let currentAmount = start;

    for (let i = 0; i < totalCount; i++) {
      generatedAmounts.push(currentAmount);
      currentAmount += incrementRate;
    }

    setAmounts(generatedAmounts);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full mx-auto p-6 space-y-6"
    >
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 border-b-2 pb-2">
          Add Scheme
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme name"
              {...formik.getFieldProps("schemeName")}
            />
            {formik.touched.schemeName && formik.errors.schemeName && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.schemeName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme code"
              {...formik.getFieldProps("schemeCode")}
            />
            {formik.touched.schemeCode && formik.errors.schemeCode && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.schemeCode}
              </div>
            )}
          </div>
          {accessBranch === "0" ? (
            <div>
            <label className="block text-sm font-medium mb-1">
              Branches <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={branch}
              placeholder="Select Branch"
              value={branch.find(
                (option) => option.value === formik.values.id_branch
              )}
              onChange={(option) => formik.setFieldValue("id_branch", option)}
            />
            {formik.errors.id_branch && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.id_branch}
              </div>
            )}
          </div>
          ):(
            <div>
            <label className="block text-sm font-medium mb-1">
              Branch <span className="text-red-500">*</span>
            </label>
            <div>{console.log(branch)}</div>
            <input
              type="text"
              readOnly
              value={branch?.branch_name || ""}
              className="w-full border rounded-md px-3 py-2"
            //   {...formik.getFieldProps("id_banch")}
            />
            {formik.errors.id_banch && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.id_banch}
              </div>
            )}
          </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              Metal Type <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={metalOptions}
              placeholder="Select metal type"
              value={formik.values.metalType}
              onChange={(option) => formik.setFieldValue("metalType", option)}
              onBlur={() => formik.setFieldTouched("metalType", true)}
            />
            {formik.touched.metalType && formik.errors.metalType && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.metalType}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Classification <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={classifications}
              placeholder="Select Classification"
              value={classifications.find(
                (option) => option.value === formik.values.id_classification
              )}
              onChange={handleClassChange}
              onBlur={() => formik.setFieldTouched("id_classification", true)}
            />
            {formik.touched.id_classification &&
              formik.errors.id_classification && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.id_classification}
                </div>
              )}
          </div>

          <div className="relative w-full">
            <label className="block text-sm font-medium mb-1">
              Maturity Month <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={formik.values.maturityMonth}
              onChange={(date) => formik.setFieldValue("maturityMonth", date)}
              onBlur={formik.handleBlur}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black"
              placeholderText="Select maturity month"
              wrapperClassName="w-full"
            />
            <CalendarDays
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              size={20}
            />
            {formik.touched.maturityMonth && formik.errors.maturityMonth && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.maturityMonth}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Installment Type <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={classifications}
              placeholder="Select Classification"
              value={formik.values.instalmentType}
              onChange={(option) =>
                formik.setFieldValue("instalmentType", option)
              }
              onBlur={() => formik.setFieldTouched("instalmentType", true)}
            />
            {formik.touched.instalmentType && formik.errors.instalmentType && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.instalmentType}
              </div>
            )}
          </div>
        </div>
        {classType && (
          <div className="grid grid-cols-3 gap-4 w-full mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Total count of amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter total count"
                {...formik.getFieldProps("totalCount")}
              />
              {formik.touched.totalCount && formik.errors.totalCount && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.totalCount}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Start <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter start amount"
                {...formik.getFieldProps("start")}
              />
              {formik.touched.start && formik.errors.start && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.start}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Increment Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter increment rate"
                onChange={generateAmounts}
                {...formik.getFieldProps("incrementRate")}
              />
              {formik.touched.incrementRate && formik.errors.incrementRate && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.incrementRate}
                </div>
              )}
            </div>
          </div>
        )}
        {classType && (
          <div className="mt-6 bg-[#f5f5f5] p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Amount List</h3>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-md"
                onClick={handleEnableEdit}
                disabled={isEditMode}
              >
                <SquarePen
                  size={20}
                  className={isEditMode ? "text-gray-400" : ""}
                />
              </button>
            </div>
            <div className="flex flex-row justify-start">
              <div className="flex gap-3 mb-4">
                <input
                  type="number"
                  placeholder="Add Amount"
                  className="flex-1 border rounded-md px-3 py-2"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 bg-[#d8d8d8] rounded-md hover:bg-gray-200"
                  onClick={handleAddAmount}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {amounts
                .sort((a, b) => a - b)
                .map((amount, index) => (
                  <div key={index} className="mb-2">
                    {isEditMode && selectedAmount === index ? (
                      <input
                        type="number"
                        className="px-4 py-2 border rounded-md w-20"
                        value={editAmount}
                        onChange={handleAmountChange}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onBlur={() => handleSaveAmount(index)}
                        autoFocus
                      />
                    ) : (
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md ${
                          selectedAmount === index
                            ? "bg-blue-900 text-white"
                            : "bg-white border hover:bg-gray-50"
                        }`}
                        onClick={() => handleAmountSelect(index)}
                      >
                        {amount.toLocaleString()}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="payable" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Payable Details
            {({ isOpen }) =>
              isOpen ? <Minus size={20} /> : <Plus size={20} />
            }
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <PayableDetails
              formik={formik}
              scheme_type={scheme_type}
              layout_color={layout_color}
              gstTypeData={[]}
              wastageType={[]}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fund" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Fund Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <FundDetails formik={formik} layout_color={layout_color} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Payment Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <PaymentDetails formik={formik} layout_color={layout_color} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customer" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Customer Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <CustomerDetails formik={formik} layout_color={layout_color} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customer" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Agent Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <AgentDetails formik={formik} layout_color={layout_color} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Advanced Settings
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <AdvancedSettings formik={formik} layout_color={layout_color} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
          onClick={() => formik.resetForm()}
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SchemeForm;
