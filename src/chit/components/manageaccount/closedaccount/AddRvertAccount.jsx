import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Search, Send } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { useMutation } from "@tanstack/react-query";
import {sendOtp , revertBill} from "../../../api/Endpoints"
import { searchmobileschemeaccount, allschemestatus, getallbranch, getallpaymentmodes } from "../../../api/Endpoints"
import { useDebounce } from '../../../hooks/useDebounce';


const AddRvertAccount = () => {

  let dispatch = useDispatch();

  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [searchmobile, setSearchMobile] = useState('');
  const [mobile, setMobile] = useState("");

  const [schemedata, setSchemeData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [statusId, setStatusId] = useState("")
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemestatus, setSchemeStatus] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [branchId, setbranchId] = useState("");
  const [paymentMode, setPaymentMode] = useState([]);
  const [errors, setErrors] = useState({});

  const today = new Date();
  const formattedDate = today.getFullYear() +
    "-" + String(today.getMonth() + 1).padStart(2, "0") +
    "-" + String(today.getDate()).padStart(2, "0");

  const [date_payment, setStartDate] = useState(formattedDate);

  const [showVerification, setShowVerification] = useState(false)
  const [refundtype, setRefundType] = useState(false)
  const [mobileNum, setMobileNum] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const debouncedOtpNumber = useDebounce(otpNumber);
  const debouncedMobileNumber = useDebounce(mobileNum);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    status: statusId,
    id_scheme_account: "",
    comments: "",
    bill_no: "",
    id_branch: branchId,
    bill_date: date_payment || new Date().toISOString(),
    return_amount: 0,
    refund_paymenttype: 0
  });


  const handleCheckboxChange = (e) => {
    setOtp(e.target.checked);
    if (e.target.checked) {
      setTimer(60);
      setCanResend(false);
    }
  };


  const isValidForm = () => {
    const errors = {};

    if (!formData.status) errors.status = 'Status is required';
    if (!formData.id_scheme_account) errors.id_scheme_account = 'Id_scheme_account is required';
    if (!formData.id_branch) errors.id_branch = 'Id_branch is required';
    if (!formData.comments) errors.comments = 'Comments is required';
    if (!formData.bill_no) errors.bill_no = 'Bill_no is required';
    if (!formData.bill_date) errors.bill_date = 'bill_dateis required';
    if (!mobile) errors.mobile = 'Mobile is required'
    


    setErrors(errors);
    return Object.keys(errors).length === 0;
  };


  
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


  const handleCancle = () => {
    navigate('/manageaccount/closedaccount')
  }

  useEffect(() => {
    
     getallbranchMutate();
   
  }, [])


  useEffect(() => {

    handleallschemestatus();
    handlePaymentmodes({
      page: 1,
      limit: 10,
      added_by: "",
      from_date: "",
      to_date: ""
    });

    if (branchId) {
      setFormData({ ...formData, id_branch: branchId })
    }

    if (searchmobile && branchId) {
      handlesearchschemeaccount({ search_mobile: searchmobile, id_branch: branchId});
    }

  }, [searchmobile, branchId]);


  const handleSearchmobile = () => {

    if (mobile === "") { toast.error('Mobile Number is required!'); }
    setSearchMobile(mobile);
  };

  
  const scheData = schemestatus.filter((account) => account.id_status !== 2 && account.id_status !== 0)





  const { mutate: getallbranchMutate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      if (response) {
        setBranch(response.data);
      }
    },
  });


  const { mutate: handlesearchschemeaccount } = useMutation({
    mutationFn: searchmobileschemeaccount,
    onSuccess: (response) => {
      if (response) {
        setSchemeData(response.data);
        toast.success(response.message)
      }

    },
  });

  // getallpaymentmodes 

  const { mutate: handlePaymentmodes } = useMutation({
    mutationFn: getallpaymentmodes,
    onSuccess: (response) => {
      if (response) {

        setPaymentMode(response.data);

      }

    },
  });

  const { mutate: handleallschemestatus } = useMutation({
    mutationFn: allschemestatus,
    onSuccess: (response) => {
      if (response) {
        setSchemeStatus(response.data);
      }

    },
  });

  const handleBranch = (e) => {

    const value = e.target.value;
    setbranchId(value)
    if (id_branch === "") {
      toast.error("Branch Id is required!")
    }
  };


  const handleDatePaymentChange = (date) => {
    ;
    if (!date) { return }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');


    const formattedDate = `${year}-${month}-${day}`;

    setStartDate(formattedDate)
    // setFormData(prev => ({ ...prev, bill_date: formattedDate }));
  };


  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "mobile") {
      setMobile(value);
    }
    else if (name === "status") {
      setStatusId(value);
      if (value === "4") {
        setRefundType(true);
      } else {
        setRefundType(false);
      }

      if (!value) toast.error("Status Id is required!");
    }
    else if (name === "id_scheme_account") {
      setSelectedId(value);

      const scheme = schemedata.find((scheme) => scheme._id === value);

      if (scheme) {
        setSelectedScheme(scheme);
        setFormData((prev) => ({
          ...prev,
          id_scheme_account: scheme._id
        }));

      } else {
        setFormData({});

      }


    } else if (name === "refundPayment") {
      setFormData((prev) => ({
        ...prev,
        refund_paymenttype: value
      }));
      if (!value) toast.error("PaymentType is required!");

    } else if (name === "bill_no") {
      setFormData((prev) => ({
        ...prev,
        bill_no: value
      }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

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
      mobile: mobileNum || mobile,
      otp: otpNumber,
      branchId: branchId
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


  // const handleVerifyOtp = (num)=>{

  //   if(validateMobile(num)){
  //     toast.error("Mobile must be 10 digits");
  //     return;
  //   }

  //   const payload = {
  //     mobile: mobileNum || mobile,
  //     otp: otpNumber,
  //     branchId: branchId
  //    }
  //    postVerifyOtp(payload)
  //    setTimer(60);
  //    setCanResend(false);
  // }

  
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

  const handleSubmit = () => {

    if (!isValidForm(formData)) {
      toast.error('Please fill in all required fields');
      return;
    }
    revertClose(formData);
  }

  const { mutate: revertClose } = useMutation({
    mutationFn: revertBill,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        setTimer(60);
        setCanResend(false);
      }
    },
  });


  
  return (
    <>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl text-[#023453] font-bold justify-between'>Revert Account</h2>
      </div>

      <div className='w-full flex flex-col bg-white pl-8 pr-8 pb-4 border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]'>

        <div className='mb-8'>

          <div className='flex flex-col my-3'>
            <label className='text-black mt-3 font-normal'>Branch<span className='text-red-400'> *</span></label>
            <div className="relative my-3">
              <select
                name='id_branch'
                value={branchId}
                onChange={handleBranch}
                className='appearance-none border-2 border-gray-300 rounded-md p-2 w-1/2 bg-white'

              >
                <option value=''>--Select--</option>
                {branchfilter.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-[48%] flex items-center">
                <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>


          </div>

          <div className='flex flex-col mt-2 relative'>
            <label className='text-black mb-1 font-normal'>Search Mobile Number<span className='text-red-400'>*</span></label>
            <input
              type='text'
              name='mobile'
              className='border-2 w-1/2 border-gray-300 rounded-md p-2 '
              placeholder='Enter Here'
              value={mobile || ""}
              onChange={handleChange}
            />
            <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] top-[70%] -translate-y-1/2 w-10 h-[56%]  sm:right-0 sm:top-[70%] sm:rounded-r-lg  md:right-[20%] md:rounded-r-lg lg:rounded-r-lg  lg:left-[47%]"
                         style={{ backgroundColor: layout_color }}>
                         <Search size={22} className="text-white" />
                       </div>
          
          </div>
          {errors.mobile && <div className="text-red-500 text-sm">{errors.mobile}</div>}
          <div className='lg:flex lg:flex-col lg:mt-2 md:flex md:flex-col md:mt-2 hidden'></div>



          <h2 className='text-1xl font-bold mb-4 mt-4'>Scheme Account Details</h2>
          <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
            <div className="flex flex-col">
              <label className="text-black mb-1 font-normal">Scheme Account</label>
              <select
                name="id_scheme_account"
                value={selectedId || ""}
                onChange={handleChange}
                className="appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white"
              >
                <option value="">--Select--</option>
                {schemedata.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.id_scheme.scheme_name}
                    {account.id_scheme.scheme_type === 4 || account.id_scheme.scheme_type === 5 || account.id_scheme.scheme_type === 6 || account.id_scheme.scheme_type === 7 || account.id_scheme.scheme_type === 8 || account.id_scheme.scheme_type === 9 || account.id_scheme.scheme_type === 10 ? ` (Rs. ${account.id_scheme.min_amount} - Rs. ${account.id_scheme.max_amount}) -  (${account.scheme_acc_number !== "" ? account.scheme_acc_number : "Not Allocated"})` : ''}
                    {account.id_scheme.scheme_type === 3 ? ` (${account.id_scheme.min_weight} - ${account.id_scheme.max_weight}) -  (${account.scheme_acc_number !== "" ? account.scheme_acc_number : "Not Allocated"})` : ''}
                    {account.id_scheme.scheme_type === 0 || account.id_scheme.scheme_type === 1 || account.id_scheme.scheme_type === 2 ? ` (Rs. ${account.id_scheme.amount}) -  (${account.scheme_acc_number !== "" ? account.scheme_acc_number : "Not Allocated"})` : ''}

                  </option>
                ))}
              </select>
              {errors.id_scheme_account && <div className="text-red-500 text-sm">{errors.id_scheme_account}</div>}

            </div>

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'> Close Type</label>
              <select
                name='status'
                value={formData.status}
                onChange={handleChange}
                className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white '
              >
                <option value=''>--Select--</option>
                {scheData.map((account) => (
                  <option key={account._id} value={account.id_status}>
                    {account.status_name}
                  </option>
                ))}
              </select>
              {errors.status && <div className="text-red-500 text-sm">{errors.status}</div>}

            </div>


            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Scheme Account Number</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                placeholder='Scheme'
                name='scheme'
                value={selectedScheme?.scheme_acc_number || ""}
                readOnly />

            </div>
            {
              refundtype && (
                <>
                  <div className='flex flex-col'>
                    <label className='text-black mb-1 font-normal'>Refund Type</label>
                    <select
                      name='refund_paymenttype'
                      value={formData?.refund_paymenttype}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white '
                    >
                      <option value=''>--Select--</option>
                      {paymentMode.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.mode_name}
                        </option>
                      ))}
                    </select>
                    {errors.refund_paymenttype && <div className="text-red-500 text-sm">{errors.refund_paymenttype}</div>}

                  </div>
                </>
              )
            }
          </div>

          <div className="flex flex-col-2">
            <h2 className='text-1xl font-bold mb-4 mt-4'>Customer Details</h2>
          </div>
          <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Customer Name</label>
              <input
                readOnly
                type='text'
                value={selectedScheme?.account_name || ""}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                placeholder='Customer Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Address</label>
              <input
                readOnly
                type='text'
                value={selectedScheme?.id_customer?.address}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                placeholder='Customer Address'
              />
            </div>

          </div>

          <h2 className='text-1xl font-bold mb-4 mt-4'>Close Form Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Bill No</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                placeholder='Bill No'
                defaultValue={""}
                name='bill_no'
                onChange={handleChange} />
              {errors.bill_no && <div className="text-red-500 text-sm">{errors.bill_no}</div>}
            </div>

            <div className='flex flex-col w-full'>
              <label className='text-black mb-2 font-normal'>Bill Date<span className='text-red-400'>*</span></label>
              <div className="relative">
                <DatePicker
                  name='date_payment'
                  selected={date_payment}
                  onChange={handleDatePaymentChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  className="border-2 border-gray-300 rounded-md p-2 w-full "
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                />
                <span className="absolute right-0 top-0 h-full w-14 flex items-center justify-center pointer-events-none">
                  <CalendarDays size={20} />
                </span>
                {errors.date_payment && <div className="text-red-500 text-sm">{errors.date_payment}</div>}
              </div>

            </div>

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Paid Installment</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                placeholder='Paid Installment'

                value={selectedScheme?.total_paidinstallments}
                readOnly />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Paid Amount</label>
              <div className="relative">
                <input type='number'
                  value={selectedScheme?.last_paid_amount}
                  min='0'
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                  placeholder='Enter Product Price'
                  readOnly
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>

            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Gift Amount<span className='text-red-400'>*</span></label>
              <div className="relative">
                <input type='number'

                  value={selectedScheme?.general?.gift_issues}
                  min='0'
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                  placeholder='Enter Product Price'
                  readOnly
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Total Close Amount<span className='text-red-400'>*</span></label>
              <div className="relative">
                <input type='number' min='0' onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                  placeholder='Enter Product Price'
                  value={selectedScheme?.total_paidamount}
                  readOnly
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Remarks</label>
              <div className="relative">
                <input type='text'
                  className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 '
                  placeholder='Remarks'
                  name='comments'
                  value={selectedScheme?.comments}
                  defaultValue=""
                  onChange={handleChange} />
                {errors.comments && <div className="text-red-500 text-sm">{errors.comments}</div>}
              </div>

            </div>
          </div>

       

        </div>
        <div className='bg-white p-2 border-t-2 border-gray-300 mt-4'>
          <div className='flex justify-end gap-2 mt-3'>
            <button
              className='bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20'
              type='button'
              onClick={handleCancle}
            >
              Cancel
            </button>
            <button
              className='bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20'
              type='button'
              onClick={handleSubmit}
            // readOnly={!isOtpVerified}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddRvertAccount;