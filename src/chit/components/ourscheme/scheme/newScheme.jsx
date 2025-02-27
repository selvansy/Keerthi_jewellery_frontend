import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Plus, Minus, SquarePen } from "lucide-react";
import {
  getSchemeClassifications,
  allinstallmenttype,
  getallbranch,
  getallmetal,
  getallschemetypes,
  getschemeById,
  allFundtype,
  addscheme,
  updateScheme,
  puritybymetal,
  buygsttype,
  wastagetype,
  getBranchById,
  giftissuetype

} from "../../../api/Endpoints";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PayableDetails from "./PayableDetails";
import FundDetails from "./FundDetails";
import PaymentDetails from "./PaymentDetails";
import AdvancedSettings from "./AdvancedSettings";
import CustomerDetails from "./CustomerDetails";
import AgentDetails from "./AgentDetails";
import Classification from "./Classification";
import Grace from "./GracePeriod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SchemeForm = () => {
  const navigate = useNavigate();

  let { id } = useParams();

  //reduux
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const formik = useFormik({
    initialValues: {
      // SchemeForm fields
      schemeName: "",
      schemeCode: "",
      id_classification: "",
      id_metal: "",
      id_purity: "",
      installment_type: "",
      maturity_period: "", // maturityMonth
      scheme_type: null,
      totalCount: null,
      incrementRate: null,
      start: null,
      fixed_amounts:null,

      //classification

      // PayableDetails fields
      amount: "",
      min_amount: "",
      max_amount: "",
      min_weight: "",
      max_weight: "",
      buy_gst: "",
      buygsttype: "",
      wastagebenefit: "",
      wastagetype: "", // no need to pass
      min_installments: "",
      installments: "",

      //grce
      grace_type: "",
      grace_period: "",
      grace_fine: "",

      // FundDetails fields
      min_fund: "",
      max_fund: "",
      saving_type: "",

      //customer referral
      referral_rate: "",
      incentive_rate: "",
      cus_remarks: "",

      //agent referral
      agent_referral: "",
      agent_incentive: "",
      agent_remark: "",
      agent_target: "",
      partial_commission: "",

      // AdvancedSettings fields
      limit_installment: "",
      pending_due_installment: "",
      paid_installment: "",
      scheme_customer_limit: "",
      //gift
      gift_type:1,
      number_of_gifts: 0,

      reward_amount: "",
      reward_percent:'',
      not_paid_installment: "",
      convenience_fee: "",
      fine_amount: "",
      cumulative_fine_amount: "",
      display_referral: false,
      display_weight_in_ledger: false,
    },
    validationSchema: Yup.object({
      // SchemeForm validation
      schemeName: Yup.string()
        .required("Scheme name is required")
        .max(15, "Scheme name cannot exceed 15 characters"),
      schemeCode: Yup.string().required("Scheme code is required"),
      installment_type: Yup.string().required("Installment type is required"),
      id_classification: Yup.string().required("Classification is required"),
      id_purity: Yup.string().required("Purity is required"),
      id_metal: Yup.string().required("Metal is required"),
      maturity_period: Yup.number()
        .typeError("Maturity Period must be a number")
        .required("Maturity Period is required")
        .integer("Maturity Period must be a whole number")
        .positive("Maturity Period must be a positive number")
        .max(336, "Maturity Period cannot exceed 336")
        .test(
          "max-length",
          "Maturity month cannot be more than 3 digits",
          (value) => String(value).length <= 3
        ),
      // schemeType: Yup.object().required("Scheme type is required"),
      totalCount: Yup.number().when("classType", {
        is: true,
        then: (schema) => schema.required("Total count is required"),
      }),

      incrementRate: Yup.number().when("classType", {
        is: true,
        then: (schema) => schema.required("Increment rate is required"),
      }),

      start: Yup.number().when("classType", {
        is: true,
        then: (schema) => schema.required("Start amount is required"),
      }),
      grace_period: Yup.number()
        .typeError("Grace period must be a number")
        .positive("Grace period must be a positive number")
        .when("grace_type", {
          is: (grace_type) => !!grace_type,
          then: Yup.number()
            .required("Grace period is required")
            .test(
              "grace_period_validation",
              "Grace period cannot be greater than maturity period",
              function (grace_period) {
                const { maturity_period } = this.parent;
                return !maturity_period || grace_period <= maturity_period;
              }
            ),
        }),
      // PayableDetails validation
      amount: Yup.number().when("schemeType", {
        is: (val) => val && val.value < 3,
        then: Yup.number().required("Amount is required"),
      }),
      min_amount: Yup.number().when("schemeType", {
        is: (val) => val && val.value >= 4,
        then: Yup.number().optional("Minimum Amount is required"),
      }),
      max_amount: Yup.number().when("schemeType", {
        is: (val) => val && val.value >= 4,
        then: Yup.number().optional("Maximum Amount is required"),
      }),
      min_weight: Yup.number().when("schemeType", {
        is: (val) => val && val.value === 3,
        then: Yup.number().optional("Minimum Weight is required"),
      }),
      max_weight: Yup.number().when("schemeType", {
        is: (val) => val && val.value === 3,
        then: Yup.number().optional("Maximum Weight is required"),
      }),
      buy_gst: Yup.number().optional("Buy GST is required"),
      buytgsttype: Yup.string().optional("Buy GST Type is required"),
      wastagebenefit: Yup.string().optional("Wastage Benefit is required"),

      // FundDetails validation
      min_fund: Yup.number()
        .optional("Min Fund is required")
        .positive("Min fund must be positive"),
      max_fund: Yup.number()
        .optional("Max Fund is required")
        .positive("Max fund must be positive"),
      saving_type: Yup.number().optional("Saving type is required"),

      referral_rate: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      incentive_rate: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      cus_remarks: Yup.string().typeError("Must be a alphabet"),

      agent_referral: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      agent_incentive: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      agent_remark: Yup.string().typeError("Must be a alphabet"),
      agent_target: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      partial_commission: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number")
        .when("agent_target", {
          is: (value) => value && value > 0,
          then: Yup.number().required(
            "Partial commission is required when agent target is set"
          ),
        }),

      // AdvancedSettings validation
      limit_installment: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      pending_due_installment: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      paid_installment: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      scheme_customer_limit: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      number_of_gifts: Yup.number()
        .typeError("Must be a number")
        .nullable()
        .positive("Must be a positive number"),
      reward_amount: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
        reward_percent: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      not_paid_installment: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      convenience_fee: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      fine_amount: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
      cumulative_fine_amount: Yup.number()
        .typeError("Must be a number")
        .positive("Must be a positive number"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      if (classType) {
        formData.append("fixed_amounts", amounts);
      }
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (mainImage) {
        formData.append("main_image", mainImage);
      }
      if (descriptionImage) {
        formData.append("desc_image", descriptionImage);
      }

      console.log(formData);
      if (id) {
        updateEmployeeMutate(formData);
      } else {
        addNewScheme(formData);
      }
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

  console.log(formik.values)

  // State management
  const [classifications, setClassifications] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [metal, setMetal] = useState([]);
  const [purity, setPurity] = useState([]);
  const [layout_color, setLayoutColor] = useState("#015173");
  const [classType, setClass] = useState(false);
  const [amounts, setAmounts] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [installment_data, setInstallment] = useState([]);
  const [funddata, setFundType] = useState([]);
  const [bygstdata, setBuyGst] = useState([]);
  const [wastagedata, setWastageType] = useState([]);
  const [schemeTypeData, setSchemeTypeData] = useState([]);
  const [giftType,setGiftType]= useState([])

  //query and mutations
  const { data: classificationData } = useQuery({
    queryKey: ["projects"],
    queryFn: getSchemeClassifications,
  });

  const { data: branchData } = useQuery({
    queryKey: ["branches", accessBranch, id_branch],
    queryFn: async () => {
      if (accessBranch === "0") {
        return getallbranch();
      }
      return getBranchById(id_branch);
    },
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: metalResponse } = useQuery({
    queryKey: ["branches"],
    queryFn: getallmetal,
  });

  const { data: purityResponse } = useQuery({
    queryKey: ["purity", formik.values.id_metal],
    queryFn: () => puritybymetal(formik.values.id_metal),
    enabled: !!formik.values.id_metal,
  });

  const results = useQueries({
    queries: [
      { queryKey: ["installment_type"], queryFn: allinstallmenttype },
      { queryKey: ["fund_type"], queryFn: allFundtype },
      { queryKey: ["buygsttype"], queryFn: buygsttype },
      { queryKey: ["wastagetype"], queryFn: wastagetype },
      { queryKey: ["schemeTypeApi"], queryFn: getallschemetypes },
      { queryKey: ["giftIssues"],queryFn: giftissuetype,}
    ],
  });

  const [
    installment_type,
    fund_type,
    buy_gst,
    wastage_type,
    scheme_typeResponse,
    giftIssueResponse
  ] = results.map((result) => result.data);

  const { mutate: addNewScheme } = useMutation({
    mutationFn: addscheme,
    onSuccess: (response) => {
      // setIsLoading(false);
      toast.success(response.message);
      navigate("");
    },
    onError: (error) => {
      // setIsLoading(false);
      toast.error(error.response.message);
    },
  });

  //useEffect
  useEffect(() => {
    if (installment_type?.data) {
      const installment_data = installment_type.data.map((item) => ({
        value: item.installment_type,
        label: item.installment_name,
      }));
      setInstallment(installment_data);
    }

    if (fund_type?.data) {
      const fund_data = fund_type.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setFundType(fund_data);
    }

    if (buy_gst?.data) {
      const buy_gst_data = buy_gst.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setBuyGst(buy_gst_data);
    }

    if (wastage_type?.data) {
      const wastage_data = wastage_type.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setWastageType(wastage_data);
    }


    if (scheme_typeResponse?.data) {
      const data = scheme_typeResponse.data.map((item) => ({
        value: item.scheme_type,
        label: item.scheme_typename,
      }));
      setSchemeTypeData(data);
    }

    if(giftIssueResponse){
      const data = giftIssueResponse.data.map((item)=>({
        value:item.id,
        label:item.name
      }))
      setGiftType(data)
    }
  }, [installment_type, fund_type, buy_gst, wastage_type, scheme_typeResponse]);


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

  // useEffect for branches
  useEffect(() => {
    if (!branchData) return;

    if (accessBranch === "0" && branchData.data) {
      const formattedBranches = branchData.data.map((item) => ({
        value: item._id,
        label: item.branch_name,
      }));
      setBranch(formattedBranches);
    } else if (branchData.data) {
      setBranch(branchData.data);
      formik.setFieldValue("id_branch", branchData.data._id);
    }
  }, [branchData, accessBranch]);

  // useEffect for metals
  useEffect(() => {
    if (metalResponse) {
      const data = metalResponse.data.map((item) => ({
        value: item._id,
        label: item.metal_name,
      }));
      setMetal(data);
    }
  }, [metalResponse]);

  // useEffect for purity
  useEffect(() => {
    if (purityResponse) {
      const data = purityResponse.data.map((item) => ({
        value: item._id,
        label: item.purity_name,
      }));
      setPurity(data);
    }
  }, [purityResponse]);

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
    if (selectedOption.label == "Fixed") {
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
              maxLength={15}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme name"
              {...formik.getFieldProps("schemeName")}
            />

            {formik.values.schemeName.length === 15 && (
              <div className="text-red-500 text-sm mt-1">
                Max 15 character allowed
              </div>
            )}
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
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">
                Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={branch?.branch_name || ""}
                className="w-full border rounded-md px-3 py-2"
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
              Classification <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={classifications}
              isClearable={true}
              placeholder="Select Classification"
              value={classifications.find(
                (option) => option.value === formik.values.id_classification || ""
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Type <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={schemeTypeData || []}
              isClearable={true}
              placeholder="Select scheme type"
              value={
                schemeTypeData?.find(
                  (option) => option.value === formik.values.scheme_type
                ) || null
              }
              onChange={(option) =>
                formik.setFieldValue("scheme_type", option?.value || "")
              }
              onBlur={() => formik.setFieldTouched("scheme_type", true)}
            />
            {formik.touched.scheme_type && formik.errors.scheme_type && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.scheme_type}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Metal Type <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              isClearable={true}
              options={metal}
              placeholder="Select metal"
              value={metal.find(
                (option) => option.value === formik.values.id_metal
              )}
              onChange={(option) =>
                formik.setFieldValue("id_metal", option ? option.value : null)
              }
              onBlur={() => formik.setFieldTouched("id_metal", true)}
            />
            {formik.touched.id_metal && formik.errors.id_metal && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.id_metal}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Purity <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={purity || []}
              isClearable={true}
              placeholder="Select purtiy type"
              value={purity.find(
                (option) => option.value === formik.values.id_purity
              )}
              onChange={(option) =>
                formik.setFieldValue("id_purity", option ? option.value : null)
              }
              onBlur={() => formik.setFieldTouched("id_purity", true)}
            />
            {formik.touched.id_purity && formik.errors.id_purity && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.id_purity}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Installment Type <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={installment_data}
              placeholder="Select installment type"
              isClearable={true}
              value={installment_data.find(
                (option) => option.value === formik.values.installment_type
              )}
              onChange={(option) =>
                formik.setFieldValue("installment_type", option ? option.value : null)
              }
              onBlur={() => formik.setFieldTouched("installment_type", true)}
            />
            {formik.touched.installment_type &&
              formik.errors.installment_type && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.installment_type}
                </div>
              )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Maturity Period <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              max={336}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter Maturiyt Period"
              {...formik.getFieldProps("maturity_period")}
            />
            {formik.touched.maturity_period &&
              formik.errors.maturity_period && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.maturity_period}
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
              <label className="block text-sm font-medium lg:mb-1 md:mb-1 sm:mb-1 mb-6">
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

      <Accordion type="multiple" collapsible className="space-y-4">
        <AccordionItem value="grace" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Grace Period
          </AccordionTrigger>
          <AccordionContent value="classification" className="px-6 py-4">
            <Grace
              formik={formik}
              layout_color={layout_color}
              grace_type={formik.values.grace_type}
              maturity_period={formik.values.maturity_period}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="classification"
          className="border rounded-lg bg-white"
        >
          <AccordionTrigger className="px-6 py-4">
            Classification
          </AccordionTrigger>
          <AccordionContent value="classification" className="px-6 py-4">
            <Classification
              formik={formik}
              layout_color={layout_color}
              setMainImg={setMainImage}
              setDescImg={setDescriptionImage}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payable" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Payable Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <PayableDetails
              formik={formik}
              layout_color={layout_color}
              gstTypeData={bygstdata || []}
              wastagedata={wastagedata || []}
              install_type={formik.values.installment_type}
              classType={classType}
              maturity_period={formik.values.maturity_period}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fund" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Fund Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <FundDetails
              formik={formik}
              layout_color={layout_color}
              fundtype={funddata}
            />
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

        <AccordionItem value="agent" className="border rounded-lg bg-white">
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
            <AdvancedSettings formik={formik} layout_color={layout_color} giftData={giftType}
            installment_type={formik.values.installment_type}
            />
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