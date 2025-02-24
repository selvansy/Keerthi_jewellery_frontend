import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CalendarDays, Camera, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import profileplaceholder from "../../../../assets/profileplaceholder.png";
import {
  allcountry,
  allstate,
  addemployee,
  allcity,
  getemployeebyid,
  getallbranch,
  updateemployee,
} from "../../../api/Endpoints";
import Select from "react-select";
import SpinLoading from "../../common/spinLoading";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const webcamRef = useRef(null);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const branch = roledata?.branch;
  const branchId = roledata?.id_branch;

  const REQUIRED_FIELDS = [
    "firstname",
    "lastname",
    "mobile",
    "address",
    "id_state",
    "id_city",
    "gender",
    "date_of_join",
    "date_of_birth",
    "pincode",
    "id_branch",
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "50px",
      height: "50px",
      borderWidth: "2px",
      borderColor: "#d1d5db",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "50px",
      padding: "0 12px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "50px",
    }),
  };

  // State Management
  const [showWebcam, setShowWebcam] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [country, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    resume: null,
  });

  // Formik Initialization
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      mobile: "",
      phone: "",
      address: "",
      pincode: "",
      id_state: "",
      id_city: "",
      id_branch: "",
      gender: "",
      date_of_join: null,
      date_of_birth: null,
      aadhar_number: "",
      id_country: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .nullable(),
      address: Yup.string().required("Address is required"),
      pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode  must be 6 digits")
      .required("Pincode is required"),
      id_state: Yup.string().required("State is required"),
      id_city: Yup.string().required("City is required"),
      id_country: Yup.string().required("Country is required"),
      gender: Yup.number().required("Gender is required"),
      date_of_join: Yup.date().required("Joining date is required"),
      date_of_birth: Yup.date().required("Birth date is required"),
      aadhar_number: Yup.string()
        .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
         .nullable(),
      id_branch: Yup.string().when("$branch", {
        is: (branchValue) => branchValue === "0",
        then: () => Yup.string().required("Branch is required"),
        otherwise: () => Yup.string().nullable(),
      }),
    }),
    onSubmit: (values) => {
      setIsLoading(true)
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
    },
  });

  // Query and Mutation Hooks
  const { data: countryResponse } = useQuery({
    queryKey: ["countries"],
    queryFn: allcountry,
  });

  const { data: branchResponse } = useQuery({
    queryKey: ["branches"],
    queryFn: getallbranch,
    enabled: branch === "0",
  });

  // Effects
  useEffect(() => {
    if (countryResponse) {
      const countryId = countryResponse.data[0]._id;
      setSelectedCountry(countryId);
      formik.setFieldValue("id_country", countryId);
    }
    if (branchResponse) {
      const branchData = branchResponse.data.map((branch) => ({
        value: branch._id,
        label: branch.branch_name,
      }));
      setBranchData(branchData);
    }
  }, [countryResponse, branchResponse]);

  const { data: employeeData } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getemployeebyid(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (employeeData?.data) {
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
        aadhar_number: employee.aadhar_number || "",
        id_country: employee.id_country._id || country._id,
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
      setIsLoading(false)
      toast.success(response.message);
      navigate("/setup/employee");
    },
     onError: (error) => {
    
                setIsLoading(false)
                toast.error(error.response.message);
            }
  });

  const { mutate: updateEmployeeMutate } = useMutation({
    mutationFn: (data) => updateemployee(id, data),
    onSuccess: (response) => {
      setIsLoading(false)
      toast.success(response.message);
      navigate("/setup/employee");

    },
     onError: (error) => {
    
                setIsLoading(false)
                toast.error(error.response.message);
            }
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const name = event.target.name;

    if (file && file.size <= (500*1024)) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: { file, previewUrl },
      }));
      formik.setFieldValue(name, file);
    }else{
      toast.error("File size exceeded or file not found")
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImagePreviews((prev) => ({
      ...prev,
      profile: imageSrc,
    }));
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "webcam-photo.jpg", {
          type: "image/jpeg",
        });
        formik.setFieldValue("profile_image", file);
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
    if (statesResponse) {
      const states = statesResponse.data.map((state) => ({
        value: state._id,
        label: state.state_name,
      }));
      setStates(states);
    }
    if (citiesResponse) {
      const cities = citiesResponse.data.map((city) => ({
        value: city._id,
        label: city.city_name,
      }));
      setCity(cities);
    }
  }, [statesResponse, citiesResponse]);

  const handleStateChange = (selectedOption) => {
<<<<<<< HEAD
=======
    
>>>>>>> dev
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

  const handleGenderSelect = (value) => {
    formik.setFieldValue("gender", value);
  };

  const renderFormFields = () => {
    return Object.keys(formik.initialValues).map((field) => {
      if (field === "gender") {
        return (
          <div key={field} className="flex flex-col">
            <label className="text-gray-700 mb-1 font-medium">
              Gender
              {REQUIRED_FIELDS.includes(field) && (
                <span className="text-red-400"> *</span>
              )}
            </label>
            <div className="flex flex-row gap-6 justify-start">
              <button
                type="button"
                name="gender"
                onClick={() => handleGenderSelect(1)}
                className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${
                  formik.values.gender === 1
                    ? "text-white"
                    : "bg-white text-black"
                }`}
                style={
                  formik.values.gender === 1
                    ? { backgroundColor: layout_color }
                    : {}
                }
              >
                Male
              </button>

              <button
                type="button"
                name="gender"
                onClick={() => handleGenderSelect(2)}
                className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${
                  formik.values.gender === 2
                    ? "text-white"
                    : "bg-white text-black"
                }`}
                style={
                  formik.values.gender === 2
                    ? { backgroundColor: layout_color }
                    : {}
                }
              >
                Female
              </button>

              <button
                type="button"
                name="gender"
                onClick={() => handleGenderSelect(3)}
                className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${
                  formik.values.gender === 3
                    ? "text-white"
                    : "bg-white text-black"
                }`}
                style={
                  formik.values.gender === 3
                    ? { backgroundColor: layout_color }
                    : {}
                }
              >
                Other
              </button>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </span>
            )}
          </div>
        );
      }

      return (
        field !== "resume" &&
        field !== "profile_image" &&
        field !== "date_of_join" &&
        field !== "date_of_birth" &&
        field !== "id_country" &&
        (field !== "id_branch" ||
          (field === "id_branch" && branch === "0")) && (
          <div key={field} className="flex flex-col">
            <label className="text-gray-700 mb-1 font-medium">
              {field === "id_state"
                ? "State"
                : field === "id_branch"
                ? "Branch"
                : field === "id_city"
                ? "City"
                : field === "firstname"
                ? "First Name"
                : field === "lastname"
                ? "Last Name"
                : field === "aadhar_number"
                ? "Aadhar Number"
                : field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
              {REQUIRED_FIELDS.includes(field) && (
                <span className="text-red-400"> *</span>
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
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
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
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            ) : field === "id_branch" ? (
              <Select
                options={branchData}
                value={branchData.find(
                  (option) => option.value === formik.values.id_branch
                )}
                onChange={handleBranchChange}
                onBlur={formik.handleBlur}
                placeholder="Select City"
                styles={customSelectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            ) : (
              <input
                type="text"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black h-[50px]"
                placeholder="Enter Here"
              />
            )}
            {formik.touched[field] && formik.errors[field] && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors[field]}
              </span>
            )}
          </div>
        )
      );
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 font-bold justify-between">
          {id ? "Edit Employee" : "Add Employee"}
        </h2>
      </div>

      <div className="flex flex-col bg-white border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <form onSubmit={formik.handleSubmit} className="p-4">
          <section className="mb-8">
            <h2 className="text-1xl font-semibold mb-4 mt-4 border-b-2 pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormFields()}
            </div>
          </section>
          <section className="mb-8">
            <h3 className="text-1xl font-semibold mb-4 mt-4 border-b-2 pb-2">
              Official Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["date_of_join", "date_of_birth"].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">
                    {field === "date_of_join"
                      ? "Date of Joining"
                      : "Date of Birth"}
                    <span className="text-red-400"> *</span>
                  </label>
                  <div className="relative w-full">
                    <DatePicker
                      selected={formik.values[field]}
                      onChange={(date) => formik.setFieldValue(field, date)}
                      onBlur={formik.handleBlur}
                      dateFormat="yyyy-MM-dd"
                      className="w-full border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black h-[50px]"
                      placeholderText="Select Date"
                      wrapperClassName="w-full"
                    />
                    <CalendarDays
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                  {formik.touched[field] && formik.errors[field] && (
                    <span className="text-red-500 text-sm mt-1">
                      {formik.errors[field]}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["image", "resume"].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium mt-2">
                    {field === "image"
                      ? "Upload Profile Image"
                      : "Upload Resume"}
                  </label>
                  {field === "image" ? (
                    <div
                      key={field}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <div className="w-full">
                        <label
                          htmlFor={field}
                          className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4 rounded-md hover:bg-gray-50"
                        >
                          <p className="text-gray-900 truncate">
                            {formik.values[field]
                              ? formik.values[field].name
                              : "Browse"}
                          </p>
                        </label>
                        <input
                          className="hidden"
                          id={field}
                          name={field}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="flex items-start justify-center">
                        <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
                          <img
                            src={
                              imagePreviews.image?.previewUrl
                                ? imagePreviews.image.previewUrl
                                : imagePreviews.image 
                                ? `${employeeData?.data?.pathurl}${imagePreviews.image}`
                                : profileplaceholder
                            }
                            alt="Profile Preview"
                            className={`w-full h-full ${
                              imagePreviews.image
                                ? "object-cover"
                                : "object-contain"
                            }`}
                          />
                          {imagePreviews.image && (
                            <button
                              type="button"
                              onClick={(e) => handleClearImage(e, "image")}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : field === "resume" ? (
                    <div key={field} className="flex flex-col">
                      <div className="flex flex-col">
                        <label
                          htmlFor={field}
                          className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4 rounded-md hover:bg-gray-50"
                        >
                          <p className="text-gray-900 truncate">
                            {formik.values[field]
                              ? formik.values[field].name
                              : "Choose file"}
                          </p>
                        </label>
                        <input
                          className="hidden"
                          id={field}
                          name={field}
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  ) : null}
                  {formik.touched[field] && formik.errors[field] && (
                    <span className="text-red-500 text-sm mt-1">
                      {formik.errors[field]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/setup/employee")}
              className="bg-gray-200 text-black px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#61A375] text-white px-6 py-2 rounded-md"
            >
              {isLoading ? <SpinLoading /> : id ? "Update" : "Submit"}
              
            </button>
          </div>
        </form>
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
                className="bg-[#61A375] text-white px-4 py-2 rounded-md"
              >
                Capture
              </button>
              <button
                onClick={() => setShowWebcam(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmployee;
