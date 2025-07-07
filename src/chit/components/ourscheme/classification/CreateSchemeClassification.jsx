import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { X } from 'lucide-react'
import { getClassificationById,getBranchById,getallbranch, getbranchbyclient, updateSchemeClassification, createSchemeClassification, } from "../../../api/Endpoints"
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { setid } from "../../../../redux/clientFormSlice"
import profileplaceholder from "../../../../../src/assets/profileplaceholder.png"


const CreateSchemeClassificaton = () => {

  let dispatch = useDispatch();

  const {id} = useParams()

  let navigate = useNavigate();

  const roledata = useSelector((state) => state.clientForm.roledata);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;

  const [typeOfScheme, setTypeOfScheme] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [branch, setbranch] = useState("");

  const [formData, setFormData] = useState({
    classification_name: "",
    description: "",
    term_desc: "",
    id_branch: id_branch,
    typeofscheme: 1,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [logo, setLogo] = useState("Browse");
  const [logoPreview, setLogoPreview] = useState(null);

  
  const [desc_img, setdesc_image] = useState("Browse");
  const [descPreview, setdescPreview] = useState(null);

  
    useEffect(() => {
      if (id_branch === '0') {
        getallbranchmuate()
      }
      
      if(id_branch && formData.id_branch !== "" && id){
        branchbyId({id:id_branch})
      }
  
      if(id_branch !== "0"){
        setFormData({ ...formData, id_branch: id_branch })
      }
      
    }, [id_branch]);

    useEffect(() => {
      if (id) {
        fetchClassificationById(id);
      }
    }, [id]);
  
 
    // mutation functions
    const { mutate: getallbranchmuate } = useMutation({
      mutationFn: getallbranch,
      onSuccess: (response) => {
        setBranchList(response.data);
      },
      onError: (error) => {
        console.error("Error:", error);
      },
    });
  
    const { mutate: branchbyId } = useMutation({
      mutationFn: getBranchById,
      onSuccess: (response) => {
        setbranch(response.data);
      },
      onError: (error) => {
        console.error("Error:", error);
      },
    });



  // input change handler
  const handleInputChange = (e) => {
    let { name, value } = e.target;

    

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


 
  //handle branch change
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      id_branch: branchId,
    }));
  };

  
  //handle wheel
  const handleWheel = (e) => {
    e.target.blur();
  };


  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.classification_name)
      errors.classification_name = "Classification name is required";

    if (!formData.description) errors.description = "Description is required";
    if (!formData.term_desc)
      errors.term_desc = "Terms & conditions is required";
    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (!logo) errors.main_image = "Main image is required";
    if (!desc_img)
      errors.desc_img = "Description image is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //mutation to create scheme classification
  const { mutate: createSchemeClassificationMutate } = useMutation({
    mutationFn: createSchemeClassification,
    onSuccess: (response) => {
      toast.success(response.message)
      setFormData({
        classification_name: "",
        description: "",
        term_desc: "",
        id_branch: id_branch,
        typeofscheme: 1,
      });
      handleRemoveLogo()
      handleRemoveDescriptionImage();
      navigate('/ourscheme/classification')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  //handle submit
  const handleSubmit = () => {
   
    if (!validateForm()) {
      toast.error("Fill required fields")
      return;
    }
    
    const formDataToSend = new FormData();

    formDataToSend.append("classification_name", formData.classification_name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("term_desc", formData.term_desc);
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("typeofscheme", formData.typeofscheme);


    if (logo) formDataToSend.append("logo", logo);
    if (desc_img) formDataToSend.append("desc_img", desc_img);

    
    createSchemeClassificationMutate(formDataToSend);


  };

  
    const handleNavigation = () => {
      setActiveDropdown(null);
      dispatch(openModal({
        modalType: 'CONFIRMATION',
        header: 'Delete Scheme',
        formData: {
          message: 'Are you sure you want to navigate to ',
        },
        buttons: {
          cancel: {
            text: 'Cancel'
          },
          submit: {
            text: 'Delete'
          }
        }
      }));
  
  
    };


  const handleCancle = () => {
    navigate("/ourscheme/classification");
  };

  //Edit form --------------------------

  //get classification by id
  const { mutate: fetchClassificationById } = useMutation({
    mutationFn: getClassificationById,
    onSuccess: (response) => {
      
      setFormData({
          classification_name: response.data.classification_name,
          description: response.data.description,
          term_desc: response.data.term_desc,
          id_branch: response.data.id_branch,
          typeofscheme: response.data.typeofscheme,
      });
      setLogoPreview(`${response.data.pathUrl}${response.data.logo}`)
      setLogo(response.data.logo);
      setdesc_image(response.data.desc_img);
      setdescPreview(`${response.data.pathUrl}${response.data.desc_img}`)
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });


  //update classification
  const { mutate: updateClassification } = useMutation({
    mutationFn: updateSchemeClassification,
    onSuccess: (response) => {
      toast.success(response.message);
      handleRemoveLogo()
      handleRemoveDescriptionImage();
      dispatch(setid(null))
      navigate('/ourscheme/classification')
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

 

  const handleUpdate = () => {

    if (!validateForm()) {
      toast.error("Fill required fields")
      return;
    }


    const formDataToSend = new FormData();
    if (formData.classification_name) 
      formDataToSend.append("classification_name", formData.classification_name);
   
    if (formData.description) 
      formDataToSend.append("description", formData.description);
    if (formData.term_desc) 
      formDataToSend.append("term_desc", formData.term_desc);
    if (formData.id_branch) 
      formDataToSend.append("id_branch", formData.id_branch);
    if (formData.typeofscheme) 
      formDataToSend.append("typeofscheme", formData.typeofscheme);
  
    // Handle File Uploads
    if (logo instanceof File) {
      formDataToSend.append("logo", logo);
    }
    if (desc_img instanceof File) {
      formDataToSend.append("desc_img", desc_img);
    }
  
    
    updateClassification({ id: id, data:formDataToSend });

  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null)
    const input = document.getElementById("main_image");
    if (input) input.value = "";
  };

  const handleRemoveDescriptionImage = () => {
    setdesc_image(null);
    setdescPreview(null)
    const input = document.getElementById("desc_img");
    if (input) input.value = "";
  };


  const handleFileChange = (e) => {
   
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setdesc_image(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setdescPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-gray-900 font-bold justify-between">
            Edit Scheme Classification
          </h2>
        ) : (
          <h2 className="text-2xl text-gray-900 font-bold justify-between">
            Create Scheme Classification
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Classificaton Name<span className="text-red-400">*</span>
              </label>
              <input
                name="classification_name"
                type="text"
                value={formData.classification_name}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              {formErrors.classification_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.classification_name}
                </span>
              )}
            </div>

             {
              id_branch === "0" && (
                <>
                <div className="flex flex-col">
                <label className="text-gray-700 mb-2 mt-2 font-medium">
                  Branch<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_branch"
                    value={formData.id_branch}
                    onChange={handleBranchChange}
                    className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="" readOnly>
                      Select a branch
                    </option>
                    {branchList.map((type) => (
                      <option
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
                </>
                
              )}

          

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Description<span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                type="text"
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.description}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Terms & Conditions<span className="text-red-400">*</span>
              </label>
              <textarea
                name="term_desc"
                type="text"
                value={formData.term_desc}
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.term_desc && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.term_desc}
                </span>
              )}
            </div>

            <div className='flex flex-col'>
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Upload Main Image<span className="text-red-400"> *</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="main_image"
                    className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                  >
                    <p className='text-gray-900 truncate'>
                      {logo ? logo.name : logo}
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
                      src={logoPreview ? logoPreview : profileplaceholder}
                      alt="image preview"
                      className={`w-full h-full ${logoPreview ? 'object-cover' : 'object-contain'}`}
                    />
                    {logoPreview && (
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                </div>

              </div>
              {formErrors.logo && (
                <div className="text-red-500 text-sm">{formErrors.logo}</div>
              )}
            </div>


            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Upload Description Image<span className="text-red-400">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="desc_img"
                    className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                  >
                    <p className='text-gray-900 truncate'>
                      {desc_img ? desc_img.name : desc_img}
                    </p>
                  </label>
                  <input
                    onChange={handleFileChange1}
                    className="hidden max-w-[190px]"
                    name="desc_img"
                    id="desc_img"
                    type="file"
                    accept="image/*"
                  />
                </div>
                <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden relative">
                  <img
                    src={descPreview ? descPreview : profileplaceholder}
                    alt="image preview"
                    className={`w-full h-full ${descPreview ? 'object-cover' : 'object-contain'}`}
                  />
                  {descPreview && (
                    <button
                      onClick={handleRemoveDescriptionImage}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

              </div>
              {formErrors.desc_img && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.desc_img}
                </span>
              )}
            </div>

          

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
                onClick={id ? handleUpdate : handleSubmit}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSchemeClassificaton;