import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CalendarDays, Search, ChevronDown, ChevronUp } from "lucide-react";
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
  const weightSchemeTypes = [12, 3, 4]; // Scheme types that use weight
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

 // Customisations for react-select
 const customStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    backgroundColor: "white",
    border: state.isFocused ? "1px solid black" : "2px solid #f2f3f8",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    borderRadius: "0.375rem",
    "&:hover": {
      color: "#e2e8f0",
    },
    pointerEvents: !isReadOnly ? "none" : "auto",
    opacity: !isReadOnly ? 1 : 1,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#858293",
    fontWeight: "thin",
    // fontStyle: "bold",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#232323",
    "&:hover": {
      color: "#232323",
    },
  }),
});

  const formik = useFormik({
    initialValues: {
      id_customer: "",
      mobile: 0,
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
    },

    validationSchema: Yup.object({
      id_branch: Yup.string().required("Branch is required"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^(\+)?\d*$/, "Invalid mobile number")
        .min(10, "Mobile number must be at least 10 digits")
        .max(13, "Mobile number must be at most 13 digits"),
      id_scheme_account: Yup.string().required("Scheme account is required"),
      date_payment: Yup.date().required("Payment date is required"),
      metal_rate: Yup.number().optional("Metal rate is required"),
      metal_weight: Yup.number().when("showWeightInput", {
        is: true,
        then: Yup.number()
          .required("Metal weight is required")
          .min(0.01, "Weight must be greater than 0")
          .max(Yup.ref("maxWeight"), "Weight cannot exceed maximum allowed"),
      }),
      payment_amount: Yup.number().required("Payment amount is required"),
      // .min(
      //   Yup.ref('minAmount'),
      //   "Amount cannot be less than minimum allowed"
      // )
      // .max(
      //   Yup.ref('maxAmount'),
      //   "Amount cannot exceed maximum allowed"
      // )
      total_amt: Yup.number().optional("Total amount is required"),
      payment_mode: Yup.string().required("Payment mode is required"),
      itr_utr: Yup.string(),
      remark: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (id) {
        updateschemepaymentmutate({ id, values });
      } else {
        createschemepaymentmutate(values);
      }
    },
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
      navigate("/payment/schemepayment");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

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
      const data = paymentModes.data.map((item) => ({
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

    // Reset all relevant fields first
    formik.setFieldValue("payment_amount", "");
    formik.setFieldValue("metal_weight", "");

    // Then set the new values
    formik.setFieldValue("id_scheme", selectedScheme?.id_scheme?._id);
    formik.setFieldValue("id_branch", selectedScheme?.id_scheme?.id_branch);
    formik.setFieldValue("mobile", selectedScheme?.id_customer?.mobile);
    formik.setFieldValue(
      "id_classification",
      selectedScheme?.id_classification?._id
    );
    formik.setFieldValue("id_customer", selectedScheme?.id_customer?._id);
    formik.setFieldValue("scheme_type", selectedScheme?.id_scheme?.scheme_type);

    const schemeType = selectedScheme?.id_scheme?.scheme_type;
    const classificationOrder = selectedScheme?.id_classification?.order;

    setShowWeightInput(false);
    setShowAmountInput(false);
    setIspayamtreadOnly(true);

    if (classificationOrder === 2) {
      if (weightSchemeTypes.includes(schemeType)) {
        const paymentAmount = Number(metalRate) * Number(selectedScheme.weight);
        formik.setFieldValue("payment_amount", paymentAmount);
        formik.setFieldValue("metal_weight", selectedScheme.weight);
        setIspayamtreadOnly(true);
      } else {
        formik.setFieldValue("payment_amount", selectedScheme.amount);
        setIspayamtreadOnly(true);
      }
    } else if (classificationOrder === 3) {
      if (selectedScheme.last_paid_amount === 0) {
        if (weightSchemeTypes.includes(schemeType)) {
          setMinWeight(selectedScheme?.id_scheme?.min_weight || 0);
          setMaxWeight(selectedScheme?.id_scheme?.max_weight || 0);
          setShowWeightInput(true);
          setIspayamtreadOnly(true);
        } else {
          setMinAmount(selectedScheme?.id_scheme?.min_amount || 0);
          setMaxAmount(selectedScheme?.id_scheme?.max_amount || 0);
          setShowAmountInput(true);
          setIspayamtreadOnly(false);
        }
      } else {
        if (weightSchemeTypes.includes(schemeType)) {
          formik.setFieldValue("metal_weight", selectedScheme.last_paid_weight);
          setIspayamtreadOnly(true);
        } else {
          formik.setFieldValue(
            "payment_amount",
            selectedScheme.last_paid_amount
          );
          setIspayamtreadOnly(true);
        }
      }
    } else {
      if (weightSchemeTypes.includes(schemeType)) {
        setMinWeight(selectedScheme?.id_scheme?.min_weight || 0);
        setMaxWeight(selectedScheme?.id_scheme?.max_weight || 0);
        setShowWeightInput(true);
        setIspayamtreadOnly(false);
      } else {
        setMinAmount(selectedScheme?.id_scheme?.min_amount || 0);
        setMaxAmount(selectedScheme?.id_scheme?.max_amount || 0);
        setShowAmountInput(true);
        setIspayamtreadOnly(false);
      }
    }
  }, [selectedScheme, metalRate]);

  useEffect(() => {
    if (formik.values.metal_weight && metalRate) {
      if (formik.values.metal_weight < minWeight) {
        formik.setFieldError(
          "metal_weight",
          "Metal can't be less than min weight"
        );
      }
      if (formik.values.metal_weight > maxWeight) {
        formik.setFieldError(
          "metal_weight",
          "Metal can't be greater than max weight"
        );
      }
      const calculatedAmount =
        Number(formik.values.metal_weight) * Number(metalRate);
      formik.setFieldValue("payment_amount", calculatedAmount);
    } else if (
      (weightSchemeTypes.includes(selectedScheme.scheme_type) &&
        formik.values.metal_weight === "") ||
      formik.values.metal_weight === 0
    ) {
      formik.setFieldValue("payment_amount", "");
    }
  }, [
    formik.values.metal_weight,
    metalRate,
    showWeightInput,
    selectedScheme.last_paid_weight,
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
    }
  }, [mobile]);

  const handleSearchmobile = () => {
    if (mobile === "") {
      return toast.error("Mobile Number is required!");
    }

    if (mobile !== "" && schemedata.length > 0 && fullData.length > 0) {
      return toast.error("Scheme accounts already fetched");
    }

    const searchData = {
      id_branch: formik.values.id_branch || id_branch,
      search_mobile: mobile,
    };

    handlesearchschemeaccount(searchData);
  };

  const handleautocompletemobile = (e) => {
    let value = e.target.value;
    if (!/^(\+)?\d*$/.test(value)) return;

    if (value.length <= 13) {
      setMobile(value);
    }

    if (formik.values.id_branch === "") {
      toast.error("Branch Id is required!");
    }
  };

  const handleCancel = () => {
    navigate("/payment/schemepayment");
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
    <div className="flex flex-row justify-between">
        <p className="text-sm text-gray-400 mt-4 mb-4">Payment / <span className="text-black">Scheme Payment</span></p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="">
          {/* <h2 className="text-xl font-medium mb-4">Customer Details</h2> */}
          <div className="flex flex-col lg:flex-row w-full justify-between">
            {/* Left column - form inputs */}
            <div className="lg:w-1/2 w-full bg-white border pt-[18px] pb-[18px] pr-[18px] pl-[18px]  rounded-md">
            <h2 className="text-lg font-semibold mb-4 pb-4">Customer Details</h2>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 lg:pr-2">
                {/* Branch selection */}
                {accessBranch === "0" && branch.length > 0 && !isLoading ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Branches <span className="text-red-500">*</span>
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
                    <label className="block text-sm font-medium mb-1">
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
                <div className="flex flex-col mt-2 relative">
                  <label className="text-black mb-1 font-normal">
                    Search Mobile Number
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={mobile}
                    onChange={handleautocompletemobile}
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Here"
                  />
                  <div
                    onClick={handleSearchmobile}
                    className="absolute inset-y-1/2 right-0 -translate-y-2 w-10 h-[62%] flex items-center justify-center cursor-pointer rounded-r-md"
                    style={{ backgroundColor: layout_color }}
                  >
                    <Search size={20} className="text-white" />
                  </div>
                </div>

                {/* Mobile accordion for scheme details */}
                <div className="lg:hidden">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={toggleAccordion}
                  >
                    <label className="text-black mb-2 font-normal">
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
                      <div className="bg-[#F8F9FA] lg:w-full rounded-lg flex flex-col p-4 lg:h-full">
                        <h2 className="text-xl font-bold text-[#023453] mb-4 text-center">
                          Scheme Details
                        </h2>
                        <div>
                          {/* Scheme details content */}
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">A/C Name</span>
                            <span className="text-gray-900">
                              {selectedScheme?.account_name || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Address</span>
                            <span className="text-gray-900">
                              {selectedScheme?.id_customer?.address || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Joined On</span>
                            <span className="text-gray-900">
                              {selectedScheme?.start_date
                                ? new Date(
                                    selectedScheme.start_date
                                  ).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Scheme A/C No</span>
                            <span className="text-gray-900">
                              {selectedScheme?.scheme_acc_number || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">
                              No of Gift Issues
                            </span>
                            <span className="text-gray-900">
                              {selectedScheme?.total_gifts_issued || "0"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Scheme Type</span>
                            <span className="text-gray-900">
                              {selectedScheme?.scheme_typename}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">
                              Total Paid Installment
                            </span>
                            <span className="text-gray-900">
                              {selectedScheme?.total_paidinstallments || "0"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">
                              Total Paid Amount
                            </span>
                            <span className="text-green-500">
                              {selectedScheme?.total_paidamount || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">
                              Total Metal Weight
                            </span>
                            <span className="text-gray-900">
                              {selectedScheme?.total_weight || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scheme account selection */}
                <div className="flex flex-col">
                  <label className="text-black mb-2 font-normal">
                    Scheme Account<span className="text-red-400"> *</span>
                  </label>
                  <Select
                    styles={customStyles}
                    isClearable={true}
                    options={schemedata || []}
                    placeholder="Select scheme Account"
                    value={schemedata?.find(
                      (option) =>
                        option.value === formik.values.id_scheme_account
                    )}
                    onChange={(option) => {
                      formik.setFieldValue("payment_amount", "");
                      formik.setFieldValue("metal_weight", "");

                      if (option?.value) {
                        formik.setFieldValue("id_scheme_account", option.value);
                        const selected = fullData.find(
                          (item) => item._id === option.value
                        );
                        setSelectedScheme(selected || {});
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

                {/* Payment date */}
                <div className="flex flex-col w-full">
                  <label className="text-black mb-2 font-normal">
                    Payment Date<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      name="date_payment"
                      disabled
                      selected={formik.values.date_payment}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select Date"
                      className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      wrapperClassName="w-full"
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                      <CalendarDays size={20} />
                    </span>
                  </div>
                </div>

                {/* Metal rate */}
                <div className="flex flex-col">
                  <label className="text-black mb-2 font-normal">
                    Today Rate<span className="text-red-400">*</span>
                  </label>
                  <input
                    name="metal_rate"
                    disabled
                    value={formik.values.metal_rate}
                    type="text"
                    className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder=""
                  />
                  <p style={{ color: "red" }}>{errors?.metal_rate}</p>
                </div>
                <div></div>
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-medium mb-4">
                    Scheme Account Details
                  </h2>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 border-t">
                    {/* Weight input for weight-based schemes */}
                    {showWeightInput && (
                      <div className="flex flex-col mt-4">
                        <label className="text-black mb-2 font-normal">
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
                            type="number"
                            name="metal_weight"
                            value={formik.values.metal_weight}
                            min={minWeight}
                            max={maxWeight}
                            step="0.01"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || "";
                              formik.setFieldValue("metal_weight", value);
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
                            className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Enter weight in grams"
                          />
                          <span
                            className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                            style={{ backgroundColor: layout_color }}
                          >
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
                      <label className="text-black mb-2 font-normal">
                        {showAmountInput ? "Enter Amount" : "Payment Amount"}
                        <span className="text-red-400">*</span>
                        {minAmount > 0 && maxAmount > 0 && showAmountInput && (
                          <span className="text-gray-500 text-sm ml-2">
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
                          max={maxAmount}
                          step="0.01"
                          onChange={formik.handleChange}
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
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter amount"
                        />
                        <span
                          className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                          style={{ backgroundColor: layout_color }}
                        >
                          INR
                        </span>
                      </div>
                      {formik.touched.payment_amount &&
                        formik.errors.payment_amount && (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.payment_amount}
                          </div>
                        )}
                    </div>

                    {/* Payment mode */}
                    <div className="flex flex-col mt-4">
                      <label className="text-black mb-2 font-normal">
                        Payment Mode<span className="text-red-400"> *</span>
                      </label>
                      <Select
                        styles={customStyles}
                        isClearable={true}
                        options={paymentmode}
                        placeholder="Select payment mode"
                        value={paymentmode?.find(
                          (option) =>
                            option.value === formik.values.payment_mode
                        )}
                        onChange={(option) => {
                          if (Number(option.mode) === 7) {
                            setSelectedMode(option.mode);
                          } else {
                            setSelectedMode("");
                          }
                          formik.setFieldValue(
                            "payment_mode",
                            option ? option.value : ""
                          );
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
                            <label className="text-black mb-2 font-normal">
                              {multipay.name}
                            </label>
                            <input
                              type="number"
                              name={multipay.parameter}
                              value={formik.values[multipay.parameter] || ""}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  multipay.parameter,
                                  Number(e.target.value) || ""
                                );
                              }}
                              className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="Enter amount here"
                            />
                          </div>
                        ))}
                      </>
                    )}

                    {/* ITR/UTR ID */}
                    <div className="flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        ITR/UTR ID
                      </label>
                      <input
                        type="text"
                        name="itr_utr"
                        value={formik.values.itr_utr}
                        onChange={formik.handleChange}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter ITR/UTR ID"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="col-span-full flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        Remarks
                      </label>
                      <input
                        name="remark"
                        value={formik.values.remark}
                        onChange={formik.handleChange}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter Here"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - scheme details (desktop) */}
            <div className="lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10 hidden lg:block">
              <div className="bg-white lg:w-full rounded-lg p-3 shadow-sm border border-gray-200">
                <h2 className="text-base font-semibold text-gray-800 mb-2">
                  Scheme Details
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <span className="text-black font-semibold">A/C Name</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900">
                        {selectedScheme?.account_name || "-"}
                      </span>
                    </div>
                  </div>

                  <div>
                  <div className="flex items-center">
                  <span className="text-black font-semibold">Address</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">
                      {selectedScheme?.id_customer?.address || "-"}
                    </span>
                  </div>
                  </div>

                  <div>
                  <div className="flex items-center">
                    <span className="text-black font-semibold">Joined On</span>
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

                  <div>
                  <div className="flex items-center">
                    <span className="text-black font-semibold">Scheme A/C No</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">
                      {selectedScheme?.scheme_acc_number || "-"}
                    </span>
                  </div>
                  </div>

                  <div>
                  <div className="flex items-center">
                    <span className="text-black font-semibold">No of Gift Issues</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">
                      {selectedScheme?.total_gifts_issued || "-"}
                    </span>
                  </div>
                  </div>

                 <div>
                 <div className="flex items-center">
                    <span className="text-black font-semibold">Scheme Type</span>
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

                  <div>
                  <div className="flex items-center">
                    <span className="text-black font-semibold">
                      Total Paid Installment
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">
                      {selectedScheme?.total_paidinstallments || "-"}
                    </span>
                  </div>
                  </div>

                 <div>
                 <div className="flex items-center">
                    <span className="text-black font-semibold">Total Paid Amount</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">
                      {selectedScheme?.total_paidamount || "-"}
                    </span>
                  </div>
                 </div>

                  <div>
                  <div className="flex items-center">
                    <span className="text-black font-semibold">Total Metal Weight</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">
                      {selectedScheme?.total_weight || "-"}
                    </span>
                  </div>
                  </div>

                  <div>
                  <div className="flex items-center">
                    <span className="text-black font-semibold">Total Overdue</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900">-</span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scheme Account Details */}
        </div>

        {/* Form buttons */}
        <div className="mt-6 pt-4">
          <div className="flex justify-end gap-4">
            <button
              className="bg-[#E2E8F0] text-black rounded-md px-6 py-2"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-[#61A375] text-white rounded-md px-6 py-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSchemePayment;
