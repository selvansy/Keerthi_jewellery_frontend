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

  //reduux
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const [searcherror, setSearchError] = useState("");
  const [multipaymode, setMultiPaymode] = useState([]);
  const [ispaymode, setIspaymode] = useState(false);

  const formattedDate = todaydate.toISOString();
  const [date_payment, setDatePayment] = useState(formattedDate);
  const [mobile, setMobile] = useState("");
  const [paymentmode, setPaymentmode] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ispayamtreadOnly, setIspayamtreadOnly] = useState(true);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [paymentamount, setPaymentAmount] = useState(0);
  // const [isseaccontno, setIsseAccontno] = useState(2);
  // const [issetreceipt, setIssetReceipt] = useState(2);
  // const [accountreadOnly, setAccountreadOnly] = useState(false);
  const [schemedata, setSchemeData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState({});
  const [weight] = useState([12, 3, 4]);
  const [selectedMode, setSelectedMode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [multiplayModes, setMultiplayModes] = useState("");
  const [formData, setFormData] = React.useState({
    id_customer: "",
    mobile: "",
    date_payment: date_payment,
    payment_mode: "",
    itr_utr: "",
    remark: "",
    scheme_acc_number: "",
    id_scheme: "",
    id_branch: id_branch,
    id_scheme_account: "",
    scheme_type: 0,
    // total_amt: 0,
    payment_amount: 0,
    metal_rate: 0,
    metal_weight: 0,
    accountschemeid: "",
    total_installments: 1,
    id_classification: "",
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

  const formik = useFormik({
    initialValues: {
      id_customer: "",
      mobile: 0,
      date_payment: date_payment,
      payment_mode: "",
      itr_utr: "",
      remark: "",
      scheme_acc_number: "",
      id_scheme: "",
      id_branch: "",
      id_scheme_account: "",
      scheme_type: 0,
      total_amt: 0,
      payment_amount: 0,
      metal_rate: 0,
      metal_weight: 0,
      // accountschemeid: "",
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
      metal_weight: Yup.number().optional("Metal weight is required"),
      payment_amount: Yup.number()
        .required("Payment amount is required")
        .min(0, "Payment amount must be greater than or equal to 0"),
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

  //api calls
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

  // const { data: multiplayModes } = useQuery({
  //   queryKey: ["multipay", formik.values.payment_mode],
  //   queryFn: async () => {
  //     console.log(typeof selectedMode)
  //     if (selectedMode === 7) {
  //       return await getmultipaymentmode();
  //     }
  //     return [];
  //   },
  // });

  useEffect(() => {
    const getMutliOptions = async () => {
      const data = await getmultipaymentmode();
      setMultiplayModes(data);
    };

    if (selectedMode === 7) {
      getMutliOptions();
    }
  }, [selectedMode]);

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

      if (response?.general) {
        setIsseAccontno(response?.general?.account_number);
        setIssetReceipt(response?.general?.display_receiptno);
      }
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  // useEffects
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
      try {
        const metalRate = await getMetalRateByMetalId(
          filteredData.id_scheme?.id_metal?._id || "",
          filteredData.id_scheme?.id_purity || "",
          todaydate
        );

        if (metalRate) {
          const rate = metalRate.data.rate;
          formik.setFieldValue("metal_rate", rate);
        }
      } catch (error) {
        console.error("Error fetching metal rate:", error);
      }
    };

    fetchMetalRate();
  }, [formik.values.id_scheme_account, fullData]);

  useEffect(() => {
    if (selectedScheme) {
      formik.setFieldValue("id_scheme", selectedScheme?.id_scheme?._id);
      formik.setFieldValue("id_branch", selectedScheme?.id_scheme?.id_branch);
      formik.setFieldValue("mobile", selectedScheme?.id_customer?.mobile);
      formik.setFieldValue(
        "id_classification",
        selectedScheme?.id_classification?._id
      );
      formik.setFieldValue("id_customer", selectedScheme?.id_customer?._id);
      if (
        weight.includes(selectedScheme?.id_scheme?.scheme_type) &&
        selectedScheme?.id_classification?.order === 2
      ) {
        console.log("first");
        formik.setFieldValue("payment_amount", selectedScheme.amount);
        setIspayamtreadOnly(true);
      } else if (
        !weight.includes(selectedScheme?.id_scheme?.scheme_type) &&
        selectedScheme?.id_classification?.order === 2
      ) {
        console.log("second");
        formik.setFieldValue("payment_amount", selectedScheme.amount);
        setIspayamtreadOnly(true);
      } else {
        console.log("third");
        setPaymentAmount(selectedScheme?.id_scheme?.amount);
        setIspayamtreadOnly(false);
      }
    }
  }, [selectedScheme]);

  useEffect(() => {
    if (id) {
      handlepaymentbyid({ id: id });
      setAccountreadOnly(true);
    }
  }, [id]);

  useEffect(() => {
    if (mobile === "" || mobile) {
      setSchemeData([]);
      setFullData([]);
      setSelectedScheme({});
      formik.setFieldValue("id_scheme_account", "");
    }
  }, [mobile]);

  //handler functions
  const handlepaymentbyid = async (data) => {
    if (!data) return;
    const response = await getschemepaymentbyid(data);
    if (response) {
      if (response.data.payment_mode === 6) {
        setIspaymode(true);
      } else {
        setIspaymode(false);
      }
      setSchemeData([
        {
          _id: response.data.id_scheme_account._id,
          id_scheme: response.data.id_scheme,
          scheme_acc_number: response.data.id_scheme_account.scheme_acc_number,
        },
      ]);

      let payment_amount = 0;
      if (response.data.id_scheme.scheme_type === 3) {
        setPaymentAmount(response.data.id_scheme.min_weight);
        payment_amount = response.data.id_scheme.min_weight;
        setIspayamtreadOnly(false);
      } else if (
        response.data.id_scheme.scheme_type === 4 ||
        response.data.id_scheme.scheme_type === 5 ||
        response.data.id_scheme.scheme_type === 7 ||
        response.data.id_scheme.scheme_type === 8 ||
        response.data.id_scheme.scheme_type === 9 ||
        response.data.id_scheme.scheme_type === 10
      ) {
        setPaymentAmount(response.data.id_scheme.min_amount);
        payment_amount = response.data.id_scheme.min_amount;
        setIspayamtreadOnly(false);
      } else {
        setPaymentAmount(response.data.id_scheme.amount);
        payment_amount = response.data.id_scheme.amount;
        setIspayamtreadOnly(true);
      }
      setSelectedId(response.data.id_scheme_account._id);
      setFormData({
        id_scheme_account: response.data.id_scheme_account._id,
        id_scheme: response.data.id_scheme._id,

        // id_classification: response.data.id_classification,

        mobile: response.data.id_customer.mobile,
        id_customer: response.data.id_customer._id,
        code: response.data.id_scheme.code,
        scheme_type: response.data.id_scheme.scheme_type,
        scheme_acc_number: response.data.id_scheme_account.scheme_acc_number,

        id_branch: response.data.id_scheme.id_branch,
        id_classification: response.data.id_scheme.id_classification,
        id: response.data._id,
        metal_rate: response.data.metal_rate,
        metal_weight: response.data.metal_weight,
        payment_receipt: response.data.payment_receipt,
        accountschemeid: response.data.id_scheme_account.accountschemeid,
        payment_amount: payment_amount,
        payment_mode: response.data.payment_mode,
        payment_type: 1,
        added_by: 0,
        total_installments: 1,
        itr_utr: response.data.itr_utr,
        remark: response.data.remark,
        total_amt: response.data.total_amt,
        // fine_amount: response.data.fine_amount,
        // buy_gst: response.data.gst_amount,
        cash_amount: response.data.cash_amount,
        gpay_amount: response.data.gpay_amount,
        card_amount: response.data.card_amount,
        date_payment: response.data.date_payment,
      });

      setSelectedScheme({
        _id: response.data.id_scheme_account._id,
        id_scheme_account: response.data.id_scheme_account._id,
        account_name: response.data.id_scheme_account.account_name,
        address: response.data.id_customer.address,
        id_scheme: response.data.id_scheme,
        scheme_acc_number: response.data.id_scheme_account.scheme_acc_number,
        start_date: response.data.id_scheme_account.start_date,
        total_paidamount: response.data.total_paidamount,
        total_paidinstallments: response.data.total_paidinstallments,
        total_weight: response.data.total_weight,
        total_gifts_issued: response.data.total_gifts_issued,
      });

      // setIdBranch(response.data.id_branch);
      setDatePayment(response.data.date_payment);
      setMobile(response.data.id_customer.mobile);
      setMetalRate(response.data.metal_rate);
    } else {
      toast.error("Customer not created!");
    }
  };

  const handleSearchmobile = () => {
    setSearchError("");

    if (mobile === "") {
      return toast.error("Mobile Number is required!");
    }

    if (mobile !== "" && schemedata.length > 0 && fullData.length > 0) {
      return toast.error("Scheme accounts alredy fetched");
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
      // setSearchMobile(value);
    }

    if (formData.id_branch === "") {
      toast.error("Branch Id is required!");
    }
  };

  console.log(formik.values);
  // const calculatepayment = () => {
  //   let total_amt = 0;
  //   let metalweight = 0;
  //   // Calculate GST if applicable
  //   if (parseInt(formik.values.buy_gst) > 0) {
  //     gstAmount =
  //       parseFloat(formik.values.payment_amount) *
  //       (parseFloat(formik.values.buy_gst) / 100);
  //   }

  //   // Calculate total amount based on scheme type
  //   if (![12, 3, 4].includes(selectedScheme?.scheme_type)) {
  //     // For schemes that are not weight-based
  //     total_amt = parseFloat(formik.values.payment_amount);
  //   } else {
  //     // For weight-based schemes
  //     metalweight =
  //       parseFloat(formik.values.payment_amount) /
  //       parseFloat(formik.values.metal_rate);
  //     total_amt = parseFloat(formik.values.payment_amount);
  //   }

  //   // Update form data with calculated values
  //   formik.setValues((prevValues) => ({
  //     ...prevValues,
  //     metal_weight: metalweight.toFixed(3),
  //     total_amt: Number(total_amt.toFixed(2)),
  //   }));
  // };

  // const handleschemebyid = async (data) => {
  //   if (!data) return;
  //   const response = await getschemeById(data);
  //   if (response) {
  //     if (response.data.scheme_type === 6) {
  //       setIspayable(true);
  //     } else {
  //       setIspayable(false);
  //     }

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       id_scheme: response.data._id,
  //       scheme_type: response.data.scheme_type,
  //       total_installments: response.data.total_installments,
  //       min_amount: response.data.min_amount,
  //       max_amount: response.data.max_amount,
  //       min_weight: response.data.min_weight,
  //       max_weight: response.data.max_weight,
  //     }));
  //   } else {
  //     toast.error("Customer not created!");
  //   }
  // };
  
  useEffect(() => {
    if (location.pathname === "/payment/schemepayment/add") {
      setHeader("Add Scheme Account");
      setReturnRoute("/payment/schemepayment");
    } else if (location.pathname === "/customer/digigold/add") {
      setHeader("Add Digi Gold Account");
      setReturnRoute("/customer/digigold");
    }
  }, [location.pathname]);

  const handleCancel = () => {
    navigate("/payment/schemepayment");
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-[#023453] font-bold justify-between">
          Scheme Payment
        </h2>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
          <div className="flex flex-col p-8 bg-white">
            <div className="space-y-6">
              <h2 className="text-xl font-medium mb-4">Customer Details</h2>
              <div className="flex flex-col lg:flex-row w-full justify-between">
                <div className="lg:w-1/2 w-full">
                  <div className="grid grid-cols-1 gap-4 lg:pr-2">
                    {accessBranch === "0" && branch.length > 0 && !isLoading ? (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Branches <span className="text-red-500">*</span>
                        </label>
                        <Select
                          styles={customStyles}
                          isClearable={true}
                          options={branch || []}
                          placeholder="Select Branch"
                          value={branch?.find(
                            (option) => option.value === formik.values.id_branch
                          )}
                          onChange={(option) =>
                            formik.setFieldValue(
                              "id_branch",
                              option.value || ""
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
                        <label className="block text-sm text-gray-500 font-medium mb-1">
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

                      {/* Search Icon */}
                      <div
                        onClick={handleSearchmobile}
                        className="absolute inset-y-1/2 right-0 -translate-y-2 w-10 h-[62%] flex items-center justify-center cursor-pointer rounded-r-md"
                        style={{ backgroundColor: layout_color }}
                      >
                        <Search size={20} className="text-white" />
                      </div>
                    </div>
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
                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">A/C Name</span>
                                <span className="text-gray-900">
                                  {selectedScheme?.account_name || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">Address</span>
                                <span className="text-gray-900">
                                  {selectedScheme?.id_customer?.address ||
                                    "N/A"}
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
                                <span className="text-gray-600">
                                  Scheme A/C No
                                </span>
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
                                <span className="text-gray-600">
                                  Scheme Type
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.scheme_typename}
                                </span>
                              </div>

                              <div className="flex justify-between py-1">
                                <span className="text-gray-600">
                                  Total Paid Installment
                                </span>
                                <span className="text-gray-900">
                                  {selectedScheme?.total_paidinstallments ||
                                    "0"}
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
                          if (option?.value) {
                            formik.setFieldValue(
                              "id_scheme_account",
                              option.value
                            );
                          } else {
                            formik.setFieldValue("id_scheme_account", "");
                          }
                        }}
                      />
                      {formik.errors.id_scheme_account && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.id_scheme_account}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-black mb-2 font-normal">
                        Payment Date<span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <DatePicker
                          name="date_payment"
                          disabled
                          selected={formData.date_payment}
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

                    {/* {issetreceipt === 1 && (
                      <div className="flex flex-col">
                        <label className="text-black mb-2 font-normal">
                          Receipt<span className="text-red-400">*</span>
                        </label>
                        <input
                          name="payment_receipt"
                          disabled
                          value={formData.payment_receipt}
                          onChange={(e) => {
                            filterInputchange(e);
                          }}
                          type="text"
                          className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder=""
                        />
                        <p style={{ color: "red" }}>
                          {errors?.payment_receipt}
                        </p>
                      </div>
                    )} */}
                  </div>
                </div>
                <div className="lg:w-1/2 w-full items-center justify-center lg:pl-10 lg:pr-10">
                  <div className="bg-[#F8F9FA] lg:w-full rounded-lg flex-col p-4 lg:h-full hidden lg:block shadow-md">
                    <h2 className="text-xl font-bold text-[#023453] mb-4 text-center">
                      Scheme Details
                    </h2>
                    <div>
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
                        <span className="text-gray-600">No of Gift Issues</span>
                        <span className="text-gray-900">
                          {selectedScheme?.total_gifts_issued || "0"}
                        </span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Scheme Type</span>
                        <span className="text-gray-900">
                          {selectedScheme?.scheme_typename
                            ?.charAt(0)
                            .toUpperCase() +
                            selectedScheme?.scheme_typename?.slice(1) || "N/A"}
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
                        <span className="text-gray-600">Total Paid Amount</span>
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
              </div>
              <div>
                <h2 className="text-xl font-medium mb-4">
                  Scheme Account Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Total Amount<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={ispayamtreadOnly}
                        name="payment_amount"
                        value={formik.values.payment_amount}
                        min="0"
                        {...formik.getFieldProps("payment_amount")}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter here"
                      />

                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                        style={{ backgroundColor: layout_color }}
                      >
                        INR
                      </span>
                    </div>
                    <p style={{ color: "red" }}>{errors?.payment_amount}</p>
                  </div>
                  {[12, 3, 4].includes(selectedScheme.scheme_type) && (
                    <div className="flex flex-col">
                      <label className="text-black mb-2 font-normal">
                        Saved Weight<span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          disabled
                          name="metal_weight"
                          value={formik.values.metal_weight}
                          min="0"
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
                          placeholder="Enter here"
                        />
                        <span
                          className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-white rounded-r-md"
                          style={{ backgroundColor: layout_color }}
                        >
                          GM
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Payment Mode<span className="text-red-400"> *</span>
                    </label>
                    <Select
                      styles={customStyles}
                      isClearable={true}
                      options={paymentmode}
                      placeholder="Select payment mode"
                      value={paymentmode?.find(
                        (option) => option.value === formik.values.payment_mode
                      )}
                      onChange={(option) => {
                        if (Number(option.mode) === 7) {
                          setSelectedMode(option.mode);
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
                  {ispaymode && (
                    <>
                      {multiplayModes?.data?.map((multipay) => (
                        <div key={multipay.parameter} className="flex flex-col">
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
                  <div className="flex flex-col">
                    <label className="text-black mb-2 font-normal">
                      Remarks
                    </label>
                    <textarea
                      name="remark"
                      value={formik.values.remark}
                      onChange={formik.handleChange}
                      className="border-2 max-h-2 border-gray-300 rounded-md p-2 min-h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter Here"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 mt-6 pt-4">
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
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSchemePayment;