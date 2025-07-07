import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {  smsaccesstype, whatsapptype, addwhatsappsetting,  whatsappsettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query'


const WhastappDetails = ({ setIsAddClient,onPageChange, isLoading = false }) => {
  const navigate = useNavigate();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const currentStep = useSelector((state) => state.clientForm.currentStep);
  const totalPages = useSelector((state) => state.clientForm.totalSteps);
  const id = useSelector((state) => state.clientForm.id_client);
  const id_client = useSelector((state) => state.clientForm.id_client);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const id_project = useSelector((state) => state.clientForm.id_project);
  const aupay_url = useSelector((state) => state.clientForm.aupay_url);
  const [branchData, setBranchData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [smsaccessData, setSmsAccessData] = useState([]);
  const [selectedWhatsappAccess, setselectedWhatsappAccess] = useState('');
  const [whatsapp, setWhatsapp] = useState([]);
  const [selectedWhatsappType, setSelectedWhatsappType] = useState('');
  let dispatch = useDispatch()

  const [formData, setFormData] = useState({
    id_branch: id_branch,
    id_client: id_client,
    id_project: id_project,
    whatsapp_type: 1,
    whatsapp_access: 1,
    newarrival_sent: 2,
    newarrival_key: '',
    product_sent: 2,
    product_key: '',
    payment_sent: 2,
    payment_key: '',
    offers_sent: 2,
    offers_key: '',
    wedding_sent: 2,
    wedding_key: '',
    birthday_key: '',
    birthday_sent: 2,
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    getallwhatsapptype();
    getallsmsaccesstype();
    getwhatsappprojectbranch();
  }, []);

  const getwhatsappprojectbranch = async () => {
  
      const response = await whatsappsettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          whatsapp_type: response.data.whatsapp_type,
          whatsapp_access: response.data.whatsapp_access,
          newarrival_sent: response.data.newarrival_sent,
          newarrival_key: response.data.newarrival_key,
          product_sent: response.data.product_sent,
          product_key: response.data.product_key,
          payment_sent: response.data.payment_sent,
          payment_key: response.data.payment_key,
          offers_sent: response.data.offers_sent,
          offers_key: response.data.offers_key,
          wedding_sent: response.data.wedding_sent,
          wedding_key: response.data.wedding_key,
          birthday_key: response.data.birthday_key,
          birthday_sent: response.data.birthday_sent
        }));

        
      }

  }
 const handleCancel = (type) => {
     if(type === "back"){
       dispatch(pagehandler(currentStep - 1))    
       setIsAddClient(false);
     } else {
        dispatch(pagehandler(2))    
         setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
     }  
 };
 


  const validate = (data) => {
    const errors = {};


    if (!data.whatsapp_access) errors.whatsapp_access = 'Whatsapp Access is required';
    if (!data.whatsapp_type) errors.whatsapp_type = 'Whatsapp Type is required';


  

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
      
      addwhatsappsettingmutate(formData);           
       // Call another API using fetch
       fetch(`${aupay_url}/api/admin/whatsappsetting`, {
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
  const {mutate: addwhatsappsettingmutate } = useMutation({
    mutationFn: addwhatsappsetting,
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

  const getallsmsaccesstype = async () => {
    try {
      const res = await smsaccesstype();
      
      setSmsAccessData(res.data);

    } catch (error) {
      
    }
  }
 
  const getallwhatsapptype = async () => {
    try {
      const res = await whatsapptype();
      
      setWhatsapp(res.data);

    } catch (error) {
      
    }
  }


  return (
    <>
      <div className="flex  w-full  flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
          <form onSubmit={handleSubmit} className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">Whatsapp Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
             
                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Whatsapp Access type<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='whatsapp_access'
                      value={formData.whatsapp_access}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value=''>--Select--</option>
                      {smsaccessData.map((access) => (
                        <option key={access.id} value={access.id}>
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
                  {errors.whatsapp_access && <span className="text-red-500 text-sm mt-1">{errors.whatsapp_access}</span>}
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-gray-700 font-medium'>Whatsapp type<span className='text-red-400'>*</span></label>
                  <div className="relative">
                    <select
                      name='whatsapp_type'
                      value={formData.whatsapp_type}
                      onChange={handleChange}
                      className='appearance-none border-2 border-gray-300 rounded-md p-2 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
                    >
                      <option value=''>--Select--</option>
                      {whatsapp.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="black">
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                 {errors.whatsapp_type && <span className="text-red-500 text-sm mt-1">{errors.whatsapp_type}</span>} 
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 font-medium">
                    New Arrival Key
                  </label>
                  <input
                    type="text"
                    name="newarrival_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter New Arrival Key"
                    value={formData.newarrival_key}
                    onChange={handleChange}
                  />
                  {errors.newarrival_key && <div className="text-red-500 text-sm">{errors.newarrival_key}</div>}
                </div>


                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Product Key
                  </label>
                  <input
                    type="text"
                    name="product_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Product Key"
                    value={formData.product_key}
                    onChange={handleChange}
                  />
                  {errors.product_key && <div className="text-red-500 text-sm">{errors.product_key}</div>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Offer Key
                  </label>
                  <input
                    type="text"
                    name="offers_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Offer Key "
                    value={formData.offers_key}
                    onChange={handleChange}
                  />
                  {errors.offers_key && <div className="text-red-500 text-sm">{errors.offers_key}</div>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Wedding Key
                  </label>
                  <input
                    type="text"
                    name="wedding_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Wedding Key"
                    value={formData.wedding_key}
                    onChange={handleChange}
                  />
                  {errors.wedding_key && <div className="text-red-500 text-sm">{errors.wedding_key}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Birthday Key
                  </label>
                  <input
                    type="text"
                    name="birthday_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Birthday Key"
                    value={formData.birthday_key}
                    onChange={handleChange}
                  />
                  {errors.birthday_key && <div className="text-red-500 text-sm">{errors.birthday_key}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Payment Key
                  </label>
                  <input
                    type="text"
                    name="payment_key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Payment Key"
                    value={formData.payment_key}
                    onChange={handleChange}
                  />
                  {errors.payment_key && <div className="text-red-500 text-sm">{errors.payment_key}</div>}
                </div>

                {/* newarrival_sent */}
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 text-md font-medium">
                    New Arrivals ON | OFF<span className="text-red-400"> *</span>
                  </label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newarrival_sent"
                        checked={formData.newarrival_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.newarrival_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.newarrival_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        >
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                {/* product_sent */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Product ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="product_sent"
                        checked={formData.product_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.product_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.product_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>

                    {errors.product_sent && <div className="text-red-500 text-sm">{errors.product_sent}</div>}
                  </div>
                </div>
                {/* payment_sent */}
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
                {/* offers_sent */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Offer  ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="offers_sent"
                        checked={formData.offers_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.offers_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.offers_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>
                    {errors.offers_sent && <div className="text-red-500 text-sm">{errors.offers_sent}</div>}
                  </div>
                </div>
                {/* wedding_sent */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Wedding ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="wedding_sent"
                        checked={formData.wedding_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.wedding_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.wedding_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>
                    {errors.wedding_sent && <div className="text-red-500 text-sm">{errors.wedding_sent}</div>}
                  </div>
                </div>


                {/* birthday_sent */}
                <div className="flex flex-col mt-2">
                  <label className="mr-2 whitespace-nowrap md:w-1/4">Birthday ON | OFF</label>
                  <div className="flex items-center space-x-6 md:w-1/4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="birthday_sent"
                        checked={formData.birthday_sent === 1}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.birthday_sent === 1
                          ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                          : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.birthday_sent === 1 ? "transform translate-x-6 bg-white" : ""
                            }`}
                        ></div>
                      </div>
                    </label>
                    {errors.birthday_sent && <div className="text-red-500 text-sm">{errors.birthday_sent}</div>}
                  </div>
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
                  style={{ backgroundColor: layout_color }} >
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

export default WhastappDetails;
