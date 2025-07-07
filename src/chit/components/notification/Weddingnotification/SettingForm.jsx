import React, { useState, useEffect } from "react";
import { createweddingbirth, getallbranch, getweddingbirthbyid, getnotificationtype } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setSettingtype } from "../../../../redux/clientFormSlice"
import { toast } from 'react-toastify';



function SettingNotification({ setIsSettingOpen}) {
  
    const roledata = useSelector((state) => state.clientForm.roledata);
    const id_branch = roledata?.branch;
  
  const [formErrors, setFormErrors] = useState({});
  const [image, setImage] = useState([]);
  const [filtertype, settype] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    type: 4,
    image: "",
  })


  const [isLoading, setisLoading] = useState(false);

  let dispatch = useDispatch();
  const id = useSelector((state) => state.clientForm.settingtype);


  const { mutate: handleweddingbirthbyid } = useMutation({
    mutationFn: getweddingbirthbyid,
    onSuccess: (response) => {
      
      let image = response.data.pathurl+response.data.image;
  
      setFormData({
        id_branch: response.data.id_branch,
        description: response.data.description,
        image: image
      })
    }
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };



  // Validation function
  const validateForm = () => {
    const errors = {};



    if (!formData.description) errors.description = "Description is required";
    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (image.length === 0) errors.image = "Product Image is required";

    ;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImage((prevState) => [...prevState, ...Array.from(files)]);
    }

  };
  const handleRemoveImage = (index) => {
    setImage((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(setSettingtype(null))
    setIsSettingOpen(false)
  }


  const handleSubmit = () => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", 4);
    if (image) formDataToSend.append("image", image);

    createweddingbirthMutate(formDataToSend);
  };


  const { mutate: createweddingbirthMutate } = useMutation({
    mutationFn: createweddingbirth,
    onSuccess: (response) => {
      toast.success(response.message)
      dispatch(setSettingtype(null))
      setIsSettingOpen(false)
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  useEffect(() => { 
    handleweddingbirthbyid({ type: 4 })

    if (id_branch === "0") {
      getBranchList();
    }
  }, [])



  return (
    <div>

      <form className='flex w-full flex-col pl-8 pr-8 pb-4 bg-white space-y-4' onSubmit={handleSubmit}>
        {id_branch === "0" && (
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
            Upload Image<span className="text-red-400">*</span>
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="image"
                className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
              >
                {image.length > 0
                  ? `${image.length} file(s) selected`
                  : "Browse to find or drag image(s) here"}
              </label>
              <input
                onChange={handleImageChange}
                className="hidden max-w-[190px]"
                name="image"
                id="image"
                type="file"
                accept="image/*"
                multiple // Allow multiple files
              />
            </div>

              <div className="flex gap-4 flex-wrap">
           
                  <div
                    className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden relative"
                  >
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                      type="button"
                    >
                      ×
                    </button>
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : formData.image // Use URL.createObjectURL to preview image
                      }
                      alt="Description image preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
              </div>
     
          </div>
          {formErrors.image && (
            <span className="text-red-500 text-sm mt-1">{formErrors.image}</span>
          )}
        </div>

        <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
          <div className="flex justify-end gap-2 mt-3">

                <>
                  <button
                    className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    readOnly={isLoading}
                    className="bg-[#023453] text-white rounded-md p-2 w-full lg:w-20"

                  >
                    Submit
                  </button> 
                
                </>
              </div>
            </div>
          </form>
       

    </div>
  );
}

export default SettingNotification;
