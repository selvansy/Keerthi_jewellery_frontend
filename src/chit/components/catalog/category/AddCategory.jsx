import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import {
  getallbranch,
  categorybyid,
  getallmetal,
  createcategory,
  puritybymetal,
  updatecategory,
} from "../../../api/Endpoints";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";

const AddCategory = ({setIsOpen, id ,clearId}) => {
    const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const navigate = useNavigate();
  const roledata = useSelector((state) => state.clientForm.roledata);
  const branchAccess = roledata?.branch;

  const [metalType, setMetalType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [branches,setBranches]=useState([])
  const [formData, setFormData] = useState({
    category_name: "",
    id_metal: "",
    id_branch:"",
    description:null
  });

  useEffect(() => {
    
    if(id) getcategoryById(id)
      
    getMetalType();
  }, []);

  useEffect(()=>{
    if(branchAccess==0)getallbranchmuate()
  },[roledata])


  //mutation get all metal types
  const { mutate: getMetalType } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetalType(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

    useEffect(() => {
      return () => {
        clearId();
      };
    }, []);
  

  //mutation to create category
  const { mutate: createcategoryMutate } = useMutation({
    mutationFn: createcategory,
    onSuccess: (response) => {
      toast.success(response.message);
      setIsLoading(false);
      setIsOpen(false)
    },
    onError: (error) => {
      setIsLoading(false);
      
      toast.error(error.response.data.message);
    },
  });

  //update category mutation
  const { mutate: updatecategorymutate } = useMutation({
    
    mutationFn: updatecategory,
    onSuccess: (response) => {
      setIsLoading(false);  
      if(response.message=="Category already Existing"){
        toast.error(response.message);
        return
      }
      toast.success(response.message);
      setIsOpen(false)
      clearId()
    },
    onError: (error) => {
      setIsLoading(false);
      ;

      toast.error(error.response.data.message);
    },
  });


  // get all branches
  const { mutate: getallbranchmuate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranches(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  /// get category by id
  const { mutate: getcategoryById } = useMutation({
    mutationFn: categorybyid,
    onSuccess: (response) => {
      setFormData(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });


  // on change input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const validateForm = (categoryData) => {
    const errors = {};
    if (!categoryData.id_metal) errors.id_metal = "Metal is required";
    if (!categoryData.id_branch) errors.branch = "Branch is required";
    if (!categoryData.category_name)
      errors.category_name = "Category Name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  

  const handleSubmit = () => {
    setFormErrors({});
    
    let updatedFormData = { ...formData }; 
    
    if (branchAccess && branchAccess !=0) {
      updatedFormData.id_branch = branchAccess;
      setFormData(updatedFormData); 
    }
    
    if (!validateForm(updatedFormData)) {
      toast.error("Fill required fields");
      return;
    }
  
    setIsLoading(true);
  
    if (id) {
      const {  category_name, id_metal, id_branch,description } = formData;
      updatecategorymutate({id,category_name,id_metal,id_branch,description});
    } else {
      createcategoryMutate(updatedFormData); 
    }
  };
  
  

  const handleCancle = () => {
    setIsOpen(false);
    clearId()
  };

  return (
    <>
     
      <div className="w-full flex flex-col bg-[#F5F5F5]  mt-3 overflow-y-auto scrollbar-hide ">
        <div className="flex flex-col p-4 bg-white relative">
          <div className="grid grid-rows-1 md:grid-cols-1 gap-5 border-[#F2F2F9] mb-10">
            {branchAccess == "0" && (
              <div className="flex flex-col lg:mt-2">
                <label className="text-black mb-2 font-medium">
                  Branch<span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="id_branch"
                    className="appearance-none border-2 border-[#F2F2F9] rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    onChange={handleInputChange}
                    value={formData.id_branch}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {branches.map((branch) => (
                      <option
                        className="text-gray-700"
                        key={branch._id}
                        value={branch._id}
                      >
                        {branch.branch_name}
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
                {formErrors.branch && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.branch}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Metal type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="id_metal"
                  value={formData.id_metal}
                  onChange={handleInputChange}
                  className="appearance-none border-2 border-[#F2F2F9] rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">--Select---</option>
                  {metalType.map((type) => (
                    <option
                      name="type"
                      className="text-gray-700"
                      key={type.id_metal}
                      value={type._id}
                    >
                      {type.metal_name}
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
              {formErrors.id_metal && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.id_metal}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Category Name<span className="text-red-400">*</span>
              </label>
              <input
                name="category_name"
                type="text"
                value={formData.category_name}
                className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              {formErrors.category_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.category_name}
                </span>
              )}
            </div>

            
            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
              Description
              </label>
              <input
                name="description"
                type="text"
                value={formData.description}
                className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              
            </div>
          </div>

          <div className="bg-white ">
        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
            onClick={isLoading ? undefined : handleCancle}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className=" text-white rounded-md p-2 w-full lg:w-20"
            style={{ backgroundColor: layout_color }}
          >
            {isLoading ? <SpinLoading /> : id ? "Update" : "Save"}
          </button>
        </div>
      </div>

        
        </div>
      </div>
    </>
  );
};

export default AddCategory;
