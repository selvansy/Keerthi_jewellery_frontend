import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {setid} from "../../../../redux/clientFormSlice";
import {getallbranch,categorybyid, getallmetal, createcategory, puritybymetal,
  updatecategory,
} from "../../../api/Endpoints"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
const AddCategory = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const id = useSelector((state) => state.clientForm.id);
  console.log(id)

  const [filtermetaltype, setMetaltype] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [new_arrivals_img_path, setcategoryImgPath] = useState([]);
  let [purityId, setPurityId] = useState("");
  let [branch, setbranch] = useState("")
  let [branchData, setBranchData] = useState([]);



  const [formData, setFormData] = useState({
    category_name: "",
    id_metal: "",
    id_branch: id_branch
  });
  const [formErrors, setFormErrors] = useState({});



  useEffect(() => {
    if (id_branch === '0') {
      getallbranchmuate();
    } 
    if (id_branch !== "0") {
      setFormData({ ...formData, id_branch: id_branch })
    }

  }, [id_branch]);


  //mutation to get purity type
  const { mutate: getMetalData } = useMutation({
    mutationFn: getallmetal,
    onSuccess: (response) => {
      setMetaltype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  const { mutate: getallbranchmuate } = useMutation({
    mutationFn: getallbranch,
    onSuccess: (response) => {
      setBranchList(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });


  //mutation to get purity type
  const { mutate: getallpurity } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => {
      setPuritytype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });


  // input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if(name === "id_metal"){
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
  
    }
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));


  };


  //handle description image change
  const handleDescriptionImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Add the new files to the state
      setcategoryImgPath((prevState) => [...prevState, ...Array.from(files)]);
    }

  };


  //handle wheel
  const handleWheel = (e) => {
    e.target.blur();
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.id_metal) errors.id_metal = "Metal is required";
    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (!formData.category_name) errors.category_name = "Category Name is required";

    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //mutation to create category
  const { mutate: createcategoryMutate } = useMutation({
    mutationFn: createcategory,
    onSuccess: (response) => {
     dispatch(setid(null));
      toast.success(response.message)
      navigate('/catalog/category')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  //handle submit
  const handleSubmit = () => {
    console.log("formData", formData)
    if (!validateForm(formData)) {
      toast.error("Fill required fields")
      return;
    }

    const formDataToSend = {
      category_name: formData.category_name,
      id_metal: formData.id_metal,

      id_branch: formData.id_branch
    };
    console.log("FormDataTobeSend", formDataToSend)
    createcategoryMutate(formDataToSend);
  };


  useEffect(() => {
    getMetalData();

    if (id) {
      fetchcategoryById(id)
      getPurity(purityId);
    }

  }, []);

  useEffect(() => {
    if (id) {
      fetchcategoryById({ id: id });
    }
  }, [id]);

  const handleCancle = () => {
    dispatch(setid(null));
    navigate("/catalog/category");
  };

  //Edit form --------------------------

  //get category by id
  const { mutate: fetchcategoryById } = useMutation({
    mutationFn: categorybyid,
    onSuccess: (response) => {
      setFormData(response.data);
      // setIffersImage(`${response.data.pathUrl}/${response.data.desc_img}`);
      handletypeChange('type', response.data.id_metal);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //update category
  const { mutate: updatecategorymutate } = useMutation({
    mutationFn: updatecategory,
    onSuccess: (response) => {
      dispatch(setid(null));
      toast.success(response.message);
      navigate("/catalog/category");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: getPurity } = useMutation({
    mutationFn: puritybymetal,
    onSuccess: (response) => {
      console.log("filterpurity", response.data)
      setPuritytype(response.data);
    },
    onError: (error) => {
      console.error("Error fetching purity types:", error);
      setPuritytype([]);
    },
  });



  const handleUpdate = () => {
    if (!validateForm(formData)) return;
    const formDataToSend = new FormData();
    formDataToSend.append("category_name", formData.category_name);
    formDataToSend.append("id_metal", formData.id_metal);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("id_branch", formData.id_branch);
    updatecategorymutate({ id: formData._id, data: formDataToSend });
  };


  const handleRemoveDescriptionImage = (index) => {
    setcategoryImgPath((prevState) => prevState.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit Category
          </h2>
        ) : (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Create Category
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">

          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            { id_branch === "0" && (
          
                  <div className="flex flex-col lg:mt-2">
                    <label className="text-black mb-2 font-medium">
                      Branch<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                    <select
                    name="id_branch"
                    className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"

                    onChange={handleInputChange}
                    value={formData.id_branch}
                  >
                    <option value="" className="text-gray-700">
                      --Select--
                    </option>
                    {branchList.map((branch) => (
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
                  className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"

                >
                  <option value="">--Select---</option>
                  {filtermetaltype.map((type) => (
                    <option
                      name="type"
                      className="text-gray-700"
                      key={type.id_metal}
                      value={type.id_metal}
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
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              {formErrors.category_name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.category_name}
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

export default AddCategory;