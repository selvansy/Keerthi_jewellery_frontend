import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { smsaccesstype, addsmssetting, smssettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query'


const SmsDetails = ({setIsAddClient,onPageChange, isLoading = false }) => {
  const navigate = useNavigate();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const currentStep = useSelector((state) => state.clientForm.currentStep);
  const totalPages = useSelector((state) => state.clientForm.totalSteps);
  const id_client = useSelector((state) => state.clientForm.id_client);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const id_project = useSelector((state) => state.clientForm.id_project);
  const id = useSelector((state) => state.clientForm.id_client);
  const aupay_url = useSelector((state) => state.clientForm.aupay_url);

  const [branchData, setBranchData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [smsaccessData, setSmsAccessData] = useState([]);
  const [selectedSmsAccess, setSelectedSmsAccess] = useState('');
  let dispatch = useDispatch()

  const [formData, setFormData] = useState({
    id_branch:id_branch,
    id_client:id_client,
    id_project:id_project,
    otp_content: "",
    otp_url: "",
    customer_content: "",
    customer_url: "",
    schemeaccount_content: "",
    schemeaccount_url: "",
    payment_content: "",
    payment_url: "",
    sms_access: "",
    customer_sent: 1,
    otp_sent: 1,
    schemeaccount_sent: 1,
    payment_sent: 1
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    getsmsprojectbranch();
  }, []);

  const getsmsprojectbranch = async () => {

      const response = await smssettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          otp_content: response.data.otp_content,
          otp_url: response.data.otp_url,
          customer_content: response.data.customer_content,
          customer_url: response.data.customer_url,
          schemeaccount_content: response.data.schemeaccount_content,
          schemeaccount_url: response.data.schemeaccount_url,
          payment_content: response.data.payment_content,
          payment_url: response.data.payment_url,
          sms_access: response.data.sms_access,
          customer_sent: response.data.customer_sent,
          otp_sent: response.data.otp_sent,
          schemeaccount_sent: response.data.schemeaccount_sent,
          payment_sent: response.data.payment_sent
        }));

        
      }

    
  }

 const handleCancel = (type) => {
  
     if(type === "back"){
       dispatch(pagehandler(currentStep - 1))    
       setIsAddClient(false);
     } else {
       dispatch(pagehandler(1))    
      setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
     }  
 };
 

  const validate = (data) => {

    const errors = {};

    if (!data.id_branch) errors.id_branch = 'Invalid id_branch';
    if (!data.sms_access) errors.sms_access = 'Invalid SMS access';
    // if (!data.otp_sent) errors.otp_sent = 'Invalid otp_sent';
    if (!data.otp_content) errors.otp_content = 'Invalid otp_content';
    if (!data.customer_sent) errors.customer_sent = 'Invalid customer_sent';
    if (!data.customer_content) errors.customer_content = 'Invalid customer_content';
    // if (!data.schemeaccount_sent) errors.schemeaccount_sent= 'Invalid schemeaccount_sent';
    if (!data.schemeaccount_content) errors.schemeaccount_content = 'Invalid schemeaccount_content';
    if (!data.payment_sent) errors.payment_sent = 'Invalid payment_sent';
    if (!data.payment_content) errors.payment_content = 'Invalid payment_content';
    if (!data.otp_url) errors.otp_url = 'Invalid otp_url';
    if (!data.customer_url) errors.customer_url = 'Invalid customer_url';
    if (!data.schemeaccount_url) errors.schemeaccount_url = 'Invalid schemeaccount_url';
    if (!data.payment_url) errors.payment_url = 'Invalid payment_url';


;
    // if (!/^\d{10}$/.test(data.otp_content)) errors.otp_content = 'Invalid Spoc Contact Number';

    // const validateUrl = (url) => /^https:\/\/[a-zA-Z0-9-]+\.auss\.co\/$/.test(url.trim());

    return errors;
  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    const updatedValue =
      type === "checkbox" ? (checked ? 1 : 2) :
        (!isNaN(value) && name !== "id_branch" && name !== "id_client" && name !== "id_project")
          ? Number(value)
          : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));


  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try { 
      
      addsmssettingmutate(formData);           
       // Call another API using fetch
       fetch(`${aupay_url}/api/admin/smssetting`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        }) .then((response) => response.json())
        .then((data) => {
        ;
        })
        .catch((error) => {
        console.error('Error with another API call:', error);
        toast.error('Error with another API call');
        });
    } catch (error) {
      // Extract error message from the response or use a default
      const errorMessage = error.response?.data?.message || 'An error occurred while adding notification details.';
      toast.error(errorMessage);
      console.error('Error adding notification setting details:', error);
    }
  };
  const {mutate: addsmssettingmutate } = useMutation({
    mutationFn: addsmssetting,
    onSuccess: (response) => {
      ;
      toast.success(response.message)
      setFormData(formData);
      dispatch(pagehandler(currentStep + 1));
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });



  useEffect(() => {
    getallsmsaccesstype();
  }, []);

  //Get all sms access
  const getallsmsaccesstype = async () => {
    try {
      const res = await smsaccesstype();
      
      setSmsAccessData(res.data);

    } catch (error) {
      
    }
  }

  return (
    <>
      <div className="flex  w-full  flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
          <form onSubmit={handleSubmit} className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">SMS Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
               

                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>SMS Access type<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='sms_access'
                      value={formData.sms_access}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value='' readOnly>--Select--</option>
                      {smsaccessData.map((access) => (
                        <option key={access.name} value={access.id}>
                          {access.name}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.sms_access && <span className="text-red-500 text-sm mt-1">{errors.sms_access}</span>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Otp Content<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="otp_content"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Otp Content"
                    value={formData.otp_content}
                    onChange={handleChange}
                  />
                  {errors.otp_content && <div className="text-red-500 text-sm">{errors.otp_content}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 font-medium">
                    Otp Url<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="otp_url"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Otp Url"
                    value={formData.otp_url}
                    onChange={handleChange}
                  />
                  {errors.otp_url && <div className="text-red-500 text-sm">{errors.otp_url}</div>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Customer Content<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="customer_content"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Customer Content"
                    value={formData.customer_content}
                    onChange={handleChange}
                  />
                  {errors.customer_content && <div className="text-red-500 text-sm">{errors.customer_content}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Customer Url<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="customer_url"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Customer Url"
                    value={formData.customer_url}
                    onChange={handleChange}
                  />
                  {errors.customer_url && <div className="text-red-500 text-sm">{errors.customer_url}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Scheme Account Content<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="schemeaccount_content"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Scheme Account Content"
                    value={formData.schemeaccount_content}
                    onChange={handleChange}
                  />
                  {errors.schemeaccount_content && <div className="text-red-500 text-sm">{errors.schemeaccount_content}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Scheme Account  Url<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="schemeaccount_url"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Scheme Account  Url"
                    value={formData.schemeaccount_url}
                    onChange={handleChange}
                  />
                  {errors.schemeaccount_url && <div className="text-red-500 text-sm">{errors.schemeaccount_url}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Payment Content<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="payment_content"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Payment Content"
                    value={formData.payment_content}
                    onChange={handleChange}
                  />
                  {errors.payment_content && <div className="text-red-500 text-sm">{errors.payment_content}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Payment Url<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="payment_url"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Payment Url"
                    value={formData.payment_url}
                    onChange={handleChange}
                  />
                  {errors.payment_url && <div className="text-red-500 text-sm">{errors.payment_url}</div>}
                </div>





                {/* Otp */}
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 text-md font-medium">
                    OTP ON | OFF<span className="text-red-400"> *</span>
                  </label>
                  <div className="grid grid-cols-3 md:grid-col-2 md:items-center md:space-x-4 mt-2">
                    <div className="flex items-center space-x-6 md:w-1/4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="otp_sent"
                          checked={formData.otp_sent === 1}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div
                          className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.otp_sent === 1
                            ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                            : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                            }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.otp_sent === 1 ? "transform translate-x-6 bg-white" : ""
                              }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Customer */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Customer ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="customer_sent"
                        checked={formData.customer_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.customer_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.customer_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
                {/* Scheme Account */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Scheme Account ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="schemeaccount_sent"
                        checked={formData.schemeaccount_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.schemeaccount_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.schemeaccount_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
                {/* Payment */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Payment ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="payment_sent"
                        checked={formData.payment_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.payment_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.payment_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                  type="button"
                  onClick={() => handleCancel('cancel')}
                >
                  Cancel
                </button>
                <button
                  readOnly={currentStep === totalPages || isLoading}
                  className=" text-white rounded-md p-2 w-full lg:w-20"
                  type="submit"
                  style={{ backgroundColor: layout_color }} >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>

      </div >
    </>
  );
};

export default SmsDetails;
