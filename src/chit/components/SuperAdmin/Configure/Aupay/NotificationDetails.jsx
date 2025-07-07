import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { addnotificationsetting,notificationsettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query'


const NotificationDetails = ({ setIsAddClient,onPageChange, isLoading = false }) => {
  const navigate = useNavigate();

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  
  const currentStep = useSelector((state) => state.clientForm.currentStep);
  const totalPages = useSelector((state) => state.clientForm.totalSteps);
  const id = useSelector((state)=>state.clientForm.id_client);
  const id_client = useSelector((state) => state.clientForm.id_client);
  const id_branch = useSelector((state) => state.clientForm.id_branch);
  const id_project = useSelector((state) => state.clientForm.id_project);
   const aupay_url = useSelector((state) => state.clientForm.aupay_url);
  const [branchData,setBranchData] = useState([]);  
  const [selectedBranch, setSelectedBranch] = useState('');
  let dispatch = useDispatch()

  const [formData, setFormData] = useState({
    id_branch:id_branch,
    id_client:id_client,
    id_project:id_project,
    notifyappid: '',
    notifyauthirization: '',
    notify_sent: 2,
    offers_sent: 2,
    newarrival_sent: 2,
    product_sent: 2
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    getnotificationprojectbranch();
  }, []);

  const getnotificationprojectbranch = async () => {

      const response = await notificationsettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          notifyappid: response.data.notifyappid,
          notifyauthirization: response.data.notifyauthirization,
          notify_sent: response.data.notify_sent,
          offers_sent: response.data.offers_sent,
          newarrival_sent: response.data.newarrival_sent,
          product_sent: response.data.product_sent,
        }));

        
      }

   
  }


 const handleCancel = (type) => {
     if(type === "back"){
       dispatch(pagehandler(currentStep - 1))    
       setIsAddClient(false);
     } else {
       dispatch(pagehandler(0))    
      setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
     }  
 };
 

  const validate = (data) => {
    const errors = {};
    if (!data.notifyauthirization) errors.notifyauthirization = 'Invalid data';
    if (!data.id_branch) errors.id_branch = 'Branch Id is required';
    if (!data.notifyappid) errors.notifyappid = 'Notification Spoc Name is required';
   
    if (!data.notify_sent) errors.notify_sent = 'Invalid notify_sent';
    if (!data.offers_sent) errors.offers_sent = 'Invalid offers_sent';
    if (!data.newarrival_sent) errors.newarrival_sent = 'Invalid newarrival_sent';

    return errors;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    
    const updatedValue =
      type === "checkbox" ? (checked ? 1 : 2) : 
      (!isNaN(value) && name !== "id_branch" && name !== "id_client" && name !== "id_project") 
        ? Number(value) 
        : value;
  
    
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
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
      
      addnotificationsettingmutate(formData);             
        // Call another API using fetch
        fetch(`${aupay_url}/api/admin/notificationsetting`, {
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
  const {mutate: addnotificationsettingmutate } = useMutation({
    mutationFn: addnotificationsetting,
    onSuccess: (response) => {
      ;
      toast.success(response.message)
      setFormData(formData);
      ;
      dispatch(pagehandler(currentStep + 1));
      ;
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });


  return (
    <>
      <div className="flex w-full  flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
          <form onSubmit={handleSubmit} className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">Notification Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
            
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-1 font-medium">
                    Notification App Id<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="notifyappid"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Notification App Id"
                    value={formData.notifyappid}
                    onChange={handleChange}
                  />
                  {errors.notifyappid && <div className="text-red-500 text-sm">{errors.notifyappid}</div>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                  Notification Authorization <span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="notifyauthirization"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter  Notification Authorization"
                    value={formData.notifyauthirization}
                    onChange={handleChange}
                  />
                  {errors.notifyauthirization && <div className="text-red-500 text-sm">{errors.notifyauthirization}</div>}
                </div>
                {/* Push Notify */}
                <div className="flex flex-col mt-2">
                    <label className="text-black mb-1 text-md font-medium">
                      Push Notification ON | OFF<span className="text-red-400"> *</span>
                    </label>
                    <div className="grid grid-cols-3 md:grid-col-2 md:items-center md:space-x-4 mt-2">
                      <div className="flex items-center space-x-6 md:w-1/4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notify_sent"
                            checked={formData.notify_sent === 1}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div
                            className={`z-0 group bg-white rounded-full duration-300 w-12 h-6 ring-1 ring-black relative ${formData.notify_sent === 1
                              ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                              : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
                              }`}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.notify_sent === 1 ? "transform translate-x-6 bg-white" : ""
                                }`}
                            ></div>
                          </div>
                        </label>
                        {errors.notify_sent && <div className="text-red-500 text-sm">{errors.notify_sent}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Offers */}
                  <div className="flex flex-col mt-2">  
                      <label className="mr-2 whitespace-nowrap md:w-1/4">Offers ON | OFF</label>
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
                  {/* New Arrivals */}
                  <div className="flex flex-col mt-2">
                      <label className="mr-2 whitespace-nowrap md:w-1/4">New Arrivals</label>
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
                            ></div>
                          </div>
                        </label>
                        {errors.newarrival_sent && <div className="text-red-500 text-sm">{errors.newarrival_sent}</div>}

                      </div>
                  </div>
                  {/* Product */}
                  <div className="flex flex-col mt-2">
                      <label className="mr-2 whitespace-nowrap md:w-1/4">Product</label>
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
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-black rounded-full transition-transform duration-300 ${formData.product_sent === 1? "transform translate-x-6 bg-white" : ""
                                }`}
                            ></div>
                          </div>
                        </label>
                        {errors.product_sent && <div className="text-red-500 text-sm">{errors.product_sent}</div>}

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

export default NotificationDetails;
