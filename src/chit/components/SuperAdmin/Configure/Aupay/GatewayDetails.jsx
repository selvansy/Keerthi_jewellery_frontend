import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getbranchbyclient, paymenttype, addgatewaysetting, gatewaysettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query'


const GatewayDetails = ({setIsAddClient,onPageChange, isLoading = false }) => {
  const navigate = useNavigate();
  
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const currentStep = useSelector((state) => state.clientForm.currentStep);
  const totalPages = useSelector((state) => state.clientForm.totalSteps);
  const id = useSelector((state)=>state.clientForm.id_client);
  const id_client = useSelector((state) => state.clientForm.id_client);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const id_project = useSelector((state) => state.clientForm.id_project);
   const aupay_url = useSelector((state) => state.clientForm.aupay_url);
  const [branchData, setBranchData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [smsaccessData, setSmsAccessData] = useState([]);
  const [selectedWhatsappAccess, setselectedWhatsappAccess] = useState('');
  const [PaymentTypeData, setPaymentTypeData] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  let dispatch = useDispatch()

  const [formData, setFormData] = useState({
    id_branch:id_branch,
    id_client:id_client,
    id_project:id_project,
    payment_type: 2,
    payment_email: '',
    merchant_key: '',
    secret_key: ''
  });

  useEffect(() => {
    getgatewayprojectbranch();
  }, []);

  const getgatewayprojectbranch = async () => {
    
      const response = await gatewaysettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          payment_type: response.data.payment_type,
          payment_email: response.data.payment_email, 
          merchant_key: response.data.merchant_key,
          secret_key: response.data.secret_key,
        }));

        
      }

  
  }
  const [errors, setErrors] = useState({});


const handleCancel = (type) => {
    if(type === "back"){
      dispatch(pagehandler(currentStep - 1))    
      setIsAddClient(false);
    } else {
      dispatch(pagehandler(3))    
      setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
    }  
};



  const validate = (data) => {
    const errors = {};


    if (!data.id_branch) errors.id_branch = 'Invalid id_branch';
    if (!data.payment_type) errors.payment_type = 'Invalid payment_type';
    if (!data.payment_email) errors.payment_email = 'Invalid payment_email';
    if (!data.merchant_key) errors.merchant_key = 'Invalid merchant_key';
    if (!data.secret_key) errors.secret_key = 'Invalid secret_key';


    // if (!/^\d{10}$/.test(data.wedding_key)) errors.wedding_key = 'Invalid Spoc Contact Number';

    const validatekey = (key) => /^https:\/\/[a-zA-Z0-9-]+\.auss\.co\/$/.test(key.trim());
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? (checked ? 1 : 2) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try { 
      
      addgatewaysettingmutate(formData);           
      // Call another API using fetch
        fetch(`${aupay_url}/api/admin/gatewaysetting`, {
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
      const errorMessage = error.response?.data?.message || 'An error occurred while adding gateway details.';
      toast.error(errorMessage);
      console.error('Error adding gateway setting details:', error);
    }
  };
  const {mutate: addgatewaysettingmutate } = useMutation({
    mutationFn: addgatewaysetting,
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
    getallpaymenttype();
  }, []);
  


  //Get all PaymentType
  const getallpaymenttype = async () => {
    try {
      const res = await paymenttype();
      
      setPaymentTypeData(res.data);

    } catch (error) {
      
    }
  }


  return (
    <>
      <div className="flex flex-row w-full md:flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
          <form onSubmit={handleSubmit} className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">Gateway Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
                
                
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Payment type<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='payment_type'
                      value={formData.payment_type}
                      ononChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value="" readOnly>--Select--</option>
                      {PaymentTypeData.map((payment) => (
                        <option key={payment.id} value={payment.id}>
                          {payment.name}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.payment_type && <span className="text-red-500 text-sm mt-1">{errors.payment_type}</span>}
                </div>  

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Merchant Key<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="merchant_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Payment Email "
                    value={formData.merchant_key}
                    onChange={handleChange}
                  />
                  {errors.merchant_key && <div className="text-red-500 text-sm">{errors.merchant_key}</div>}
                </div>
                
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Secret Key<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="secret_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Payment Email "
                    value={formData.secret_key}
                    onChange={handleChange}
                  />
                  {errors.secret_key && <div className="text-red-500 text-sm">{errors.secret_key}</div>}
                </div>     

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Payment Email<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="payment_email"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Payment Email "
                    value={formData.payment_email}
                    onChange={handleChange}
                  />
                  {errors.payment_email && <div className="text-red-500 text-sm">{errors.payment_email}</div>}
                </div>
  
                </div> 
                </div>
                <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      readOnly={currentStep === totalPages || isLoading}
                      className=" text-white rounded-md p-2 w-full lg:w-20"
                      type="submit"
                      style={{ backgroundColor: layout_color }}  >
                      Submit
                    </button>
                  </div>
                </div> 
                
          </form >
        </div >

      </div >
    </>
  );
};

export default GatewayDetails;
