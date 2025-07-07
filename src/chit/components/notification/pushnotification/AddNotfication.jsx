import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {getnotificationtype ,getallbranch,createpushnotification   } from '../../../api/Endpoints'
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { X } from 'lucide-react'
import profileplaceholder from "../../../../../src/assets/profileplaceholder.png"

const AddNotfication = () => {

  const navigate = useNavigate();

  
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;



  const [filtertype, setNotifyType] = useState([]);
  const [branchList, setBranchList] = useState([]);

  
    const [noti_image, setnoti_image] = useState(null);
    const [noti_imagePreview, setnoti_imagePreview] = useState(null);

  const [formData, setFormData] = useState({
    noti_name: "",
    noti_desc: "",
    id_branch: id_branch,
    senttype: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const { mutate: handlenotificationtype } = useMutation({
    mutationFn: getnotificationtype,
    onSuccess: (response) => {
     
      setNotifyType(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  const { mutate: getBranchList } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

   
  };

  const handleDescriptionImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setNotiImage((prevState) => [...prevState, ...Array.from(files)]);
    }
  };



  // Validation function
  const validateForm = () => {
    const errors = {};  
    if (!formData.noti_name) errors.noti_name = " Name is required";    
    if (!formData.noti_desc) errors.noti_desc = "Description is required";    
    if (noti_image.length === 0) errors.noti_image = "Description is required";   
    if (!formData.id_branch) errors.id_branch = "Branch Id is required";   
    if (!formData.senttype) errors.senttype = "SentType is required";   
    setFormErrors(errors);
  
    return Object.keys(errors).length === 0;
  };

  //mutation to create notification
  const { mutate: createpushnotificationMutate } = useMutation({
    mutationFn: createpushnotification,
    onSuccess: (response) => {
      toast.success(response.message)
      navigate('/notification/pushnotification')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });


  //handle submit
  const handleSubmit = () => {
    
    if (!validateForm(formData)) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("noti_name", formData.noti_name);
    formDataToSend.append("noti_desc", formData.noti_desc);
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("senttype", formData.senttype);  
    if (noti_image) formDataToSend.append("noti_image", noti_image);

    
    createpushnotificationMutate(formDataToSend);
  };

  useEffect(() => {
    handlenotificationtype();
    getBranchList();
  }, []);

  const handleCancle = () => {
    navigate("/notification/pushnotification");
  };

  const handleRemoveImage = () => {
    setnoti_image(null);
    setnoti_imagePreview(null)
    const input = document.getElementById("main_image");
    if (input) input.value = "";
  };


  
  const handleFileChange = (e) => {
   
    const file = e.target.files[0];
    if (file) {
      setnoti_image(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setnoti_imagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      <div className="flex flex-row justify-between">
       
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Create Notification
          </h2>
        
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">

          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
               {
                id_branch === "0" && (
                  <div className="flex flex-col">
                  <label className="text-gray-700 mb-2 mt-2 font-medium">
                    Branch<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="id_branch"
                      value={formData.id_branch}
                      onChange={handleInputChange}
                      className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    
                    >
                      <option value="">--Select---</option>
                      {branchList.map((type) => (
                        <option
                          name="id_branch"
                          className="text-gray-700"
                          key={type._id}
                          value={type._id}
                        >
                          {type.branch_name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="black"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {formErrors.id_branch && (
                    <span className="text-red-500 text-sm mt-1">
                      {formErrors.id_branch}
                    </span>
                  )}
                </div>
                )

               }
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="senttype"
                  value={formData.senttype}
                  onChange={handleInputChange}
                  className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  
                >
                    <option value="">--Select---</option>
                  {filtertype.map((senttype) => (
                    <option
                      name="senttype"
                      className="text-gray-700"
                      key={senttype.id}
                      value={senttype.id}
                    >
                      {senttype.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.senttype && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.senttype}
                </span>
              )}
            </div>
          
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Title<span className="text-red-400">*</span>
              </label>
              <input
                name="noti_name"
                type="text"
                value={formData.noti_name}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              {formErrors.noti_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.noti_name}
                </span>
              )}
            </div>
    
        
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Description<span className="text-red-400">*</span>
              </label>
              <textarea
                name="noti_desc"
                value={formData.noti_desc}
                type="text"
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.noti_desc && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.noti_desc}
                </span>
              )}
            </div>


            <div className='flex flex-col'>
            <label className="text-gray-700 mb-2 mt-2 font-medium">
                Upload Image<span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="main_image"
                    className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                  >
                    <p className='text-[#023453] truncate'>
                      {noti_image ? noti_image.name : noti_image}
                    </p>
                  </label>
                  <input
                    onChange={handleFileChange}
                    className="hidden max-w-[190px]"
                    name="main_image"
                    id="main_image"
                    type="file"
                    accept="image/*"
                  />
                </div>

                <div>
                  <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden relative">
                    <img
                      src={noti_image ? noti_imagePreview : profileplaceholder}
                      alt="image preview"
                      className={`w-full h-full ${noti_imagePreview ? 'object-cover' : 'object-contain'}`}
                    />
                    {noti_imagePreview && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                </div>

              </div>
                {formErrors.noti_image && (
                <span className="text-red-500 text-sm mt-1">{formErrors.noti_image}</span>
              )}
            </div>

     
        
            {/* <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Upload Image<span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="noti_image"
                    className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                  >
                    {noti_image.length > 0
                      ? `${noti_image.length} file(s) selected`
                      : "Browse to find or drag image(s) here"}
                  </label>
                  <input
                    onChange={handleDescriptionImageChange}
                    className="hidden max-w-[190px]"
                    name="noti_image"
                    id="noti_image"
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files
                  />
                </div>
                     
                {/* Display the selected images */}
                {/* {noti_image.length > 0 && (
                  <div className="flex gap-4 flex-wrap">
                    {noti_image.map((file, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden relative"
                      >
                        <button
                          onClick={() => handleRemoveDescriptionImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                          type="button"
                        >
                          ×
                        </button>
                        <img
                          src={
                            typeof file === "string"
                              ? file
                              : URL.createObjectURL(file) 
                          }
                          alt="Description image preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.noti_image && (
                <span className="text-red-500 text-sm mt-1">{formErrors.noti_image}</span>
              )}
            </div> */}
        
           
         
          </div>
        
          <div className="bg-white">
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                type="button"
                onClick={handleCancle}
              >
                Cancel
              </button>
              <button
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNotfication;