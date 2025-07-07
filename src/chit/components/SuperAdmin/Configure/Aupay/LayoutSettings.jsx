import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux';
import { getbranchbyclient, layouttype, addlayoutsetting,layoutsettingprojectbranchbyid  } from "../../../../api/Endpoints"
import { pagehandler, setSelectedProject } from '../../../../../redux/clientFormSlice';
import { CalendarDays, Camera, X } from 'lucide-react'
import profileplaceholder from "../../../../../../src/assets/profileplaceholder.png"

const LayoutSettings = ({ onPageChange, isLoading = false, setIsAddClient }) => {

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
    const [branch_logo, setbranch_logo] = useState(null)
    const [errors, setErrors] = useState({});
    const [branch_logoPreview, setbranch_logoPreview] = useState(null);
    const [branch_favicon, setbranch_favicon] = useState(null)

    const [branch_faviconPreview, setbranch_faviconPreview] = useState(null);


    const [imagePreview, setimagePreview] = useState(null);
    const [branch_image, setbranch_image] = useState(null);

    const [toplayout, setToplayout] = useState(false);
    const [rightlayout, setRightlayout] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    let dispatch = useDispatch()

    const [formData, setFormData] = useState({
        id_branch:id_branch,
        id_client:id_client,
        id_project:id_project,
        layout_color: "#023453",
        layout_type: null,
    });

  useEffect(() => {
    getlayoutprojectbranch();
  }, []);

  const getlayoutprojectbranch = async () => {
 
      const response = await layoutsettingprojectbranchbyid({id_branch:id_branch,id_project:id_project});
      if(response){
        
        setFormData((prevData) =>({...prevData,
          id:response._id,
          id_branch:response.data.id_branch,
          id_client:response.data.id_client,
          id_project:response.data.id_project,
          layout_color:response.data.layout_color,
          layout_type: response.data.layout_type
        }));

        
      }

  }

 const handleCancel = (type) => {
     if(type === "back"){
       dispatch(pagehandler(currentStep - 1))    
       setIsAddClient(false);
     } else {
       dispatch(pagehandler(6))    
        setIsAddClient(false);
      navigate("/superadmin/aupayconfigure");  
     }  
 };
 


    const validate = (data) => {
        const errors = {};

        if (!data.layout_color) errors.layout_color = 'Invalid layout_color';
        if (!data.layout_type) errors.layout_type = 'Invalid layout_type';
        if (!branch_logo) errors.branch_logo = 'Invalid branch_logo';
        if (!branch_favicon) errors.branch_favicon = 'Invalid branch_favicon';
        if (!branch_image) errors.branch_image = 'Invalid branch_image';


        // if (!/^\d{10}$/.test(data.wedding_key)) errors.wedding_key = 'Invalid Spoc Contact Number';

        // const validatekey = (key) => /^https:\/\/[a-zA-Z0-9-]+\.auss\.co\/$/.test(key.trim());
        setFormErrors(errors);

        if (Object.keys(formErrors).length === 0) {
            return;
        }
        return errors;

    };
    // 

    const handleChange = (e) => {

        const { name, value, type } = e.target;

        // if (name === 'toplayout') {

        //     setToplayout(!toplayout)
        //     setRightlayout(!rightlayout)

        //     setFormData((prev) => ({
        //         ...prev,
        //         layout_type: 1
        //     }))
        //     
        // } else if (name == 'rightlayout') {

        //     setToplayout(!toplayout)
        //     setRightlayout(!rightlayout)

        //     setFormData((prev) => ({
        //         ...prev,
        //         layout_type: 2
        //     }))
        // }

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));


    };



  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // const validationErrors = validate(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }
  
    try { 
      
      addlayoutsettingmutate(formData);           
      // Call another API using fetch
      fetch(`${aupay_url}/api/admin/layoutsetting`, {
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
      const errorMessage = error.response?.data?.message || 'An error occurred while adding layout details.';
      toast.error(errorMessage);
      console.error('Error adding layout setting details:', error);
    }
  };
  const {mutate: addlayoutsettingmutate } = useMutation({
    mutationFn: addlayoutsetting,
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
        layouttype()
    }, []);



    //Get layoutType
    const layouttype = async () => {
        try {
            const res = await layouttype();
            // 
        } catch (error) {
            // 
        }
    }

    const handleClearImage = () => {
        setbranch_image(null);
        setimagePreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setbranch_image(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setimagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage1 = () => {
        setbranch_favicon(null);
        setbranch_faviconPreview(null);
    };

    const handleFileChange1 = (e) => {
        const file = e.target.files[0];
        if (file) {
            setbranch_favicon(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setbranch_faviconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage2 = () => {
        setbranch_logo(null);
        setbranch_logoPreview(null);
    };

    const handleFileChange2 = (e) => {
        const file = e.target.files[0];
        if (file) {
            setbranch_logo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setbranch_logoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        if (formData.layout_type === 1) {
            setRightlayout(!rightlayout)
        } else {
            setToplayout(!toplayout)
        }
    }, [])


    return (
        <>
            <div className="flex flex-row w-full  md:flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide">
                <div>
                    <div className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white'>
                        <div className="mb-8">
                            <h2 className="text-1xl font-bold mb-4 mt-4">Layout Details</h2>

                            <div className="flex flex-col ">
                                <div className="flex flex-col mt-2 gap-4">
                                    <label className="text-black mb-2 mt-1 font-medium whitespace-nowrap">
                                        Layout color<span className="text-red-400"> *</span>
                                    </label>
                                    <div className="flex flex-row gap-2 items-center space-x-0">

                                        <input
                                            type="text"
                                            name="layout_color"
                                            className={`border-2 w-1/2 rounded-md p-2 focus:outline-none ${formErrors.layout_color ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter layout color"
                                            value={formData.layout_color || "#023453"}
                                            onChange={handleChange}
                                        />


                                        <input
                                            type="color"
                                            name="layout_color"
                                            className="border-2 border-gray-300 rounded-md p-2 focus:outline-none "
                                            value={formData.layout_color || "#023453"}
                                            onChange={handleChange}
                                        />


                                        <div
                                            className="w-10 h-10 border-2 border-gray-300 rounded-md"
                                            style={{ backgroundColor: formData.layout_color || "#cbcbcb" }}
                                        />
                                        {formErrors.layout_color && (
                                            <div className="text-red-500 text-sm">{formErrors.layout_color}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mt-6">
                                    <label className="text-gray-700 font-medium">
                                        Menu Layout<span className="text-red-400">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            name="rightlayout"
                                            className={`relative inline-flex flex-shrink-0 h-[45px] w-[60px] border-2 border-gray-300 rounded-lg cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                                            style={{
                                                backgroundColor: rightlayout ? formData.layout_color : '#cbcbcb',
                                            }}
                                            onClick={() => {
                                                setToplayout(!toplayout)
                                                setRightlayout(!rightlayout)

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    layout_type: 1
                                                }))
                                            }}
                                        >
                                            <span className="absolute left-[0px] top-[16px] h-[8px] w-[30px] rotate-90 rounded-full bg-white" />
                                        </button>
                                        <button
                                            type="button"
                                            name="toplayout"
                                            className={`relative inline-flex flex-shrink-0 h-[45px] w-[60px] border-2 border-gray-300 rounded-lg cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                                            style={{
                                                backgroundColor: toplayout ? formData.layout_color : '#cbcbcb',
                                            }}
                                            onClick={() => {
                                                setToplayout(!toplayout)
                                                setRightlayout(!rightlayout)

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    layout_type: 2
                                                }))
                                            }}
                                        >
                                            <span className="absolute left-[10px] top-1 h-[8px] w-[35px] z-10 rounded-full bg-white" />
                                        </button>
                                        {formErrors.layout_color && (
                                            <div className="text-red-500 text-sm">{formErrors.layout_color}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-rows-2 md:grid-cols-2 gap-4 mt-8">
                                <div className='flex flex-col'>
                                    <label className='text-black mb-1 font-medium'>Branch_favicon</label>
                                    <div className='flex flex-col sm:flex-row gap-4'>
                                        <div className='flex-1'>
                                            <label
                                                htmlFor="branch_icon"
                                                className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4"
                                            >
                                                <p className='text-gray-900 truncate'>
                                                    {branch_favicon ? branch_favicon.name : 'Browse'}
                                                </p>
                                            </label>
                                            <input
                                                className="hidden"
                                                name="branch_icon"
                                                id="branch_icon"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange1}
                                            />

                                        </div>

                                        <div className='flex items-start justify-center'>
                                            <div className='relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden'>
                                                <img
                                                    src={branch_faviconPreview ? branch_faviconPreview : profileplaceholder}
                                                    alt="image preview"
                                                    className={`w-full h-full ${branch_faviconPreview ? 'object-cover' : 'object-contain'}`}
                                                />
                                                {branch_faviconPreview && (
                                                    <button
                                                        onClick={handleClearImage1}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>


                                        </div>
                                    </div>
                                    {formErrors.branch_favicon && (
                                        <div className="text-red-500 text-sm">{formErrors.branch_favicon}</div>
                                    )}
                                </div>

                                <div className='flex flex-col'>
                                    <label className='text-black mb-1 font-medium'>Branch_logo</label>
                                    <div className='flex flex-col sm:flex-row gap-4'>
                                        <div className='flex-1'>
                                            <label
                                                htmlFor="branch_logo"
                                                className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4"
                                            >
                                                <p className='text-gray-900 truncate'>
                                                    {branch_logo ? branch_logo.name : 'Browse'}
                                                </p>
                                            </label>
                                            <input
                                                className="hidden"
                                                name="branch_logo"
                                                id="branch_logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange2}
                                            />

                                        </div>

                                        <div className='flex items-start justify-center'>
                                            <div className='relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden'>
                                                <img
                                                    src={branch_logoPreview ? branch_logoPreview : profileplaceholder}
                                                    alt="image preview"
                                                    className={`w-full h-full ${branch_logoPreview ? 'object-cover' : 'object-contain'}`}
                                                />
                                                {branch_logoPreview && (
                                                    <button
                                                        onClick={handleClearImage2}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>

                                        </div>

                                    </div>
                                    {formErrors.branch_logo && (
                                        <div className="text-red-500 text-sm">{formErrors.branch_logo}</div>
                                    )}
                                </div>


                                <div className='flex flex-col'>
                                    <label className='text-black mb-1 font-medium'>Branch_image</label>
                                    <div className='flex flex-col sm:flex-row gap-4'>
                                        <div className='flex-1'>
                                            <label
                                                htmlFor="branch_img"
                                                className="flex justify-center items-center w-full h-12 border-2 border-dashed border-gray-300 text-black cursor-pointer px-4"
                                            >
                                                <p className='text-gray-900 truncate'>
                                                    {branch_image ? branch_image.name : 'Browse'}
                                                </p>
                                            </label>
                                            <input
                                                className="hidden"
                                                name="branch_image"
                                                id="branch_img"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />

                                        </div>

                                        <div className='flex items-start justify-center'>
                                            <div className='relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden'>
                                                <img
                                                    src={imagePreview ? imagePreview : profileplaceholder}
                                                    alt="Profile Preview"
                                                    className={`w-full h-full ${imagePreview ? 'object-cover' : 'object-contain'}`}
                                                />
                                                {imagePreview && (
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
                                    {formErrors.branch_image && (
                                        <div className="text-red-500 text-sm">{formErrors.branch_image}</div>
                                    )}
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
                                    onClick={handleSubmit}
                                    style={{ backgroundColor: layout_color }} >
                                    Submit
                                </button>
                            </div>
                        </div>

                    </div >
                </div >

            </div >
        </>
    );
};

export default LayoutSettings;
