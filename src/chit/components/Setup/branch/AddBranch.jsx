import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getallclient, getallprojects, allcountry, allstate, allcity, addbranch, getbranchbyid, updatebranch } from '../../../api/Endpoints'
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity/index";
import { CloudFog } from 'lucide-react';

const INITIAL_FORM_STATE = {
  branch_name: '',
  branch_landline: '',
  mobile: '',
  whatsapp_no: '',
  address: '',
  pincode: '',
  email: '',
  id_country: "",
  id_state: "",
  id_city: "",
};

const addBranch = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [clientData, setClientData] = useState([])
  const [countryData, setCountryData] = useState([])
  const [stateData, setStateData] = useState([])
  const [cityData, setCityData] = useState([])
   const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  // edit branch section
  const [branchDetails, setBranchDetails] = useState(null);

  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const [selectedClient, setSelectedClient] = useState(id_client)
  
 
  //mutations
  const { mutate: getallclientMutate } = useMutation({
    mutationFn: getallclient,
    onSuccess: (response) => {
      if (response?.data) {
        setClientData(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      }
    },
  });

  const { mutate: getallprojectsMutate } = useMutation({
    mutationFn: getallprojects,
    onSuccess: (response) => {
      if (response?.data) {
        setProjectData(response.data);
      }
    },
  });



  const { mutate: addbranchMutate } = useMutation({
    mutationFn: addbranch,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message)
        navigate('/setup/branch')
      }
    },
  });


  
  const { data: countryresponse, isLoading: loadingCountries } = useQuery({
    queryKey: ["country"],
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


  useEffect(() => {
    getallclientMutate()
    getallprojectsMutate()
    // getAllCountryMutate()
  }, [])

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

  useEffect(() => {
    if (id && branchDetails) {
      setFormData({
        branch_name: branchDetails.branch_name || '',
        branch_landline: branchDetails.branch_landline || '',
        mobile: branchDetails.mobile || '',
        whatsapp_no: branchDetails.whatsapp_no || '',
        address: branchDetails.address || '',
        pincode: branchDetails.pincode || '',
        email: branchDetails.email || '',
        id_country: branchDetails.id_country._id || '',
        id_state:branchDetails.id_state._id || '',
        id_city: branchDetails.id_city._id || '',
      });

      if (branchDetails.id_client) {
        setSelectedClient(branchDetails.id_client._id);
      }

      if (branchDetails.id_country) {
        setCountry(branchDetails.id_country._id);
      }

      if (branchDetails.id_state) {
        setState(branchDetails.id_state._id);
      }

      if (branchDetails.id_city) {
        setCity(branchDetails.id_city._id);
      }


   
    }
  }, [branchDetails, id]);



  // handlers
  const handleCancle = () => {
    navigate('/setup/branch')
  }

  // input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.branch_name.trim()) errors.branch_name = 'Branch name is required';
    if (!formData.branch_landline) {
      errors.branch_landline = 'Branch landline is required';
    } else if (!/^\d{6,15}$/.test(formData.branch_landline)) {
      errors.branch_landline = 'Landline must be 6-15 digits';
    }
    if (!formData.mobile) errors.mobile = 'Mobile number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.pincode) errors.pincode = 'Pincode is required';
    if (!formData.whatsapp_no) errors.whatsapp_no = 'Whatsapp No is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!country) errors.country = 'Country is required';
    if (!state) errors.state = 'State is required';
    if (!city) errors.city = 'City is required';
    if (!selectedClient) errors.client = 'Client is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formDataToSend = {
      id_client: selectedClient,
      branch_name: formData.branch_name,
      branch_landline: formData.branch_landline,
      mobile: formData.mobile,
      whatsapp_no: formData.whatsapp_no,
      address: formData.address,
      pincode: formData.pincode,
      id_country: country,
      id_state: state,
      id_city: city,
      email: formData.email
    };

    if (id) {
   
      updatebranchMutate({ id, ...formDataToSend });
    } else {
    
      addbranchMutate(formDataToSend);
    }
  };


  const handleCommonChange = (e) => { 
      setSelectedClient(e.target.value)
  }

  // edit brach seciton
  const { mutate: getbranchbyidMutate } = useMutation({
    mutationFn: getbranchbyid,
    onSuccess: (response) => {
      setBranchDetails(response.data);
    }
  });

  useEffect(() => {
    if (id) {
      getbranchbyidMutate({ id: id })
    }
  }, [id])

  const { mutate: updatebranchMutate } = useMutation({
    mutationFn: updatebranch,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        navigate('/setup/branch');
      }
    },
  });

  const handleBack = () => {
    navigate('/setup/branch')
  }

  // const handleCountry = (e)=>{
  //   const value = e.target.value
  //   setCountry(value)

  // }

  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold'>
          {id ? 'Edit Branch' : 'Add Branch'}
        </h2>
        {id && (
          <div className='flex flex-row gap-4'>
            <button className='bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20'
              onClick={handleBack}
            >
              Back
            </button>
            <button className='bg-[#61A375] text-white rounded-md p-3 w-full lg:w-20'
              onClick={handleSubmit}
            >
              Edit
            </button>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
        <div className='flex flex-col bg-white px-8 pb-4 pt-2 relative'>
          <div>
            <h2 className='text-1xl font-semibold mb-4 mt-4'>Branch Details</h2>
            <div className='grid grid-rows-2 md:grid-cols-2 gap-6 border-t-2 border-gray-300'>
              <div className='flex flex-col gap-2 mt-2'>
                <label className='text-gray-700 font-medium'>Branch Name<span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  name='branch_name'
                  value={formData.branch_name}
                  onChange={handleInputChange}
                  className='border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Branch Name'
                />
                {formErrors.branch_name && <span className="text-red-500 text-sm mt-1">{formErrors.branch_name}</span>}
              </div>

              {id_role === 1 && (
                <div className='flex flex-col gap-2 md:mt-2 lg:mt-2' >
                  <label className='text-gray-700 font-medium'>Client<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name="id_client"
                      value={selectedClient}
                      onChange={handleCommonChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select Client--</option>
                      {clientData.map((client) => (
                        <option key={client._id} value={client._id}>{client.company_name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {formErrors.client && <span className="text-red-500 text-sm mt-1">{formErrors.client}</span>}
                </div>
              )}
              <div className='flex flex-col gap-2'>
                <label className='text-gray-700 font-medium'>Email<span className='text-red-400'>*</span></label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Email'
                />
                {formErrors.email && <span className="text-red-500 text-sm mt-1">{formErrors.email}</span>}
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-gray-700 font-medium'>Branch Landline</label>
                <input
                  type="text"
                  name="branch_landline"
                  value={formData.branch_landline}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 15) {
                      handleInputChange({ target: { name: "branch_landline", value } });
                    }
                  }}
                  maxLength="15"
                  placeholder="Enter Branch Landline"
                  onKeyDown={(e) => {
                    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                      e.preventDefault();
                    }
                  }}
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />

                {formErrors.branch_landline && <span className="text-red-500 text-sm mt-1">{formErrors.branch_landline}</span>}
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-gray-700 font-medium'>Mobile<span className='text-red-400'>*</span></label>
                <input
                  type='number'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Mobile No'
                />
                {formErrors.mobile && <span className="text-red-500 text-sm mt-1">{formErrors.mobile}</span>}
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-gray-700 font-medium'>Whatsapp<span className='text-red-400'>*</span></label>
                <input
                  type='number'
                  name='whatsapp_no'
                  value={formData.whatsapp_no}
                  onChange={handleInputChange}
                  className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Whatsapp No'
                />
                {formErrors.whatsapp_no && <span className="text-red-500 text-sm mt-1">{formErrors.whatsapp_no}</span>}
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-gray-700 font-medium'>Address<span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Address'
                />
                {formErrors.address && <span className="text-red-500 text-sm mt-1">{formErrors.address}</span>}
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-gray-700 font-medium'>Pincode<span className='text-red-400'>*</span></label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onInput={(e) =>
                    (e.target.value = e.target.value.replace(/\D/g, ""))
                  }
                  onChange={handleInputChange}
                  pattern="\d{6}"
                  maxLength={"6"}
                  className="border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter Pincode"
                />
                
                {formErrors.pincode && <span className="text-red-500 text-sm mt-1">{formErrors.pincode}</span>}
              </div>


              <div className="flex flex-col gap-2">
                <label className="text-black mb-1 font-medium">
                  Country<span className="text-red-400">*</span>
                </label>

                <Select
                  options={countryData}
                  value={
                    countryData.find(
                      (ctry) => ctry.value === formData.id_country
                    ) || country
                  }
                  onChange={(ctry) => {
                    setFormData(prev=>({
                      ...prev,
                      id_country:ctry.value,
                    }))
                    setCountry(ctry.value);
                  }}
                  customSelectStyles={customSelectStyles}
                  isLoading={loadingCountries}
                  placeholder="Select Country"
                />
                {formErrors.id_country ? (
                  <div style={{ color: "red" }}>
                    {formErrors.id_country}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-black mb-1 font-medium">
                  State<span className="text-red-400">*</span>
                </label>

                <Select
                  options={stateData}
                  value={
                    stateData.find(
                      (state) => state.value === formData.id_state
                    ) || state
                  }
                  onChange={(e) => {
                    setFormData(prev=>({
                      ...prev,
                      id_state:e.value,
                    }))
                    setState(e.value);
                  }}
                  customSelectStyles={customSelectStyles}
                  isLoading={loadingStates}
                  placeholder="Select state"
                />

                {formErrors.id_state ? (
                  <div style={{ color: "red" }}>
                    {formErrors.id_state}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-black mb-1 font-medium">
                  City<span className="text-red-400">*</span>
                </label>

                <Select
                  options={cityData}
                  value={
                    cityData.find(
                      (city) => city.value === formData.id_city
                    ) || city
                  }
                  onChange={(e) => {
                    setFormData(prev=>({
                      ...prev,
                      id_city:e.value,
                    }))
                    setCity(e.value);
                  }}
                  customSelectStyles={customSelectStyles}
                  isLoading={loadingCities}
                  placeholder="Select city"
                />

                {formErrors.id_city ? (
                  <div style={{ color: "red" }}>
                    {formErrors.id_city}
                  </div>
                ) : null}
              </div>

            </div>
          </div>
          {!id && (
            <div>
              <hr className='absolute border-gray-300 right-0 w-full bottom-20' />
              <div className='bg-white mt-6'>
                <div className='flex justify-end gap-2 mt-3'>
                  <button
                    className='bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20'
                    type='button'
                    onClick={handleCancle}
                  >
                    Cancel
                  </button>
                  <button
                    className='bg-[#61A375] text-white rounded-md p-3 w-full lg:w-20'
                    type='button'
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default addBranch