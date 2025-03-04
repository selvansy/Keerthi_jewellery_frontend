import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import { Plus, Trash2, SquarePen } from "lucide-react";
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
} from "../../../api/Endpoints";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import PayableDetails from "./PayableDetails";
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
import { toast } from "react-toastify";
import { schemeValidationSchema } from "../../../../utils/validations/schemeValidationSchema";
import SpinLoading from "../../common/spinLoading";

const SchemeForm = () => {
  const navigate = useNavigate();

  let { id } = useParams();
  //reduux
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  // State management
  const [classifications, setClassifications] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [metal, setMetal] = useState([]);
  const [purity, setPurity] = useState([]);
  const [layout_color, setLayoutColor] = useState("#015173");
  //  const [classType, setClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
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
  const [giftType, setGiftType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [spanText, setSpanText] = useState("");
  const [validation,setValidation]= useState({})

  const formik = useFormik({
    initialValues: {
      classType: false,
      // SchemeForm fields
      scheme_name: "",
      code: "",
      id_classification: "",
      id_metal: "",
      id_purity: "",
      installment_type: "",
      maturity_period: "", // maturityMonth
      scheme_type: null,
      totalCountAmount: "",
      incrementRate: "",
      // start: "",
      startingAmount: "",
      // fixed_amounts: "",
      saving_type: "",

      // PayableDetails fields
      amount: "", // no need to pass
      min_amount: "",
      max_amount: "",
      min_weight: "",
      max_weight: "",
      total_installments: "",
      buygsttype: "",
      buy_gst: "",
      benefit_min_installment_wst_mkg: "",
      wastagebenefit: "",
      benefit_making: "",

      //grce
      grace_type: "",
      grace_period: "",
      grace_fine_amount: false,
      grace_fine: 0,

      //classification
      description: "",
      term_desc: "",
      classification_order: "",

      //customer referral
      referral_rate: "",
      incentive_rate: "",
      cus_remarks: "",

      //agent referral
      agent_referral: "",
      agent_incentive: "",
      agent_restriction: true,
      agent_remark: "",
      agent_target: "",
      partial_commission: "",

      wastagetype: "", // no need to pass

      // AdvancedSettings fields
      limit_installment: "",
      pending_due_installment: "",
      paid_installment: "",
      scheme_customer_limit: "",
      gift_minimum_paid_installment: "",

      //gift
      gift_type: 1,
      number_of_gifts: 0,

      bonus_type: "",
      bonus_amount: "",
      bonus_percent: "",
      not_paid_installment: "",
      convenience_fee: "",
      fine_amount: 0,
      cumulative_fine_amount: "",
      display_referral: false,
      display_weight_in_ledger: false,
      wallet_redemption_onpayment: false,
    },
    validationSchema: schemeValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      if (formik.values.classType) {
        console.log(amounts);
        amounts.forEach((amount) => {
          if (amount !== "") {
            formData.append("fixed_amounts[]", amount);
          }
        });
      }

      Object.keys(values).forEach((key) => {
        if (
          !formik.values.classType &&
          ["startingAmount", "totalCountAmount", "incrementRate"].includes(key)
        ) {
          return;
        }

        formData.append(key, values[key]);
      });

      // Ensure that min/max weight or min/max amount are only appended once
      if (
        formik.values.classType &&
        [12, 3, 4].includes(formik.values.scheme_type)
      ) {
        formData.delete("min_amount");
        formData.delete("max_amount");
        formData.delete("min_weight");
        formData.delete("max_weight");
        formData.append("min_weight", amounts[0]);
        formData.append("max_weight", amounts[amounts.length - 1]);
      } else if (formik.values.classType) {
        formData.delete("min_weight");
        formData.delete("max_weight");
        formData.delete("min_amount");
        formData.delete("max_amount");
        formData.append("min_amount", amounts[0]);
        formData.append("max_amount", amounts[amounts.length - 1]);
      }

      if (mainImage) {
        formData.append("logo", mainImage);
      }

      if (descriptionImage) {
        formData.append("desc_img", descriptionImage);
      }

      if (id) {
        setIsLoading(true);
        updateSchemeData({ id, data: formData });
      } else {
        setIsLoading(true);
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

  const { data: schemeData } = useQuery({
    queryKey: ["scheme", id],
    queryFn: async () => await getschemeById(id),
    enabled: Boolean(id),
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
    ],
  });

  const [
    installment_type,
    fund_type,
    buy_gst,
    wastage_type,
    scheme_typeResponse,
    giftIssueResponse,
  ] = results.map((result) => result.data);

  const { mutate: addNewScheme } = useMutation({
    mutationFn: addscheme,
    onSuccess: (response) => {
      setIsLoading(false);
      toast.success(response.message);
      navigate("/scheme/scheme/");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.message);
    },
  });

  const { mutate: updateSchemeData } = useMutation({
    mutationFn: ({ id, data }) => updateScheme(id, data),
    onSuccess: (response) => {
      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.message);
        navigate("/scheme/scheme/");
      }
    },
    onError: () => {
      setIsLoading(false);
      toast.error(response.message);
    },
  });

  //useEffect
  useEffect(() => {
    if (id && schemeData) {
      // Set the classification type first
      const classItem = classifications.find(
        (c) => c.value === schemeData.id_classification
      );
      if (classItem) {
        handleClassChange({ value: classItem.value, id: classItem.id });
      }

      // Set field values
      formik.setValues({
        ...formik.values,
        scheme_name: schemeData.data.scheme_name || "",
        code: schemeData.data.code || "",
        id_classification: schemeData.data.id_classification._id || "",
        id_branch: schemeData?.data?.id_branch || "",
        id_metal: schemeData.data.id_metal._id || "",
        id_purity: schemeData.data.id_purity._id || "",
        installment_type: schemeData.data.installment_type || "",
        maturity_period: schemeData.data.maturity_period || "",
        saving_type: schemeData.data.saving_type || "",

        // Fixed scheme specific fields
        totalCountAmount: schemeData?.data?.totalCountAmount || "",
        incrementRate: schemeData.data.incrementRate || "",
        startingAmount: schemeData.data.startingAmount || "",

        // PayableDetails fields
        min_amount: schemeData.data.min_amount || "",
        max_amount: schemeData.data.max_amount || "",
        min_weight: schemeData.data.min_weight || "",
        max_weight: schemeData.data.max_weight || "",
        buy_gst: schemeData.data.buy_gst || "",
        buygsttype: schemeData.data.buytgsttype || "",
        wastagebenefit: schemeData.data.wastagebenefit || "",
        total_installments: schemeData.data.total_installments || "",
        benefit_making: schemeData.data.makingcharge || "",

        // Grace period
        grace_type: schemeData.data.grace_type || "",
        grace_period: schemeData.data.gracePeriod || "",
        grace_fine: schemeData.data.graceFineAmount || "",

        // Classification
        description: schemeData.data.description || "",
        term_desc: schemeData.data.term_desc || "",

        // Customer referral
        referral_rate: schemeData.data.customer_referral_per || "",
        incentive_rate: schemeData.data.customer_incentive_per || "",
        cus_remarks: schemeData.data.cus_remark || "",

        // Agent referral
        agent_referral: schemeData.data.agent_referral_percentage || "",
        agent_incentive: schemeData.data.agent_percentage || "",
        agent_target: schemeData.data.agent_target_per || "",
        partial_commission: schemeData.data.agent_partial_per || "",
        agent_remark: schemeData.data.agent_remark || false,

        // AdvancedSettings
        limit_installment: schemeData.data.limit_installment || "",
        pending_due_installment: schemeData.data.pending_installment || "",
        paid_installment: schemeData.data.allowed_minpaid || "",
        scheme_customer_limit: schemeData.data.limit_customer || "",
        gift_type: schemeData.data.gift_type || 1,
        number_of_gifts: schemeData.data.number_of_gifts || 0,
        convenience_fee: schemeData.data.convenience_fees || "",
        fine_amount: schemeData.data.fine_amount || 0,
        cumulative_fine_amount: schemeData.data.cumulative_fine_amount || "",
        display_referral: schemeData.data.display_referral || false,
        display_weight_in_ledger:
          schemeData.data.display_Weight_in_ledger || false,
        wallet_redemption_onpayment: schemeData.data.wallet_redemption || false,
        gift_minimum_paid_installment:
          schemeData.data.gift_minimum_paid_installment || "",
      });
      if (schemeData?.data?.fixed_amounts.length > 0) {
        formik.setFieldValue("classType", true);
      }
      if (schemeData?.data) {
        formik.setFieldValue("scheme_type", schemeData.data.scheme_type);
      }
      
    }
  }, [id, schemeData]);

  useEffect(() => {
    if (schemeData?.data && Array.isArray(schemeData.data.fixed_amounts)) {
      setAmounts(schemeData.data.fixed_amounts);
    }
  }, [schemeData?.data]);
  

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

    if (giftIssueResponse) {
      const data = giftIssueResponse.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setGiftType(data);
    }
  }, [installment_type, fund_type, buy_gst, wastage_type, scheme_typeResponse]);

  useEffect(() => {
    if (classificationData) {
      const data = classificationData.data.map((item) => ({
        value: item._id,
        label: item.name,
        id: item.order,
      }));
      setClassifications(data);
    }
  }, [classificationData]);

  useEffect(() => {
    if (formik.values.incrementRate) {
      const incrementRate = formik.values.incrementRate;
      const startingAmount = formik.values.startingAmount;
      const totalCountAmount = formik.values.totalCountAmount;
      if (incrementRate === "" || startingAmount === "" || totalCountAmount === "") {
        setAmounts([]);
      } else {
        generateAmounts(totalCountAmount, startingAmount, incrementRate);
      }
    }
  }, [
    formik.values.incrementRate,
    formik.values.startingAmount,
    formik.values.totalCountAmount,
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

  // Handler for adding new amount
  const handleAddAmount = () => {
    if (
      formik.values.totalCountAmount &&
      formik.values.startingAmount &&
      formik.values.incrementRate
    ) {
      if (newAmount && !amounts.includes(Number(newAmount))) {
        setAmounts([...amounts, Number(newAmount)]);
        setNewAmount("");
      }
    } else {
      toast.error("Fill the requried fields");
    }
  };

  //handler to choose the
  const handleClassChange = (selectedOption) => {
    formik.setFieldValue(
      "id_classification",
      selectedOption ? selectedOption.value : ""
    );

    if (selectedOption?.id === 2) {
      setSelectedClass(null);
      formik.setFieldValue("classType", true);
      formik.setFieldValue("scheme_type", null);
    } else if (selectedOption?.id === 1) {
      setSelectedClass(1);
      formik.setFieldValue("classType", false);
      formik.setFieldValue("scheme_type", null);
      formik.setFieldValue("totalCountAmount", "");
      formik.setFieldValue("incrementRate", "");
      formik.setFieldValue("startingAmount", "");
      setAmounts([]);
    } else {
      setSelectedClass(3);
      formik.setFieldValue("classType", false);
      formik.setFieldValue("scheme_type", null);
      formik.setFieldValue("totalCountAmount", "");
      formik.setFieldValue("incrementRate", "");
      formik.setFieldValue("startingAmount", "");
      setAmounts([]);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAmount();
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

  const filteredSchemeTypeData = React.useMemo(() => {
    if (!schemeTypeData) return [];

    if (formik.values.classType) {
      // Fixed scheme types
      return schemeTypeData.filter((option) =>
        [0, 1, 2, 3].includes(option.value)
      );
    } else if (selectedClass === 1) {
      // Flexi scheme types
      return schemeTypeData.filter((option) =>
        [5, 11, 12, 13].includes(option.value)
      );
    } else if (selectedClass === 3) {
      // Flexi-Fixed scheme types
      return schemeTypeData.filter((option) =>
        [7, 6, 8, 4].includes(option.value)
      );
    }
    return schemeTypeData;
  }, [schemeTypeData, formik.values.classType, selectedClass]);

  const handleReset = () => {
    setAmounts([]);

    formik.setFieldValue("totalCountAmount", "");
    formik.setFieldValue("incrementRate", "");
    formik.setFieldValue("startingAmount", "");

    formik.setFieldTouched("totalCountAmount", false);
    formik.setFieldTouched("incrementRate", false);
    formik.setFieldTouched("startingAmount", false);

    formik.setErrors((prevErrors) => ({
      ...prevErrors,
      totalCountAmount: undefined,
      incrementRate: undefined,
      startingAmount: undefined,
    }));
  };

  console.log(validation,'dkd')
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
              maxLength={30}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme name"
              {...formik.getFieldProps("scheme_name")}
            />

            {/* Show error if user reaches max length */}
            {formik.values.scheme_name.length >= 30 && (
              <div className="text-red-500 text-sm mt-1">
                Max 30 characters allowed
              </div>
            )}

            {/* Show validation errors from Formik */}
            {formik.touched.scheme_name && formik.errors.scheme_name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.scheme_name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={15}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme code"
              {...formik.getFieldProps("code")}
            />
            {formik.values.code.length === 15 && (
              <div className="text-red-500 text-sm mt-1">
                Max 15 character allowed
              </div>
            )}
            {formik.touched.code && formik.errors.code && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.code}
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
                options={branch || []}
                placeholder="Select Branch"
                value={branch || [].find(
                  (option) => option.value === formik.values.id_branch
                )}
                onChange={(option) => formik.setFieldValue("id_branch", option.value || "")}
              />
              {formik.errors.id_branch && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.id_branch}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-500 font-medium mb-1">
                Branch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value={branch?.branch_name || ""}
                className="w-full border rounded-md px-3 py-2 text-gray-500"
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
                (option) =>
                  option.value === formik.values.id_classification || ""
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
              options={filteredSchemeTypeData}
              isDisabled={!formik.values.id_classification}
              placeholder={
                !formik.values.id_classification
                  ? "Choose a classification first"
                  : "Select scheme type"
              }
              value={filteredSchemeTypeData?.find(
                (option) => option.value === formik.values.scheme_type
              )}
              onChange={(option) => {
                formik.setFieldValue("scheme_type", option?.value);
              }}
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
                formik.setFieldValue("id_metal", option ? option.value : "")
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
              isDisabled={!formik.values.id_metal}
              placeholder={
                !formik.values.id_metal
                  ? "Choose a metal first"
                  : "Select purtiy type"
              }
              value={purity.find(
                (option) => option.value === formik.values.id_purity
              )}
              onChange={(option) =>
                formik.setFieldValue("id_purity", option ? option.value : "")
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
              onChange={(option) => {
                formik.setFieldValue(
                  "installment_type",
                  option ? option.value : null
                );
                setSpanText(option.label);
                if(option.value === 1){
                  setValidation({max: 12, maxLength: 2})
                }else if(option.value ==2){
                  setValidation({max: 52, maxLength: 2})
                }else if(option.value === 3){
                  setValidation({max: 336, maxLength: 3})
                }else{
                  setValidation({max: 9, maxLength: 1})
                }
              }}
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
            <div className="relative">
              <input
                type="text"
                name="maturity_period"
                onWheel={(e) => e.target.blur()}
                onInput={(e) => {
                  if (e.target.value.length <= validation.maxLength) {
                    console.log('kd')
                    formik.handleChange(e);
                  }
                }}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter Maturity Period"
                {...formik.getFieldProps("maturity_period")}
              />
              {spanText && (
                <span
                  className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-sm text-white rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  {spanText}
                </span>
              )}
            </div>
            {formik.touched.maturity_period &&
              formik.errors.maturity_period && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.maturity_period}
                </div>
              )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Saving Type<span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              isClearable={true}
              options={funddata || []}
              placeholder="Select saving type"
              value={funddata.find(
                (option) => option.value === formik.values.saving_type
              )}
              onChange={(option) =>
                formik.setFieldValue("saving_type", option ? option.value : "")
              }
              onBlur={() => formik.setFieldTouched("saving_type", true)}
            />
            {formik.touched.saving_type && formik.errors.saving_type && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.saving_type}
              </div>
            )}
          </div>
        </div>
        {formik.values.classType && (
          <div className="grid grid-cols-3 gap-4 w-full mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {formik.values.classType &&
                [12, 3, 4].includes(formik.values.scheme_type)
                  ? "Total count of weights"
                  : "Total count of amount"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={50}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter total count"
                {...formik.getFieldProps("totalCountAmount")}
                onBlur={formik.handleBlur}
                onInput={(e) => {
                  let value = e.target.value;
                  if (value > "50") {
                    formik.setFieldError("totalCountAmount", "Max allowed is 50");
                  }

                  if (value.length > 2) {
                    value = value.slice(0, 2);
                  }
                  if (parseInt(value, 10) > 50) {
                    value = "50";
                  }

                  e.target.value = value;
                  formik.setFieldValue("totalCountAmount", value);
                }}
                onKeyDown={(e) => {
                  if (e.target.value.length >= 2 && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
              />
              {formik.errors.totalCountAmount && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.totalCountAmount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium lg:mb-1 md:mb-1 sm:mb-1 mb-6">
                {formik.values.classType &&
                [12, 3, 4].includes(formik.values.scheme_type)
                  ? "Starting Weight"
                  : "Starting Amount"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={99999999999}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter start amount"
                {...formik.getFieldProps("startingAmount")}
                onBlur={formik.handleBlur}
                onInput={(e) => {
                  let value = e.target.value;
                  if (value.length > 11) {
                    e.target.value = value.slice(0, 11);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.target.value.length >= 11 && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
              />
              {formik.errors.startingAmount && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.startingAmount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Increment Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={99999999999}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter increment rate"
                onChange={generateAmounts}
                {...formik.getFieldProps("incrementRate")}
                onInput={(e) => {
                  let value = e.target.value;
                  if (value.length > 11) {
                    e.target.value = value.slice(0, 11);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.target.value.length >= 11 && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
              />
              {formik.errors.incrementRate && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.incrementRate}
                </div>
              )}
            </div>
          </div>
        )}

        {formik.values.classType && (
          <div className="mt-6 bg-[#f5f5f5] p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {formik.values.classType &&
                [12, 3, 4].includes(formik.values.scheme_type)
                  ? "Weight List"
                  : "Amount List"}
              </h3>
              <div className="flex flex-row gap-3">
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
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={handleReset}
                  disabled={isEditMode}
                >
                  <Trash2
                    size={20}
                    className={isEditMode ? "text-gray-400" : ""}
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-start">
              <div className="flex gap-3 mb-4">
                <input
                  type="number"
                  placeholder={
                    formik.values.scheme_type &&
                    [12, 3, 4].includes(formik.values.scheme_type)
                      ? "Add weight"
                      : "Add amount"
                  }
                  className="flex-1 border rounded-md px-3 py-2"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                        {amount?.toLocaleString()}
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
              classType={formik.values.classType}
              maturity_period={formik.values.maturity_period}
              scheme_type={formik.values.scheme_type}
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
            <AdvancedSettings
              formik={formik}
              layout_color={layout_color}
              giftData={giftType}
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
          disabled={isLoading}
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          {isLoading ? <SpinLoading /> : "submit"}
        </button>
      </div>
    </form>
  );
};

export default SchemeForm;