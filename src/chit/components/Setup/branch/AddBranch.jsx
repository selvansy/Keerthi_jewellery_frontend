import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getallclient, getallprojects,allcountry,allstate,allcity,addbranch,getbranchbyid,updatebranch} from '../../../api/Endpoints'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {useParams} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';  

const INITIAL_FORM_STATE = {
  branch_name: '',
  branch_landline: '',
  mobile: '',
  whatsapp_no: '',
  address: '',
  pincode: '',
  email: '',
};

const addBranch = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [clientData, setClientData] = useState([])
    const [countryData, setCountryData] = useState([])
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])
    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState({});
    // edit branch section
    const [branchDetails, setBranchDetails] = useState(null);

    const roledata = localStorage.getItem('decoded');
    const id_role = roledata?.id_role?.id_role;
    const id_client = roledata?.id_client;
    const id_branch = roledata?.branch;
    const [selectedClient, setSelectedClient] = useState(id_client)
    console.log(roledata);
     // Memoized sort functions
  const sortedStates = React.useMemo(() => 
    [...stateData].sort((a, b) => a.state_name.localeCompare(b.state_name)),
    [stateData]
  );

  const sortedCities = React.useMemo(() => 
    [...cityData].sort((a, b) => a.city_name.localeCompare(b.city_name)),
    [cityData]
  );


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

    const { mutate: getAllCountryMutate } = useMutation({
        mutationFn: allcountry,
        onSuccess: (response) => {
            if (response?.data) {
                setCountryData(response.data);
                if (response.data.length > 0) {
                    setSelectedCountry(response.data[0]._id);
                }
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

    const { mutate: getAllStateMutate } = useMutation({
      mutationFn: allstate,
      onSuccess: (response) => {
          if (response?.data) {
              setStateData(response.data);
          }
      },
  });
  const { mutate: getAllCityMutate } = useMutation({
      mutationFn: allcity,
      onSuccess: (response) => {
          if (response?.data) {
              setCityData(response.data);
          }
      },
  });


    //useEffects
    useEffect(()=>{
      if(selectedCountry){
        getAllStateMutate({id_country: selectedCountry})
      }
    },[selectedCountry])

    useEffect(() => {
      getallclientMutate()
      getallprojectsMutate()
      getAllCountryMutate()
  }, [])

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
      });
      
      if (branchDetails.id_client) {
        setSelectedClient(branchDetails.id_client._id);
      }
      if (branchDetails.id_country) {
        setSelectedCountry(branchDetails.id_country._id);
      }
      if (branchDetails.id_state) {
        setSelectedState(branchDetails.id_state._id);
        getAllCityMutate({ id_state: branchDetails.id_state._id });
      }
      if (branchDetails.id_city) {
        setSelectedCity(branchDetails.id_city._id);
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
    if (!formData.branch_landline) errors.branch_landline = 'Branch landline is required';
    if (!formData.mobile) errors.mobile = 'Mobile number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.pincode) errors.pincode = 'Pincode is required';
    if(!formData.whatsapp_no) errors.whatsapp_no = 'Whatsapp No is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!selectedCountry) errors.country = 'Country is required';
    if (!selectedState) errors.state = 'State is required';
    if (!selectedCity) errors.city = 'City is required';
    if(!selectedClient) errors.client = 'Client is required';

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
          id_country: selectedCountry,
          id_state: selectedState,
          id_city: selectedCity,
          email: formData.email
      };
  
      if (id) {
        // Update existing branch
        updatebranchMutate({ id, ...formDataToSend });
      } else {
        // Create new branch
        addbranchMutate(formDataToSend);
      }
    };


    const handleCommonChange = (e) => {
      if(e.target.name === 'id_client'){
        setSelectedClient(e.target.value)
      }else if(e.target.name === 'id_country'){
        setSelectedCountry(e.target.value)
      }else if(e.target.name === 'id_state'){
        setSelectedState(e.target.value)
        getAllCityMutate({ id_state: e.target.value });
      }else if(e.target.name === 'id_city'){
        setSelectedCity(e.target.value)
      }
    }

   // edit brach seciton
  const { mutate: getbranchbyidMutate } = useMutation({
    mutationFn: getbranchbyid,
    onSuccess: (response) => {
      setBranchDetails(response.data);
    }
  });

  useEffect(()=>{
    if(id){
      getbranchbyidMutate({id:id})
    }
  },[id])

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

    return (
        <>
            <div className='flex flex-row justify-between'>
                <h2 className='text-2xl text-[#023453] font-bold'>
                    {id ? 'Edit Branch' : 'Add Branch'}
                </h2>
               {id &&(
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
                                        <option value='' disabled>--Select Client--</option>
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
                                    type='number'
                                    name='branch_landline'
                                    value={formData.branch_landline}
                                    onChange={handleInputChange}
                                    min='0'
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                    placeholder='Enter Branch Landline'
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
                                    type='number'
                                    name='pincode'
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    min='0'
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                    placeholder='Enter Pincode'
                                />
                                {formErrors.pincode && <span className="text-red-500 text-sm mt-1">{formErrors.pincode}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-gray-700 font-medium'>Country<span className='text-red-400'>*</span></label>
                                <div className="relative">
                                    <select 
                                        name='id_country'
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                    >
                                        <option value='' disabled>--Select--</option>
                                        {countryData.map((country) => (
                                            <option key={country._id} value={country._id}>
                                                {country.country_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                            <path d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                {formErrors.country && <span className="text-red-500 text-sm mt-1">{formErrors.country}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-black font-medium'>State<span className='text-red-400'>*</span></label>
                                <div className="relative">
                                  <select 
                                    name='id_state'
                                    className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                                    onChange={handleCommonChange}
                                    value={selectedState}
                                  >
                                    <option value='' disabled className="text-gray-700">--Select--</option>
                                    {sortedStates.map((state) => (
                                      <option className="text-gray-700" key={state._id} value={state._id}>
                                        {state.state_name}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                      <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                  </div>
                                </div>
                                {formErrors.state && <span className="text-red-500 text-sm mt-1">{formErrors.state}</span>}
                              </div>
                              <div className='flex flex-col gap-2'>
                              <label className='text-black font-medium'>City<span className='text-red-400'>*</span></label>
                              <div className="relative">
                                <select 
                                  name='id_city'
                                  className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700' 
                                  defaultValue=''
                                  onChange={handleCommonChange}
                                  value={selectedCity}
                                >
                                  <option value='' disabled className="text-gray-700">--Select--</option>
                                  {sortedCities.map((city) => (
                                    <option className="text-gray-700" key={city._id} value={city._id}>
                                      {city.city_name}
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                                    <path d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                </div>
                              </div>
                              {formErrors.city && <span className="text-red-500 text-sm mt-1">{formErrors.city}</span>}
                            </div>
                        </div>
                    </div>
                    {!id &&(
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