
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Camera, X, Send, Plus, Minus } from 'lucide-react'

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { updatecustomer, getcustomerById, getallbranch, allstate, addcustomer, allcountry, allcity, } from '../../../api/Endpoints';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { sendOtp, verifyOtp } from "../../../api/BackendUrl"
import { useMutation, useQuery } from '@tanstack/react-query';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SpinLoading from '../../common/spinLoading';
import Select from "react-select";
import profileplaceholder from '../../../../assets/profileplaceholder.png'
import { customSelectStyles } from "../../Setup/purity/index"
import { SetaccExp } from '../../../../redux/clientFormSlice';


const CustomerForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
    const roledata = useSelector((state) => state.clientForm.roledata);

    const acc = useSelector((state) => state.clientForm.accExp);

    const id_branch = roledata?.branch;


    const [showVerification, setShowVerification] = useState(false)
    const [isLoading, setisLoading] = useState()
    const [otpNumber, setOtpNumber] = useState("");
    const [mobile, setMobile] = useState("")
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const webcamRef = useRef(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [branchData, setBranchData] = useState([]);
    const [branch, setBranch] = useState("")
    const [id_proof, setid_proof] = useState(null);
    const [cus_img, setcus_img] = useState("");
    const [pathurl, setPathurl] = useState('');

   

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        mobile: '',
        gender: '',
        address: '',
        id_branch: branch,
        id_country: country,
        id_state: state,
        id_city: city,
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

        if (id_branch !== "0") {
            setFormData(prev => ({
                ...prev,
                id_branch: id_branch
            }))
            setBranch(id_branch)
        }

    }, [id_branch]);


    useEffect(() => {
        if (id) {
            getCustomerData(id);
        }
        // return () => {
        //     setcus_img("")
        //     setPathurl("")
        //     setFormData({})
        // }

    }, [id]);


    const { mutate: getCustomerData } = useMutation({
        mutationFn: (id) => getcustomerById(id),
        onSuccess: (response) => {
            if (response) {
                const res = response.data
                const formValues = {
                    firstname: res.firstname,
                    lastname: res.lastname,
                    mobile: res.mobile,
                    gender: res.gender,
                    address: res.address,
                    whatsapp:res.whatsapp,
                    id_branch: res.branchDetails?._id,
                    id_country: res.countryDetails?._id,
                    id_state: res.stateDetails?._id,
                    id_city: res.cityDetails?._id,
                    date_of_wed: res.date_of_wed,
                    pan: res.pan,
                    date_of_birth: res.date_of_birth,
                    pincode: res.pincode,
                    authorno: res.authorno,
                }
                setFormData(formValues)
                setcus_img(response.data.cus_img)
                const img = `${response.data.pathurl}${response.data.cus_img}`
                setPathurl(img);
                setid_proof(res.id_proof)

                setCountry(res.countryDetails?._id)
                setState(res.stateDetails?._id)
                setCity(res.cityDetails?._id)

            }
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


    const { data: branchresponse, isLoading: loadingbranch } = useQuery({
        queryKey: ["branch"],
        queryFn: getallbranch,
    });


    useEffect(() => {

        if (branchresponse) {
            const data = branchresponse.data
            const branch = data.map((branch) => ({
                value: branch._id,
                label: branch.branch_name,
            }));
            setBranchData(branch);
        }

    }, [branchresponse])


    useEffect(() => {

        if (countryresponse) {
            const data = countryresponse.data
            const country = data.map((country) => ({
                value: country._id,
                label: country.country_name,
            }));
            setCountryData(country)
        }

        if (stateresponse) {
            const data = stateresponse.data
            const state = data.map((state) => ({
                value: state._id,
                label: state.state_name,
            }));
            setStateData(state)
        }

        if (cityresponse) {
            const data = cityresponse.data
            const city = data.map((city) => ({
                value: city._id,
                label: city.city_name,
            }));
            setCityData(city)
        }

    }, [cityresponse, stateresponse, countryresponse])


    // const handleSubmitForm =  async() => {
    //     setisLoading(true)
    //     const formPayload = new FormData();

    //     Object.entries(formData).forEach(([key, value]) => {
    //         if (value) formPayload.append(key, value);
    //     });

    //     if (cus_img) formPayload.append('cus_img', cus_img);
    //     if (id_proof) formPayload.append('id_proof', id_proof);

    //     id ? updateCustomerData({ id, data: formPayload }) : addcustomerMutate(formPayload);
    // };


    const { mutate: addcustomerMutate } = useMutation({
        mutationFn: (data) => addcustomer(data),
        onSuccess: (response) => {
            if (response) {
                toast.success(response.message);
                console.log(formik.values)
                dispatch(SetaccExp((prev) => ({
                    ...prev, 
                    customerId: response.data
                })))  
            }
            setisLoading(false)
        },
        onError: (error) => {
            setisLoading(false)
            toast.error(error.response.data.message)
            console.error('Error:', error);
        }
    });

    const { mutate: updateCustomerData } = useMutation({
        mutationFn: updatecustomer,
        onSuccess: (response) => {

            toast.success(response.message)
            setFormData({})
            setisLoading(false)
            navigate("/managecustomers/customer/")
        },

        onError: (error) => {
            setisLoading(false)
            console.error("Erro:", error);
        },
    });

    const handleid_proofUpload = (e) => {
        e.preventDefault()
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
        e.preventDefault();
        const file = e.target.files[0];


        if (!file) {
            toast.error("No file selected");
            return;
        }

        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const maxSize = 500 * 1024;

        if (!validImageTypes.includes(file.type)) {
            toast.error("Invalid file type. Allowed: JPG, PNG, GIF, WEBP");
            return;
        }

        if (file.size > maxSize) {
            toast.error("File size exceeded (Max 500KB)");
            return;
        }

        setcus_img(file);


        const reader = new FileReader();
        reader.onloadend = () => {
            setPathurl(reader.result || "");
        };

        reader.readAsDataURL(file);
    };


    const handleCapture = (e) => {
        e.preventDefault()
        const imageSrc = webcamRef.current.getScreenshot();
        setPathurl(imageSrc);
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
        setPathurl(null);
    };


    const ResetTimer = () => {

        setCanResend(false);
        setIsTimerRunning(false);
        setTimer(60)
    }

    const { mutate: postSendOtpMobile } = useMutation({
        mutationFn: (data) => sendOtp(data),
        onSuccess: (response) => {
            if (response) {
                toast.success(response.message);
            }

            ResetTimer()
        },
        onError: (error) => {
            setCanResend(true);
            setIsTimerRunning(false);
            setTimer(60)
            toast.error("Invalid mobile number")
        }
    });

    const { mutate: VerifyOtpNumber } = useMutation({
        mutationFn: (data) => verifyOtp(data),
        onSuccess: (response) => {
            if (response) {
                toast.success(response.message);

            }
            ResetTimer()
            setMobile("")
            setOtpNumber("")
        },
        onError: (error) => {
            setCanResend(true);
            setIsTimerRunning(false);
            setTimer(60)
            toast.error(error.response?.data?.message)
        }
    });


    useEffect(() => {
        if (timer > 0 && isTimerRunning) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
            setIsTimerRunning(false);
        }
    }, [timer, isTimerRunning]);


    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

   const handleDispatch=(data)=>{
    dispatch(SetaccExp({
        customer_name: data.firstname + ' ' + data.lastname,
        address: data.address,
        id_branch: data.id_branch,
        mobile: data.mobile,

    }))
    }


    return <>
       <div className='w-full flex flex-col bg-white'>
    <div className='flex flex-col pl-8 pr-8 pb-4 pt-2 relative space-y-2'>
        {/* Replace Formik with useFormik implementation */}
        {(() => {
            const formik = useFormik({
                initialValues: formData,
                validationSchema: validationSchema,
                enableReinitialize: true,
                validateOnChange: false,
                validateOnBlur: false,
                onSubmit: (values) => {
                    handleDispatch(values)
                    setisLoading(true)
                    const formPayload = new FormData();
            
                    Object.entries(values).forEach(([key, value]) => {
                        if (value) formPayload.append(key, value);
                    });
            
                    if (cus_img) formPayload.append('cus_img', cus_img);
                    if (id_proof) formPayload.append('id_proof', id_proof);
            
                    id ? updateCustomerData({ id, data: formPayload }) : addcustomerMutate(formPayload);
                }
            });

            return (
                <>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit(e);
                    }}>
                        <div className='grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300'>
                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>First Name<span className='text-red-400'>*</span></label>
                                <input
                                    type='text'
                                    name='firstname'
                                    value={formik.values.firstname}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldTouched("firstname", false);
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent'
                                    placeholder='Enter Here'
                                />
                                {formik.errors.firstname ? <div style={{ color: "red" }}>{formik.errors.firstname}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Last Name<span className='text-red-400'>*</span></label>
                                <input
                                    type='text'
                                    name='lastname'
                                    value={formik.values.lastname}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldTouched("lastname", false);
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus-[#D1D5DB] focus:border-transparent'
                                    placeholder='Enter Here'
                                />
                                {formik.errors.lastname ? <div style={{ color: "red" }}>{formik.errors.lastname}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>
                                    Branch<span className='text-red-400'>*</span>
                                </label>

                                <Select
                                    options={branchData}
                                    value={branchData.find(branch => branch.value === (id_branch !== "0" ? formik.values.id_branch : formData.id_branch)) || ""}
                                    onChange={(e, branch) => {
                                        e.preventDefault();
                                        formik.setFieldValue("id_branch", branch.value);
                                        setBranch(branch.value);
                                        formik.setFieldTouched("id_branch", false);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingbranch}
                                    isDisabled={id_branch !== "0"}
                                    placeholder="Select Branch"
                                />

                                {formik.errors.id_branch && <div style={{ color: "red" }}>{formik.errors.id_branch}</div>}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Mobile<span className='text-red-400'>*</span></label>
                                <input
                                    type='text'
                                    name='mobile'
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                        formik.handleChange(e);
                                    }}
                                    value={formik.values.mobile}
                                    pattern="\d{10}"
                                    maxLength={"10"}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent'
                                    placeholder='Enter Mobile Number'
                                />

                                {formik.errors.mobile ? <div style={{ color: "red" }}>{formik.errors.mobile}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Whatsapp Number</label>
                                <input
                                    type='text'
                                    name='whatsapp'
                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    value={formik.values.whatsapp}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        formik.handleChange(e);
                                        formik.setFieldTouched("whatsapp", false);
                                    }}
                                    pattern="\d{10}"
                                    maxLength={"10"}
                                    className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent'
                                    placeholder='Enter Whatsapp Number'
                                />
                                {formik.errors.whatsapp ? <div style={{ color: "red" }}>{formik.errors.whatsapp}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Address<span className='text-red-400'>*</span></label>
                                <input
                                    type='text'
                                    name='address'
                                    value={formik.values.address}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        formik.handleChange(e);
                                        formik.setFieldTouched("address", false);
                                    }}
                                    className='border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent'
                                    placeholder='Enter Here'
                                />
                                {formik.errors.address ? <div style={{ color: "red" }}>{formik.errors.address}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Pincode<span className='text-red-400'>*</span></label>
                                <input
                                    type='text'
                                    name='pincode'
                                    value={formik.values.pincode}
                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        formik.handleChange(e);
                                        formik.setFieldTouched("pincode", false);
                                    }}
                                    pattern="\d{6}"
                                    maxLength={"6"}
                                    className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                    placeholder='Enter Pincode'
                                />
                                {formik.errors.pincode ? <div style={{ color: "red" }}>{formik.errors.pincode}</div> : null}
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
                                            className={`rounded-full w-20 h-10 flex items-center justify-center border-2 border-black transition-colors duration-200 ${formik.values.gender === gender.value ? 'text-white' : 'bg-white text-black'
                                                }`}
                                            style={formik.values.gender === gender.value ? { backgroundColor: layout_color } : {}}
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
                                {formik.errors.gender ? <div style={{ color: "red" }}>{formik.errors.gender}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>Country<span className='text-red-400'>*</span></label>

                                <Select
                                    options={countryData}
                                    value={countryData.find(ctry => ctry.value === formik.values.id_country) || country}
                                    onChange={(ctry) => {
                                        formik.setFieldValue("id_country", ctry.value);
                                        setCountry(ctry.value);
                                        formik.setFieldTouched("id_country", false);
                                    }}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingCountries}
                                    placeholder="Select Country"
                                />
                                {formik.errors.id_country ? <div style={{ color: "red" }}>{formik.errors.id_country}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>State<span className='text-red-400'>*</span></label>

                                <Select
                                    options={stateData}
                                    onChange={(e) => {
                                        formik.setFieldValue("id_state", e.value);
                                        setState(e.value);
                                        formik.setFieldTouched("id_state", false);
                                    }}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingStates}
                                    value={stateData.find(ctry => ctry.value === formik.values.id_state) || state}
                                    placeholder="Select state"
                                />

                                {formik.errors.id_state ? <div style={{ color: "red" }}>{formik.errors.id_state}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>City<span className='text-red-400'>*</span></label>

                                <Select
                                    options={cityData}
                                    onChange={(e) => {
                                        formik.setFieldValue("id_city", e.value);
                                        setCity(e.value);
                                        formik.setFieldTouched("id_city", false);
                                    }}
                                    customSelectStyles={customSelectStyles}
                                    isLoading={loadingCities}
                                    value={cityData.find(ctry => ctry.value === formik.values.id_city) || city}
                                    placeholder="Select city"
                                />

                                {formik.errors.id_city ? <div style={{ color: "red" }}>{formik.errors.id_city}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>Pan Number<span className='text-red-400'> *</span></label>
                                <input
                                    type='text'
                                    name='pan'
                                    value={formik.values.pan}
                                    onChange={formik.handleChange}
                                    className='border-2 w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent'
                                    placeholder='ABCDE1234F'
                                    maxLength='10'
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {formik.errors.pan ? <div style={{ color: "red" }}>{formik.errors.pan}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Aadhar Card Number<span className='text-red-400'> *</span></label>
                                <input
                                    type="text"
                                    name="authorno"
                                    value={formik.values.authorno}
                                    pattern="\d{12}"
                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    maxLength="12"
                                    inputMode="numeric"
                                    onChange={formik.handleChange}
                                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] focus:border-transparent"
                                    placeholder="Enter Aadhar Number"
                                />

                                {formik.errors.authorno ? <div style={{ color: "red" }}>{formik.errors.authorno}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Date Of Wedding</label>

                                <div className="relative w-full">
                                    <DatePicker
                                        selected={formik.values.date_of_wed}
                                        onChange={(date) => {
                                            const value = formatDate(date);
                                            formik.setFieldValue("date_of_wed", value);
                                            formik.setFieldTouched("date_of_wed", false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] h-[50px]"
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
                                {formik.errors.date_of_wed ? <div style={{ color: "red" }}>{formik.errors.date_of_wed}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-gray-700 mb-1 font-medium'>Date Of Birth<span className='text-red-400'>*</span></label>
                                <div className="relative">
                                    <DatePicker
                                        selected={formik.values.date_of_birth}
                                        onChange={(date) => {
                                            const value = formatDate(date);
                                            formik.setFieldValue("date_of_birth", value);
                                            formik.setFieldTouched("date_of_birth", false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB] h-[50px]"
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
                                {formik.errors.date_of_birth ? <div style={{ color: "red" }}>{formik.errors.date_of_birth}</div> : null}
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-black mb-1 font-medium'>Upload Document</label>
                                <label
                                    htmlFor="id_proof"
                                    className="flex flex-col justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer p-5 text-center hover:bg-gray-50 transition-colors"
                                >
                                    <p className='text-gray-900'>
                                        {id_proof ? (id_proof.name || id_proof) : 'Browse to upload Document (.pdf,.doc,.docx,.xls,.xlsx,.txt)'}
                                    </p>
                                </label>
                                <input
                                    className="hidden"
                                    name="id_proof"
                                    id="id_proof"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                                    onChange={(e) => handleid_proofUpload(e)}
                                />
                                {formik.errors.id_proof ? <div style={{ color: "red" }}>{formik.errors.id_proof}</div> : null}

                                {id_proof && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-gray-600">
                                            Selected file: {id_proof.name || id_proof}
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
                                    <p className='text-gray-900 text-[12px] truncate text-start mx-2'>
                                        (Maximum file size(500KB))
                                    </p>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-4'>
                                    <div className='flex-1'>
                                        <label
                                            htmlFor="profile-image"
                                            className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4"
                                        >
                                            <div className="text-gray-900 text-center text-[12px]">
                                                {cus_img ? cus_img.name : "Browse"}
                                                <span>
                                                    {cus_img?.size ? ` (${(cus_img.size / 1024).toFixed()} KB)` : profileplaceholder}
                                                </span>
                                            </div>
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
                                                type='button'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setShowWebcam(prev => !prev);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className="mt-2 rounded-lg flex items-center gap-2 text-white px-3 py-1"
                                                style={{ backgroundColor: layout_color }}
                                            >
                                                <Camera size={16} />
                                                <span className='text-sm'>{showWebcam ? 'Close Camera' : 'Open Camera'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className='flex items-start justify-center'>
                                        <div className='relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden'>
                                            <img
                                                src={
                                                    pathurl
                                                        ? pathurl
                                                        : profileplaceholder
                                                }
                                                alt="Profile Preview"
                                                className={`w-full h-full ${cus_img ? "object-cover" : "object-contain"}`}
                                            />

                                            {pathurl && (
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
                                                    onClick={(e) => handleCapture(e)}
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
                        </div>
                        <div className="flex flex-col mt-3">
                            <div className="flex flex-row items-center">
                                <input
                                    type="checkbox"
                                    className="w-8 h-5 accent-blue-600"
                                    name="showVerification"
                                    checked={showVerification}
                                    onChange={() => {
                                        setShowVerification(!showVerification);
                                        setMobile("");
                                        setOtpNumber("");
                                        ResetTimer();
                                    }}
                                />
                                <h2 className="text-lg text-[#023453] font-bold whitespace-nowrap px-2 my-3">
                                    To verify account with OTP verification, kindly check the checkbox.
                                </h2>
                            </div>

                            {showVerification && (
                                <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
                                    {/* Mobile Number Input */}
                                    <div className="flex flex-col relative">
                                        <label className="text-black mb-1 font-normal">
                                            Mobile Number <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formik.values.mobile || mobile}
                                            className="border-2 w-full border-gray-300  bg-[#f2f2f2] rounded-md p-2 focus:outline-none"
                                            placeholder="Enter Here"
                                            readOnly
                                            maxLength={10}
                                        />

                                        <div
                                            onClick={() => {
                                                const payload = {
                                                    mobile: formik.values.mobile,
                                                    branchId: branch
                                                };
                                                setCanResend(false);
                                                setIsTimerRunning(true);
                                                postSendOtpMobile(payload);
                                            }}
                                            className="absolute flex items-center justify-center cursor-pointer right-0 top-[29px] w-10 h-10 bg-[#023453] rounded-r-md transition"
                                        >
                                            <Send size={22} className="text-white" />
                                        </div>
                                    </div>

                                    {/* OTP Input */}
                                    <div className="flex flex-col relative">
                                        <label className="text-black mb-1 font-normal">
                                            OTP Number <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="otp"
                                            className="border-2 w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:[#D1D5DB]"
                                            placeholder="Enter OTP"
                                            value={otpNumber || ""}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setOtpNumber(value);
                                            }}
                                        />
                                        <div
                                            onClick={() => {
                                                const payload = {
                                                    mobile: formik.values.mobile,
                                                    otp: otpNumber,
                                                };
                                                VerifyOtpNumber(payload);
                                            }}
                                            disabled={!otpNumber}
                                            className="absolute flex items-center justify-center cursor-pointer right-0 top-[29px] w-10 h-10 bg-[#023453] rounded-r-md transition"
                                        >
                                            <Send size={22} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Countdown Timer */}
                                    <div className="flex flex-col text-sm text-gray-600 mt-1">
                                        {(timer > 0 && isTimerRunning) ? (
                                            <span>Resend OTP in {timer} seconds</span>
                                        ) : (
                                            (canResend) && (
                                                <span
                                                    className="text-blue-600 cursor-pointer hover:underline"
                                                    onClick={() => {
                                                        const payload = {
                                                            mobile: formik.values.mobile,
                                                            branchId: branch
                                                        };
                                                        setCanResend(false);
                                                        setIsTimerRunning(true);
                                                        postSendOtpMobile(payload);
                                                    }}
                                                    disabled={isTimerRunning}
                                                >
                                                    Resend OTP
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className='bg-white mt-6'>
                                <div className='flex justify-end gap-2 mt-3'>
                                    <button
                                        className='bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20'
                                        type='button'
                                        onClick={() => navigate('/manageaccount/customer/')}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-white rounded-md p-2 w-full lg:w-20"
                                        type='submit'
                                        style={{ backgroundColor: layout_color }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <SpinLoading /> : id ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
            );
        })()}
    </div>
</div>
    </>
}

export default CustomerForm