import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { addappsetting, appsettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query'
const AppsettingDetails = ({ setIsAddClient,onPageChange, isLoading = false }) => {

  const navigate = useNavigate();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const currentStep = useSelector((state) => state.clientForm.currentStep);
  const totalPages = useSelector((state) => state.clientForm.totalSteps);
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
    android_version: '',
    ios_version: '',
    android_check: 1,
    ios_check: 1,
    android_link: '',
    ios_link: '',
    youtube_link: '',
    facebook_link: '',
    instagram_link: '',
    website_link: '',
    social_link: '',
    android_launch: '',
    ios_launch: ''
  });
  const [errors, setErrors] = useState({});


  const handleCancel = (type) => {
    if(type === "back"){
      dispatch(pagehandler(currentStep - 1))    
      setIsAddClient(false);
    } else {
       dispatch(pagehandler(5))    
      setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
    }  
};
  const validate = (data) => {
    const errors = {};

    if (!data.android_version) errors.android_version = 'Invalid android_version';
    if (!data.ios_version) errors.ios_version = 'Invalid ios_version';
    if (!data.ios_check) errors.ios_check = 'Invalid ios_check';
    if (!data.android_check) errors.android_check = 'Invalid android_check';
   
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
      
      addappsettingmutate(formData);      
      // Call another API using fetch
          fetch(`${aupay_url}/api/admin/appsetting`, {
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
  const {mutate: addappsettingmutate } = useMutation({
    mutationFn: addappsetting,
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
    getappsettingprojectbranchbyid();
  }, []);

  const getappsettingprojectbranchbyid = async () => {
    try {
      const response = await appsettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          android_version: response.data.android_version,
          ios_version: response.data.ios_version,
          android_check: response.data.android_check,
          ios_check: response.data.ios_check,
          android_link: response.data.android_link,
          ios_link: response.data.ios_link,
          youtube_link: response.data.youtube_link,
          facebook_link: response.data.facebook_link,
          instagram_link: response.data.instagram_link,
          website_link: response.data.website_link,
          social_link: response.data.social_link,
          android_launch: response.data.android_launch,
          ios_launch: response.data.ios_launch
        }));

        
      }

    } catch (error) {
      
    }
  }




  return (
    <>
      <div className="flex flex-col  w-full  bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
          <form onSubmit={handleSubmit} className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">App Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Android Version<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="android_version"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter Android Version "
                    value={formData.android_version}
                    onChange={handleChange}
                  />
                  {errors.android_version && <div className="text-red-500 text-sm">{errors.android_version}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    IOS Version<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="ios_version"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter  IOS Version "
                    value={formData.ios_version}
                    onChange={handleChange}
                  />
                  {errors.ios_version && <div className="text-red-500 text-sm">{errors.ios_version}</div>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Android Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="android_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Android Link "
                    value={formData.android_link}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    IOS Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="ios_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="IOS Link "
                    value={formData.ios_link}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Youtube Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="youtube_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="youtube Link "
                    value={formData.youtube_link}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Facebook Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="facebook_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Facebook Link "
                    value={formData.facebook_link}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Instagram Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="instagram_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Instagram Link "
                    value={formData.instagram_link}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Website Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="website_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Website Link "
                    value={formData.website_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Social Link<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="social_link"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Social Link "
                    value={formData.social_link}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    Android Launch Date<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="date"
                    name="android_launch"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder=" Android Launch Date "
                    value={formData.android_launch}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    IOS Launch Date<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="date"
                    name="ios_launch"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="IOS Launch Date"
                    value={formData.ios_launch}
                    onChange={handleChange}
                  />
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

export default AppsettingDetails;
