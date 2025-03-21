import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, Search, Send } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  searchmobileschemeaccount,
  allschemestatus,
  getallbranch,
  getallpaymentmodes,
  getallpaymentmode,
} from "../../../api/Endpoints";
import Modal from "../../common/Modelone";
import ModelOne from "../../common/Modelone";
import RevertForm from "./RevertForm";

const AddCloseAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux selectors
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  // State variables
  const [schemedata, setSchemeData] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemestatus, setSchemeStatus] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [paymentModeOptions, setPaymentModeOptions] = useState([]);
  const [refundtype, setRefundType] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [mobileNum, setMobileNum] = useState("");
  const [otpNumber, setOtpNumber] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [dynamic, setDynamic] = useState(false);
  const [totalAmount, setAmount] = useState(0);
  const [isviewOpen, setIsviewOpen] = useState(false);

  // Format today's date
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  // Validation schema
  const validationSchema = Yup.object({
    status: dynamic
      ? Yup.number().required("Status is required")
      : Yup.number(),
    id_scheme_account: Yup.string().required("Scheme account is required"),
    id_branch: Yup.string().required("Branch is required"),
    comments: Yup.string().required("Comments are required"),
    bill_no: Yup.string().required("Bill number is required"),
    bill_date: Yup.string().required("Bill date is required"),
    mobile: Yup.string()
      .required("Mobile is required")
      .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
    refund_paymenttype: refundtype
      ? Yup.string().required("Refund payment type is required")
      : Yup.string(),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      status: !dynamic ? 1 : "",
      id_scheme_account: "",
      comments: "",
      bill_no: "",
      id_branch: id_branch ||"",
      bill_date: formattedDate,
      return_amount: 0,
      refund_paymenttype: "",
      mobile: "",
      penalty_amount: "",
      total_paidamount: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validateOnBlur: true,
    validateOnChange: false, 
  });
  console.log(formik.errors)

  const { data: paymentModes } = useQuery({
    queryKey: ["paymentModes"],
    queryFn: getallpaymentmode,
  });

  useEffect(() => {
    const lastPart = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1
    );
    if (lastPart === "preclose") {
      setDynamic(true);
    } else {
      setDynamic(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (paymentModes) {
      const data = paymentModes.data
        .filter((item) => item.id_mode !== 7)
        .map((item) => ({
          mode: item.id_mode,
          value: item._id,
          label: item.mode_name,
        }));

      setPaymentModeOptions(data);
    }
  }, [paymentModes]);

  useEffect(() => {
    if (formik.values.total_paidamount && formik.values.penalty_amount) {
      const newPayment =
        Number(formik.values.total_paidamount) -
        Number(formik.values.penalty_amount);
      formik.setFieldValue("total_paidamount", newPayment);
    } else if (
      formik.values.penalty_amount <= 0 ||
      formik.values.penalty_amount === ""
    ) {
      formik.setFieldValue("total_paidamount", totalAmount);
    }
  }, [formik.values.penalty_amount, totalAmount]);

  // OTP timer effect
  useEffect(() => {
    let countdown;

    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  // Initial data loading
  useEffect(() => {
    getallbranchMutate();
    handleallschemestatus();
    handlePaymentmodes({
      page: 1,
      limit: 10,
      added_by: "",
      from_date: "",
      to_date: "",
    });
  }, []);

  // Fetch scheme accounts when branch or mobile changes
  // useEffect(() => {
  //   if (formik.values.mobile && formik.values.id_branch) {
  //     handlesearchschemeaccount({
  //       search_mobile: formik.values.mobile,
  //       id_branch: formik.values.id_branch
  //     });
  //   }
  // }, [formik.values.mobile, formik.values.id_branch]);

  // Handle search mobile click
  const handleSearchMobile = () => {
    if (!formik.values.mobile) {
      toast.error("Mobile Number is required!");
      return;
    }

    if (formik.values.id_branch) {
      handlesearchschemeaccount({
        search_mobile: formik.values.mobile,
        id_branch: formik.values.id_branch,
      });
    } else {
      toast.error("Branch selection is required!");
      formik.setFieldTouched("id_branch", true);
    }
  };

  // Branch API mutation
  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response?.data) {
        const options = response.data.map((branch) => ({
          value: branch._id,
          label: branch.branch_name,
        }));
        setBranchOptions(options);
      }
    },
  });

  // Search scheme account API mutation
  const { mutate: handlesearchschemeaccount } = useMutation({
    mutationFn: searchmobileschemeaccount,
    onSuccess: (response) => {
      if (response?.data) {
        setSchemeData(response.data);
        toast.success(response.message);
      }
    },
    onError:(error)=>{
      console.log(error)
      toast.error(error.response.data.message)
    }
  });

  // Scheme status API mutation
  const { mutate: handleallschemestatus } = useMutation({
    mutationFn: allschemestatus,
    onSuccess: (response) => {
      if (response?.data) {
        setSchemeStatus(response.data);
      }
    },
  });

  // Payment modes API mutation
  const { mutate: handlePaymentmodes } = useMutation({
    mutationFn: getallpaymentmodes,
    onSuccess: (response) => {
      if (response?.data) {
        console.log(response.data);
        const options = response.data.map((mode) => ({
          value: mode._id,
          label: mode.mode_name,
        }));
        setPaymentModeOptions(options);
      }
    },
  });

  // Send OTP API mutation
  const { mutate: postSendOtpMobile } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        setTimer(60);
        setCanResend(false);
      }
    },
  });

  // Verify OTP API mutation
  const { mutate: postVerifyOtp } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
      }
    },
  });

  // Close bill API mutation
  const { mutate: BillClose } = useMutation({
    mutationFn: closeBill,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
       if(formik.values.status === 1){
        navigate("/report/redemptionsummary/");
       }else if(Number(formik.values.status) === 3){
        navigate("/reports/preclosesummary");
       }else{
        navigate('/report/refund/')
       }
      }
    },
  });

  //handler functions
  function closeIncommingModal() {
    setIsviewOpen(false);
  }

  // Send OTP handler
  const sendOtpToMobile = () => {
    const mobileToUse = mobileNum || formik.values.mobile;

    if (!mobileToUse) {
      toast.error("Mobile number is required");
      return;
    }

    postSendOtpMobile({
      mobile: mobileToUse,
      otp: otpNumber,
      branchId: formik.values.id_branch,
    });
  };

  // Verify OTP handler
  const handleVerifyOtp = () => {
    if (!otpNumber) {
      toast.error("OTP is required");
      return;
    }

    postVerifyOtp({
      mobile: mobileNum || formik.values.mobile,
      otp: otpNumber,
      branchId: formik.values.id_branch,
    });
  };

  // Handle scheme account selection
  const handleSchemeAccountChange = (selectedOption) => {
    formik.setFieldValue("id_scheme_account", selectedOption.value);

    const scheme = schemedata.find(
      (scheme) => scheme._id === selectedOption.value
    );
    if (scheme) {
      setSelectedScheme(scheme);

      setAmount(scheme.total_paidamount);
      formik.setFieldValue("total_paidamount", scheme.total_paidamount);
      if (scheme.id_customer?.mobile) {
        setMobileNum(scheme.id_customer.mobile);
      }
    }
  };

  // Handle status change
  const handleStatusChange = (selectedOption) => {
    formik.setFieldValue("status", selectedOption.value);

    // Show refund options if status is 4 (refund)
    if (selectedOption.value === 4) {
      setRefundType(true);
    } else {
      setRefundType(false);
      formik.setFieldValue("refund_paymenttype", "");
    }
  };

  // Handle bill date change
  const handleDatePaymentChange = (date) => {
    if (!date) return;

    const formattedDate = date.toISOString().split("T")[0];
    formik.setFieldValue("bill_date", formattedDate);
  };

  // Submit form handler
  const handleSubmit = (values) => {
    if (showVerification && !otpNumber) {
      toast.error("OTP verification is required");
      return;
    }
    BillClose(values);
  };

  // Filter scheme statuses to exclude status 2 and 0
  const schemeStatusOptions = schemestatus
    .filter((status) => status.id_status !== 0 && status.id_status !== 2)
    .map((status) => ({
      value: status.id_status,
      label: status.status_name,
    }));

  // Create scheme account options
  const schemeAccountOptions = schemedata.map((account) => {
    let label = account.id_scheme.scheme_name;

    if ([4, 5, 6, 7, 8, 9, 10].includes(account.id_scheme.scheme_type)) {
      label += ` (Rs. ${account.id_scheme.min_amount} - Rs. ${account.id_scheme.max_amount})`;
    } else if (account.id_scheme.scheme_type === 3) {
      label += ` (${account.id_scheme.min_weight} - ${account.id_scheme.max_weight})`;
    } else if ([0, 1, 2].includes(account.id_scheme.scheme_type)) {
      label += ` (Rs. ${account.id_scheme.amount})`;
    }

    label += ` - (${account.scheme_acc_number || "Not Allocated"})`;

    return {
      value: account._id,
      label,
    };
  });

  const handleOpenRevert = () => {
    setIsviewOpen(true);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-[#023453] font-bold justify-between">
          {dynamic ? "Preclose" : "Closed Account"}
        </h2>
        {!dynamic && (
          <div className="flex flex-row items-center justify-end gap-2">
          <button
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleOpenRevert}
            style={{ backgroundColor: layout_color }}
          >
            + Revert account
          </button>
        </div>
        )}
      </div>

      <div className="w-full flex flex-col bg-white pl-8 pr-8 pb-4 border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-8">
            {/* Branch Selection */}
            <div className="flex flex-col my-3">
              <label className="text-black mt-3 font-normal">
                Branch<span className="text-red-400"> *</span>
              </label>
              <div className="relative my-3">
                <Select
                  name="id_branch"
                  options={branchOptions}
                  className="w-1/2"
                  placeholder="Select Branch"
                  onChange={(option) => {
                    formik.setFieldValue("id_branch", option.value);
                    formik.setFieldTouched("id_branch", true);
                  }}
                  onBlur={() => formik.setFieldTouched("id_branch", true)}
                  isSearchable
                  classNamePrefix="select"
                />
                {formik.touched.id_branch && formik.errors.id_branch && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.id_branch}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search */}
            <div className="flex flex-col mt-2 relative">
              <label className="text-black mb-1 font-normal">
                Search Mobile Number<span className="text-red-400">*</span>
              </label>
              <div className="relative w-1/2">
                <input
                  type="text"
                  name="mobile"
                  className="border-2 w-full border-gray-300 rounded-md p-2"
                  placeholder="Enter Here"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div
                  onClick={handleSearchMobile}
                  className="absolute flex items-center justify-center cursor-pointer right-0 top-0 h-full w-10 rounded-r-md"
                  style={{ backgroundColor: layout_color }}
                >
                  <Search size={22} className="text-white" />
                </div>
              </div>
              {formik.touched.mobile && formik.errors.mobile && (
                <div className="text-red-500 text-sm">
                  {formik.errors.mobile}
                </div>
              )}
            </div>

            {/* Scheme Account Details Section */}
            <h2 className="text-1xl font-bold mb-4 mt-4">
              Scheme Account Details
            </h2>
            <div className="grid grid-rows-1 md:grid-cols-2 gap-5">
              {/* Scheme Account Selection */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Scheme Account<span className="text-red-400">*</span>
                </label>
                <Select
                  name="id_scheme_account"
                  options={schemeAccountOptions}
                  className="w-full"
                  placeholder="Select Scheme Account"
                  onChange={handleSchemeAccountChange}
                  onBlur={() =>
                    formik.setFieldTouched("id_scheme_account", true)
                  }
                  isSearchable
                  classNamePrefix="select"
                />
                {formik.touched.id_scheme_account &&
                  formik.errors.id_scheme_account && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.id_scheme_account}
                    </div>
                  )}
              </div>

              {/* Close Type */}
              {dynamic && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Close Type<span className="text-red-400">*</span>
                  </label>
                  <Select
                    name="status"
                    options={schemeStatusOptions}
                    className="w-full"
                    placeholder="Select Close Type"
                    onChange={handleStatusChange}
                    onBlur={() => formik.setFieldTouched("status", true)}
                    isSearchable
                    classNamePrefix="select"
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
              )}

              {/* Scheme Account Number */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Scheme Account Number
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  placeholder="Scheme"
                  value={selectedScheme?.scheme_acc_number || ""}
                  readOnly
                />
              </div>

              {/* Refund Type (Conditional) */}
              {refundtype && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Refund Type<span className="text-red-400">*</span>
                  </label>
                  <Select
                    name="refund_paymenttype"
                    options={paymentModeOptions}
                    className="w-full"
                    placeholder="Select Refund Type"
                    onChange={(option) => {
                      formik.setFieldValue("refund_paymenttype", option.value);
                      formik.setFieldTouched("refund_paymenttype", true);
                    }}
                    onBlur={() =>
                      formik.setFieldTouched("refund_paymenttype", true)
                    }
                    isSearchable
                    classNamePrefix="select"
                  />
                  {formik.touched.refund_paymenttype &&
                    formik.errors.refund_paymenttype && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.refund_paymenttype}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Customer Details Section */}
            <h2 className="text-1xl font-bold mb-4 mt-4">Customer Details</h2>
            <div className="grid grid-rows-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Customer Name
                </label>
                <input
                  disabled
                  type="text"
                  value={selectedScheme?.account_name || ""}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  placeholder="Customer Name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">Address</label>
                <input
                  disabled
                  type="text"
                  value={selectedScheme?.id_customer?.address || ""}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  placeholder="Customer Address"
                />
              </div>
            </div>

            {/* Close Form Details Section */}
            <h2 className="text-1xl font-bold mb-4 mt-4">Close Form Details</h2>
            <div className="grid grid-rows-2 md:grid-cols-2 gap-5">
              {/* Bill No */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Bill No<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  placeholder="Bill No"
                  name="bill_no"
                  onChange={formik.handleChange}
                  value={formik.values.bill_no}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bill_no && formik.errors.bill_no && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.bill_no}
                  </div>
                )}
              </div>

              {/* Bill Date */}
              <div className="flex flex-col w-full">
                <label className="text-black mb-2 font-normal">
                  Bill Date<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    selected={
                      formik.values.bill_date
                        ? new Date(formik.values.bill_date)
                        : null
                    }
                    onChange={handleDatePaymentChange}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
                    onBlur={() => formik.setFieldTouched("bill_date", true)}
                  />
                  <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                    <CalendarDays size={20} />
                  </span>
                  {formik.touched.bill_date && formik.errors.bill_date && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.bill_date}
                    </div>
                  )}
                </div>
              </div>

              {/* Paid Installment */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Paid Installment
                </label>
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                  placeholder="Paid Installment"
                  value={selectedScheme?.total_paidinstallments || ""}
                  disabled
                />
              </div>

              {/* Paid Amount */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Paid Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedScheme?.last_paid_amount || ""}
                    min="0"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    placeholder="Enter Product Price"
                    disabled
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">
                    INR
                  </span>
                </div>
              </div>

              {/* Gift Amount */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Gift Amount<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedScheme?.general?.gift_issues || ""}
                    min="0"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    placeholder="Enter Product Price"
                    disabled
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">
                    INR
                  </span>
                </div>
              </div>

              {refundtype && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Penalty amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="penalty_amount"
                      {...formik.getFieldProps("penalty_amount")}
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                      placeholder="Penalty charges"
                      value={formik.values.penalty_amount || ""}
                    />
                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">
                      INR
                    </span>
                  </div>
                </div>
              )}

              {/* Total Close Amount */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Total Amount<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    placeholder="Total amount"
                    value={formik.values.total_paidamount}
                    disabled={!dynamic}
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">
                    INR
                  </span>
                </div>
              </div>

              {/* Add wallet point */}
              {/* {!dynamic && (
                <div className="flex flex-col">
                  <label className="text-black mb-1 font-normal">
                    Add wallet point
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="border-2 border-gray-300 rounded-md p-2 w-full"
                      placeholder="Add wallet points"
                      name="wallet_point"
                      value={
                        formik.values.wallet_points ||
                        selectedScheme?.wallet_points ||
                        ""
                      }
                      {...formik.getFieldProps("wallet_points")}
                    />
                  </div>
                </div>
              )} */}

              {/* Remarks */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-normal">
                  Remarks<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                    placeholder="Remarks"
                    name="comments"
                    onChange={formik.handleChange}
                    value={formik.values.comments}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.comments && formik.errors.comments && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.comments}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* OTP Verification Section */}
            <div className="flex flex-col w-full mt-2">
              <div className="flex flex-row items-center">
                <input
                  type="checkbox"
                  className="w-8 h-5 accent-blue-600"
                  checked={showVerification}
                  onChange={() => setShowVerification(!showVerification)}
                />
                <h2 className="text-lg text-[#023453] font-bold whitespace-nowrap px-2 my-3">
                  To close & refund the account with OTP verification, kindly
                  check the checkbox.
                </h2>
              </div>
            </div>

            {showVerification && (
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
                {/* Mobile Number Input */}
                <div className="flex flex-col mt-2 relative">
                  <label className="text-black mb-1 font-normal">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-2 w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter Here"
                    onChange={(e) => setMobileNum(e.target.value)}
                    defaultValue={
                      selectedScheme?.id_customer?.mobile ||
                      formik.values.mobile ||
                      ""
                    }
                  />
                  <div
                    onClick={sendOtpToMobile}
                    className="absolute flex items-center justify-center cursor-pointer right-0 top-[30px] w-10 h-10 bg-[#023453] rounded-md transition"
                  >
                    <Send size={22} className="text-white" />
                  </div>
                </div>

                {/* OTP Input */}
                <div className="flex flex-col mt-2 relative">
                  <label className="text-black mb-1 font-normal">
                    OTP Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="border-2 w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtpNumber(e.target.value)}
                    value={otpNumber}
                  />
                  <div
                    onClick={handleVerifyOtp}
                    className="absolute flex items-center justify-center cursor-pointer right-0 top-[30px] w-10 h-10 bg-[#023453] rounded-md transition"
                  >
                    <Send size={22} className="text-white" />
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex flex-col text-sm text-gray-600 mt-1">
                  {canResend ? (
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={sendOtpToMobile}
                    >
                      Resend OTP
                    </span>
                  ) : (
                    `Resend OTP in ${timer} seconds`
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={() => formik.resetForm()}
              >
                Clear
              </button>
              <button
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <ModelOne
          title={"Revert close account"}
          extraClassName="max-w-lg"
          setIsOpen={setIsviewOpen}
          isOpen={isviewOpen}
          closeModal={closeIncommingModal}
        >
          <RevertForm isviewOpen={isviewOpen} setIsOpen={setIsviewOpen} />
        </ModelOne>
        <Modal />
      </div>
    </>
  );
};

export default AddCloseAccount;
