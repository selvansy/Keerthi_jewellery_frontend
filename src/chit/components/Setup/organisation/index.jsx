import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Select from "react-select";
import { allcountry, allstate, allcity,organisation,getOrganisation} from "../../../api/Endpoints";

const Organisation = () => {

  const [imagePreviews, setImagePreviews] = useState({
    logo: null,
    small_logo: null,
    favicon: null,
    login: null,
    background: null,
    bottom_logo: null,
  });
  const [orgData,setOrgData] = useState({})
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);

  const formik = useFormik({
    initialValues: {
        company_name: orgData?.company_name || "",
        mobile: orgData?.mobile || "",
        pincode: orgData?.pincode || "",
        short_code: orgData?.short_code || "",
        address: orgData?.address || "",
        id_country: orgData?.id_country || "",
        id_state: orgData?.id_state || "",
        id_city: orgData?.id_city || "",
        email: orgData?.email || "",
        website: orgData?.website || "",
        color: orgData?.color || "",
        primary_color: orgData?.primary_color || "",
        secondary_color: orgData?.secondary_color || "",
        background_color: orgData?.background_color || "",
        whatsapp_no: orgData?.whatsapp_no || "",
        toll_free: orgData?.toll_free || "",
        logo: orgData?.logo || null,
        small_logo: orgData?.small_logo || null,
        favicon: orgData?.favicon || null,
        login: orgData?.login || null,
        background: orgData?.background || null,
        bottom_logo: orgData?.bottom_logo || null,
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
      background_color: Yup.string(),
      whatsapp_no: Yup.string()
        .matches(/^[0-9]{10}$/, "Whatsapp number must be 10 digits"),
      toll_free: Yup.string(),
    }),
    onSubmit: (values) => {
        const formData = new FormData();
      
        Object.keys(values).forEach((key) => {
          if (values[key] && typeof values[key] !== "object") {
            formData.append(key, values[key]);
          }
        });
      
        const fileFields = ["logo", "small_logo", "favicon", "login", "background", "bottom_logo"];
        
        fileFields.forEach((field) => {
          if (values[field]) {
            formData.append(field, values[field]);
          }
        });
      
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
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
    if (fetchedData) {
      const newData = fetchedData.data;
      setOrgData(newData);
  
      formik.setValues((prevValues) => ({
        ...prevValues,
        ...newData,
        logo: null,
        small_logo: null,
        favicon: null,
        login: null,
        background: null,
        bottom_logo: null,
      }));
  
      const previewUpdates = {};
      ["logo", "small_logo", "favicon", "login", "background", "bottom_logo"].forEach((field) => {
        if (newData[field]) {
          previewUpdates[field] = {
            url: newData.pathurl + newData[field],
            isPopulated: true,
          };
        }
      });
  
      setImagePreviews((prev) => ({
        ...prev,
        ...previewUpdates,
      }));
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
      minHeight: "50px",
      height: "50px",
      borderWidth: "2px",
      borderColor: "#D1D5DB",
      "&:hover": {
        borderColor: "#D1D5DB",
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

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      setImagePreviews(prev => ({
        ...prev,
        [name]: {
          url: URL.createObjectURL(file),
          isPopulated: false
        }
      }));
      formik.setFieldValue(name, file);
    }
  };

  const handleRemoveImage = (fieldName) => {
    setImagePreviews(prev => ({
      ...prev,
      [fieldName]: null
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
  };

  const handleStateChange = (selectedOption) => {
    formik.setFieldValue(
      "id_state",
      selectedOption ? selectedOption.value : ""
    );
  };

  const handleCityChange = (selectedOption) => {
    formik.setFieldValue("id_city", selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 font-bold justify-between">
          Organisation
        </h2>
      </div>
      <div className="flex flex-col bg-white border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <form onSubmit={formik.handleSubmit} className="p-4">
          <h2 className="text-1xl font-semibold mb-4 mt-4">
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formik.initialValues).map((field) =>
              field !== "logo" &&
              field !== "small_logo" &&
              field !== "favicon" &&
              field !== "login" &&
              field !== "background" &&
              field !== "bottom_logo" ? (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">
                    {field === "id_country"
                      ? "Country"
                      : field === "id_state"
                      ? "State"
                      : field === "id_city"
                      ? "City"
                      : field
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                    {formik.touched[field] && formik.errors[field] && (
                      <span className="text-red-400">*</span>
                    )}
                  </label>
                  {field === "id_country" ? (
                    <Select
                      options={country}
                      value={country.find(
                        (option) => option.value === formik.values.id_country
                      )}
                      onChange={handleCountryChange}
                      onBlur={formik.handleBlur}
                      placeholder="Select Country"
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  ) : field === "id_state" ? (
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
              ) : (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 mb-1 font-medium">
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </label>
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
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {imagePreviews[field] && (
                      <div className="mt-2 relative flex flex-row justify-center">
                        <img
                          src={imagePreviews[field].url}
                          alt={`${field} preview`}
                          className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(field)}
                          className="absolute top-1 right-[35%] lg:right-[39%] bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex flex-row justify-end mt-4 mb-2">
            <button
              className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Organisation;
