import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Camera, X, Send } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { updatecustomer, getcustomerById, getallbranch, allcountry, allstate, addcustomer, allcity,getBranchById } from '../../../api/Endpoints';

import {sendOtp , closeBill} from "../../../api/BackendUrl"
import { useMutation } from '@tanstack/react-query';
import Webcam from 'react-webcam';
import profileplaceholder from '../../../../assets/profileplaceholder.png'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMobileNumber } from '../../../utils/commonFunction';

const AddCustomer = () => {

  let {id} = useParams();

  const navigate = useNavigate()
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const [showVerification, setShowVerification] = useState(false)
    const [refundtype, setRefundType] = useState(false)
    const [mobileNum, setMobileNum] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpNumber, setOtpNumber] = useState("");
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
  
  const [cus_img, setcus_img] = useState(null);
  const [id_proof, setid_proof] = useState(null);
  const [id_proofError, setid_proofError] = useState('');
  const [date_of_wed, setDate_of_wed] = useState(null);
  const [countryData, setCountryData] = useState('');
  const [stateData, setStateData] = useState([]);
  const sortedStates = [...stateData].sort((a, b) =>
    a.state_name.localeCompare(b.state_name)
  );
  const [selectedGender, setSelectedGender] = useState(3);
  const [birthDate, setBirthDate] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const sortedCities = [...cityData].sort((a, b) =>
    a.city_name.localeCompare(b.city_name)
  );
  const [selectedBranch, setSelectedBranch] = useState('');

  const [selectedCity, setSelectedCity] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    whatsapp: '',
    address: '',
    pincode: '',
    pan: '',
    authorno: '',
  });


  const [formErrors, setFormErrors] = useState({});
  const [customerData, setcustomerData] = useState(null);


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

  useEffect(() => {
    getAllCountryMutate();
    getallbranchMutate();
  }, []);

  useEffect(() => {
    
    if (id) {
      getCustomerData(id);
    }
  }, [id])


    const validateMobile = (mobileNum)=>{
        if (!mobileNum){
          errors.mobileNum = 'Mobile is required'
        }else if (!/^\d{10}$/.test(mobileNum)) {
          errors.mobileNum = "Mobile number must be 10 digits";
          
        }
      } 
    
      const handleMobileNumber = (e)=>{
        const num = e.target.value;
        if(validateMobile(num)){
          toast.error("Mobile must be 10 digits");
          return;
        }
        setMobileNum(e.target.value)
      }
    
      const SendOtpToMobile = ()=>{
        const payload = {
          mobile: formData.mobile || mobileNum,
          otp: otpNumber,
          branchId: selectedBranch
         }
         postSendOtpMobile(payload)
      }
    
    
      const { mutate: postSendOtpMobile } = useMutation({
        mutationFn: sendOtp,
        onSuccess: (response) => {
          if (response) {
            toast.success(response.message);
          }
        },
      });

        const { mutate: branchbyId } = useMutation({
          mutationFn: getBranchById,
          onSuccess: (response) => {
            setbranch(response.data);
          },
          onError: (error) => {
            console.error("Error:", error);
          },
        });
    
    
      const handleVerifyOtp = (num)=>{
    
        if(validateMobile(num)){
          toast.error("Mobile must be 10 digits");
          return;
        }
    
        const payload = {
          mobile: mobileNum || mobile,
          otp: otpNumber,
          branchId: selectedBranch
         }
         postVerifyOtp(payload)
         setTimer(60);
         setCanResend(false);
      }
    
      
      const { mutate: postVerifyOtp } = useMutation({
        mutationFn: sendOtp,
        onSuccess: (response) => {
          if (response) {
            toast.success(response.message);
            setTimer(60);
            setCanResend(false);
          }
        },
      });
  

 

  const { mutate: getAllCountryMutate } = useMutation({
    mutationFn: allcountry,
    onSuccess: (response) => {
      if (response?.data?.[0]?._id) {
        setCountryData(response.data[0]._id);
        getAllStateMutate({ id_country: response.data[0]._id });
      }
    },
    onError: (error) => {
      console.error('Error fetching countries:', error);
    }
  });

  const handleSetStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value)
    console.log("StateId",value)
    getAllCityMutate({ id_state: value });
    cityData.map((city) => {
      if (city._id === value) {
        setSelectedCity(city.city_name);
      }
    })
  }


  const { mutate: getCustomerData } = useMutation({
    mutationFn: (id)=>getcustomerById(id),
    onSuccess: (response) => {

      if (response?.data) {
        setcustomerData(response.data);
        setSelectedGender(response.data.gender);
        setFormData({
          firstName: response.data.firstname,
          lastName: response.data.lastname,
          mobile: response.data.mobile,
          whatsapp: response.data.whatsapp,
          address: response.data.address,
          pincode: response.data.pincode,
          pan: response.data.pan,
          authorno: response.data.authorno,
        });
        setProfilePreview(response.data.image);
        setDate_of_wed(adjustDate(response.data.date_of_wed));
        setBirthDate(adjustDate(response.data.date_of_birth));
      
        setSelectedState(response.data.stateDetails._id);
        setSelectedCity(response.data.cityDetails._id);
        setSelectedBranch(response.data.branchDetails._id);
        
        getAllCityMutate({ id_state: response.data.stateDetails._id });
      }
    },
  });



  const adjustDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('T')[0].split('-');
    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { mutate: getAllStateMutate } = useMutation({
    mutationFn: allstate,
    onSuccess: (response) => {
      if (response?.data) {
        setStateData(response.data);
      }
    },
    onError: (error) => {
      console.error('Error fetching states:', error);
    }
  });

  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response?.data) {
        setBranchData(response.data);
      }
    },
    onError: (error) => {
      console.error('Error fetching cities:', error);
    }
  });

  const { mutate: getAllCityMutate } = useMutation({
    mutationFn: allcity,
    onSuccess: (response) => {
      if (response?.data) {
        setCityData(response.data);
      }
    },
    onError: (error) => {
      console.error('Error fetching cities:', error);
    }
  });

  // api to add customer
  const { mutate: addcustomerMutate } = useMutation({
    mutationFn: (data) => addcustomer(data),
    onSuccess: (response) => {

      if (response) {
        toast.success(response.message);
        navigate('/manageaccount/customer');
        setFormData({})
      }
    },
    onError: (error) => {
      console.error('Error adding customer:', error);
    }
  });

  const { mutate: updateCustomerData } = useMutation({
    mutationFn: updatecustomer,
    onSuccess: (response) => {
      toast.success(response.message)
      navigate('/manageaccount/customer');
      setFormData({})
      dispatch(setid(null))
    },
    onError: (error) => {
      console.error("Error fetching scheme types:", error);
    },
  });

  // input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;


    if (name === 'authorno') {
      setFormData(prev => ({
        ...prev,
        authorno: value.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleCancle = () => {
    navigate('/customer')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= (500*1024)) {
      setcus_img(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      }
      reader.readAsDataURL(file);
    }else{
      toast.error("File size exceeded or no file found")
    }
  };
  
   

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setProfilePreview(imageSrc);
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
        setcus_img(file);
      });
    setShowWebcam(false);
  };

  const handleClearImage = () => {
    setcus_img(null);
    setProfilePreview(null);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    formData.gender = gender;
    setFormErrors(prev => ({
      ...prev,
      gender: ''
    }));
  };

  //Branch change handler
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranch(branchId);
  };


  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.mobile) errors.mobile = 'Mobile number is required';
    if (!formData.address || !formData.address.trim()) errors.address = 'Address is required';
    if (!formData.pincode) errors.pincode = 'Pincode is required';
    if (!selectedState) errors.state = 'State is required';
    if (!selectedCity) errors.city = 'City is required';
    if (!selectedGender) errors.gender = 'Gender is required';
    if (!birthDate) errors.birthDate = 'Birth date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
  
    let formDataToSend = new FormData();
  
 
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });
  
  
    formDataToSend.append('id_country', countryData);
    formDataToSend.append('id_state', selectedState);
    formDataToSend.append('id_city', selectedCity);
    formDataToSend.append('id_branch', selectedBranch);
    formDataToSend.append('gender', selectedGender || '');
    formDataToSend.append('authorno', String(formData.authorno || ''));
    formDataToSend.append('notification', 1);
  
    if (birthDate) formDataToSend.append('date_of_birth', birthDate.toISOString());
    if (date_of_wed) formDataToSend.append('date_of_wed', date_of_wed.toISOString());
  
    if (formData.whatsapp) formDataToSend.append('whatsapp', formData.whatsapp);
    if (cus_img) formDataToSend.append('cus_img', cus_img);
    if (id_proof) formDataToSend.append('id_proof', id_proof);
  
  
    id ? updateCustomerData({ id, data: formDataToSend }) : addcustomerMutate(formDataToSend);
  };
  

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
  };

  // pancard number input handler
  const handlePanInput = (e) => {
    e.target.value = e.target.value.toUpperCase();
  };

  // input name capitalization
  const handleNameInput = (e, name) => {
    const value = e.target.value;
    if (value) {
      e.target.value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  // Handle id_proof file upload
  const handleid_proofUpload = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        setid_proof(file);
        setid_proofError('');
      } else {
        setid_proof(null);
        setid_proofError('Please upload a valid file format (PDF, DOC, DOCX, XLS, XLSX, or TXT)');
        e.target.value = '';
      }
    }
  };

  const handleWheel = (e) => {
    e.target.blur();
  };

  const handleBack = () => {
    navigate('/manageaccount/customer');
  }

  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-gray-900 font-bold justify-between'>{id ? "Edit Customer" : "Add Customer"}</h2>
        {id && (
          <div className='flex flex-row gap-4'>
            <button onClick={handleBack} className='bg-[#E2E8F0] text-black px-4 py-2 rounded-md'>Back</button>
            <button onClick={handleSubmit} className='bg-[#61A375] text-white px-4 py-2 rounded-md'>Edit</button>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col  bg-white border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)] '>
        <div className='flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2'>
          <div>
            <h2 className='text-1xl font-semibold mb-4 mt-4'>Basic Information</h2>
            <div className='grid grid-rows-2 md:grid-cols-2 gap-5  border-gray-300'>
              <div className='flex flex-col mt-2 gap-3'>
                <label className='text-gray-700 mb-1 font-medium'>First Name<span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  name='firstname'
                  className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                  value={formData.firstName}
                  onChange={(e) => handleNameInput(e, 'firstName')}
                />
                {formErrors.firstName && <span className="text-red-500 text-sm mt-1">{formErrors.firstName}</span>}
              </div>
              <div className='flex flex-col mt-2 gap-3'>
                <label className='text-gray-700 mb-1 font-medium'>Last Name<span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  name='lastname'
                  className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                  value={formData.lastName}
                  onChange={(e) => handleNameInput(e, 'lastName')}
                />
                {formErrors.lastName && <span className="text-red-500 text-sm mt-1">{formErrors.lastName}</span>}
              </div>
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Branch<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <select
                    name='id_branch'
                    className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                    onChange={handleBranchChange}
                    value={selectedBranch}
                  >
                    <option value='' readOnly className="text-gray-700">--Select--</option>
                    {branchData.map((branch) => (
                      <option className="text-gray-700" key={branch._id} value={branch._id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className='flex flex-col'>
                <label className='text-gray-700 mb-1 font-medium'>Mobile<span className='text-red-400'>*</span></label>
               
                 <input
                  type='text'
                  // {...mobileProps}
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleInputChange}
                  onWheel={handleWheel}
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                  pattern="\d{10}"
                  maxLength="10"
                  inputMode="numeric" 
                   className='border-2 border-gray-300 rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  placeholder='Enter Mobile Number'
                 
                />
                {formErrors.mobile && <span className="text-red-500 text-sm mt-1">{formErrors.mobile}</span>}
              </div>
              <div className='flex flex-col'>
                <label className='text-gray-700 mb-1 font-medium'>Whatsapp Number</label>
                <input
                  type='text'
                  name='whatsapp'
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  onWheel={handleWheel}
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                  pattern="\d{10}"
                  inputMode="numeric" 
                   maxLength={"10"}
                
                  className='border-2 border-gray-300 rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  placeholder='Enter Whatsapp Number'
                />
              </div>
              <div className='flex flex-col'>
                <label className='text-gray-700 mb-1 font-medium'>Address<span className='text-red-400'>*</span></label>
                <input
                  type='text'
                  name='address'
                  className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {formErrors.address && <span className="text-red-500 text-sm mt-1">{formErrors.address}</span>}
              </div>
              <div className='flex flex-col'>
                <label className='text-gray-700 mb-1 font-medium'>Pincode<span className='text-red-400'>*</span></label>
                <input
                  type='number'
                  name='pincode'
                  value={formData.pincode}
                  onChange={handleInputChange}
                  onWheel={handleWheel}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' ||
                      e.key === 'ArrowDown' ||
                      e.key === 'e' ||
                      e.key === 'E' ||
                      e.key === '-') {
                      e.preventDefault();
                    }
                  }}
                  className='border-2 border-gray-300 rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  placeholder='Enter Pincode'
                  maxLength="6"
                />
                {formErrors.pincode && <span className="text-red-500 text-sm mt-1">{formErrors.pincode}</span>}
              </div>
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Gender<span className='text-red-400'>*</span></label>
                <div className="flex flex-row gap-6 justify-start">
                  <button
                    name="gender"
                    onClick={() => handleGenderSelect(1)}
                    className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${selectedGender === 1 ? 'text-white' : 'bg-white text-black'
                      }`}
                    style={selectedGender === 1 ? { backgroundColor: layout_color } : {}}
                  >
                    Male
                  </button>

                  <button
                    name='gender'
                    onClick={() => handleGenderSelect(2)}
                    className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${selectedGender === 2 ? ' text-white' : 'bg-white text-black'
                      }`}
                      style={selectedGender === 2 ? { backgroundColor: layout_color } : {}}>
                    Female
                  </button>
                  <button
                    name='gender'
                    onClick={() => handleGenderSelect(3)}
                    className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${selectedGender === 3 ? ' text-white' : 'bg-white text-black'
                      }`}
                      style={selectedGender === 3 ? { backgroundColor: layout_color } : {}}>
                    Other
                  </button>
                </div>
                {formErrors.gender && <span className="text-red-500 text-sm mt-1">{formErrors.gender}</span>}
              </div>
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>State<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <select
                    name='id_state'
                    className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                    onChange={handleSetStateChange}
                    value={selectedState}
                  >
                    <option value='' readOnly className="text-gray-700">--Select--</option>
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
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>City<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <select
                    name='id_city'
                    className='appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'
                    defaultValue=''
                    onChange={handleCityChange}
                    value={selectedCity}
                  >
                    <option value='' readOnly className="text-gray-700">--Select--</option>
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
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Pan Number</label>
                <input
                  type='text'
                  name='pan'
                  className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                  onInput={handlePanInput}
                  maxLength="10"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Aadhar Card Number</label>
                <input
                  type='text'
                  name='authorno'
                  value={formData.authorno || ''}
                  onChange={handleInputChange}
                  className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                />
              </div>
            </div>

            <div className='grid grid-rows-2 md:grid-cols-2 gap-6 border-gray-300 mt-3'>
              <div className='flex flex-col mt-2 gap-3'>
                <label className='text-black mb-1 font-medium'>Date Of Wedding</label>
                <div className="relative">
                  <DatePicker
                    name='date_of_wed'
                    selected={date_of_wed}
                    onChange={(date) => setDate_of_wed(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Date"
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
                    utcOffset={0}
                    timeZone="UTC"
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                    <CalendarDays size={20} />
                  </span>
                </div>
              </div>

              <div className='flex flex-col mt-2 gap-3'>
                <label className='text-black mb-1 font-medium'>Date Of Birth<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <DatePicker
                    name='date_of_birth'
                    selected={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Date"
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
                    utcOffset={0}
                    timeZone="UTC"
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                    <CalendarDays size={20} />
                  </span>
                </div>
                {formErrors.birthDate && <span className="text-red-500 text-sm mt-1">{formErrors.birthDate}</span>}
              </div>


              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Upload Profile Image</label>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='flex-1'>
                    <label
                      htmlFor="profile-image"
                      className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4"
                    >
                      <p className='text-gray-900 truncate'>
                        {cus_img ? cus_img.name : 'Browse'}
                      </p>
                    </label>
                    <input
                      className="hidden"
                      name="profile_image"
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className='flex flex-col items-center justify-center lg:items-start lg:justify-start lg:w-52 mt-2'>
                      <button
                        onClick={() => setShowWebcam(prev => !prev)}
                        className="mt-2 rounded-lg flex items-center gap-2 text-white px-3 py-1 "
                        style={{ backgroundColor: layout_color }}>
                        <Camera size={16} />
                        <span className='text-sm'>{showWebcam ? 'Close Camera' : 'Open Camera'}</span>
                      </button>
                    </div>
                  </div>

                  <div className='flex items-start justify-center'>
                    <div className='relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden'>
                      <img
                        src={profilePreview ? profilePreview : profileplaceholder}
                        alt="Profile Preview"
                        className={`w-full h-full ${profilePreview ? 'object-cover' : 'object-contain'}`}
                      />
                      {profilePreview && (
                        <button
                          onClick={handleClearImage}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {showWebcam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="rounded-lg"
                      />
                      <div className="mt-4 flex justify-center gap-2">
                        <button
                          onClick={handleCapture}
                          className=" text-white px-4 py-2 rounded-md"
                          style={{ backgroundColor: layout_color }} >
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
                </div>
              )}
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Upload Document</label>
                <label
                  htmlFor="id_proof"
                  className="flex flex-col justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer p-5 text-center hover:bg-gray-50 transition-colors"
                >
                  <p className='text-gray-900'>
                    {id_proof ? id_proof.name : 'Browse to upload Document (PNG,JPG,SVG)'}
                  </p>
                </label>
                <input
                  className="hidden"
                  name="id_proof"
                  id="id_proof"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={handleid_proofUpload}
                />
                {id_proofError && (
                  <p className="text-red-500 text-sm mt-1">{id_proofError}</p>
                )}
                {id_proof && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      Selected file: {id_proof.name}
                    </span>
                    <button
                      onClick={() => {
                        setid_proof(null);
                        document.getElementById('id_proof').value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col w-full mt-2">
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                className="w-8 h-5 accent-blue-600"
                name="showVerification"
                checked={showVerification}
                onChange={() => setShowVerification(!showVerification)}
              />
              <h2 className="text-lg text-[#023453] font-bold whitespace-nowrap px-2 my-3">
                To verify account with OTP verification, kindly check the checkbox.
              </h2>
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
                  name="mobile"
                  className="border-2 w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter Here"
                  onChange={handleMobileNumber}
                  defaultValue={""}
                />
                <div
                  onClick={SendOtpToMobile}
                  className="absolute flex items-center justify-center cursor-pointer right-0 top-[30px] w-10 h-10 bg-[#023453] rounded-md  transition"
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
                  name="otp"
                  className="border-2 w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtpNumber(e.target.value)}
                />
                <div
                  onClick={()=>handleVerifyOtp(otpNumber)}
                  className="absolute flex items-center justify-center cursor-pointer right-0 top-[30px] w-10 h-10 bg-[#023453] rounded-md  transition"
                >
                  <Send size={22} className="text-white" />
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-col text-sm text-gray-600 mt-1">
                {canResend ? (
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={SendOtpToMobile}
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
            </div>
          </div>
          {!id && (
            <div>

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
                    className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                    type="button"
                    onClick={id ? handleUpdate : handleSubmit}
                  >
                    {id ? "Update" : "Submit"}
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

export default AddCustomer;