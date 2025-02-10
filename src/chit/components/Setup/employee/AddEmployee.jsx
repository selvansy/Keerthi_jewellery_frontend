import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Camera, X } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { allcountry, allstate, addemployee, allcity, getemployeebyid,getallbranch, updateemployee } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import Webcam from 'react-webcam';
import profileplaceholder from '../../../../assets/profileplaceholder.png'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
const AddEmployee = () => {
  const navigate = useNavigate()

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  
  const { id } = useParams();
  const [profileImage, setProfileImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [joiningDate, setJoiningDate] = useState(null);
  const [countryData, setCountryData] = useState('');
  const [stateData, setStateData] = useState([]);
  const sortedStates = [...stateData].sort((a, b) =>
    a.state_name.localeCompare(b.state_name)
  );
  const [selectedGender, setSelectedGender] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [branchfilter, setBranch] = useState([]);
  const sortedCities = [...cityData].sort((a, b) =>
    a.city_name.localeCompare(b.city_name)
  );

  const [selectedCity, setSelectedCity] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const webcamRef = useRef(null);

  const [formErrors, setFormErrors] = useState({});
  const [employeeData, setEmployeeData] = useState(null);
  const roledata = localStorage.getItem('decoded');
  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const [formData, setFormData] = useState({
    firstName: '',
    id_branch: "",
    lastName: '',
    mobile: '',
    phone: '',
    address: '',
    pincode: '',
    panNumber: '',
    aadharNumber: '',
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
  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      console.log('jut')
      if (response) {
        setBranch(response.data);
      }
    },
  });

  const handleSetStateChange = (stateId) => {
    setSelectedState(stateId)
    getAllCityMutate({ id_state: stateId });
    cityData.map((city) => {
      if (city._id === stateId) {
        setSelectedCity(city.city_name);
      }
    })
  }

  const handleSetCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
  }

  const { mutate: getemployeebyidMutate } = useMutation({
    mutationFn: getemployeebyid,
    onSuccess: (response) => {
      if (response?.data) {
        setEmployeeData(response.data);
        setSelectedGender(response.data.gender);
        setFormData({
          firstName: response.data.firstname,
          lastName: response.data.lastname,
          mobile: response.data.mobile,
          phone: response.data.phone,
          address: response.data.address,
          pincode: response.data.pincode,
          panNumber: response.data.pan_number,
          aadharNumber: response.data.aadhar_number,
          id_branch: response.data.id_branch,
        });
        setProfilePreview(response.data.image);
        setJoiningDate(adjustDate(response.data.date_of_join));
        setBirthDate(adjustDate(response.data.date_of_birth));
        setSelectedState(response.data.id_state);
        handleSetStateChange(response.data.id_state);
        setSelectedState(response.data.id_state);
        setSelectedCity(response.data.id_city);
        getAllCityMutate({ id_state: response.data.id_state });
      }
    },
  });

  const { mutate: updateEmployeeMutate } = useMutation({
    mutationFn: updateemployee,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate('/setup/employee');
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
    }
  });

  const adjustDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return new Date(`${year}-${month}-${day}`);
  };

  const handleEditSubmit = () => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const updateData = {
      id: id,
      firstname: formData.firstName,
      lastname: formData.lastName,
      mobile: formData.mobile,
      phone: formData.phone,
      address: formData.address,
      pincode: formData.pincode,
      pan_number: formData.panNumber,
      aadhar_number: formData.aadharNumber,
      id_branch: formData.id_branch,
      gender: selectedGender,
      date_of_birth: formatDate(birthDate),
      date_of_join: formatDate(joiningDate),
      id_state: selectedState,
      id_city: selectedCity,
      id_country: countryData
    };

    updateEmployeeMutate(updateData);
  }

  useEffect(() => {
    if (id) {
      getemployeebyidMutate({ id: id });
    }
  }, [id]);

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

  // api to add employee
  const { mutate: addEmployeeMutate } = useMutation({
    mutationFn: (data) => addemployee(data),
    onSuccess: (response) => {
      console.log(response);
      if (response) {
        toast.success(response.message);
        navigate('/setup/employee');
      }
    },
    onError: (error) => {
      console.error('Error adding employee:', error);
    }
  });

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


  useEffect(() => {
    getAllCountryMutate();
    getallbranchMutate();
  }, []);

  const handleCancle = () => {
    navigate('/setup/employee')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setProfilePreview(imageSrc);
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
        setProfileImage(file);
      });
    setShowWebcam(false);
  };

  const handleClearImage = () => {
    setProfileImage(null);
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

  //state change handler
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    formData.id_state = stateId;
    setSelectedState(stateId);
    if (stateId) {
      getAllCityMutate({ id_state: stateId });
    } else {
      setCityData([]);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.mobile) errors.mobile = 'Mobile number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.pincode) errors.pincode = 'Pincode is required';
    if (!selectedState) errors.state = 'State is required';
    if (!selectedCity) errors.city = 'City is required';
    if (!selectedGender) errors.gender = 'Gender is required';
    if (!joiningDate) errors.joiningDate = 'Joining date is required';
    if (!birthDate) errors.birthDate = 'Birth date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Fill required fields")
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append('firstname', formData.firstName);
    formDataToSend.append('lastname', formData.lastName);
    formDataToSend.append('mobile', formData.mobile);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('pincode', formData.pincode);
    formDataToSend.append('id_country', countryData);
    formDataToSend.append('id_state', selectedState);
    formDataToSend.append('id_city', selectedCity);
    formDataToSend.append('id_branch', '67629df47db4c1ee87829124');
    formDataToSend.append('date_of_birth', birthDate.toISOString());
    formDataToSend.append('date_of_join', joiningDate.toISOString());
    formDataToSend.append('gender', selectedGender);

    if (formData.phone) formDataToSend.append('phone', formData.phone);
    if (formData.panNumber) formDataToSend.append('pan_number', formData.panNumber);
    if (formData.aadharNumber) formDataToSend.append('aadhar_number', formData.aadharNumber);
    if (profileImage) formDataToSend.append('image', profileImage);
    if (resume) formDataToSend.append('resume', resume);

    addEmployeeMutate(formDataToSend);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
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

  // Handle resume file upload
  const handleResumeUpload = (e) => {
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
        setResume(file);
        setResumeError('');
      } else {
        setResume(null);
        setResumeError('Please upload a valid file format (PDF, DOC, DOCX, XLS, or TXT)');
        e.target.value = '';
      }
    }
  };

  const handleWheel = (e) => {
    e.target.blur();
  };

  const handleBack = () => {
    navigate('/setup/employee');
  }

  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-gray-900 font-bold justify-between'>Add Employee</h2>
        {id && (
          <div className='flex flex-row gap-4'>
            <button onClick={handleBack} className='bg-[#E2E8F0] text-black px-4 py-2 rounded-md'>Back</button>
            <button onClick={handleEditSubmit} className='bg-[#61A375] text-white px-4 py-2 rounded-md'>Edit</button>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>
        <div className='flex flex-col bg-white pl-8 pr-8 pb-4 pt-2 relative'>
          <div>
            <h2 className='text-1xl font-semibold mb-4 mt-4'>Basic Information</h2>
            <div className='grid grid-rows-2 md:grid-cols-2 gap-5 border-t-2 border-gray-300'>
              <div className='flex flex-col mt-2'>
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
              <div className='flex flex-col mt-2'>
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
                <label className='text-gray-700 mb-1 font-medium'>Mobile<span className='text-red-400'>*</span></label>
                <input
                  type='number'
                  name='mobile'
                  value={formData.mobile}
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
                  placeholder='Enter Mobile Number'
                  maxLength="10"
                />
                {formErrors.mobile && <span className="text-red-500 text-sm mt-1">{formErrors.mobile}</span>}
              </div>
              <div className='flex flex-col'>
                <label className='text-gray-700 mb-1 font-medium'>Additional Mobile No</label>
                <input
                  type='number'
                  name='phone'
                  value={formData.phone}
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
                  placeholder='Enter Mobile Number'
                  maxLength="10"
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
                <label className='text-black mb-1 font-medium'>
                  Gender<span className='text-red-400'>*</span>
                </label>
                <div className="flex flex-row gap-6 justify-start">
                  <button
                    name='gender'
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
                    className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${selectedGender === 2 ? 'text-white' : 'bg-white text-black'
                      }`}
                    style={selectedGender === 2 ? { backgroundColor: layout_color } : {}}
                  >
                    Female
                  </button>

                  <button
                    name='gender'
                    onClick={() => handleGenderSelect(3)}
                    className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${selectedGender === 3 ? 'text-white' : 'bg-white text-black'
                      }`}
                    style={selectedGender === 3 ? { backgroundColor: layout_color } : {}}
                  >
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
                    onChange={handleStateChange}
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
              {id_branch === "0" && (
                <div className='flex flex-col'>
                  <label className='text-black mb-1 font-normal'>Branch<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select name="id_branch" value={formData.id_branch} onChange={(e) => { handleInputChange(e); }} className='appearance-none border border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent' defaultValue=''>
                      <option value='' >--Select--</option>
                      {branchfilter.map((branch) => (
                        <option key={branch._id} value={branch._id}>{branch.branch_name}</option>
                      ))
                      }
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div className='flex flex-col'>
                <label className='text-black mb-1 font-medium'>Aadhar Card Number</label>
                <input
                  type='text'
                  name='aadharNumber'
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }

                  }}
                  className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Here'
                />
                {formErrors.aadharNumber && <span className="text-red-500 text-sm mt-1">{formErrors.aadharNumber}</span>}
              </div>
            </div>
            <h2 className='text-1xl font-semibold mb-4 mt-6'>Official Information</h2>
            <div className='grid grid-rows-2 md:grid-cols-2 gap-6 border-t-2 border-gray-300'>
              <div className='flex flex-col mt-2'>
                <label className='text-gray-700 mb-1 font-medium'>Date Of Joining<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <DatePicker
                    name='date_of_join'
                    selected={joiningDate}
                    onChange={(date) => setJoiningDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
                  />
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                    <CalendarDays size={20} />
                  </span>
                </div>
                {formErrors.joiningDate && <span className="text-red-500 text-sm mt-1">{formErrors.joiningDate}</span>}
              </div>
              <div className='flex flex-col mt-2'>
                <label className='text-gray-700 mb-1 font-medium'>Date Of Birth<span className='text-red-400'>*</span></label>
                <div className="relative">
                  <DatePicker
                    name='date_of_birth'
                    selected={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                    className="border-2 border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    wrapperClassName="w-full"
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
                        {profileImage ? profileImage.name : 'Browse'}
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
                <label className='text-black mb-1 font-medium'>Upload Resume</label>
                <label
                  htmlFor="resume"
                  className="flex flex-col justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer p-5 text-center hover:bg-gray-50 transition-colors"
                >
                  <p className='text-gray-900'>
                    {resume ? resume.name : 'Browse to upload resume (PDF, DOC, DOCX, XLS, TXT)'}
                  </p>
                </label>
                <input
                  className="hidden"
                  name="resume"
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.txt"
                  onChange={handleResumeUpload}
                />
                {resumeError && (
                  <p className="text-red-500 text-sm mt-1">{resumeError}</p>
                )}
                {resume && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      Selected file: {resume.name}
                    </span>
                    <button
                      onClick={() => {
                        setResume(null);
                        document.getElementById('resume').value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!id && (
            <div>
              <hr className='absolute border-gray-300 mt-3 mb-3 right-[0px] bottom-[71px] md:top-[93%] lg:right-[0px] lg:w-[77rem] lg:top-[93%] w-[100%]' />
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

export default AddEmployee;