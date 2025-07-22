import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { X, Trash2 } from "lucide-react";
import Select from "react-select";
import {
  allcountry,
  allstate,
  allcity,
  organisation,
  getOrganisation,
} from "../../../api/Endpoints";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";

const Organisation = () => {
  const [imagePreviews, setImagePreviews] = useState({
    logo: null,
  });
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const REQUIRED_FIELDS = [
    "company_name",
    "short_code",
    "mobile",
    "pincode",
    "address",
    "id_city",
    "id_state",
    "id_country",
    "email",
  ];
  const [orgData, setOrgData] = useState({});
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);

 const customStyles = (isReadOnly) => ({
    control: (base, state) => ({
      ...base,
      minHeight: "44px", //42px
      backgroundColor: "white",
      color:"#232323",
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
      "&:hover": {
        color: "#232323",
      },
    }),
     input: (base) => ({
      ...base,
      "input[type='text']:focus": { boxShadow: 'none' },
      }),
      option:(base,state)=>({
        ...base,
        backgroundColor: state.isSelected ? "#F0F7FE" : state.isFocused ? "#F0F7FE" : "white",
        color:"#232323",
        fontWeight:"500",
        fontSize:"14px"
      })
    });


  const formik = useFormik({
    initialValues: {
      company_name: orgData?.company_name || "",
      short_code: orgData?.short_code || "",
      email: orgData?.email || "",
      mobile: orgData?.mobile || "",
      address: orgData?.address || "",
      pincode: orgData?.pincode || "",
      id_country: orgData?.id_country || "",
      id_state: orgData?.id_state || "",
      id_city: orgData?.id_city || "",
      website: orgData?.website || "",
      whatsapp_no: orgData?.whatsapp_no || "",
      logo: orgData?.logo || null,
      longitude:"",
      latitude:"",
    },
    validationSchema: Yup.object({
      company_name: Yup.string().required("Company name is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      pincode: Yup.string().required("Pincode is required"),
      short_code: Yup.string().required("Short code is required"),
      address: Yup.string().required("Address is required"),
      id_city: Yup.string().required("City is required"),
      id_state: Yup.string().required("State is required"),
      id_country: Yup.string().required("Country is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      website: Yup.string().url("Invalid URL format"),
      whatsapp_no: Yup.string().matches(
        /^[0-9]{10}$/,
        "Whatsapp number must be 10 digits"
      ),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key] && typeof values[key] !== "object") {
          formData.append(key, values[key]);
        }
      });

      if (values.logo) {
        formData.append("logo", values.logo);
      }

      orgDetails(formData);
    },
  });

  //api call
  //fetch country
  const { data: countryData } = useQuery({
    queryKey: ["countries"],
    queryFn: allcountry,
  });

  const { data: fetchedData } = useQuery({
    queryKey: ["orgData"],
    queryFn: getOrganisation,
  });

  //fetch state
  const { data: statesData } = useQuery({
    queryKey: ["states", formik.values.id_country],
    queryFn: () => allstate(formik.values.id_country),
    enabled: !!formik.values.id_country,
  });

  //fetch city
  const { data: cityData } = useQuery({
    queryKey: ["cities", formik.values.id_state],
    queryFn: () => allcity(formik.values.id_state),
    enabled: !!formik.values.id_state,
  });

  //useeffect to populate data
  useEffect(() => {
    if (countryData) {
      const formattedCountries = countryData.data.map((country) => ({
        value: country._id,
        label: country.country_name,
      }));
      setCountry(formattedCountries);
    }
    if (statesData) {
      const states = statesData.data.map((state) => ({
        value: state._id,
        label: state.state_name,
      }));
      setStates(states);
    }
    if (cityData) {
      const cities = cityData.data.map((city) => ({
        value: city._id,
        label: city.city_name,
      }));
      setCity(cities);
    }
  }, [countryData, statesData, cityData]);

  useEffect(() => {
    
    if (fetchedData && fetchedData?.data) {
      const newData = fetchedData.data;
      setOrgData(newData);

      formik.setValues((prevValues) => ({
        ...prevValues,
        ...newData,
        logo: null,
      }));

      if (newData.logo) {
        setImagePreviews((prev) => ({
          ...prev,
          logo: {
            url: newData.pathurl + newData.logo,
            isPopulated: true,
          },
        }));
      }
    }
  }, [fetchedData]);

  //mutation to add/update orgnisation details
  const { mutate: orgDetails } = useMutation({
    mutationFn: organisation,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
      }
    },
  });

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      height: "40px",
      borderWidth: "2px",
      borderColor: "#f2f3f8",
      "&:hover": {
        borderColor: "#D1D5DB",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "40px",
      padding: "0 12px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "40px",
    }),
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      setImagePreviews((prev) => ({
        ...prev,
        [name]: {
          url: URL.createObjectURL(file),
          isPopulated: false,
        },
      }));
      formik.setFieldValue(name, file);
    }
  };

  const handleRemoveImage = (fieldName) => {
    setImagePreviews((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    formik.setFieldValue(fieldName, null);
    const fileInput = document.getElementById(fieldName);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCountryChange = (selectedOption) => {
    formik.setFieldValue(
      "id_country",
      selectedOption ? selectedOption.value : ""
    );
    formik.setFieldValue("id_state", "");
    formik.setFieldValue("id_city", "");
  };

  const handleStateChange = (selectedOption) => {
    formik.setFieldValue(
      "id_state",
      selectedOption ? selectedOption.value : ""
    );
    formik.setFieldValue("id_city", "");
  };

  const handleCityChange = (selectedOption) => {
    formik.setFieldValue("id_city", selectedOption ? selectedOption.value : "");
  };

  const handleClear = () => {
    formik.resetForm();
    setImagePreviews({
      logo: null,
    });
  };

  console.log(formik.values)

  return (
    <>
      {/* <div className="flex flex-row justify-between">
        <p className="text-sm text-gray-400 mt-4 mb-4">Settings/<span className="text-black">Organisation</span></p>
      </div> */}
      <Breadcrumb
        items={[{ label: "Settings" }, { label: "Organisation", active: true }]}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col bg-white border-2 border-[#F2F2F9] rounded-[10px] px-4 pb-4">
          <div className="p-4">
            <h2 className="text-lg text-[#232323] font-semibold mb-4 border-b pb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* First Row */}
              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Company Name<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formik.values.company_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter company name"
                />
                {formik.touched.company_name && formik.errors.company_name && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.company_name}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Short Code<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="short_code"
                  value={formik.values.short_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter short code"
                />
                {formik.touched.short_code && formik.errors.short_code && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.short_code}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Email<span className="text-red-400"> *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter email"
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.email}
                  </span>
                )}
              </div>

              {/* Second Row */}
              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Mobile<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter mobile number"
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.mobile}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Address<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter address"
                />
                {formik.touched.address && formik.errors.address && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.address}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Pincode<span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter pincode"
                />
                {formik.touched.pincode && formik.errors.pincode && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.pincode}
                  </span>
                )}
              </div>

              {/* Third Row */}
              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Country<span className="text-red-400"> *</span>
                </label>
                <Select
                  options={country}
                  value={country.find(
                    (option) => option.value === formik.values.id_country
                  )}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                  placeholder="Select Country"
                  styles={customStyles(true)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {formik.touched.id_country && formik.errors.id_country && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.id_country}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  State<span className="text-red-400"> *</span>
                </label>
                <Select
                  options={states}
                  value={states.find(
                    (option) => option.value === formik.values.id_state
                  )}
                  onChange={handleStateChange}
                  onBlur={formik.handleBlur}
                  placeholder="Select State"
                  styles={customStyles(true)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {formik.touched.id_state && formik.errors.id_state && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.id_state}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  City<span className="text-red-400"> *</span>
                </label>
                <Select
                  options={city}
                  value={city.find(
                    (option) => option.value === formik.values.id_city
                  )}
                  onChange={handleCityChange}
                  onBlur={formik.handleBlur}
                  placeholder="Select City"
                  styles={customStyles(true)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {formik.touched.id_city && formik.errors.id_city && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.id_city}
                  </span>
                )}
              </div>

              {/* Fourth Row */}
              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter website url"
                />
                {formik.touched.website && formik.errors.website && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.website}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formik.values.latitude}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter latitude"
                />
                {formik.touched.website && formik.errors.website && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.website}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formik.values.longitude}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter longitude"
                />
                {formik.touched.website && formik.errors.website && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.website}
                  </span>
                )}
              </div>


              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Whatsapp No
                </label>
                <input
                  type="text"
                  name="whatsapp_no"
                  value={formik.values.whatsapp_no}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border-2 border-[#f2f3f8] rounded-md px-3 py-2"
                  placeholder="Enter whatsapp number"
                />
                {formik.touched.whatsapp_no && formik.errors.whatsapp_no && (
                  <span className="text-red-500 text-xs mt-1">
                    {formik.errors.whatsapp_no}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-black mb-1 text-sm font-medium">
                  Upload Image
                </label>
                {!imagePreviews.logo && (
                  <div className="relative flex items-center justify-between border-2 border-[#f2f3f8] rounded-md hover:bg-gray-50 cursor-pointer w-full h-[43px]">
                    <span className="ml-2 text-sm text-gray-600 truncate">
                      {formik.values.logo ? formik.values.logo.name : "Browse"}
                    </span>
                    <label
                      htmlFor="logo"
                      className="text-white px-3 py-1 rounded-lg cursor-pointer h-full flex items-center text-sm"
                      style={{ backgroundColor: layout_color }}
                    >
                      Choose File
                    </label>
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                {imagePreviews.logo && (
                  <div className="mt-2 relative">
                    <div className="relative inline-block">
                      <img
                        src={imagePreviews.logo.url}
                        alt="logo preview"
                        className="w-24 h-20 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("logo")}
                        className="absolute top-1 right-1 bg-white text-red-400 p-1 rounded-md focus:outline-none"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-4 mb-2 gap-3">
          <button
            type="submit"
            className="px-9 h-[36px] text-sm font-semibold text-white rounded-lg flex justify-center items-center lg:h-[36px]"
            style={{ backgroundColor: layout_color }}
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-9 h-[36px] font-semibold text-sm border-2 bg-[#F6F7F9] border-[#f2f3f8] rounded-lg hover:bg-gray-50 flex justify-center items-center text-[#6C7086] lg:h-[36px]"
          >
            Clear
          </button>
          
        </div>
      </form>
    </>
  );
};

export default Organisation;