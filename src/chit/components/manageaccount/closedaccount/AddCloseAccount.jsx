import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search,  } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
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
  sendOtp,
  closeBill,
  verifyOtp,
  customSearchScheme
} from "../../../api/Endpoints";
import RevertForm from "./RevertForm";
import customSelectStyles from "../../common/customSelectStyles";
import CalenderNew from "../../../../assets/icons/calendarNew.svg";
import CheckboxToggle from "../../common/checkBox";
import ModelOne from "../../common/Modelone";
import VerificationModal from "./VerificationModal";
import OtpCompleted from "./OtpCompleted";
import SpinLoading from "../../common/spinLoading";
import { formatNumber } from "../../../utils/commonFunction";

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
  const [dynamic, setDynamic] = useState(false);
  const [totalAmount, setAmount] = useState(0);
  const [isviewOpen, setIsviewOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [otpSended, setSendOtp] = useState(false);
  const [otpCompleted, setOtpComplete] = useState(false);
  const [viewRevertForm, setReverView] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoading1, setLoading1] = useState(false);
  const [bonusAmnt, setBonusAmnt] = useState(0);
  const [bonustype, setBonusType] = useState(null);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

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
      .required("Mobile is required"),
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
      id_branch: id_branch || "",
      bill_date: formattedDate,
      return_amount: 0,
      refund_paymenttype: "",
      mobile: "",
      penalty_amount: "",
      total_paidamount: 0,
      otpMobile: "",
      total_amount: 0
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

  // Calculate bonus when scheme or bonus type changes
  useEffect(() => {
    console.log(bonusAmnt,bonustype)
    if (!selectedScheme) return;

    const baseAmount = selectedScheme.total_paidamount || 0;
    let calculatedAmount = baseAmount;

    if (bonustype === 1) {
      // Fixed amount bonus
      console.log("first")
      calculatedAmount = baseAmount + (bonusAmnt || 0);
      console.log(calculatedAmount)
    } else if (bonustype === 2) {
      // Percentage bonus
      console.log(" 1")
      calculatedAmount = baseAmount + (baseAmount * (bonusAmnt || 0) / 100);
      console.log(calculatedAmount)
    }

    setCalculatedTotal(calculatedAmount);
    formik.setFieldValue("total_paidamount", calculatedAmount);
    formik.setFieldValue("total_amount", baseAmount); // Original amount without bonus

  }, [selectedScheme, bonustype, bonusAmnt]);

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

  // useEffect(() => {
  //   if (formik.values.total_paidamount) {
  //     const newPayment = Number(formik.values.total_paidamount);
  //     formik.setFieldValue("total_paidamount", newPayment);
  //   } else if (
  //     formik.values.penalty_amount <= 0 ||
  //     formik.values.penalty_amount === ""
  //   ) {
  //     formik.setFieldValue("total_paidamount", calculatedTotal || totalAmount);
  //   }
  // }, [formik.values.penalty_amount, totalAmount, calculatedTotal]);

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

  // Handle search mobile click
  const handleSearchMobile = () => {
    if (!formik.values.mobile) {
      toast.error("Mobile Number is required!");
      return;
    }

    if(!formik.values.id_branch){
      return toast.error("Choose a branch first")
    }

    if (formik.values.id_branch) {
      setLoading1(true)
      handlesearchschemeaccount({
        search_mobile: formik.values.mobile,
        id_branch: formik.values.id_branch,
        status: !dynamic ?  [2] : [0]
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
  const { mutate: handlesearchschemeaccount} = useMutation({
    mutationFn: customSearchScheme,
    onSuccess: (response) => {
      if (response?.data && response.data.length > 0) {
        setSchemeData(response.data);
        toast.success(response.message);
        setLoading1(false)
      }else{
        setLoading1(false)
        toast.error("No scheme account to close")
      }
    },
    onError: (error) => {
      setLoading1(false)
      toast.error(error.response.data.message);
    },
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
        if (response && !otpSended) {
          setSendOtp(!otpSended);
          setLoading(false);
        }
      }
    },
  });

  // Verify OTP API mutation
  const { mutate: postVerifyOtp } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      if (response) {
        if (response.status) {
          setSendOtp(false);
        }
        toast.success(response.message);
      }
    },
    onError: (error) => {
      setValidity(true);
    },
  });

  // Close bill API mutation
  const { mutate: BillClose } = useMutation({
    mutationFn: closeBill,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        if (formik.values.status === 1) {
          navigate("/report/redemptionsummary/");
        } else if (Number(formik.values.status) === 3) {
          navigate("/reports/preclosesummary");
        } else {
          navigate("/report/refund/");
        }
      }
    },
  });

  // Send OTP handler
  const sendOtpToMobile = (e) => {
    if (e) {
      e.preventDefault();
    }
    const mobileToUse = mobileNum || formik.values.mobile;

    if (!mobileToUse) {
      toast.error("Mobile number is required");
      return;
    }

    if (!formik.values.id_branch) {
      toast.error("Choose a branch first");
      return;
    }

    setLoading(true);
    postSendOtpMobile({
      mobile: mobileToUse,
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
      
      if (scheme.id_customer?.mobile) {
        setMobileNum(scheme.id_customer.mobile);
      }
      
      // Set bonus information
      if (scheme?.id_scheme?.bonus_type !== null) {
        setBonusType(scheme.id_scheme.bonus_type);
        if (scheme.id_scheme.bonus_type === 1) {
          setBonusAmnt(scheme.id_scheme.bonus_amount);
        } else if (scheme.id_scheme.bonus_type === 2) {
          setBonusAmnt(scheme.id_scheme.bonus_percent);
        }
      } else {
        setBonusType(null);
        setBonusAmnt(0);
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

    const SelectedDate = date.toISOString().split("T")[0];

    if (SelectedDate < formattedDate) {
      return toast.error(
        "Not allowed to choose a date older than current date"
      );
    } else {
      formik.setFieldValue("bill_date", SelectedDate);
    }
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

  const handleOpenRevert = (e) => {
    e.preventDefault();
    setReverView(true);
  };

  const handleOtpToggle = () => {
    setChecked(!checked);
  };

  function closeIncommingModal(e) {
    e.preventDefault();
    setSendOtp(false);
    setIsviewOpen(false);
  }

  const handleOtpComplete = () => {
    setOtpComplete(true);
    setSendOtp(false);
    setReverView(false);
  };

  console.log(formik.values)

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="w-full mx-auto space-y-6">
        <div className="flex flex-row justify-between items-center mt-4 mb-4">
          <p className="text-sm text-gray-400 mb-3">
            Manage Customers /{" "}
            <span className="text-black">
              {" "}
              {dynamic ? "Pre Close Account" : "Closed Accounts"}
            </span>
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border">
          <div className="flex flex-row justify-between mb-4 border-b pb-4">
            <h2 className="text-lg font-semibold ">
              {dynamic ? "Pre Close Account" : "Closed Accounts"}
            </h2>
            {!dynamic && (
              <div>
                <button
                  className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                  onClick={(e) => handleOpenRevert(e)}
                  style={{ backgroundColor: layout_color }}
                >
                  + Revert account
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Branche <span className="text-red-500">*</span>
                </label>
                <Select
                  styles={customSelectStyles(true)}
                  isClearable={true}
                  options={branchOptions}
                  placeholder="Select Branch"
                  value={
                    branchOptions.find(
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
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Search Mobile Number / AC No
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="mobile"
                  className="w-full border-2 border-[#f2f3f8] rounded-md p-2"
                  placeholder="Enter Mobile No / AC No"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div
                  onClick={handleSearchMobile}
                  disabled={isLoading1}
                  className="absolute  flex items-center justify-center cursor-pointer right-0 top-0 h-full w-10 rounded-r-md"
                >
                  {isLoading1 ? (
                    <SpinLoading 
                    customCss="black"
                    />
                  ) : (
                    <Search size={22} className="text-[#6C7086]" />
                  )}
                </div>
              </div>
              {formik.touched.mobile && formik.errors.mobile && (
                <div className="text-red-500 text-sm">
                  {formik.errors.mobile}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4 border-b pb-4">
              Scheme Account Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Scheme Account<span className="text-red-400"> *</span>
              </label>
              <Select
                name="id_scheme_account"
                options={schemeAccountOptions}
                styles={customSelectStyles(true)}
                className="w-full"
                placeholder="Select Scheme Account"
                onChange={handleSchemeAccountChange}
                onBlur={() => formik.setFieldTouched("id_scheme_account", true)}
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

            {dynamic && (
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Close Type<span className="text-red-400"> *</span>
                </label>
                <Select
                  name="status"
                  styles={customSelectStyles(true)}
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

            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1">
                Scheme Account Number
              </label>
              <input
                type="text"
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
                placeholder="Scheme"
                value={selectedScheme?.scheme_acc_number || ""}
                readOnly
              />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4 border-b pb-4">
              Customer Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                readOnly
                type="text"
                value={selectedScheme?.account_name || ""}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
                placeholder="Customer Name"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                readOnly
                type="text"
                value={selectedScheme?.id_customer?.address || ""}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
                placeholder="Customer Address"
              />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4 border-b pb-4">
              Close Form Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Bill No <span className="text-red-400"> *</span>
              </label>
              <input
                type="text"
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
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

            <div>
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
                  className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                  onBlur={() => formik.setFieldTouched("bill_date", true)}
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                  <img src={CalenderNew} className="w-5 h-5" />
                </span>
                {formik.touched.bill_date && formik.errors.bill_date && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.bill_date}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium mb-1">
                Paid Installments
              </label>
              <input
                disabled
                type="text"
                value={selectedScheme?.total_paidinstallments || ""}
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
                placeholder="Paid Installments"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Paid Amount
              </label>
              <div className="relative">
                <input
                  disabled
                  type="text"
                  value={formatNumber({value: formik.values.total_amount, decimalPlaces: 0, currency: null}) || ""}
                  className="border-2 border-[#f2f3f8] pl-10 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Paid Amount"
                />
                <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                  ₹
                </span>
              </div>
            </div>

            {bonustype !== null && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {bonustype === 1 ? "Bonus Amount" : "Bonus Percentage"}
                </label>
                <div className="relative">
                  <input
                    disabled
                    type="text"
                    value={bonustype === 1 
                      ? formatNumber({value: bonusAmnt, decimalPlaces: 0, currency: null})
                      : `${bonusAmnt}%`}
                    className="border-2 border-[#f2f3f8] pl-10 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={bonustype === 1 ? "Bonus Amount" : "Bonus Percentage"}
                  />
                  <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                    {bonustype === 1 ? '₹' : '%'}
                  </span>
                </div>
              </div>
            )}

            {bonustype !== null && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Amount
                </label>
                <div className="relative">
                  <input
                    disabled
                    type="text"
                    value={formatNumber({value: formik.values.total_paidamount, decimalPlaces: 0, currency: null}) || ""}
                    className="border-2 border-[#f2f3f8] pl-10 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Total Amount"
                  />
                  <span className="absolute left-0 top-0 w-9 h-full px-3 flex items-center justify-center text-black border-r">
                    ₹
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Remark</label>
              <input
                type="text"
                className="border-2 border-[#f2f3f8] rounded-md p-2 w-full"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="flex flex-col gap-3 lg:mt-4">
              <CheckboxToggle
                checked={checked}
                label="To close & refund the account with OTP verification, kindly check the checkbox"
                onChange={handleOtpToggle}
              />

              {checked && (
                <div className="flex flex-row justify-between w-full gap-4">
                  <div className="flex flex-col gap-3 flex-[0.9]">
                    <label className="block text-sm font-medium mb-1">
                      Mobile Number<span className="text-red-400"> *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        className="border-2 border-[#f2f3f8] rounded-md p-2 w-96 lg:w-[81%] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent pr-24"
                        placeholder="Enter mobile number"
                        value={formik.values.mobile || formik.values.otpMobile}
                        onChange={formik.handleChange}
                        name="otpMobile"
                      />
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                        <button
                          className="bg-[#004181] text-white rounded-md px-4 py-2"
                          onClick={(e) => sendOtpToMobile(e)}
                          disabled={isLoading}
                        >
                          {isLoading ? <SpinLoading /> : "Send OTP"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="w-20 h-9 border-2 bg-[#F6F7F9] border-[#f2f3f8] rounded-md hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
            onClick={() => formik.resetForm()}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-20 h-9 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex justify-center items-center"
          >
            {isLoading ? <SpinLoading /> : "Save"}
          </button>
        </div>
      </form>
      {otpSended && (
        <ModelOne
          title="Verify Mobile Number"
          setIsOpen={setSendOtp}
          isOpen={otpSended}
          closeModal={closeIncommingModal}
        >
          <VerificationModal
            mobile={formik.values.mobile}
            branch={formik.values.id_branch}
            setIsOpen={closeIncommingModal}
            otpComplete={handleOtpComplete}
          />
        </ModelOne>
      )}

      {otpCompleted && (
        <ModelOne
          extraClassName="lg:w-[24rem]"
          setIsOpen={setOtpComplete}
          isOpen={otpCompleted}
          closeModal={closeIncommingModal}
        >
          <OtpCompleted setIsOpen={closeIncommingModal} />
        </ModelOne>
      )}
      <ModelOne
        title={"Revert close account"}
        extraClassName="w-[31rem]"
        custom="border-b"
        setIsOpen={setReverView}
        isOpen={viewRevertForm}
        closeModal={closeIncommingModal}
      >
        <RevertForm isviewOpen={viewRevertForm} setIsOpen={setReverView} />
      </ModelOne>
    </>
  );
};

export default AddCloseAccount;