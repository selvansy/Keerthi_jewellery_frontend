
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Camera, X, Send } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { updatecustomer, getcustomerById, getallbranch, allstate, addcustomer, allcountry, allcity, } from '../../../api/Endpoints';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { sendOtp, closeBill } from "../../../api/BackendUrl"
import { useMutation } from '@tanstack/react-query';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SpinLoading from '../../common/SpinLoading';
import Select from "react-select";

function AddCustomers() {

    const { id } = useParams();
    const navigate = useNavigate();
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const [showVerification, setShowVerification] = useState(false)
    const [isLoading, setisLoading] = useState()
    const [otpNumber, setOtpNumber] = useState("");
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const webcamRef = useRef(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);

    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [id_proof, setid_proof] = useState(null);
    const [cus_img, setcus_img] = useState(null);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        mobile: '',
        gender: '',
        address: '',
        id_branch:"",
        id_country: "",
        id_state: '',
        id_city: '',
        date_of_wed: "",
        pan: "",
        date_of_birth: "",
        pincode: '',
        authorno: "",
    })


    const validationSchema = Yup.object({
        firstname: Yup.string().required('First name is required'),
        lastname: Yup.string().required('Last name is required'),
        mobile: Yup.string().required('Mobile number is required').matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
        gender: Yup.number().required('Gender is required'),
        address: Yup.string().required('Address is required'),
        id_country: Yup.string().required('Country is required'),
        id_state: Yup.string().required('State is required'),
        id_city: Yup.string().required('City is required'),
        date_of_birth: Yup.date().typeError("Invalid date format").required("Birth Date is required"),
        pincode: Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be 6 digits'),
    });


    useEffect(() => {
        getAllCountryMutate();
        getallbranchMutate();
    }, []);

    useEffect(() => {
        if (id) {
            getCustomerData(id);
        }
    }, [id]);

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


    const { mutate: getCustomerData } = useMutation({
        mutationFn: (id) => getcustomerById(id),
        onSuccess: (response) => {
            if (response) {
                setFormData(response.data);
                setProfilePreview(response.data.image);
            }
        },
    });

    const { mutate: getAllCountryMutate } = useMutation({
        mutationFn: allcountry,
        onSuccess: (response) => {
            setCountryData(response.data)
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });


    const { mutate: getAllStateMutate } = useMutation({
        mutationFn: allstate,
        onSuccess: (response) => {
            if (response?.data) {
                setStateData(response.data);
            }
        },
    });

    const { mutate: getallbranchMutate } = useMutation({
        mutationFn: getallbranch,
        onSuccess: (response) => {
            if (response?.data) {
                const data = response?.data.map((country) => ({
                    value: country._id,
                    label: country.branch_name,
                  }));
                setBranchData(data);
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

    const handleSubmit = () => {
        setisLoading(true)
        const formPayload = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value) formPayload.append(key, value);
        });

        if (cus_img) formPayload.append('cus_img', cus_img);
        if (id_proof) formPayload.append('id_proof', id_proof);

        id ? updateCustomerData({ id, data: formPayload }) : addcustomerMutate(formPayload);
    };


    const { mutate: addcustomerMutate } = useMutation({
        mutationFn: (data) => addcustomer(data),
        onSuccess: (response) => {

            if (response) {
                toast.success(response.message);
                navigate('/manageaccount/customer');
                setFormData({})
            }
            setisLoading(false)
        },
        onError: (error) => {
            setisLoading(false)
            console.error('Error adding customer:', error);
        }
    });

    const { mutate: updateCustomerData } = useMutation({
        mutationFn: updatecustomer,
        onSuccess: (response) => {
            toast.success(response.message)
            navigate('/manageaccount/customer');
            setFormData({})
            setisLoading(false)
        },

        onError: (error) => {
            setisLoading(false)
            console.error("Error fetching scheme types:", error);
        },
    });

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

            } else {
                setid_proof(null);
                toast.error('Please upload a valid file format (PDF, DOC, DOCX, XLS, XLSX, or TXT)');
                e.target.value = '';
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.size <= (500 * 1024)) {
            setcus_img(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            }
            reader.readAsDataURL(file);
        } else {
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



    const SendOtpToMobile = () => {
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



    const handleVerifyOtp = (num) => {

        if (validateMobile(num)) {
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

    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formValues = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        mobile: formData.mobile,
        gender: formData.gender,
        address: formData.address,
        id_branch:formData.branchDetails?.branch_name,
        id_country: formData.countryDetails?.country_name,
        id_state: formData.stateDetails?.state_name,
        id_city: formData.cityDetails?.city_name,
        date_of_wed: formData.date_of_wed,
        pan: formData.pan,
        date_of_birth: formData.date_of_birth,
        pincode: formData.pincode,
        authorno: formData.authorno,
    }


    return (

        <div>
            <div className='flex flex-row justify-between'>
                <h2 className='text-2xl text-gray-900 font-bold justify-between'>{id ? "Edit Customer" : "Add Customer"}</h2>
            </div>

            <div className='w-full flex flex-col  bg-white border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)] '>
                <div className='flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2'>
                    <h2 className='text-1xl font-semibold mb-4 mt-4'>Basic Information</h2>
                    <Formik
                        initialValues={formValues || formData}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            setFormData(values)
                            handleSubmit()
                        }}
                    >
                        {({ values, errors, setFieldValue, touched, handleChange, handleSubmit }) => (
                            <>
                            
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}>
                                    <div className='grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300'>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>First Name<span className='text-red-400'>*</span></label>
                                            <Field
                                                type='text'
                                                name='firstname'
                                                onChange={handleChange}
                                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                                placeholder='Enter Here'
                                            />
                                            {errors.firstname && touched.firstname ? <div style={{ color: "red" }}>{errors.firstname}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Last Name<span className='text-red-400'>*</span></label>
                                            <Field
                                                type='text'
                                                name='lastname'
                                                onChange={handleChange}
                                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                                placeholder='Enter Here'
                                            />
                                            {errors.lastname && touched.lastname ? <div style={{ color: "red" }}>{errors.lastname}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                           
                                            <label className='text-black mb-1 font-medium'>Branch<span className='text-red-400'>*</span></label>
                                            <div>{console.log("valubranch",values.id_branch)}</div>
                                           <Select
                                                    options={branchData}
                                                    onChange={(selectedOption) => setFieldValue("id_branch", selectedOption)}
                                                    value={values.id_branch}
                                                    placeholder="Select Branch"
                                                    styles={customSelectStyles}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    
                                                />
                                            {errors.id_branch && touched.id_branch ? <div style={{ color: "red" }}>{errors.id_branch}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Mobile<span className='text-red-400'>*</span></label>
                                            <Field
                                                type='text'
                                                name='mobile'
                                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                                onChange={handleChange}
                                                pattern="\d{10}"
                                                maxLength={"10"}
                                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                                placeholder='Enter Mobile Number'
                                            />
                                            {errors.mobile && touched.mobile ? <div style={{ color: "red" }}>{errors.mobile}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Whatsapp Number</label>
                                            <Field
                                                type='text'
                                                name='whatsapp'
                                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                                onChange={handleChange}
                                                pattern="\d{10}"
                                                maxLength={"10"}
                                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                                placeholder='Enter Whatsapp Number'
                                            />
                                            {errors.whatsapp && touched.whatsapp ? <div style={{ color: "red" }}>{errors.whatsapp}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Address<span className='text-red-400'>*</span></label>
                                            <Field
                                                type='text'
                                                name='address'
                                                onChange={handleChange}
                                                className='border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                                placeholder='Enter Here'
                                            />
                                            {errors.address && touched.address ? <div style={{ color: "red" }}>{errors.address}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Pincode<span className='text-red-400'>*</span></label>
                                            <Field
                                                type='text'
                                                name='pincode'
                                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                                onChange={handleChange}
                                                pattern="\d{6}"
                                                maxLength={"6"}
                                                className='border-2 border-gray-300 rounded-md p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                placeholder='Enter Pincode'
                                            />
                                            {errors.pincode && touched.pincode ? <div style={{ color: "red" }}>{errors.pincode}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-black mb-1 font-medium'>Gender<span className='text-red-400'>*</span></label>
                                            <div className='flex flex-row gap-6 justify-start'>
                                                {[
                                                    { label: 'Male', value: 1 },
                                                    { label: 'Female', value: 2 },
                                                    { label: 'Other', value: 3 }
                                                ].map((gender) => (
                                                    <button
                                                        key={gender.value}
                                                        type='button'
                                                        className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${values.gender === gender.value ? 'text-white' : 'bg-white text-black'
                                                            }`}
                                                        style={values.gender === gender.value ? { backgroundColor: layout_color } : {}}
                                                        onClick={() => setFieldValue("gender", gender.value)}
                                                    >
                                                        {gender.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.gender && touched.gender ? <div style={{ color: "red" }}>{errors.gender}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-black mb-1 font-medium'>Country<span className='text-red-400'>*</span></label>
                                            <Field as='select'
                                                name='id_country'
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFieldValue("id_country", value)
                                                    getAllStateMutate(value);
                                                }}
                                                value={values.id_country}
                                                readOnly
                                                className='border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'>
                                                <option value=''>--Select--</option>
                                                {countryData.map((country) => (
                                                    <option key={country._id} value={country._id}>{country.country_name}</option>
                                                ))}
                                            </Field>
                                            {errors.id_country && touched.id_country ? <div style={{ color: "red" }}>{errors.id_country}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-black mb-1 font-medium'>State<span className='text-red-400'>*</span></label>
                                            <Field as='select'
                                                name='id_state'
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFieldValue("id_state", value)
                                                    getAllCityMutate(value)
                                                }}
                                                className='border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'>
                                                <option value=''>--Select--</option>
                                                {stateData.map((state) => (
                                                    <option key={state._id} value={state._id}>{state.state_name}</option>
                                                ))}
                                            </Field>
                                            {errors.id_state && touched.id_state ? <div style={{ color: "red" }}>{errors.id_state}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-black mb-1 font-medium'>City<span className='text-red-400'>*</span></label>
                                            <Field as='select'
                                                name='id_city'
                                                onChange={handleChange}
                                                className='border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700'>
                                                <option value=''>--Select--</option>
                                                {cityData.map((city) => (
                                                    <option key={city._id} value={city._id}>{city.city_name}</option>
                                                ))}
                                            </Field>
                                            {errors.id_city && touched.id_city ? <div style={{ color: "red" }}>{errors.id_city}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-black mb-1 font-medium'>Pan Number</label>
                                            <Field
                                                type='text'
                                                name='pan'
                                                onChange={handleChange}
                                                className='border-2 w-full border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                                                placeholder='Enter Here'
                                                maxLength='10'
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                            {errors.pan && touched.pan ? <div style={{ color: "red" }}>{errors.pan}</div> : null}
                                            <ErrorMessage name='pan' component='span' className='text-red-500 text-sm mt-1' />
                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Aadhar Card Number<span className='text-red-400'></span></label>
                                            <Field
                                                type="text"
                                                name="authorno"
                                                pattern="\d{12}"
                                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                                maxLength="12"
                                                inputMode="numeric"
                                                onChange={handleChange}
                                                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                                placeholder="Enter Here"
                                            />

                                            {errors.authorno ? <div style={{ color: "red" }}>{errors.authorno}</div> : null}

                                        </div>


                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Date Of Wedding</label>

                                            <div className="relative w-full">
                                                <DatePicker

                                                    selected={formData.date_of_wed}
                                                    onChange={(date) => {
                                                        const value = formatDate(date)
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            date_of_wed: value
                                                        }))
                                                        setFieldValue("date_of_wed", value)
                                                    }}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="w-full border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black h-[50px]"
                                                    placeholderText="Select Date"
                                                    wrapperClassName="w-full"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode='select'
                                                    title="Enter a date in YYYY-MM-DD format"

                                                />
                                                <CalendarDays
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                                                    size={20}
                                                />
                                            </div>
                                            {errors.date_of_wed && touched.date_of_wed ? <div style={{ color: "red" }}>{errors.date_of_wed}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-gray-700 mb-1 font-medium'>Date Of Birth<span className='text-red-400'>*</span></label>
                                            <div className="relative">
                                                <DatePicker

                                                    selected={formData.date_of_birth}
                                                    onChange={(date) => {
                                                        const value = formatDate(date)
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            date_of_birth: value
                                                        }))
                                                        setFieldValue("date_of_birth", value)
                                                    }}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="w-full border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black h-[50px]"
                                                    placeholderText="Select Date"
                                                    wrapperClassName="w-full"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode='select'
                                                />

                                                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                                                    <CalendarDays size={20} />
                                                </span>
                                            </div>
                                            {errors.date_of_birth && touched.date_of_birth ? <div style={{ color: "red" }}>{errors.date_of_birth}</div> : null}

                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-black mb-1 font-medium'>Upload Document</label>
                                            <label
                                                htmlFor="id_proof"
                                                className="flex flex-col justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer p-5 text-center hover:bg-gray-50 transition-colors"
                                            >
                                                <p className='text-gray-900'>
                                                    {id_proof ? id_proof.name : 'Browse to upload Document (.pdf,.doc,.docx,.xls,.xlsx,.txt)'}
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
                                            {errors.id_proof && touched.id_proof ? <div style={{ color: "red" }}>{errors.id_proof}</div> : null}

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

                                        <div className='flex flex-col'>
                                            <div className="flex flex-row " >
                                                <label className='text-black mb-1 font-medium'>Upload Profile Image</label>
                                                <p className='text-gray-900 text-[12px] truncate text-start mt-1 mx-2'>
                                                    (Maximum file size(500KB))
                                                </p>
                                            </div>
                                            <input
                                                type='file'
                                                name='profile_image'
                                                accept='image/*'
                                                className='hidden'
                                                id='profile-image'
                                                onChange={(event) => handleFileChange(event, setFieldValue)}
                                            />

                                            {
                                                !cus_img && (

                                                    <label htmlFor='profile-image' className='border-2 border-gray-300 rounded-md p-3 cursor-pointer'>
                                                        <p className='text-gray-900 truncate text-center'>
                                                            {cus_img ? cus_img.name : 'Browse'}
                                                        </p>
                                                    </label>
                                                )
                                            }

                                            <button
                                                type='button'
                                                onClick={() => setShowWebcam((prev) => !prev)}
                                                className='my-2 w-4/12 rounded-lg flex items-center gap-2 text-white px-3 py-1'
                                                style={{ backgroundColor: layout_color }}>
                                                <Camera size={28} />
                                                {showWebcam ? 'Close Camera' : 'Open Camera'}
                                            </button>

                                            {profilePreview && (
                                                <div className='relative w-24 h-24 my-3'>
                                                    <img src={profilePreview} alt='Profile Preview' className='w-full h-full object-cover rounded-md' />
                                                    <button
                                                        type='button'
                                                        onClick={() => handleClearImage(setFieldValue)}
                                                        className='absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100'>
                                                        <X size={14} />
                                                    </button>
                                                    <p className='text-gray-900 text-sm truncate text-center'>
                                                        {cus_img ? `${((cus_img.size / 1024).toFixed())}KB` : 'Browse'}
                                                    </p>
                                                </div>
                                            )}

                                            {errors.profile_image && touched.profile_image ? <div style={{ color: "red" }}>{errors.profile_image}</div> : null}
                                        </div>

                                        {showWebcam && (
                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                <div className="bg-white p-4 rounded-lg">
                                                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg" />
                                                    <div className="mt-4 flex justify-center gap-2">
                                                        <button type='button' onClick={() => handleCapture(setFieldValue)} className='text-white px-4 py-2 rounded-md' style={{ backgroundColor: layout_color }}>Capture</button>
                                                        <button type='button' onClick={() => setShowWebcam(false)} className='bg-gray-500 text-white px-4 py-2 rounded-md'>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col">
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
                                                            onChange={handleChange}
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
                                                            onClick={() => handleVerifyOtp(otpNumber)}
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
                                    <div>

                                        <div className='bg-white mt-6'>
                                            <div className='flex justify-end gap-2 mt-3'>
                                                <button
                                                    className='bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20'
                                                    type='button'
                                                    onClick={() => navigate('/customer')}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                                                    type="submit"

                                                >
                                                    {isLoading ? <SpinLoading /> : id ? 'Update' : 'Submit'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </Form>
                            </>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default AddCustomers