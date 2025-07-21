import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CalendarDays, ChevronDown, ChevronUp, Search } from "lucide-react";
import Calender from "../../../../assets/icons/calender.svg";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { toast } from "sonner";
import * as Yup from "yup";
import {
  addschemepayment,
  getmultipaymentmode,
  searchmobileschemeaccount,
  getschemepaymentbyid,
  updateschemepayment,
  getallbranch,
  getBranchById,
  getallpaymentmode,
  getMetalRateByMetalId,
} from "../../../api/Endpoints";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import { formatNumber } from "../../../utils/commonFunction";
import { formatDecimal } from "../../../utils/commonFunction";
// import { customStyles } from "../../ourscheme/scheme/AddScheme";

const AddSchemePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const todaydate = new Date();
  const formattedDate = todaydate.toISOString();

  // Redux
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const [ispaymode, setIspaymode] = useState(false);
  const [multipaymode, setMultiPaymode] = useState([]);
  const [mobile, setMobile] = useState("");
  const [paymentmode, setPaymentmode] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ispayamtreadOnly, setIspayamtreadOnly] = useState(true);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [schemedata, setSchemeData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState({});
  // Add these to your constants
  const weightSchemeTypes = [12, 3, 4]; // Schemes where weight is primary input
  const amountSchemeTypes = [2, 5, 6]; // Schemes where amount is primary input
  const specialSchemeTypes = [10, 14]; // Schemes that need special handling

  const [selectedMode, setSelectedMode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [multiplayModes, setMultiplayModes] = useState([]);
  const [metalRate, setMetalRate] = useState(0);

  // Dynamic amount/weight constraints
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(0);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [isFirstPayment, setIsFirstPay] = useState(false);
  const [baseAmount, setBaseAmount] = useState(0);
  const [selectKey, setSelectKey] = useState(0);

  const formik = useFormik({
    initialValues: {
      id_customer: "",
      mobile: null,
      date_payment: formattedDate,
      payment_mode: "",
      itr_utr: "",
      remark: "",
      scheme_acc_number: "",
      id_scheme: "",
      id_branch: "",
      id_scheme_account: "",
      scheme_type: 0,
      total_amt: 0,
      payment_amount: "",
      metal_rate: 0,
      metal_weight: "",
      total_installments: 1,
      id_classification: "",
      installments: 1,
      min_amount: 0,
      max_amount: 0,
      min_weight: 0,
      max_weight: 0,
      isFirstPayment: false,
      totalInstallments: 1,
    },

    validationSchema: Yup.object({
      id_branch: Yup.string().required("Branch is required"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .max(20, "Mobile number must be at most 20 digits"),
      id_scheme_account: Yup.string().required("Scheme account is required"),
      date_payment: Yup.date().required("Payment date is required"),
      metal_rate: Yup.number().optional("Metal rate is required"),
      metal_weight: Yup.number().when([], {
        is: () => showWeightInput,
        then: () =>
          Yup.number()
            .required("Metal weight is required")
            .min(minWeight, `Weight must be at least ${minWeight}g`)
            .max(maxWeight, `Weight cannot exceed ${maxWeight}g`),
        otherwise: () => Yup.number().notRequired(),
      }),
      payment_amount: Yup.number().when([], {
        is: () => showAmountInput && isFirstPayment,
        then: () =>
          Yup.number()
            .required("Amount is required")
            .min(minAmount, `Amount must be at least ${minAmount}`)
            .max(
              maxAmount * (formik.values.installments || 1),
              `Total payment cannot exceed ${
                maxAmount * (formik.values.installments || 1)
              } for ${formik.values.installments} installments`
            ),
        otherwise: () => Yup.number().required("Amount is required"),
      }),
      total_amt: Yup.number().optional("Total amount is required"),
      payment_mode: Yup.string().required("Payment mode is required"),
      itr_utr: Yup.string(),
      remark: Yup.string(),
      installments: Yup.number()
        .required("Installments is required")
        .min(1, "At least 1 installment is required")
        .test(
          "max-installments",
          "Installments exceed remaining scheme installments",
          function (value) {
            if (!selectedScheme) return true;

            const schemeType = selectedScheme?.id_scheme?.scheme_type;
            if (schemeType === 10 || schemeType === 14) return true;

            const totalPaid = selectedScheme.total_paidinstallments || 0;
            const totalInstallments =
              selectedScheme?.id_scheme?.total_installments;

            return value <= totalInstallments - totalPaid;
          }
        ),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      // if (id) {
      //   updateschemepaymentmutate({ id, values });
      // } else {
      if (!isLoading) {
        setIsLoading(true);
        createschemepaymentmutate(values);
      }
      // }
    },
  });

  const customStyles = (isReadOnly) => ({
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
    menuList: (provided) => ({
      ...provided,
      // paddingTop: 0,
      // paddingBottom: 0,
      maxHeight: showWeightInput ? "130px" : "209px",
      // maxHeight: [2, 5, 6].includes(formik.values.scheme_type)
      //   ? "130px"
      //   : "209px",
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

  // API calls
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

  const { data: paymentModes } = useQuery({
    queryKey: ["modes"],
    queryFn: getallpaymentmode,
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const getMutliOptions = async () => {
      const data = await getmultipaymentmode();
      setMultiplayModes(data);
    };

    if (selectedMode === 7) {
      getMutliOptions();
    }
  }, [selectedMode]);

  // Mutations
  const { mutate: createschemepaymentmutate } = useMutation({
    mutationFn: addschemepayment,
    onSuccess: (response) => {
      toast.success(response.message);
      resetForm();
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
    },
  });

  const resetForm = () => {
    const branch = formik.values.id_branch;
    formik.resetForm();
    setSchemeData([]);
    setFullData([]);
    setSelectedScheme({});
    setMobile("");
    setBaseAmount(0);
    setShowWeightInput(false);
    setShowAmountInput(false);
    setIspayamtreadOnly(true);
    setIsFirstPay(false);
    setSelectedMode(0);
    setIsLoading(false);
    setSelectKey((prev) => prev + 1);
  };

  const { mutate: updateschemepaymentmutate } = useMutation({
    mutationFn: updateschemepayment,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/reports/schemepayment");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: handlesearchschemeaccount } = useMutation({
    mutationFn: searchmobileschemeaccount,
    onSuccess: (response) => {
      if (response && response.data) {
        try {
          const outputData = response.data;
          const data = outputData.map((item) => ({
            value: item._id,
            label: item.scheme_name,
          }));
          setSchemeData(data);
          setFullData(outputData);
          toast.success(response.message);
        } catch (error) {
          toast.error("Error processing response data");
        }
      } else {
        toast.error("No data found in response");
      }
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  // Effects
  useEffect(() => {
    if (selectedMode === 7) {
      if (multiplayModes?.data?.length > 0) {
        setIspaymode(true);
        const data = multiplayModes.data.map((item) => ({
          value: item.parameter,
          label: item.name,
        }));
        setMultiPaymode(data);
      }
    } else {
      setIspaymode(false);
    }
  }, [multiplayModes, selectedMode]);

  useEffect(() => {
    formik.setFieldValue("id_branch", id_branch);
  }, [id_branch]);

  useEffect(() => {
  if (paymentModes) {
    const data = paymentModes.data
      .filter(item => item.id_mode !== 11) 
      .map((item) => ({
        mode: item.id_mode,
        value: item._id,
        label: item.mode_name,
      }));
    setPaymentmode(data);
  }
}, [paymentModes]);


  useEffect(() => {
    if (!branchData) return;

    if (accessBranch === "0" && branchData.data) {
      const formattedBranches = branchData.data.map((item) => ({
        value: item._id,
        label: item.branch_name,
      }));
      setBranch(formattedBranches);
      setIsLoading(false);
    } else if (branchData.data) {
      setBranch(branchData.data);
      formik.setFieldValue("id_branch", branchData.data._id);
      setIsLoading(false);
    }
  }, [branchData, accessBranch]);

  useEffect(() => {
    const fetchMetalRate = async () => {
      if (!formik.values.id_scheme_account || !todaydate) return;

      const filteredData = fullData.find(
        (item) => item._id === formik.values.id_scheme_account
      );

      if (!filteredData) return;
      setSelectedScheme(filteredData);

      const branchId = formik.values.id_branch || id_branch;

      try {
        const metalRate = await getMetalRateByMetalId(
          filteredData.id_scheme?.id_metal?._id || "",
          filteredData.id_scheme?.id_purity || "",
          todaydate,
          branchId
        );

        if (metalRate) {
          const rate = metalRate.data.rate;
          setMetalRate(rate);
          formik.setFieldValue("metal_rate", rate);
        }
      } catch (error) {
        console.error("Error fetching metal rate:", error);
      }
    };

    fetchMetalRate();
  }, [formik.values.id_scheme_account]);

  useEffect(() => {
    if (!selectedScheme) return;

    const {
      id_scheme,
      id_customer,
      id_classification,
      amount,
      weight,
      last_paid_amount,
      last_paid_weight,
      total_installments,
      flexFixed,
    } = selectedScheme;

    const schemeType = id_scheme?.scheme_type;
    const classificationOrder = id_classification?.order;

    // Reset fields
    formik.setFieldValue("payment_amount", "");
    formik.setFieldValue("metal_weight", "");
    setShowWeightInput(false);
    setShowAmountInput(false);
    setIspayamtreadOnly(true);

    // Set common fields
    formik.setFieldValue("id_scheme", id_scheme?._id);
    formik.setFieldValue("id_branch", id_scheme?.id_branch);
    formik.setFieldValue("id_classification", id_classification?._id);
    formik.setFieldValue("id_customer", id_customer?._id);
    formik.setFieldValue("scheme_type", schemeType);
    formik.setFieldValue("total_installments", total_installments);

    const isWeightScheme = weightSchemeTypes.includes(schemeType);

    // Classification logic
    if (classificationOrder === 2) {
      if (isWeightScheme) {
        const paymentAmount = Number(metalRate) * Number(flexFixed || 0);
        formik.setFieldValue("payment_amount", paymentAmount);
        setBaseAmount(paymentAmount);
        // formik.setFieldValue("metal_weight", weight);
        setMinWeight(id_scheme?.min_weight || 0);
        formik.setFieldValue("min_weight", id_scheme?.min_weight);
        setMaxWeight(id_scheme?.max_weight || 0);
        formik.setFieldValue("max_weight", id_scheme?.max_weight);
        const initialWeight = selectedScheme?.flexFixed;
        formik.setFieldValue("metal_weight", initialWeight);
        setShowWeightInput(true);
      } else {
        formik.setFieldValue("payment_amount", selectedScheme?.flexFixed);
        setBaseAmount(selectedScheme?.flexFixed);
      }
    } else if (classificationOrder === 3) {
      const output = true; 
      setIsFirstPay(output);
      formik.setFieldValue("isFirstPayment", output);

      if (output) {
        if (isWeightScheme) {
          setMinWeight(id_scheme?.min_weight || 0);
          formik.setFieldValue("min_weight", id_scheme?.min_weight);
          setMaxWeight(id_scheme?.max_weight || 0);
          formik.setFieldValue("max_weight", id_scheme?.max_weight);
          const initialWeight =
            selectedScheme?.flexFixed || selectedScheme?.weight || 0;
          formik.setFieldValue("metal_weight", initialWeight);
          setShowWeightInput(true);
          setIspayamtreadOnly(false);

          // Calculate initial amount
          const initialAmount = initialWeight * metalRate;
          formik.setFieldValue("payment_amount", initialAmount.toFixed(2));
          setBaseAmount(initialAmount);
        } else {
          setMinAmount(id_scheme?.min_amount || 0);
          formik.setFieldValue("min_amount", id_scheme?.min_amount);
          setMaxAmount(id_scheme?.max_amount || 0);
          formik.setFieldValue("max_amount", id_scheme?.max_amount);
          setShowAmountInput(true);
          setIspayamtreadOnly(false);
        }
      } else {
        if (isWeightScheme) {
          formik.setFieldValue("metal_weight", last_paid_weight);
          const calculatedAmount =
            Number(metalRate) * Number(last_paid_weight || 0);
          formik.setFieldValue("payment_amount", calculatedAmount);
          setBaseAmount(calculatedAmount);
        } else {
          formik.setFieldValue("payment_amount", last_paid_amount);
          setBaseAmount(last_paid_amount);
        }
      }
    } else {
      // Classification order 1
      if (isWeightScheme) {
        setMinWeight(id_scheme?.min_weight || 0);
        setMaxWeight(id_scheme?.max_weight || 0);
        setShowWeightInput(true);
        setIspayamtreadOnly(false);

        // Initialize with existing weight if available
        const initialWeight = selectedScheme?.weight || 0;
        formik.setFieldValue("metal_weight", initialWeight);

        // Calculate initial amount
        const initialAmount = initialWeight * metalRate;
        formik.setFieldValue("payment_amount", initialAmount.toFixed(2));
        setBaseAmount(initialAmount);
      } else {
        setMinAmount(id_scheme?.min_amount || 0);
        setMaxAmount(id_scheme?.max_amount || 0);
        setShowAmountInput(true);
        setIspayamtreadOnly(false);
      }
    }
  }, [selectedScheme, metalRate]);

  useEffect(() => {
    if (!selectedScheme?.scheme_type || !metalRate) return;

    const schemeType = selectedScheme.scheme_type;

    if (
      (!formik.values.metal_weight && !formik.values.payment_amount) ||
      metalRate <= 0
    ) {
      return;
    }

    // schemes (12, 3, 4)
    if (weightSchemeTypes.includes(schemeType)) {
      if (formik.values.metal_weight) {
        const calculatedAmount = Number(formik.values.metal_weight) * metalRate;
        formik.setFieldValue("payment_amount", calculatedAmount.toFixed(2));
        setBaseAmount(calculatedAmount);
      }
    }
    // schemes (2, 5, 6)
    else if (amountSchemeTypes.includes(schemeType)) {
      if (formik.values.payment_amount) {
        const calculatedWeight = formik.values.payment_amount / metalRate;
        formik.setFieldValue("metal_weight", calculatedWeight);
      }
    }
    // schemes (10, 14)
    else if (specialSchemeTypes.includes(schemeType)) {
      if (formik.values.metal_weight && formik.values.payment_amount) {
        const calculatedAmount = Number(formik.values.metal_weight) * metalRate;
        if (Math.abs(calculatedAmount - formik.values.payment_amount) > 0.01) {
          formik.setFieldValue("payment_amount", calculatedAmount.toFixed(2));
          setShowAmountInput(true);
        }
      }
    }
  }, [
    formik.values.metal_weight,
    formik.values.payment_amount,
    metalRate,
    selectedScheme?.scheme_type,
  ]);

  useEffect(() => {
    if (mobile === "" || mobile) {
      setSchemeData([]);
      setFullData([]);
      setSelectedScheme({});
      formik.setFieldValue("id_scheme_account", "");
      formik.setFieldValue("payment_amount", "");
      formik.setFieldValue("metal_weight", "");
      setShowWeightInput(false);
      setShowAmountInput(false);
      setBaseAmount(0);
    }
  }, [mobile]);

  useEffect(() => {
    if (baseAmount > 0 && formik.values.installments > 1) {
      const newTotal = baseAmount * formik.values.installments;
      formik.setFieldValue("payment_amount", newTotal);
    } else if (baseAmount > 0) {
      formik.setFieldValue("payment_amount", baseAmount);
    }
  }, [formik.values.installments, baseAmount]);

  const handleSearch = () => {
    if (!formik.values.mobile) {
      return toast.error("Please provide mobile or scheme account number!");
    }

    const searchData = {
      id_branch: formik.values.id_branch || id_branch,
      search_mobile: formik.values.mobile,
      type: "payment",
    };

    handlesearchschemeaccount(searchData);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("mobile", value);
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    formik.setFieldValue("mobile", pastedData);
    e.preventDefault();
  };

  const handleCancel = () => {
    navigate("/payment/schemepayment");
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (
      [2, 5, 6].includes(formik.values.scheme_type) &&
      formik.values.payment_amount > 0 &&
      metalRate > 0
    ) {
      const calculatedWeight = formik.values.payment_amount / metalRate;
      formik.setFieldValue("metal_weight", calculatedWeight);
    }
  }, [formik.values.payment_amount, formik.values.scheme_type, metalRate]);

  // const handleAmountChange = (e) => {
  //   const value = parseFloat(e.target.value) || 0;
  //   formik.setFieldValue("payment_amount", value);
  //   if (formik.values.installments === 1) {
  //     setBaseAmount(value);
  //   }
  // };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || "";

    formik.setFieldValue("payment_amount", value);
    // formik.setFieldError("payment_amount","")

    if (formik.values.installments === 1) {
      setBaseAmount(value);
    }
  };

  const handleInstallmentChange = (value) => {
    if (!selectedScheme) return;

    const schemeType = selectedScheme?.id_scheme?.scheme_type;

    if (schemeType !== 10 && schemeType !== 14) {
      const totalPaid = selectedScheme.total_paidinstallments || 0;
      const totalInstallments = selectedScheme?.id_scheme?.total_installments;
      const remainingInstallments = totalInstallments - totalPaid;

      if (value > remainingInstallments) {
        value = remainingInstallments;
        toast.error(`Cannot exceed remaining installments`);
      } else if (value < 1) {
        value = 1;
        toast.error("Minimum 1 installment required");
      }
    }

    const prevInstallments = formik.values.installments || 1;
    formik.setFieldValue("installments", value);

    if (weightSchemeTypes.includes(selectedScheme?.id_scheme?.scheme_type)) {
      let baseWeight = 0;

      if (formik.values.metal_weight && prevInstallments > 0) {
        baseWeight = parseFloat(formik.values.metal_weight) / prevInstallments;
      } else {
        baseWeight = parseFloat(
          selectedScheme?.flexFixed || selectedScheme?.weight || 0
        );
      }

      if (baseWeight > 0) {
        const newWeight = baseWeight * value;
        formik.setFieldValue("metal_weight", newWeight.toFixed(3));

        const rate = formik.values.metal_rate || 0;
        const totalAmount = newWeight * rate;
        formik.setFieldValue("payment_amount", totalAmount.toFixed(2));
      }
    } else if (
      amountSchemeTypes.includes(selectedScheme?.id_scheme?.scheme_type)
    ) {
      let baseAmount = 0;

      if (formik.values.payment_amount && prevInstallments > 0) {
        baseAmount =
          parseFloat(formik.values.payment_amount) / prevInstallments;
      } else {
        baseAmount = parseFloat(selectedScheme?.amount || 0);
      }

      if (baseAmount > 0) {
        const newAmount = baseAmount * value;
        formik.setFieldValue("payment_amount", newAmount.toFixed(2));
      }
    }
  };

  const [weightSaved, setWeightSaved] = useState(0);

  useEffect(() => {
    const { payment_amount, metal_rate, scheme_type } = formik.values;

    if (
      [2, 5, 6, 10, 14].includes(scheme_type) &&
      payment_amount &&
      metal_rate &&
      Number(metal_rate) !== 0
    ) {
      setWeightSaved(Number(payment_amount) / Number(metal_rate));
    } else {
      setWeightSaved(0);
    }
  }, [
    formik.values.payment_amount,
    formik.values.metal_rate,
    formik.values.scheme_type,
    selectedScheme,
  ]);

  console.log(ispayamtreadOnly,"kd")

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.type !== "textarea") {
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-row justify-between items-center mb-4">
          <p className="text-sm text-gray-400 mt-4 mb-4">
            Payment /{" "}
            <span className="text-[#232323] font-semibold text-sm">
              Scheme Payment
            </span>
          </p>

          <div className="flex flec-row gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-24 h-9 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 flex justify-center items-center"
            >
              {isLoading ? <SpinLoading /> : "Save"}
            </button>
            <button
              type="button"
              className="w-24 h-9 border-[1px] bg-[#F6F7F9] border-[#f2f3f8] text-sm font-semibold rounded-lg hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <div className="flex flex-col lg:flex-row w-full justify-between gap-[20px]">
            <div className="lg:w-1/2 w-full bg-white border-[1px]  px-[18px] py-[20px] rounded-[16px] p-4 border-[#F2F2F9]">
              <h2 className="text-[#232323] text-md font-bold mb-4 pb-4">
                Customer Details
              </h2>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 lg:pr-2">
                {accessBranch === "0" && branch.length > 0 && !isLoading ? (
                  <div>
                    <label className="block text-sm text-[#232323] font-semibold mb-1">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <Select
                      styles={customStyles(true)}
                      isClearable={true}
                      options={branch || []}
                      placeholder="Select Branch"
                      value={branch?.find(
                        (option) => option.value === formik.values.id_branch
                      )}
                      onChange={(option) =>
                        formik.setFieldValue("id_branch", option.value || "")
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
                    <label className="block text-sm  mb-1">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={branch?.branch_name || ""}
                      className="w-full border rounded-md px-3 py-2 text-gray-500"
                    />
                    {formik.errors.id_branch && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.id_branch}
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile number search */}
                <div className="relative">
                  <label className="block text-sm  mb-1">
                    Search AC No/ Mob No
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values.mobile || ""}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#004181] outline-none"
                    placeholder="Enter Mobile No or Scheme AC No (e.g., F-FLMVC4319)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <span className="absolute right-0 top-3 w-10 h-full px-3 flex items-center justify-center text-black">
                    <Search
                      className="w-6 h-6 hover:cursor-pointer"
                      onClick={() => handleSearch()}
                    />
                  </span>
                </div>

                {/* Scheme account selection */}
                <div className="flex flex-col">
                  <label className="block text-sm  mb-1">
                    Scheme Account<span className="text-red-400"> *</span>
                  </label>
                  <Select
                    key={selectKey}
                    styles={customStyles(true)}
                    isClearable={true}
                    options={schemedata}
                    placeholder="Choose Account"
                    value={schemedata?.find(
                      (option) =>
                        option.value === formik.values.id_scheme_account
                    )}
                    // onChange={(option) => {
                    //   formik.setFieldValue("payment_amount", "");
                    //   formik.setFieldValue("metal_weight", "");
                    //   formik.setFieldValue("installments", 1);

                    //   if (option?.value) {
                    //     formik.setFieldValue("id_scheme_account", option.value);
                    //     const selected = fullData.find(
                    //       (item) => item._id === option.value
                    //     );
                    //     setSelectedScheme(selected || {});
                    //   } else {
                    //     formik.setFieldValue("id_scheme_account", "");
                    //     setSelectedScheme({});
                    //   }
                    // }}
                    onChange={(option) => {
                      formik.setFieldValue("payment_amount", "");
                      formik.setFieldValue("metal_weight", "");
                      formik.setFieldValue("installments", 1);
                      formik.setFieldValue("metal_rate", 0);
                      formik.setFieldValue("total_amt", 0);
                      setBaseAmount(0);
                      setShowWeightInput(false);
                      setShowAmountInput(false);
                      setIspayamtreadOnly(true);
                      setIsFirstPay(false);
                    
                      if (option?.value) {
                        formik.setFieldValue("id_scheme_account", option.value);
                        const selected = fullData.find((item) => item._id === option.value);
                        setSelectedScheme(selected || {});
                        setMinAmount(0);
                        setMaxAmount(0);
                        setMinWeight(0);
                        setMaxWeight(0);
                      } else {
                        formik.setFieldValue("id_scheme_account", "");
                        setSelectedScheme({});
                      }
                    }}
                  />
                  {formik.errors.id_scheme_account && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.id_scheme_account}
                    </div>
                  )}
                </div>

                {/* Mobile accordion for scheme details */}
                <div className="lg:hidden ">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={toggleAccordion}
                  >
                    <label className="block text-sm  mb-1">
                      Scheme Details<span className="text-red-400">*</span>
                    </label>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {isExpanded && (
                    <div className="lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10">
                      <div className="bg-white lg:w-full rounded-[16px] shadow-sm borde p-4 border-[#F2F2F9]">
                        <h2 className="text-base font-semibold text-gray-800 mb-2">
                          Scheme Details
                        </h2>
                        <div className="grid grid-cols-2 gap-5  text-sm">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                A/C Name
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.account_name || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Address
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.id_customer?.address || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Joined On
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.start_date
                                  ? new Date(
                                      selectedScheme.start_date
                                    ).toLocaleDateString("en-GB")
                                  : "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Scheme A/C No
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.scheme_acc_number || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                No of Gift Issues
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.total_gifts_issued || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Scheme Type
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.scheme_typename
                                  ? selectedScheme.scheme_typename
                                      .charAt(0)
                                      .toUpperCase() +
                                    selectedScheme.scheme_typename.slice(1)
                                  : "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Total Paid Installment
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {selectedScheme?.total_paidinstallments || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Total Paid Amount
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                ₹ {selectedScheme?.total_paidamount || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Total Metal Weight
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                {Number(selectedScheme?.total_weight || 0)}
                                {/* {selectedScheme?.total_weight || "-"} */}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <span className="text-[#232323] font-semibold">
                                Total Overdue
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-900">-</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment date */}
                <div className="flex flex-col w-full">
                  <label className="block text-sm  mb-1">
                    Payment Date<span className="text-red-400"> *</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      name="date_payment"
                      readOnly
                      selected={formik.values.date_payment}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select Date"
                      className="border-[1px] border-[#f2f3f8] text-[14px] rounded-lg p-2 w-full focus:ring-1 focus:ring-[#004181] outline-none focus:border-transparent"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      wrapperClassName="w-full"
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                      <img src={Calender} className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Metal rate */}
                <div className="flex flex-col">
                  <label className="block text-sm  mb-1">
                    Today Rate<span className="text-red-400">*</span>
                  </label>
                  <input
                    name="metal_rate"
                    disabled
                    value={formik.values.metal_rate}
                    type="text"
                    className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full text-[14px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder=""
                  />
                  <p style={{ color: "red" }}>{errors?.metal_rate}</p>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm  mb-1">
                    Installments<span className="text-red-400"> *</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      name="installments"
                      value={formik.values.installments}
                      onChange={(e) =>
                        handleInstallmentChange(parseInt(e.target.value))
                      }
                      className="border-[1px] border-[#f2f3f8] rounded-md text-[14px]  p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] outline-none focus:border-transparent"
                      min="1"
                      max={
                        selectedScheme &&
                        ![10, 14].includes(
                          selectedScheme?.id_scheme?.scheme_type
                        )
                          ? selectedScheme.total_installments -
                            (selectedScheme.total_paidinstallments || 0)
                          : undefined
                      }
                    />
                    <div className="absolute right-2 flex flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          handleInstallmentChange(
                            parseInt(formik.values.installments || 0) + 1
                          )
                        }
                        className="focus:outline-none"
                        disabled={
                          selectedScheme &&
                          formik.values.installments >=
                            selectedScheme.total_installments -
                              (selectedScheme.total_paidinstallments || 0)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleInstallmentChange(
                            Math.max(
                              1,
                              parseInt(formik.values.installments || 0) - 1
                            )
                          )
                        }
                        className="focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {formik.errors.installments && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.installments}
                    </div>
                  )}
                  {selectedScheme && schemedata.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedScheme &&
                        schemedata.length > 0 &&
                        ![10, 14].includes(
                          selectedScheme?.id_scheme?.scheme_type
                        ) && (
                          <div className="text-xs text-gray-500 mt-1">
                            {`Remaining installments: ${
                              selectedScheme?.id_scheme?.total_installments -
                              (selectedScheme?.total_paidinstallments || 0)
                            }`}
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <div></div>
                <div className="lg:col-span-2">
                  <h2 className="text-[#232323] text-md font-bold mb-4">
                    Scheme Account Details
                  </h2>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 border-t">
                    {/* Weight input for weight-based schemes */}
                    {showWeightInput && (
                      <div className="flex flex-col mt-4">
                        <label className="block text-sm  mb-1">
                          Enter Weight
                          <span className="text-red-400">*</span>
                          {minWeight > 0 && maxWeight > 0 && (
                            <span className="text-gray-500 text-sm ml-2">
                              (Min: {minWeight}gm, Max: {maxWeight}gm)
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="metal_weight"
                            disabled={ispayamtreadOnly}
                            value={formik.values.metal_weight}
                            min={minWeight}
                            max={maxWeight}
                            step="0.01"
                            onChange={(e) => {
                              // Allow empty string or valid decimal numbers
                              const value = e.target.value;

                              // Validate the input format (optional)
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                formik.setFieldValue("metal_weight", value);

                                // Calculate payment amount only when we have a valid number
                                if (!isNaN(parseFloat(value))) {
                                  const rate = formik.values.metal_rate || 0;
                                  const installments =
                                    formik.values.installments || 1;
                                  const totalAmount =
                                    parseFloat(value) * rate * installments;
                                  formik.setFieldValue(
                                    "payment_amount",
                                    totalAmount.toFixed(2)
                                  );
                                } else {
                                  formik.setFieldValue("payment_amount", "");
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "-" ||
                                e.key === "e" ||
                                e.key === "E"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="border-[1px] border-[#f2f3f8]  rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] outline-none focus:border-transparent"
                            placeholder="Enter weight in grams"
                          />
                          <span className="absolute right-0 top-0 w-9 h-full px-3 flex items-center justify-center text-[#232323] border-l">
                            GM
                          </span>
                        </div>
                        {formik.touched.metal_weight &&
                          formik.errors.metal_weight && (
                            <div className="text-red-500 text-sm mt-1">
                              {formik.errors.metal_weight}
                            </div>
                          )}
                      </div>
                    )}

                    {/* Amount input */}
                    <div className="flex flex-col mt-4">
                      <label className="block text-sm  mb-1">
                        {showAmountInput ? "Enter Amount" : "Payment Amount"}
                        <span className="text-red-400">*</span>
                        {minAmount > 0 && maxAmount > 0 && showAmountInput && (
                          <span className="text-gray-500 text-[10px] ml-2">
                            (Min: {minAmount}, Max: {maxAmount})
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          disabled={ispayamtreadOnly}
                          name="payment_amount"
                          value={formik.values.payment_amount}
                          min={minAmount}
                          onBlur={formik.handleBlur}
                          max={maxAmount * formik.installments}
                          step="0.01"
                          onWheel={(e) => e.target.blur()}
                          onChange={handleAmountChange}
                          onKeyDown={(e) => {
                            if (
                              !/^[0-9\b.]+$/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "ArrowLeft" &&
                              e.key !== "ArrowRight" &&
                              e.key !== "Delete" &&
                              e.key !== "Tab"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="border-[1px] border-[#f2f3f8] pl-10 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] outline-none focus:border-transparent"
                          placeholder="Enter amount"
                        />
                        <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-[#232323] border-r">
                          ₹
                        </span>
                      </div>
                      {formik.touched.payment_amount &&
                        formik.errors.payment_amount && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.payment_amount}
                          </div>
                        )}
                    </div>

                    {[2, 5, 6, 10, 14].includes(formik.values.scheme_type) && (
                      <div className="relative flex-1 mt-4">
                        <label className="block text-sm  mb-1">
                          Weight Saved<span className="text-red-400"> *</span>
                        </label>
                        <input
                          type="text"
                          disabled
                          value={`${formatDecimal(weightSaved)}`}
                          className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full bg-gray-100"
                        />
                      </div>
                    )}

                    {/* Payment mode */}
                    <div
                      className={`flex flex-col ${
                        (!showWeightInput ||
                          ![2, 5, 6, 10, 14].includes(
                            formik.values.scheme_type
                          )) &&
                        "mt-4"
                      } `}
                    >
                      <label className="block text-sm  mb-1">
                        Payment Mode<span className="text-red-400"> *</span>
                      </label>
                      <Select
                        styles={customStyles(true)}
                        isClearable={true}
                        options={paymentmode}
                        placeholder="Select payment mode"
                        value={
                          paymentmode?.find(
                            (option) =>
                              option.value === formik.values.payment_mode
                          ) || null
                        }
                        onChange={(option) => {
                          if (!option) {
                            setSelectedMode("");
                            formik.setFieldValue("payment_mode", "");
                            return;
                          }

                          if (Number(option?.mode) === 7) {
                            setSelectedMode(option.mode);
                          } else {
                            setSelectedMode("");
                          }
                          formik.setFieldValue("payment_mode", option.value);
                        }}
                      />
                      {formik.errors.payment_mode && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.payment_mode}
                        </div>
                      )}
                    </div>

                    {/* Multi-payment modes */}
                    {ispaymode && (
                      <>
                        {multiplayModes?.data?.map((multipay) => (
                          <div
                            key={multipay.parameter}
                            className="flex flex-col"
                          >
                            <label className="block text-sm  mb-1">
                              {multipay.name}
                            </label>
                            <input
                              type="number"
                              name={multipay.parameter}
                              value={formik.values[multipay.parameter] || ""}
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                if (e.target.value >= 0) {
                                  formik.setFieldValue(
                                    multipay.parameter,
                                    Number(e.target.value) || ""
                                  );
                                }
                              }}
                              className="border-[1px] border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="Enter amount here"
                            />
                          </div>
                        ))}
                      </>
                    )}

                    {/* ITR/UTR ID */}
                    <div className="flex flex-col">
                      <label
                        className={`block text-sm  mb-1 ${
                          (!showWeightInput ||
                            ![2, 5, 6, 10, 14].includes(
                              formik.values.scheme_type
                            )) &&
                          "mt-4"
                        }`}
                      >
                        ITR/UTR ID
                      </label>
                      <input
                        type="text"
                        name="itr_utr"
                        value={formik.values.itr_utr}
                        onChange={formik.handleChange}
                        className="border-[1px] border-[#f2f3f8] rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#004181] outline-none focus:border-transparent"
                        placeholder="Enter ITR/UTR ID"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="col-span-full flex flex-col">
                      <label className="block text-sm mb-1">Remarks</label>
                      <textarea
                        name="remark"
                        value={formik.values.remark}
                        onChange={formik.handleChange}
                        className="border-[1px] border-[#f2f3f8] rounded-md p-2 max-h-32 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter remarks"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - scheme details (desktop) */}
            <div className="lg:w-1/2 w-full items-center justify-center hidden lg:block">
              <div className="bg-white lg:w-full p-5  border-[1px]  border-[#F2F2F9] rounded-[16px]">
                <h2 className="text-base text-[#232323] text-md font-bold mb-8">
                  Scheme Details
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        A/C Name
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.account_name || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Address
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.id_customer?.address || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Joined On
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.start_date
                          ? new Date(
                              selectedScheme.start_date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Scheme A/C No
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.scheme_acc_number || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        No of Gift Issues
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.total_gifts_issued || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Scheme Type
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.scheme_typename
                          ? selectedScheme.scheme_typename
                              .charAt(0)
                              .toUpperCase() +
                            selectedScheme.scheme_typename.slice(1)
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Total Paid Installment
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.total_paidinstallments || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Total Paid Amount
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.total_paidamount
                          ? formatNumber({
                              value: selectedScheme?.total_paidamount,
                              decimalPlaces: 0,
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Total Metal Weight
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.total_weight != null
                          ? `${Number(
                              formatDecimal(selectedScheme.total_weight)
                            )} g`
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-[#232323] font-semibold">
                        Total Overdue
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSchemePayment;
