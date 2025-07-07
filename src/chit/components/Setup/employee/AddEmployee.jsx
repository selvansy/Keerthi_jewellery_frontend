import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import cameraIcon from "../../../../assets/icons/cameraIcon.svg";
import {
  allcountry,
  allstate,
  addemployee,
  allcity,
  getemployeebyid,
  getallbranch,
  updateemployee,
  getAllDepartments,
} from "../../../api/Endpoints";
import Select from "react-select";
import SpinLoading from "../../common/spinLoading";
import { customStyles } from "../../ourscheme/scheme/AddScheme";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const webcamRef = useRef(null);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const branch = roledata?.branch;
  const branchId = roledata?.id_branch;
  const isMounted = useRef(true);

  const descImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const REQUIRED_FIELDS = [
    "firstname",
    "lastname",
    "mobile",
    "address",
    "id_country",
    "id_state",
    "id_city",
    "gender",
    "date_of_join",
    "date_of_birth",
    "pincode",
    "id_branch",
    "pan",
    "aadharNumber",
    "department",
  ];
  
  // State Management
  const [showWebcam, setShowWebcam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [country, setSelectedCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    resume: null,
  });

  // Formik Initialization
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      id_branch: "",
      mobile: "",
      whatsappNumber: "",
      gender: "",
      id_country: "",
      id_state: "",
      id_city: "",
      id_branch: "",
      address: "",
      pincode: "",
      pan: "",
      date_of_birth: null,
      date_of_join: null,
      aadharNumber: "",
      employeeIncentivePercentage: 0,
      department: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .required("First name is required")
        .matches(/^[A-Za-z]+$/, "First name should only contain letters"),
      lastname: Yup.string()
        .required("Last name is required")
        .matches(/^[A-Za-z]+$/, "Last name should only contain letters"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      whatsappNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "WhatsApp number must be 10 digits")
        .nullable(),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .nullable(),
      address: Yup.string()
        .required("Address is required")
        .min(10, "Address should be at least 10 characters"),
      pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
        .required("Pincode is required"),
      id_branch: Yup.string().required("Branch is required"),
      department: Yup.string().required("Department is required"),
      id_state: Yup.string().required("State is required"),
      id_city: Yup.string().required("City is required"),
      id_country: Yup.string().required("Country is required"),
      gender: Yup.number().required("Gender is required"),
      date_of_join: Yup.date()
        .required("Joining date is required")
        .max(new Date(), "Joining date cannot be in the future"),
      date_of_birth: Yup.date()
        .required("Birth date is required")
        .max(
          new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
          "Employee must be at least 18 years old"
        ),
      aadharNumber: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
        .required("Aadhar number is required"),
      pan: Yup.string()
        .matches(
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          "PAN must be in valid format (e.g., ABCDE1234F)"
        )
        .required("PAN number is required"),
      id_branch: Yup.string().when("$branch", {
        is: (branchValue) => branchValue === "0",
        then: () => Yup.string().required("Branch is required"),
        otherwise: () => Yup.string().nullable(),
      }),
    }),
    onSubmit: async (values) => {
      if (!isMounted.current) return;

      setIsLoading(true);
      try {
        const formData = new FormData();

        if (branch === "0") {
          formData.append("id_branch", values.id_branch);
        } else {
          formData.append("id_branch", branchId);
        }

        if (values.date_of_birth) {
          const formattedDOB = new Date(values.date_of_birth)
            .toISOString()
            .split("T")[0];
          formData.append("date_of_birth", formattedDOB);
        }

        if (values.date_of_join) {
          const formattedDOJ = new Date(values.date_of_join)
            .toISOString()
            .split("T")[0];
          formData.append("date_of_join", formattedDOJ);
        }

        Object.keys(values).forEach((key) => {
          if (
            values[key] &&
            typeof values[key] !== "object" &&
            key !== "id_branch" &&
            key !== "date_of_birth" &&
            key !== "date_of_join"
          ) {
            formData.append(key, values[key]);
          }
        });

        if (values.image) {
          formData.append("image", values.image);
        }
        if (values.resume) {
          formData.append("resume", values.resume);
        }

        if (id) {
          updateEmployeeMutate(formData);
        } else {
          addEmployeeMutate(formData);
        }
      } catch (error) {
        if (isMounted.current) {
          toast.error(error.message || "An error occurred");
          setIsLoading(false);
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Query and Mutation Hooks
  const { data: countryResponse } = useQuery({
    queryKey: ["countries"],
    queryFn: allcountry,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });

  const { data: branchResponse } = useQuery({
    queryKey: ["branches"],
    queryFn: getallbranch,
    enabled: branch === "0",
  });

  const { data: employeeData } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getemployeebyid(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  //useEffects
  useEffect(() => {
    if (departments && departments?.data?.length > 0) {
      const output = departments?.data?.map((dept) => ({
        value: dept._id,
        label: dept.name,
      }));
      
      setDepartment(output);
    }
  }, [departments]);

  useEffect(() => {
    if (countryResponse && isMounted.current) {
      const countryOptions = countryResponse.data.map((state) => ({
        value: state._id,
        label: state.country_name,
      }));
      setSelectedCountry(countryOptions);
    }
    if (branchResponse && isMounted.current) {
      const branchData = branchResponse.data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchData(branchData);
    }
  }, [countryResponse, branchResponse]);

  useEffect(() => {
    if (employeeData?.data && isMounted.current) {
      const employee = employeeData.data;

      formik.setValues({
        firstname: employee.firstname || "",
        lastname: employee.lastname || "",
        mobile: employee.mobile || "",
        phone: employee.phone || "",
        address: employee.address || "",
        pincode: employee.pincode || "",
        id_state: employee.id_state._id || "",
        id_city: employee.id_city?._id || "",
        id_branch: employee.id_branch?._id || "",
        gender: employee.gender || "",
        date_of_join: employee.date_of_join
          ? new Date(employee.date_of_join)
          : null,
        date_of_birth: employee.date_of_birth
          ? new Date(employee.date_of_birth)
          : null,
        aadharNumber: employee.aadharNumber || "",
        id_country: employee.id_country._id || country._id,
        employeeIncentivePercentage: employee.employeeIncentivePercentage || 0,
        pan: employee.pan || "",
        whatsappNumber: employee.whatsappNumber || "",
        department: employee.department || "",
      });

      setImagePreviews({
        image: employee.image || null,
        resume: employee.resume || null,
      });
    }
  }, [employeeData]);

  const { mutate: addEmployeeMutate } = useMutation({
    mutationFn: addemployee,
    onSuccess: (response) => {
      if (isMounted.current) {
        setIsLoading(false);
        toast.success(response.message);
        navigate("/employee/details/");
      }
    },
    onError: (error) => {
      if (isMounted.current) {
        setIsLoading(false);
        toast.error(error.response?.data?.message || "Failed to add employee");
      }
    },
  });

  const { mutate: updateEmployeeMutate } = useMutation({
    mutationFn: (data) => updateemployee(id, data),
    onSuccess: (response) => {
      if (isMounted.current) {
        setIsLoading(false);
        toast.success(response.message);
        navigate("/employee/details/");
      }
    },
    onError: (error) => {
      if (isMounted.current) {
        setIsLoading(false);
        toast.error(error.response?.message || "Failed to update employee");
      }
    },
  });

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
      formik.setFieldValue(name, file);
    } else {
      toast.error("File size exceeded or file not found");
    }
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
        formik.setFieldValue("image", file);
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

  const { data: statesResponse } = useQuery({
    queryKey: ["states", formik.values.id_country],
    queryFn: () => {
      const countryId = formik.values.id_country;
      if (!countryId) return null;
      return allstate(countryId);
    },
    enabled: !!formik.values.id_country,
  });

  const { data: citiesResponse } = useQuery({
    queryKey: ["cities", formik.values.id_state],
    queryFn: () => allcity(formik.values.id_state),
    enabled: !!formik.values.id_state,
  });

  useEffect(() => {
    if (statesResponse && isMounted.current) {
      const states = statesResponse.data.map((state) => ({
        value: state._id,
        label: state.state_name,
      }));
      setStates(states);
    }
    if (citiesResponse && isMounted.current) {
      const cities = citiesResponse.data.map((city) => ({
        value: city._id,
        label: city.city_name,
      }));
      setCity(cities);
    }
  }, [statesResponse, citiesResponse]);

  const handleStateChange = (selectedOption) => {
    formik.setFieldValue(
      "id_state",
      selectedOption ? selectedOption.value : ""
    );
  };

  const handleCityChange = (selectedOption) => {
    formik.setFieldValue("id_city", selectedOption ? selectedOption.value : "");
  };

  const handleBranchChange = (selectedOption) => {
    formik.setFieldValue(
      "id_branch",
      selectedOption ? selectedOption.value : ""
    );
  };

  const handleCountryChange = (selectedOption) => {
    formik.setFieldValue(
      "id_country",
      selectedOption ? selectedOption.value : ""
    );
  };

  const handleDepartmentChange = (selectedOption) => {
    formik.setFieldValue("department", selectedOption ? selectedOption.id : "");
  };

  const handleGenderSelect = (value) => {
    formik.setFieldValue("gender", value);
  };

  const renderFormFields = () => {
    return Object.keys(formik.initialValues).map((field) => {
      if (field === "gender") {
        return (
          <div key={field}>
            <label className="block text-sm  mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row gap-3">
              <button
                type="button"
                name="gender"
                onClick={() => handleGenderSelect(1)}
                className={`px-4 py-2 rounded-md text-sm border ${
                  formik.values.gender === 1
                    ? "bg-white text-[#004181] border-[#004181]"
                    : "bg-white text-[#6C7086] border-[1px] hover:bg-gray-50"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                name="gender"
                onClick={() => handleGenderSelect(2)}
                className={`px-4 py-2 rounded-md text-sm border ${
                  formik.values.gender === 2
                    ? "bg-white text-[#004181] border-[#004181]"
                    : "bg-white text-[#6C7086] border hover:bg-gray-50"
                }`}
              >
                Female
              </button>

              <button
                type="button"
                name="gender"
                onClick={() => handleGenderSelect(3)}
                className={`px-4 py-2 rounded-md text-sm border ${
                  formik.values.gender === 3
                    ? "bg-white text-[#004181] border-[#004181]"
                    : "bg-white text-[#6C7086] border hover:bg-gray-50"
                }`}
              >
                Other
              </button>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </div>
            )}
          </div>
        );
      }

      return (
        field !== "resume" &&
        field !== "profile_image" &&
        field !== "date_of_join" &&
        field !== "date_of_birth" &&
        (field !== "id_branch" ||
          (field === "id_branch" && branch === "0")) && (
          <div key={field}>
            <label className="block text-sm  mb-1">
              {field === "id_state"
                ? "State"
                : field === "id_branch"
                ? "Branch"
                : field === "whatsappNumber"
                ? "Whatsapp Number"
                : field === "id_city"
                ? "City"
                : field === "firstname"
                ? "First Name"
                : field === "lastname"
                ? "Last Name"
                : field === "id_country"
                ? "Country"
                : field === "pan"
                ? "Pan Number"
                : field === "aadharNumber"
                ? "Aadhar card number"
                : field === "employeeIncentivePercentage"
                ? "Employee Incentive Percentage"
                : field === "department"
                ? "Department"
                : field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
              {REQUIRED_FIELDS.includes(field) && (
                <span className="text-red-500"> *</span>
              )}
            </label>

            {field === "id_state" ? (
              <Select
                options={states}
                value={states.find(
                  (option) => option.value === formik.values.id_state
                )}
                onChange={handleStateChange}
                onBlur={formik.handleBlur}
                placeholder="Select State"
                styles={customStyles(true)}
              />
            ) : field === "id_city" ? (
              <Select
                options={city}
                value={city.find(
                  (option) => option.value === formik.values.id_city
                )}
                onChange={handleCityChange}
                onBlur={formik.handleBlur}
                placeholder="Select City"
                styles={customStyles(true)}
              />
            ) : field === "id_branch" ? (
              <Select
                options={branchData}
                value={branchData.find(
                  (option) => option.value === formik.values.id_branch
                )}
                onChange={handleBranchChange}
                onBlur={formik.handleBlur}
                placeholder="Select Branch"
                styles={customStyles(true)}
              />
            ) : field === "id_country" ? (
              <Select
                options={country}
                value={country.find(
                  (option) => option.value === formik.values.id_country
                )}
                onChange={handleCountryChange}
                onBlur={formik.handleBlur}
                placeholder="Select Country"
                styles={customStyles(true)}
              />
            ) : field === "department" ? (
              <Select
                options={department}
                value={department.find(
                  (option) => option.value === formik.values.department
                )}
                onChange={(selectedOption) => {
                  formik.setFieldValue(
                    "department",
                    selectedOption ? selectedOption.value : ""
                  );
                }}
                onBlur={formik.handleBlur}
                placeholder="Select Department"
                styles={customStyles(true)}
              />
            ) : field === "whatsappNumber" ? (
              <input
                type="text"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder={`Enter whatsapp number`}
              />
            ) : field === "pan" ? (
              <input
                type="text"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder={`Enter pancard number`}
              />
            ) : (
              <input
                type="text"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                placeholder={`Enter ${field.replace(/_/g, " ")}`}
              />
            )}
            {formik.touched[field] && formik.errors[field] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field]}
              </div>
            )}
          </div>
        )
      );
    });
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto space-y-6">
      <div className="flex flex-row justify-between items-center mb-4">
        <p className="text-sm text-gray-400 mt-4 mb-3">
          Employee /{" "}
          <span className="text-[#232323] font-semibold text-sm">
            Employee Creation
          </span>
        </p>
      </div>

      <div className="bg-[#FFFFFF] rounded-[16px] p-6  border-[1px]">
        <h2 className="text-lg font-semibold mb-4 border-b pb-4">
          {id ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderFormFields()}

          {["date_of_join", "date_of_birth"].map((field) => (
            <div key={field}>
              <label className="block text-sm  mb-1">
                {field === "date_of_join" ? "Date of Joining" : "Date of Birth"}
                <span className="text-red-500"> *</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={formik.values[field]}
                  onChange={(date) => {
                    formik.setFieldValue(field, date);
                    formik.setFieldTouched(field, true);
                  }}
                  onBlur={formik.handleBlur}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Date"
                  className="w-full border-[1px] border-[#f2f3f8] rounded-md px-3 py-2"
                  showMonthDropdown
                  showYearDropdown
                  wrapperClassName="w-full"
                  dropdownMode="select"
                />
                <span className="absolute right-0 top-0 h-full w-10 flex items-center justify-center pointer-events-none">
                  <CalendarDays size={20} className="text-gray-400" />
                </span>
              </div>
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors[field]}
                </div>
              )}
            </div>
          ))}

          {/* Resume Upload Field */}
          <div>
            <label className="block text-sm  mb-1">Resume</label>
            <div className="flex items-center gap-3 relative">
              <label
                htmlFor="resume"
                className="flex-1 border-[1px] border-[#f2f3f8] rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <p className="truncate text-[#b5b5b5]">
                  {imagePreviews.resume?.name ||
                    imagePreviews.resume ||
                    (formik.values.resume
                      ? formik.values.resume.name
                      : "Browse")}
                </p>
              </label>
              <div className="absolute right-0 top-0 bottom-0 h-full flex flex-row gap-2">
                <label
                  htmlFor="resume"
                  className="bg-blue-600 text-white px-4 flex items-center justify-center rounded-md cursor-pointer text-sm"
                  style={{ backgroundColor: layout_color }}
                >
                  Choose File
                </label>
              </div>
              <input
                className="hidden"
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                ref={resumeInputRef}
              />
            </div>
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm  mb-1">
              Upload Profile Image{" "}
              <span className="font-sm">(Maximum file size: 500KB)</span>
            </label>
            <div className="flex items-center gap-3 relative">
              <label
                htmlFor="image"
                className="flex-1 border-[1px] border-[#f2f3f8] rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <p className="truncate text-[#b5b5b5]">
                  {imagePreviews.image?.name ||
                    imagePreviews.image ||
                    (formik.values.image ? formik.values.image.name : "Browse")}
                </p>
              </label>
              <div className="absolute right-0 top-0 bottom-0 h-full flex flex-row gap-2">
                <label
                  htmlFor="image"
                  className="bg-blue-600 text-white px-4 flex items-center justify-center rounded-md cursor-pointer text-sm"
                  style={{ backgroundColor: layout_color }}
                >
                  Choose File
                </label>
                <div
                  className="w-11 h-10 flex items-center justify-center rounded-md cursor-pointer"
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
        <div className="flex justify-end space-x-4 mt-4 py-5">
          <button
            type="submit"
            disabled={isLoading || !formik.isValid}
            className={`w-24 h-9 bg-[#004181] text-sm text-white font-semibold rounded-lg hover:from-[#072D2D] hover:to-[#072D2D] flex justify-center items-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/employee/details/")}
            className="w-24 h-9 border-[1px] bg-[#F6F7F9] font-semibold border-[#f2f3f8] text-sm rounded-lg hover:bg-gray-50 flex justify-center items-center text-[#6C7086]"
          >
            Cancel
          </button>
        </div>
      </div>

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
  );
};

export default AddEmployee;
