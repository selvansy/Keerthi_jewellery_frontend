import React, { useEffect, useState, Suspense, lazy } from "react";
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
const PayableDetails = lazy(() => import("./PayableDetails"));
const AdvancedSettings = lazy(() => import("./AdvancedSettings"));
const Classification = lazy(() => import("./Classification"));
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { schemeValidationSchema } from "../../../../utils/validations/schemeValidationSchema";
import SpinLoading from "../../common/spinLoading";
import "react-datepicker/dist/react-datepicker.css";
import { color, hover } from "framer-motion";
import { option } from "framer-motion/client";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

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

const SchemeForm = () => {
  // const { setFieldValue, validateForm, values } = useFormikContext();
  const navigate = useNavigate();

  let { id } = useParams();

  //reduux
  const roleData = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  // State management
  const [classifications, setClassifications] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);

  const [metal, setMetal] = useState([]);
  const [purity, setPurity] = useState([]);
  // const [layout_color, setLayoutColor] = useState("#015173");
  const [selectedClass, setSelectedClass] = useState(null);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
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
  // const [isLoading, setIsLoading] = useState(false);
  const [spanText, setSpanText] = useState("");
  const [validation, setValidation] = useState({});
  const [pathUrl, setPathUrl] = useState("");

  const { mutate: addNewScheme, isPending: isAdding } = useMutation({
    mutationFn: addscheme,
    onSuccess: (response) => {
      // setIsLoading(false);
      toast.success(response.message);
      navigate("/scheme/scheme/");
    },
    onError: (error) => {
      // setIsLoading(false);
      toast.error(error.response?.data?.message);
    },
  });

  const { mutate: updateSchemeData, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateScheme(id, data),
    onSuccess: (response) => {
      if (response.status === 200) {
        // setIsLoading(false);
        toast.success(response?.data?.message);
        formik.resetForm();
        navigate("/scheme/delisted");
      }
    },
    onError: () => {
      // setIsLoading(false);
      toast.error(response.message);
    },
  });

  const isLoading = isAdding || isUpdating;

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
      id_branch: "",
      startingAmount: "",
      saving_type: "",
      final_join_date: "",

      // PayableDetails fields
      amount: "", // no need to pass
      min_amount: "",
      max_amount: "",
      min_weight: "",
      max_weight: "",
      total_installments: "",
      benefit_min_installment_wst_mkg: "",
      wastagebenefit: "",
      benefit_making: "",

      //classification
      description: "",
      term_desc: "",
      classification_order: 0,

      wastagetype: "", // no need to pass

      // AdvancedSettings fields
      limit_installment: 1,
      pending_installment: "",
      paid_installment: "",
      limit_customer: 0,
      gift_minimum_paid_installment: 0,
      referralPercentage: "",

      //gift
      gift_type: 1,
      no_of_gifts: 0,

      bonus_type: "",
      bonus_amount: "",
      bonus_percent: "",
      not_paid_installment: "",
      convenience_fees: 0,
      display_referral: false,
      display_Weight_in_ledger: false,
      wallet_redemption_onpayment: false,
    },
    validationSchema: schemeValidationSchema,
    onSubmit: (values) => {
      if (isLoading) return;
      const formData = new FormData();

      if (formik.values.classType) {
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
        updateSchemeData({ id, data: formData });
      } else {
        addNewScheme(formData);
        return;
      }
    },
  });

  useEffect(() => {
    if (!id) {
      formik.resetForm();
      setAmounts([]);
      setMainImage(null);
      setDescriptionImage(null);
      setSelectedClass(null);
    }
  }, [id]);

  // Customisations for react-

  const inputHeight = "44px";

  //query and mutations
  const { data: classificationData } = useQuery({
    queryKey: ["projects"],
    queryFn: getSchemeClassifications,
  });

  // const { data: branchData } = useQuery({
  //   queryKey: ["branches", accessBranch, id_branch],
  //   queryFn: async () => {
  //     if (accessBranch === "0") {
  //       setIsLoading(true);
  //       return getallbranch();
  //     }
  //     setIsLoading(true);
  //     return getBranchById(id_branch);
  //   },
  //   enabled: Boolean(accessBranch),
  //   staleTime: 5 * 60 * 1000,
  //   cacheTime: 10 * 60 * 1000,
  // });
  const { data: branchData, isLoading: isBranchLoading } = useQuery({
    queryKey: ["branches", accessBranch, id_branch],
    queryFn: async () => {
      if (accessBranch === "0") {
        return getallbranch();
      }
      return getBranchById(id_branch);
    },
    enabled: Boolean(accessBranch),
  });

  const { data: schemeData } = useQuery({
    queryKey: ["scheme", id],
    queryFn: async () => await getschemeById(id),
    enabled: Boolean(id),
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
      { queryKey: ["wastagetype"], queryFn: wastagetype },
      { queryKey: ["schemeTypeApi"], queryFn: getallschemetypes },
    ],
  });

  const [
    installment_type,
    fund_type,
    wastage_type,
    scheme_typeResponse,
    giftIssueResponse,
  ] = results.map((result) => result.data);

  //useEffect
  useEffect(() => {
    if (id && schemeData) {
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
        id_metal: schemeData?.data?.id_metal?._id || "",
        id_purity: schemeData?.data?.id_purity?._id || "",
        installment_type: schemeData.data.installment_type || "",
        maturity_period: schemeData.data.maturity_period || "",
        saving_type: schemeData.data.saving_type || "",

        // Fixed scheme specific fields
        totalCountAmount: schemeData?.data?.totalCountAmount || "",
        incrementRate: schemeData.data.incrementRate || "",
        startingAmount: schemeData.data.startingAmount || "",

        // PayableDetails fields
        min_amount: schemeData.data.min_amount || 0,
        max_amount: schemeData.data.max_amount || 0,
        min_weight: schemeData.data.min_weight || 0,
        max_weight: schemeData.data.max_weight || 0,
        wastagebenefit: schemeData.data.wastagebenefit || "",
        total_installments: schemeData.data.total_installments || "",
        benefit_making: schemeData.data.makingcharge || "",

        // Grace period
        grace_type: schemeData.data.grace_type || "",
        grace_period: schemeData.data.grace_period || "",
        grace_fine: schemeData.data.grace_fine || "",

        // Classification
        description: schemeData.data.description || "",
        term_desc: schemeData.data.term_desc || "",

        // Customer referral
        customer_referral_per: schemeData.data.customer_referral_per || "",
        customer_incentive_per: schemeData.data.customer_incentive_per || "",
        customer_ref_remarks: schemeData.data.customer_ref_remarks || "",

        // Agent referral
        agent_referral_percentage:
          schemeData.data.agent_referral_percentage || "",
        agent_incentive: schemeData.data.agent_incentive || "",
        agent_target_per: schemeData.data.agent_target_per || "",
        agent_partial_per: schemeData.data.agent_partial_per || "",
        agent_remark: schemeData.data.agent_remark || false,

        // AdvancedSettings
        limit_installment: schemeData.data.limit_installment || "",
        pending_installment: schemeData.data.pending_installment || "",
        paid_installment: schemeData.data.allowed_minpaid || "",
        limit_customer: schemeData.data.limit_customer || "",
        gift_type: schemeData.data.gift_type || 1,
        no_of_gifts: schemeData.data.no_of_gifts || 0,
        convenience_fees: schemeData.data.convenience_fees || "",
        fine_amount: schemeData.data.fine_amount || 0,
        cumulative_fine_amount: schemeData.data.cumulative_fine_amount || "",
        display_referral: schemeData.data.display_referral || false,
        display_Weight_in_ledger:
          schemeData?.data?.display_Weight_in_ledger || false,
        wallet_redemption_onpayment:
          schemeData.data.wallet_redemption_onpayment || false,
        gift_minimum_paid_installment:
          schemeData.data.gift_minimum_paid_installment || "",
        bonus_type: schemeData.data.bonus_type || "",
        bonus_amount: schemeData?.data?.bonus_amount || "",
        bonus_percent: schemeData?.data?.bonus_percent || "",
        not_paid_installment: schemeData?.data?.not_paid_installment || "",
        benefit_min_installment_wst_mkg:
          schemeData?.data?.benefit_min_installment_wst_mkg || "",
        classification_order: schemeData?.data?.classification_order,
        grace_fine_amount: schemeData?.data?.grace_fine_amount || false,
        final_join_date: schemeData?.data?.final_join_date || "",
        setMainImage: schemeData?.data?.logo || null,
        setDescriptionImage: schemeData?.data?.desc_img || null,
        referralPercentage: schemeData?.data?.referralPercentage || "",
      });
      if (schemeData?.data?.logo) {
        setMainImage(schemeData?.data?.logo);
      }
      if (schemeData?.data?.desc_img) {
        setDescriptionImage(schemeData?.data?.desc_img);
      }
      if (schemeData?.data?.fixed_amounts.length > 0) {
        formik.setFieldValue("classType", true);
      }
      if (schemeData?.data) {
        formik.setFieldValue("scheme_type", schemeData.data.scheme_type);
      }
      if (schemeData?.data?.pathUrl) {
        setPathUrl(schemeData?.data?.pathUrl);
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
  }, [installment_type, fund_type, wastage_type, scheme_typeResponse]);

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
      if (
        incrementRate === "" ||
        startingAmount === "" ||
        totalCountAmount === ""
      ) {
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
      // setIsLoading(false);
    } else if (branchData.data) {
      setBranch(branchData.data);
      formik.setFieldValue("id_branch", branchData.data._id);
      // setIsLoading(false);
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

  const handleRemoveAmount = (index) => {
    let updatedAmounts = amounts.filter((_, i) => i !== index);
    setAmounts(updatedAmounts);
    formik.setFieldValue("totalCountAmount", amounts.length);
    setSelectedAmount("");
    setEditAmount("");
  };

  const handleReset = () => {
    if (selectedAmount != null && editAmount) {
      handleRemoveAmount(selectedAmount);
    } else {
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
    }
  };

  useEffect(() => {
    if (formik.values.maturity_period && formik.values.installment_type) {
      let calculatedInstallments = 0;
      const maturityMonths = Number(formik.values.maturity_period);

      switch (formik.values.installment_type) {
        case 1: // Monthly
          calculatedInstallments = maturityMonths - 1;
          break;
        case 2: // Weekly
          calculatedInstallments = Math.round(maturityMonths * 4.345 - 4.345);
          break;
        case 3: // Daily
          calculatedInstallments = maturityMonths * 30 - 30;
          break;
        case 4: // Yearly
          calculatedInstallments = 1;
          break;
        default:
          calculatedInstallments = 0;
      }

      formik.setFieldValue("total_installments", calculatedInstallments);
    }
  }, [formik.values.maturity_period, formik.values.installment_type]);

  console.log(formik.errors)

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Scheme" }, { label: "Add scheme", active: true }]}
      />
      <form
        onSubmit={formik.handleSubmit}
        className="w-full mx-auto mt-3 space-y-6"
      >
        <div className="bg-[#FFFFFF] rounded-[16px] p-5 border-[1px] text-[#232323]">
          <h2 className="text-lg font-semibold mb-4 border-b pb-4">
            Add Scheme
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Scheme Name<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                maxLength={30}
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder="Enter scheme name"
                value={formik.values.scheme_name}
                // {...formik.getFieldProps("scheme_name")}
                onChange={(e) => {
                  const capitalized = e.target.value
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                  formik.setFieldValue("scheme_name", capitalized);
                }}
                onBlur={formik.handleBlur}
                name="scheme_name"
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
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder="Enter scheme code"
                value={formik.values.code}
                onChange={(e) => {
                  const capitalized = e.target.value
                    .toUpperCase()
                    // .replace(/\b\w/g, (char) => char.toUpperCase());
                  formik.setFieldValue("code", capitalized);
                }}
                onBlur={formik.handleBlur}
                name="code"
              />
              {formik.values.code.length === 15 && (
                <div className="text-red-500 text-sm mt-1">
                  Max 15 characters allowed
                </div>
              )}
              {formik.touched.code && formik.errors.code && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.code}
                </div>
              )}
            </div>

            {accessBranch === "0" && branch.length > 0 && !isLoading ? (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Branches <span className="text-red-500">*</span>
                </label>
                <Select
                  styles={customStyles(true)}
                  isClearable={true}
                  options={branch}
                  placeholder="Select Branch"
                  value={
                    branch.find(
                      (option) => option.value === formik.values.id_branch
                    ) || ""
                  }
                  onChange={(option) =>
                    formik.setFieldValue(
                      "id_branch",
                      option ? option.value : ""
                    )
                  }
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
                  disabled
                  value={branch?.branch_name || ""}
                  className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2 text-gray-500"
                />
                {formik.errors.id_branch && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.id_branch}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Metal Type <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                isClearable={true}
                options={metal}
                placeholder="Choose a metal"
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
                styles={customStyles(formik.values.id_metal)}
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
                Classification <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles(true)}
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
                styles={customStyles(formik.values.id_classification)}
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
                  formik.validateForm();
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
                Installment Type <span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                options={installment_data}
                placeholder="Select installment type"
                isClearable={true}
                value={installment_data.find(
                  (option) => option.value === formik.values.installment_type
                )}
                onChange={(option) => {
                  // formik.setFieldValue("maturity_period", "");
                  formik.setFieldValue(
                    "installment_type",
                    option ? option.value : null
                  );
                  setSpanText(option.label);
                  if (option.value === 1) {
                    setValidation({ max: 12, maxLength: 2, val: "month" });
                  } else if (option.value == 2) {
                    setValidation({ max: 52, maxLength: 2, val: "weeks" });
                  } else if (option.value === 3) {
                    setValidation({ max: 365, maxLength: 3, val: "Days" });
                  } else {
                    setValidation({ max: 1, maxLength: 1, val: "year" });
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
                  type="number"
                  name="maturity_period"
                  onWheel={(e) => e.target.blur()}
                  onKeyUp={(e) => {
                    const value = e.target.value.trim();
                    const numValue = Number(value);
                    if (value.length > validation.maxLength) {
                      formik.setFieldError(
                        "maturity_period",
                        `Maturity period should be under ${validation.maxLength} characters`
                      );
                      return;
                    }

                    if (numValue > validation.max) {
                      formik.setFieldError(
                        "maturity_period",
                        `Maturity period should be under ${validation.max} ${validation.val}`
                      );
                      return;
                    }

                    formik.setFieldError("maturity_period", "");
                    formik.handleChange(e);
                  }}
                  className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
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
                Installments <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_installments"
                value={formik.values.total_installments}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  let value = parseInt(e.target.value, 10);
                  if (value > formik.values.maturity_period) {
                    formik.setFieldError(
                      "total_installments",
                      `Installment cannot exceed maturity period`
                    );
                  } else {
                    formik.setFieldValue("total_installments", value);
                    formik.setFieldError("total_installments", "");
                  }
                }}
                onBlur={formik.handleBlur}
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder="Total installments"
                style={{ height: inputHeight }}
              />
              {formik.touched.total_installments &&
                formik.errors.total_installments && (
                  <span className="text-red-500 text-sm mt-1">
                    {formik.errors.total_installments}
                  </span>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Saving Type<span className="text-red-500">*</span>
              </label>
              <Select
                styles={customStyles(true)}
                isClearable={true}
                options={funddata || []}
                placeholder="Select saving type"
                value={funddata.find(
                  (option) => option.value === formik.values.saving_type
                )}
                onChange={(option) =>
                  formik.setFieldValue(
                    "saving_type",
                    option ? option.value : ""
                  )
                }
                onBlur={() => formik.setFieldTouched("saving_type", true)}
              />
              {formik.touched.saving_type && formik.errors.saving_type && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.saving_type}
                </div>
              )}
            </div>
            {/* <div>
            <label className="block text-sm font-medium mb-1">
              Final Join Date
            </label>
            <div className="relative">
              <DatePicker
                selected={formik.values.final_join_date}
                onChange={(date) =>
                  formik.setFieldValue("final_join_date", date)
                }
                // dateFormat="dd-MM-yyyy"
                placeholderText="Select Date"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                wrapperClassName="w-full"
              />
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                <CalendarDays size={20} />
              </span>
            </div>
          </div> */}
            {formik.values.classType && (
              //   <div className="grid grid-cols-3 gap-4 w-full mt-3">

              // </div>
              <>
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
                    className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                    placeholder="Enter total count"
                    {...formik.getFieldProps("totalCountAmount")}
                    onBlur={formik.handleBlur}
                    onInput={(e) => {
                      let value = e.target.value;
                      if (value > "50") {
                        formik.setFieldError(
                          "totalCountAmount",
                          "Max allowed is 50"
                        );
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
                    min={
                      [12, 3, 4].includes(formik.values.scheme_type) ? 0.1 : 1
                    }
                    step={
                      [12, 3, 4].includes(formik.values.scheme_type)
                        ? "any"
                        : "1"
                    }
                    max={99999999999}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                    placeholder={
                      [12, 3, 4].includes(formik.values.scheme_type)
                        ? "Enter start weight (e.g. 0.1)"
                        : "Enter start amount"
                    }
                    {...formik.getFieldProps("startingAmount")}
                    onBlur={(e) => {
                      // Validate the value meets minimum requirement
                      const value = parseFloat(e.target.value);
                      if ([12, 3, 4].includes(formik.values.scheme_type)) {
                        if (value < 0.1) {
                          formik.setFieldValue("startingAmount", 0.1);
                        }
                      } else {
                        if (value < 1) {
                          formik.setFieldValue("startingAmount", 1);
                        }
                      }
                      formik.handleBlur(e);
                    }}
                    onInput={(e) => {
                      let value = e.target.value;
                      if (value.length > 11) {
                        e.target.value = value.slice(0, 11);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.target.value.length >= 11 &&
                        e.key !== "Backspace"
                      ) {
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
                    className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
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
                      if (
                        e.target.value.length >= 11 &&
                        e.key !== "Backspace"
                      ) {
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
              </>
            )}
          </div>

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
                    className="flex-1 border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    className="bg-[#004181] rounded-md w-10 h-10 flex items-center justify-center"
                    onClick={handleAddAmount}
                  >
                    <Plus className="text-white" size={20} />
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
                          className="px-4 py-2 border-[1px] border-[#f2f3f8] rounded-md w-20"
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
                              ? "bg-[#004181] text-white"
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
          {/* <AccordionItem value="grace" className="border rounded-lg bg-white">
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
        </AccordionItem> */}

          <AccordionItem
            value="payable"
            className=" rounded-[16px] border-[1px] bg-white"
          >
            <AccordionTrigger className="px-6 py-4 text-[#232323] font-semibold text-lg">
              {/* <div className="w-full text-start text-lg font-semisemibold pb-4"> Payable Details</div> */}
              Payable Details
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="border-t pt-4">
                <Suspense fallback={<SpinLoading />}>
                  <PayableDetails
                    formik={formik}
                    layout_color={layout_color}
                    gstTypeData={bygstdata || []}
                    wastagedata={wastagedata || []}
                    install_type={formik.values.installment_type}
                    classType={formik.values.classType}
                    maturity_period={formik.values.maturity_period}
                    scheme_type={formik.values.scheme_type}
                    customStyle={customStyles}
                  />
                </Suspense>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="advanced"
            className="border-[1px] rounded-[16px] bg-white"
          >
            <AccordionTrigger className="px-6 py-4 text-[#232323] font-semibold text-lg">
              Installment
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="border-t pt-4">
                <Suspense fallback={<SpinLoading />}>
                  <AdvancedSettings
                    formik={formik}
                    layout_color={layout_color}
                    giftData={giftType}
                    installment_type={formik.values.installment_type}
                  />
                </Suspense>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="classification"
            className="border-[1px] rounded-[16px] bg-white"
          >
            <AccordionTrigger className="px-6 text-[#232323] font-semibold text-lg">
              Scheme Details
            </AccordionTrigger>
            <AccordionContent value="classification" className="px-6">
              <div className="border-t pt-4">
                <Suspense fallback={<SpinLoading />}>
                  <Classification
                    formik={formik}
                    layout_color={layout_color}
                    setMainImg={setMainImage}
                    setDescImg={setDescriptionImage}
                    pathurl={pathUrl}
                    logo={mainImage}
                    desc_img={descriptionImage}
                  />
                </Suspense>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isLoading || !formik.isValid || !formik.dirty}
            className={`px-9 h-[36px] text-sm font-semibold bg-blue-900 text-white rounded-lg flex justify-center items-center lg:h-[36px] ${
              isLoading ? "opacity-50" : "hover:bg-blue-800"
            }`}
          >
            {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
          </button>

          <button
            type="button"
            className="px-9 h-[36px] font-semibold text-sm border-[1px] bg-[#F6F7F9] border-[#f2f3f8] rounded-lg hover:bg-gray-50 flex justify-center items-center text-[#6C7086] lg:h-[36px]"
            onClick={() => formik.resetForm()}
          >
            Clear
          </button>
          {/* <button
          type="submit"
          disabled={isLoading}
          className="w-20 h-9 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
        >
          {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
        </button> */}
        </div>
      </form>
    </div>
  );
};

export default SchemeForm;
