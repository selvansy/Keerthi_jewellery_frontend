import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query'
import { searchmobileschemeaccount, allschemestatus, getallbranch, getallpaymentmodes } from "../../../api/Endpoints"
const AddRvertAccount = () => {
  const navigate = useNavigate()

  const handleCancle = () => {
    navigate('/manageaccount/closedaccount')
  }


  let dispatch = useDispatch();

  const roledata = localStorage.getItem('decoded');
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;



  const [searchmobile, setSearchMobile] = useState('');
  const [mobile, setMobile] = useState(null);

  const [schemedata, setSchemeData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [statusId, setStatusId] = useState("")
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemestatus, setSchemeStatus] = useState([]);
  const [branchfilter, setBranch] = useState([]);
  const [branchId, setbranchId] = useState([]);
  const [errors, setErrors] = useState(null);
  const [showVerification, setshowVerification] = useState(false)
  const [mobileOtp, setMobileOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);


  const [formData, setFormData] = useState({});


  useEffect(() => {

    if (branchId) {
      setFormData({ ...formData, id_branch: branchId })
    }

    if (searchmobile && branchId) {
      handlesearchschemeaccount({ search_mobile: searchmobile, id_branch: branchId });
    }
  }, [searchmobile, branchId]);


  useEffect(() => {
    getallbranchMutate();
    handleallschemestatus();
    return () => {
      dispatch(setbranchId(null))
    }
  }, []);


  const handleSearchmobile = () => {
    console.log("Mobile", mobile)
    if (mobile === "") { toast.error('Mobile Number is required!'); }
    setSearchMobile(mobile);
  };


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

        setSelectedScheme(null);
        setSchemeData(response.data);
        toast.success(response.message)
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


  const handleChange = (e) => {

    console.log("Remarks", e.target.value)

    const { name, value } = e.target;

    if (name === "mobile") {
      setMobile(value);
    }
    else if (name === "id_closeType") {

      console.log("Clsee")
      setStatusId(value);
      if (!value) toast.error("Status Id is required!");
    }
    else if (name === "id_scheme_account") {
      setSelectedId(value);

      const scheme = schemedata.find((scheme) => scheme._id === value);
      if (scheme) {
        setSelectedScheme(scheme);
        setFormData((prev) => ({
          ...prev,
          scheme_acc_number: scheme.scheme_acc_number,
          accountschemeid: scheme.accountschemeid,
          id_scheme: scheme.id_scheme,
          id_classification: scheme.id_classification,
          id_scheme_account: scheme._id,
          code: scheme.code,
        }));
      } else {
        setFormData({});
      }

      isValidForm();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };



  const isValidForm = () => {
    const err = {};

    if (formData.total_amt === '') {
      err['total_amt'] = 'Total Amount is required';
    } else {
      err['total_amt'] = '';
    }

    if (formData.payment_mode === '') {
      err['payment_mode'] = 'Payment Mode is required';
    } else {
      err['payment_mode'] = '';
    }

    if (formData.accountschemeid === '') {
      err['scheme_acc_number'] = 'Scheme Account Number is required';
    } else {
      err['scheme_acc_number'] = '';
    }


    if (formData.id_scheme_account === '') {
      err['id_scheme_account'] = 'Scheme Account is required';
    } else {
      err['id_scheme_account'] = '';
    }

    console.log(err);
    setErrors((prevState) => ({
      ...prevState,
      ...err,
    }));

    const hasErrors = Object.values(err).some((error) => error.length > 0);

    return !hasErrors;
  };


  const handleSubmit = () => {
    console.log("submittedData", formData)
  }

  const handleSendOtp = () => {
    console.log("MobileNum", mobileOtp)
  }

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
                value={branchId || ""}
                onChange={handleBranch}
                className='appearance-none border-2 border-gray-300 rounded-md p-2 w-1/2 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'

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
              className='border-2 w-1/2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              placeholder='Enter Here'
              onChange={handleChange}
            />
            <div onClick={handleSearchmobile} className="absolute flex items-center justify-center cursor-pointer right-[0%] rounded-r-lg top-[70%] -translate-y-1/2 w-10 h-[65%] sm:right-0 sm:top-[68%] sm:rounded-r-lg md:right-[20%] md:rounded-lg lg:rounded-r-lg lg:left-[47%]"
              style={{ backgroundColor: layout_color }}>
              <Search size={22} className="text-white" />
            </div>
          </div>
          <div className='lg:flex lg:flex-col lg:mt-2 md:flex md:flex-col md:mt-2 hidden'></div>



          <h2 className='text-1xl font-bold mb-4 mt-4'>Scheme Account Details</h2>
          <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Scheme Account</label>
              <select
                name='id_scheme_account'
                value={selectedId}
                onChange={handleChange}
                className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
              >
                <option value=''>--Select--</option>
                {schemedata.map((account) => (

                  <option key={account._id} value={account._id}>
                    {account.id_scheme.scheme_name}
                    {account.id_scheme.scheme_type === 4 || account.id_scheme.scheme_type === 5 || account.id_scheme.scheme_type === 6 || account.id_scheme.scheme_type === 7 || account.id_scheme.scheme_type === 8 || account.id_scheme.scheme_type === 9 || account.id_scheme.scheme_type === 10 ? ` (Rs. ${account.id_scheme.min_amount} - Rs. ${account.id_scheme.max_amount}) -  (${account.scheme_acc_number !== "" ? account.scheme_acc_number : "Not Allocated"})` : ''}
                    {account.id_scheme.scheme_type === 3 ? ` (${account.id_scheme.min_weight} - ${account.id_scheme.max_weight}) -  (${account.scheme_acc_number !== "" ? account.scheme_acc_number : "Not Allocated"})` : ''}
                    {account.id_scheme.scheme_type === 0 || account.id_scheme.scheme_type === 1 || account.id_scheme.scheme_type === 2 ? ` (Rs. ${account.id_scheme.amount}) -  (${account.scheme_acc_number !== "" ? account.scheme_acc_number : "Not Allocated"})` : ''}

                  </option>
                ))}
              </select>
            </div>
         
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Scheme</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Scheme'
                value={formData?.id_scheme?.scheme_name}
                disabled />
            </div>
          </div>

          <div className="flex flex-col-2">
            <h2 className='text-1xl font-bold mb-4 mt-4'>Customer Details</h2>
          </div>
          <div className='grid grid-rows-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Customer Name</label>
              <input
                disabled
                type='text'
                value={selectedScheme?.account_name}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Customer Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Address</label>
              <input
                disabled
                type='text'
                value={selectedScheme?.id_customer?.address}
                className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Customer Address'
              />
            </div>

          </div>

          <h2 className='text-1xl font-bold mb-4 mt-4'>Close Form Details</h2>
          <div className='grid grid-rows-2 md:grid-cols-2 gap-5'>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Bill No</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Bill No'
                defaultValue={""}
                onChange={handleChange} />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Paid Installment</label>
              <input type='text' className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                placeholder='Paid Installment'

                value={selectedScheme?.total_installments}
                disabled />
            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Paid Amount</label>
              <div className="relative">
                <input type='number'
                  value={selectedScheme?.amount}
                  min='0'
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Product Price'
                  disabled
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>

            </div>
            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Gift Amount<span className='text-red-400'>*</span></label>
              <div className="relative">
                <input type='number'

                  value={selectedScheme?.gift_issues}
                  min='0'
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Product Price'
                  disabled
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
                }} className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Enter Product Price'
                  disabled
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-[#023453] w-14 h-[43px] justify-center items-center flex rounded-r-md">INR</span>
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='text-black mb-1 font-normal'>Remarks</label>
              <div className="relative">
                <input type='text'
                  className='border-2 border-gray-300 rounded-md p-2 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                  placeholder='Remarks'
                  name='comments'
                  defaultValue=""
                  onChange={handleChange} />
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
            // disabled={!isOtpVerified}
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