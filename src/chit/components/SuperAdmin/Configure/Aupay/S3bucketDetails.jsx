import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { adds3bucketsetting, s3bucketsettingprojectbranchbyid } from "../../../../api/Endpoints"
import { pagehandler } from '../../../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query'


const S3bucketDetails = ({ setIsAddClient,onPageChange, isLoading = false }) => {
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
    s3key: '',
    s3secret: '',
    s3bucket_name: '',
    s3display_url: '',
    region: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    gets3bucketprojectbranch();
  }, []);

  const gets3bucketprojectbranch = async () => {

      const response = await s3bucketsettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          s3key: response.data.s3key,
          s3secret: response.data.s3secret,
          s3bucket_name: response.data.s3bucket_name,
          s3display_url: response.data.s3display_url,
          region: response.data.region,
        }));

        
      }

    
  }


 const handleCancel = (type) => {
     if(type === "back"){
       dispatch(pagehandler(currentStep - 1))    
       setIsAddClient(false);
     } else {
      dispatch(pagehandler(4))    
      setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
     }  
 };
 

  const validate = (data) => {
    const errors = {};


    if (!data.id_branch) errors.id_branch = 'Invalid id_branch';
    if (!data.s3key) errors.s3key = 'Invalid s3key';
    if (!data.s3secret) errors.s3secret = 'Invalid s3secret';
    if (!data.s3bucket_name) errors.s3bucket_name = 'Invalid s3bucket_name';
    if (!data.s3display_url) errors.s3display_url = 'Invalid s3display_url';
    if (!data.region) errors.region = 'Invalid region';


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
      
      adds3bucketsettingmutate(formData);           
       // Call another API using fetch
       fetch(`${aupay_url}/api/admin/bucketsetting`, {
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
  const {mutate: adds3bucketsettingmutate } = useMutation({
    mutationFn: adds3bucketsetting,
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






  return (
    <>
      <div className="flex w-full  flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
        <div>
          <form onSubmit={handleSubmit} className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
            <div className="mb-8">
              <h2 className="text-1xl font-bold mb-4 mt-4">S3 Bucket Details</h2>
              <div className="grid grid-rows-2 md:grid-cols-2 gap-4">
             
              
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                    S3 Bucket Key<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="s3key"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter S3 Bucket Key "
                    value={formData.s3key}
                    onChange={handleChange}
                  />
                  {errors.s3key && <div className="text-red-500 text-sm">{errors.s3key}</div>}
                </div>
                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                  S3 Bucket Secret<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="s3secret"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter  S3 Bucket Secret "
                    value={formData.s3secret}
                    onChange={handleChange}
                  />
                  {errors.s3secret && <div className="text-red-500 text-sm">{errors.s3secret}</div>}
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                  S3 Bucket name<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="s3bucket_name"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="S3 Bucket name"
                    value={formData.s3bucket_name}
                    onChange={handleChange}
                  />
                  {errors.s3bucket_name && <div className="text-red-500 text-sm">{errors.s3bucket_name}</div>}
                </div>  

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                  S3 Bucket Display Url<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="s3display_url"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="S3 Bucket Display Url "
                    value={formData.s3display_url}
                    onChange={handleChange}
                  />
                  {errors.s3display_url && <div className="text-red-500 text-sm">{errors.s3display_url}</div>}
                </div>     

                <div className="flex flex-col mt-2">
                  <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                  S3 Bucket Region<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    name="region"
                    className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="S3 Bucket Region "
                    value={formData.region}
                    onChange={handleChange}
                  />
                  {errors.region && <div className="text-red-500 text-sm">{errors.region}</div>}
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

export default S3bucketDetails;
