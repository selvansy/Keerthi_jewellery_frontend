import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff } from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  updatecustomer,
  getcustomerById,
  getallbranch,
  allstate,
  addcustomer,
  allcountry,
  allcity,
  getBranchById,
} from "../../../api/Endpoints";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendOtp, verifyOtp } from "../../../api/Endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import Select from "react-select";
import CalenderNew from "../../../../assets/icons/calendarNew.svg";
import eye1 from "../../../../assets/icons/eye1.svg";
import cameraIcon from "../../../../assets/icons/cameraIcon.svg";
import verified from "../../../../assets/icons/verified.svg";
import CheckboxToggle from "../../common/checkBox";
import ModelOne from "../../common/Modelone";
import VerificationModal from "../closedaccount/VerificationModal";
import OtpCompleted from "../../manageaccount/closedaccount/OtpCompleted";
import { customStyles } from "../../ourscheme/scheme/AddScheme";
import Webcam from "react-webcam";

const customSelectStyles = (isReadOnly) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "43px",
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
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      position: "absolute",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  }),
});

const inputHeight = "42px";

const CustomerForm = ({
  setCusData,
  handleCusData,
  id,
  cusData,
  id_proof,
  setIdProof,
  cus_img,
  pathurl,
  setCusImg,
  setPathurl,
  handleClear,
}) => {
  const navigate = useNavigate();

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roleData = useSelector((state) => state.clientForm.roledata);
  const id_proofInputRef = useRef(null);

  const id_branch = roleData?.id_branch;
  const accessBranch = roleData?.branch;

  const [isLoading, setisLoading] = useState(false);

  const [mobile, setMobile] = useState("");
  const [timer, setTimer] = useState(60);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const [otpSended, setSendOtp] = useState(false);
  const [viewRevertForm, setReverView] = useState(false);
  const webcamRef = useRef(null);
  const [checked, setChecked] = useState(true);
  const [otpCompleted, setOtpComplete] = useState(false);
  const [showverifyIcon, setShowVerifyIcon] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [branchData, setBranchData] = useState(() =>
    accessBranch === "0" ? [] : {}
  );
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    id_proof: null,
  });

  const initialCustomerData = {
    firstname: "",
    lastname: "",
    mobile: "",
    gender: null,
    pan: "",
    address: "",
    id_branch: id_branch ? id_branch : accessBranch || "",
    id_country: "",
    id_state: "",
    id_city: "",
    date_of_wed: "",
    date_of_birth: "",
    pincode: "",
    aadharNumber: "",
    password: "",
    confirmpassword: "",
    whatsapp: "",
    otpVerified: false,
  };

  const descImageInputRef = useRef(null);

  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    // lastname: Yup.string().required("Last name is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
    gender: Yup.number().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    id_country: Yup.string().required("Country is required"),
    id_state: Yup.string().required("State is required"),
    id_city: Yup.string().required("City is required"),
    // date_of_birth: Yup.date()
    //   .typeError("Invalid date format")
    //   .required("Birth Date is required"),
    date_of_birth: Yup.date()
      // .required("Birth date is required")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        "Employee must be at least 18 years old"
      ),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be 6 digits"),

    password: Yup.string().nullable().notRequired(),

    confirmPassword: Yup.string()
      .nullable()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .notRequired(),
    // aadharNumber: Yup.string()
    //   .required("Aadhaar number is required")
    //   .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
    // pan: Yup.string()
    //   .required("PAN card number is required")
    //   .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format"),
  });

  const formik = useFormik({
    initialValues: initialCustomerData,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if (values.password !== values.confirmpassword) {
        toast.error("Passwords doesn't match");
        return;
      }

      // setCusData(values);
      handleDispatch(values);
      setisLoading(true);
      const formPayload = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value) formPayload.append(key, value);
      });

      if (cus_img) formPayload.append("cus_img", cus_img);
      if (id_proof) formPayload.append("id_proof", id_proof);

      id
        ? updateCustomerData({ id, data: formPayload })
        : addcustomerMutate(formPayload);
    },
  });

  useEffect(() => {
    if (id) {
      getCustomerData(id);
    } else {
      //   handleClear();
    }
  }, [id]);

  const { mutate: getCustomerData } = useMutation({
    mutationFn: (id) => getcustomerById(id),
    onSuccess: (response) => {
      if (response) {
        const res = response.data;
        const formValues = {
          firstname: res?.firstname || "",
          lastname: res?.lastname || "",
          mobile: res?.mobile || "",
          gender: res?.gender || 1,
          address: res?.address || "",
          whatsapp: res?.whatsapp || "",
          id_branch: res?.branchDetails?._id || "",
          id_country: res?.countryDetails?._id || "",
          id_state: res?.stateDetails?._id || "",
          id_city: res?.cityDetails?._id || "",
          date_of_wed: res?.date_of_wed || "",
          pan: res?.pan || "",
          date_of_birth: res?.date_of_birth || "",
          pincode: res?.pincode || "",
          aadharNumber: res?.aadharNumber || "",
          password: res?.password || "",
          confirmpassword: res?.password || "",
        };

        // 4. Set form values directly using formik.setValues
        formik.setValues(formValues);

        setCusData(formValues);
        setCusImg(response.data.cus_img);
        const img = `${response.data.pathurl}${response.data.cus_img}`;
        setPathurl(img);
        setIdProof(res.id_proof);

        setCountry(res.countryDetails?._id);
        setState(res.stateDetails?._id);
        setCity(res.cityDetails?._id);
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error fetching customer data"
      );
    },
  });

  const { data: countryresponse, isLoading: loadingCountries } = useQuery({
    queryKey: ["country", country],
    queryFn: allcountry,
  });

  const { data: stateresponse, isFetching: loadingStates } = useQuery({
    queryKey: ["states", country],
    queryFn: () => allstate(country),
    enabled: !!country,
  });

  const { data: cityresponse, isFetching: loadingCities } = useQuery({
    queryKey: ["city", state],
    queryFn: () => allcity(state),
    enabled: !!state,
  });

  const { data: branchresponse } = useQuery({
    queryKey: ["branches", accessBranch, id_branch],
    queryFn: async () => {
      if (accessBranch === "0") {
        setisLoading(true);
        return getallbranch();
      }
      setisLoading(true);
      return getBranchById(id_branch);
    },
    enabled: Boolean(accessBranch),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!branchresponse) return;
    if (accessBranch === "0" && branchresponse.data) {
      const formattedBranches = branchresponse.data.map((item) => ({
        value: item._id,
        label: item.branch_name,
      }));
      setBranchData(formattedBranches);
      setisLoading(false);
    } else if (branchresponse.data) {
      setBranchData(branchresponse.data);
      formik.setFieldValue("id_branch", branchresponse.data._id);
      setisLoading(false);
    }
  }, [branchresponse, accessBranch]);

  useEffect(() => {
    if (countryresponse) {
      const data = countryresponse.data;
      const country = data?.map((country) => ({
        value: country._id,
        label: country.country_name,
      }));
      setCountryData(country);
    }

    if (stateresponse) {
      const data = stateresponse.data;
      const state = data.map((state) => ({
        value: state._id,
        label: state.state_name,
      }));
      setStateData(state);
    }

    if (cityresponse) {
      const data = cityresponse.data;
      const city = data.map((city) => ({
        value: city._id,
        label: city.city_name,
      }));
      setCityData(city);
    }
  }, [cityresponse, stateresponse, countryresponse]);

  const { mutate: addcustomerMutate, isLoading: addLoading } = useMutation({
    mutationFn: (data) => addcustomer(data),
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        handleCusData(response.data);
        formik.resetForm({
          values: initialCustomerData,
        });

        setCusImg(null);
        setIdProof(null);
        setImagePreviews({
          image: null,
          id_proof: null,
        });
      }
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      toast.error(error.response.data.message);
    },
  });

  const { mutate: updateCustomerData } = useMutation({
    mutationFn: updatecustomer,
    onSuccess: (response) => {
      toast.success(response.message);
      setisLoading(false);
      handleClear();
      navigate("/managecustomers/customer/");
    },

    onError: (error) => {
      setisLoading(false);
      console.error("Erro:", error);
    },
  });

  const sendOtpToMobile = (e) => {
    if (e) {
      e.preventDefault();
    }
    const mobileToUse = mobile || cusData?.mobile;

    if (!mobileToUse) {
      toast.error("Mobile number is required");
      return;
    }

    postSendOtpMobile({
      mobile: mobileToUse,
      branchId: cusData?.id_branch,
    });
  };

  const handleOtpToggle = () => {
    setChecked(!checked);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const fileName = `webcam-capture-${new Date().getTime()}.jpg`;

    setImagePreviews((prev) => ({
      ...prev,
      image: {
        previewUrl: imageSrc,
        name: fileName,
      },
    }));

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], fileName, {
          type: "image/jpeg",
        });
        setCusImg(file);
        // formik.setFieldValue("image", file);
      });

    setShowWebcam(false);
  };

  const handleClearImage = (e, field) => {
    e.preventDefault();
    e.stopPropagation();

    setImagePreviews((prev) => ({
      ...prev,
      [field]: null,
    }));
    formik.setFieldValue(field, null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const name = event.target.name;

    if (file && file.size <= 500 * 1024) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: {
          file,
          previewUrl,
          name: file.name,
        },
      }));

      if (name === "id_proof") {
        setIdProof(file);
      }
      if (name === "image") {
        setCusImg(file);
      }
    } else {
      toast.error(
        `File size exceeded, upload max-size(500KB) or file not found`
      );
    }
  };

  useEffect(() => {
    if (formik.values.otpVerified == true) {
      setChecked(false);
    }
  }, [formik.values.otpVerified]);

  // Send OTP API mutation
  const { mutate: postSendOtpMobile } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        if (response && !otpSended) {
          setSendOtp(!otpSended);
          setShowVerifyIcon(false);
        }
        setShowVerifyIcon(true);
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

  function closeIncommingModal(e) {
    e.preventDefault();
    setSendOtp(false);
    // setIsviewOpen(false);
  }

  const handleOtpComplete = () => {
    formik.setFieldValue("otpVerified", true);
    setOtpComplete(true);
    setSendOtp(false);
  };

  const handleOpenRevert = (e) => {
    e.preventDefault();
    setReverView(true);
  };

  useEffect(() => {
    if (timer > 0 && isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // setCanResend(true);
      setIsTimerRunning(false);
    }
  }, [timer, isTimerRunning]);

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDispatch = (data) => {
    setCusData({
      customer_name: data.firstname + " " + data.lastname,
      address: data.address,
      id_branch: data.id_branch,
      mobile: data.mobile,
    });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showpassword);
  };

  return (
    <>
      <div className="w-full flex flex-col bg-white">
        <div className="flex flex-col">
          {/* {(() => { */}

          {/* 
            return ( */}
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit(e);
                 autoComplete="off"
              }}
            >
              <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-gray-300">
                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    First Name<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formik.values.firstname}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldTouched("firstname", false);
                    }}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Here"
                  />
                  {formik.errors.firstname ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.firstname}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formik.values.lastname}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldTouched("lastname", false);
                    }}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Here"
                  />
                  {formik.errors.lastname ? (
                    <div style={{ color: "red" }}>{formik.errors.lastname}</div>
                  ) : null}
                </div>

                {/* <div className="flex flex-col">
                      <label className="text-black mb-1 ">
                        Branch<span className="text-red-400">*</span>
                      </label>

                      <Select
                        options={branchData}
                        value={
                          branchData.find(
                            (option) =>
                              option.value ===
                              (id_branch !== "0"
                                ? cusData.id_branch
                                : formik.values.id_branch)
                          ) || ""
                        }
                        onChange={(option) =>
                          formik.setFieldValue("id_branch", option?.value || "")
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && e.preventDefault()
                        }
                        styles={customSelectStyles(true)}
                        isLoading={loadingbranch}
                        isDisabled={id_branch !== "0"}
                        placeholder="Select Branch"
                      />

                      {formik.errors.id_branch && (
                        <div style={{ color: "red" }}>
                          {formik.errors.id_branch}
                        </div>
                      )}
                    </div> */}
                {accessBranch === "0" && branchData.length > 0 && !isLoading ? (
                  <div>
                    <label className="block text-sm  mb-1 text-[#232323] font-semibold">
                      Branches <span className="text-red-500">*</span>
                    </label>
                    <Select
                      styles={customStyles(true)}
                      isClearable={true}
                      options={branchData}
                      placeholder="Select Branch"
                      value={
                        branchData.find(
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
                    <label className="block text-sm  mb-2">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      style={{ height: inputHeight }}
                      value={branchData?.branch_name || ""}
                      className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2 text-gray-500"
                    />
                    {formik.errors.id_branch && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.id_branch}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Mobile<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    onChange={(e) => {
                      let digitsOnly = e.target.value.replace(/\D/g, "");
                      if (
                        digitsOnly.length > 10 &&
                        digitsOnly.startsWith("91")
                      ) {
                        digitsOnly = digitsOnly.slice(2);
                      }
                      const cleaned = digitsOnly.slice(-10);

                      formik.setFieldValue("mobile", cleaned);
                      setMobile(cleaned);
                    }}
                    value={formik.values.mobile}
                    pattern="\d{10}"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Mobile Number"
                  />

                  {formik.errors.mobile && (
                    <div style={{ color: "red" }}>{formik.errors.mobile}</div>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Whatsapp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    value={formik.values.whatsapp}
                    onChange={(e) => {
                      e.preventDefault();
                      formik.handleChange(e);
                      formik.setFieldTouched("whatsapp", false);
                    }}
                    pattern="\d{10}"
                    maxLength={"10"}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Whatsapp Number"
                  />
                  {formik.errors.whatsapp ? (
                    <div style={{ color: "red" }}>{formik.errors.whatsapp}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className=" mb-1 text-[#232323] text-sm font-semibold">
                    Gender<span className="text-red-400"> *</span>
                  </label>
                  <div className="flex flex-row gap-6 justify-start">
                    {[
                      { label: "Male", value: 1 },
                      { label: "Female", value: 2 },
                      { label: "Others", value: 3 },
                    ].map((gender) => (
                      <button
                        key={gender.value}
                        type="button"
                        className={`rounded-lg w-20 h-10 flex items-center justify-center border-[1px] border-black transition-colors duration-200 ${
                          formik.values.gender === gender.value
                            ? "text-[#004181]"
                            : " text-[#6C7086]"
                        }`}
                        style={
                          formik.values.gender === gender.value
                            ? { borderColor: layout_color }
                            : { borderColor: "#f2f3f8" }
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          formik.setFieldValue("gender", gender.value);
                          formik.setFieldTouched("gender", false);
                        }}
                      >
                        {gender.label}
                      </button>
                    ))}
                  </div>
                  {formik.errors.gender ? (
                    <div style={{ color: "red" }}>{formik.errors.gender}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] text-sm font-semibold mb-1 ">
                    Country<span className="text-red-400"> *</span>
                  </label>

                  <Select
                    options={countryData}
                    value={
                      countryData?.find(
                        (ctry) => ctry.value === formik.values.id_country
                      ) || country
                    }
                    onChange={(ctry) => {
                      formik.setFieldValue("id_country", ctry.value);
                      setCountry(ctry.value);
                      formik.setFieldTouched("id_country", false);
                    }}
                    styles={customStyles(true)}
                    isLoading={loadingCountries}
                    placeholder="Select Country"
                  />
                  {formik.errors.id_country ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.id_country}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] text-sm font-semibold mb-1 ">
                    State<span className="text-red-400"> *</span>
                  </label>

                  <Select
                    options={stateData}
                    onChange={(e) => {
                      formik.setFieldValue("id_state", e.value);
                      setState(e.value);
                      formik.setFieldTouched("id_state", false);
                    }}
                    styles={customStyles(true)}
                    isLoading={loadingStates}
                    value={
                      stateData.find(
                        (ctry) => ctry.value === formik.values.id_state
                      ) || state
                    }
                    placeholder="Select state"
                  />

                  {formik.errors.id_state ? (
                    <div style={{ color: "red" }}>{formik.errors.id_state}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] text-sm font-semibold mb-1 ">
                    City<span className="text-red-400"> *</span>
                  </label>

                  <Select
                    options={cityData}
                    onChange={(e) => {
                      formik.setFieldValue("id_city", e.value);
                      setCity(e.value);
                      formik.setFieldTouched("id_city", false);
                    }}
                    styles={customStyles(true)}
                    isLoading={loadingCities}
                    value={
                      cityData.find(
                        (ctry) => ctry.value === formik.values.id_city
                      ) || city
                    }
                    placeholder="Select city"
                  />

                  {formik.errors.id_city ? (
                    <div style={{ color: "red" }}>{formik.errors.id_city}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Address<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={(e) => {
                      e.preventDefault();
                      formik.handleChange(e);
                      formik.setFieldTouched("address", false);
                    }}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Here"
                  />
                  {formik.errors.address ? (
                    <div style={{ color: "red" }}>{formik.errors.address}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Pincode<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formik.values.pincode}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    onChange={(e) => {
                      e.preventDefault();
                      formik.handleChange(e);
                      formik.setFieldTouched("pincode", false);
                    }}
                    pattern="\d{6}"
                    maxLength={"6"}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Pincode"
                  />
                  {formik.errors.pincode ? (
                    <div style={{ color: "red" }}>{formik.errors.pincode}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm  mb-1 ">
                    Pan Number
                  </label>
                  <input
                    type="text"
                    name="pan"
                    value={formik.values.pan}
                    onChange={(e) => {
                      const value = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      formik.setFieldValue("pan", value);
                    }}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="ABCDE1234F"
                    maxLength="10"
                  />
                  {formik.errors.pan ? (
                    <div style={{ color: "red" }}>{formik.errors.pan}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Aadhar Card Number
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formik.values.aadharNumber}
                    pattern="\d{12}"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    maxLength="12"
                    inputMode="numeric"
                    onChange={formik.handleChange}
                    className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                    placeholder="Enter Aadhar Number"
                  />

                  {formik.errors.aadharNumber ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.aadharNumber}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Date Of Wedding
                  </label>

                  <div className="relative">
                    <DatePicker
                      selected={formik.values.date_of_wed}
                      onChange={(date) => {
                        const value = formatDate(date);
                        formik.setFieldValue("date_of_wed", value);
                        formik.setFieldTouched("date_of_wed", false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                      placeholderText="Select Date"
                      wrapperClassName="w-full"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                      <img src={CalenderNew} className="w-5 h-5" />
                    </span>
                  </div>

                  {formik.errors.date_of_wed ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.date_of_wed}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Date Of Birth
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={formik.values.date_of_birth}
                      onChange={(date) => {
                        const value = formatDate(date);
                        formik.setFieldValue("date_of_birth", value);
                        formik.setFieldTouched("date_of_birth", true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                      placeholderText="Select Date"
                      wrapperClassName="w-full"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      maxDate={new Date()}
                      autoComplete="off"
                    />

                    <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                      <img src={CalenderNew} className="w-5 h-5" />
                    </span>
                  </div>
                  {formik.errors.date_of_birth ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.date_of_birth}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Password
                  </label>

                  <div className="relative w-full">
                    <input
                      type={showpassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                      placeholder="Enter password"
                    />
                    {showpassword ? (
                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center cursor-pointer"
                        onClick={handlePasswordToggle}
                      >
                        <img
                          src={eye1}
                          className="w-5 h-5 cursor-pointer"
                          onClick={handlePasswordToggle}
                        />
                      </span>
                    ) : (
                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center cursor-pointer"
                        onClick={handlePasswordToggle}
                      >
                        <EyeOff
                          size={16}
                          className="w-5 h-5 cursor-pointer"
                          onClick={handlePasswordToggle}
                        />
                      </span>
                    )}
                  </div>
                  {formik.errors.password ? (
                    <div style={{ color: "red" }}>{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Confirm Password
                  </label>

                  <div className="relative w-full">
                    <input
                      type={showpassword ? "text" : "password"}
                      name="confirmpassword"
                      value={formik.values.confirmpassword}
                      onChange={formik.handleChange}
                      className="w-full border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2"
                      placeholder="Confirm Password"
                    />

                    {showpassword ? (
                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center cursor-pointer"
                        onClick={handlePasswordToggle}
                      >
                        <img
                          src={eye1}
                          className="w-5 h-5 cursor-pointer"
                          onClick={handlePasswordToggle}
                        />
                      </span>
                    ) : (
                      <span
                        className="absolute right-0 top-0 h-full w-14 flex items-center justify-center cursor-pointer"
                        onClick={handlePasswordToggle}
                      >
                        <EyeOff
                          size={16}
                          className="w-5 h-5 cursor-pointer"
                          onClick={handlePasswordToggle}
                        />
                      </span>
                    )}
                  </div>
                  {formik.errors.confirmpassword ? (
                    <div style={{ color: "red" }}>
                      {formik.errors.confirmpassword}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Upload Profile Image
                    <span className="font-normal">
                      (Maximum file size: 500KB)
                    </span>
                  </label>
                  <div className="flex items-center gap-3 relative">
                    <label
                      htmlFor="image"
                      className="flex-1 border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <p className="truncate text-[#b5b5b5] w-1/2">
                        {cus_img ? cus_img.name || cus_img : "Browse"}
                      </p>
                    </label>
                    <div className="absolute right-0 top-0 bottom-0 h-full flex flex-row gap-2">
                      <label
                        htmlFor="image"
                        className="bg-blue-600 text-white px-4 flex items-center justify-center rounded-lg cursor-pointer text-sm"
                        style={{ backgroundColor: layout_color }}
                      >
                        Choose File
                      </label>
                      <div
                        className="w-11 h-11 flex items-center justify-center rounded-lg cursor-pointer"
                        style={{ backgroundColor: layout_color }}
                        onClick={() => setShowWebcam(true)}
                      >
                        <img
                          src={cameraIcon}
                          alt="Camera Icon"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                    <input
                      className="hidden"
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={descImageInputRef}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-rows-1 md:grid-rows-1 lg:grid-cols-3 gap-6 border-gray-300 mt-8">
                {/* Resume Upload Field */}
                {/* <div className="flex flex-col">
                  <label className="text-[#232323] font-semibold text-sm mb-1 ">
                    Upload Document
                  </label>
                  <div className="flex items-center gap-3 relative">
                    <label
                      htmlFor="id_proof"
                      className="flex-1 border-[1px] border-[#f2f3f8] rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <p className="truncate text-[#b5b5b5]">
                        {id_proof ? id_proof.name || id_proof : "Browse"}
                      </p>
                    </label>
                    <div className="absolute right-0 top-0 bottom-0 h-full flex flex-row gap-2">
                      <label
                        htmlFor="id_proof"
                        className="bg-blue-600 text-white px-4 flex items-center justify-center rounded-lg cursor-pointer text-sm"
                        style={{ backgroundColor: layout_color }}
                      >
                        Choose File
                      </label>
                    </div>
                    <input
                      className="hidden"
                      id="id_proof"
                      name="id_proof"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      ref={id_proofInputRef}
                    />
                  </div>
                  {formik.errors.id_proof ? (
                    <div style={{ color: "red" }}>{formik.errors.id_proof}</div>
                  ) : null}
                </div> */}

                {/* Image Upload Field */}
              </div>

              <div className="grid grid-rows-1 md:grid-rows-1 lg:grid-cols-1 gap-6 my-3">
                <div className="flex flex-col gap-3 lg:mt-4">
                  <CheckboxToggle
                    checked={checked}
                    label="Enable OTP verification to create a customer account"
                    onChange={handleOtpToggle}
                  />

                  {checked && (
                    <div className="flex flex-row justify-between w-full mt-2">
                      <div className="flex flex-col flex-[0.9]">
                        <label className="block text-sm  mb-1 text-[#232323] font-semibold">
                          Mobile Number
                          <span className="text-red-400"> *</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            className="border-[1px] border-[#f2f3f8] rounded-lg p-2 px-3 py-2 focus:ring-1 focus:ring-[#004181] outline-none pr-24"
                            placeholder="Enter mobile number"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            name="otpMobile"
                          />

                          {showverifyIcon && (
                            <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                              <img src={verified} className="w-5 h-5" />
                            </span>
                          )}

                          <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <button
                              className="bg-[#004181] text-sm font-semibold text-white rounded-md px-4 py-2"
                              onClick={(e) => sendOtpToMobile(e)}
                            >
                              Send OTP
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right (Narrower) */}
                      <div className="flex items-end flex-[1]"></div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-white mt-6">
                  <div className="flex justify-end gap-5 mt-3">
                    <button
                      className="text-white rounded-lg text-sm font-semibold h-[36px] w-full md:w-24"
                      type="submit"
                      style={{ backgroundColor: layout_color }}
                      disabled={addLoading}
                    >
                      {addLoading ? <SpinLoading /> : id ? "Update" : "Save"}
                    </button>
                    <button
                      className="bg-[#E2E8F0] text-gray-500 rounded-lg h-[36px] w-full text-sm font-semibold md:w-24"
                      type="button"
                      onClick={() => {
                        handleClear();
                        navigate("/managecustomers/customer/");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
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

              {showWebcam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-lg"
                    />
                    <div className="mt-4 flex justify-center gap-4">
                      <button
                        onClick={handleCapture}
                        className="bg-[#004181] text-sm text-white px-4 py-2 rounded-md"
                      >
                        Capture
                      </button>
                      <button
                        onClick={() => setShowWebcam(false)}
                        className="bg-gray-500 text-sm text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </>
        </div>
      </div>
    </>
  );
};

export default CustomerForm;
