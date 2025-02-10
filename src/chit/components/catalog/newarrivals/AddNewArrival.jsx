import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Search } from 'lucide-react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { getallbranch, getBranchById, showtype, createnewarrivals, updatenewarrivals, newarrivalsbyid, } from "../../../api/Endpoints"
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux'

const AddNewArrival = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const roledata = localStorage.getItem('decoded');
  const id_branch = roledata?.branch;

  const id = useSelector((state) => state.clientForm.id);
  console.log("---", id)

  const [filtertype, setShowType] = useState([]);

  const [branchList, setBranchList] = useState([]);
  let [branch, setbranch] = useState("")
  const [new_arrivals_img_path, setNewarrivalsImgPath] = useState([]);
  const todaydate = new Date();
  const [expiry_date, setExpriyDate] = useState(todaydate);
  const [formData, setFormData] = useState({
    name: "",
    show_rate: "",
    new_arrivals_content: "",
    id_branch: id_branch,
    price: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    getallshowtype();

  }, []);

  useEffect(() => {
    if (id_branch === '0') {
      getallbranchmuate()
    }

    if (id_branch !== "0") {
      setFormData({ ...formData, id_branch: id_branch })
    }

  }, [id_branch]);


  //mutation to get newarrivals type
  const { mutate: getallshowtype } = useMutation({
    mutationFn: showtype,
    onSuccess: (response) => {
      setShowType(response.data);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //get branches
  const { mutate: branchbyId } = useMutation({
    mutationFn: getBranchById,
    onSuccess: (response) => {
      setbranch(response.data);
    },
    onError: (error) => {
      console.error("Error:", error);
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


  // input change handler
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


  //handle description image change
  const handleDescriptionImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Add the new files to the state
      setNewarrivalsImgPath((prevState) => [...prevState, ...Array.from(files)]);
    }

  };



  //handle wheel
  const handleWheel = (e) => {
    e.target.blur();
  };


  const handleExpriyDateChange = (date) => {


    const start = new Date(date);
    const day = String(start.getDate()).padStart(2, '0');
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const year = start.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    setExpriyDate(date);
    setFormData(prev => ({ ...prev, expiry_date: formattedDate }));
  }


  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.show_rate) errors.show_rate = "Type is required";
    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (!formData.name) errors.name = "Title is required";
    if (!formData.price) errors.name = "Price is required";
    if (!formData.new_arrivals_content) errors.new_arrivals_content = "Description is required";
    if (!formData.expiry_date) errors.expiry_date = "Expriy Date is required";
    if (new_arrivals_img_path.length === 0) errors.new_arrivals_img_path = "Upload image is required";
    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //mutation to create newarrivals
  const { mutate: createnewarrivalsMutate } = useMutation({
    mutationFn: createnewarrivals,
    onSuccess: (response) => {
      dispatch(setid(null));
      toast.success(response.message)
      navigate('/catalog/newarrivals')
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  //handle submit
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("show_rate", formData.show_rate);
    formDataToSend.append("new_arrivals_content", formData.new_arrivals_content);
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("expiry_date", formData.expiry_date);
    if (new_arrivals_img_path) formDataToSend.append("new_arrivals_img_path", new_arrivals_img_path);
    console.log("FormData", formData)
    createnewarrivalsMutate(formDataToSend);
  };



  const handleCancle = () => {
    dispatch(setid(null));
    navigate("/catalog/newarrivals");
  };

  //Edit form --------------------------

  //get newarrivals by id
  const { mutate: fetchnewarrivalsById } = useMutation({
    mutationFn: newarrivalsbyid,
    onSuccess: (response) => {
      setFormData(
        {
          id_branch: response.data.id_branch,
          description: response.data.description,
          name: response.data.name,
          images_Url: response.data.images_Url,
          price: response.data.price.$numberDecimal,
          expiry_date: response.data.expiry_date,
          show_rate: response.data.show_rate

        });
      // setIffersImage(`${response.data.pathUrl}/${response.data.desc_img}`);
      handletypeChange('type', response.data.show_rate);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //update newarrivals
  const { mutate: updateNewarrivalsmutate } = useMutation({
    mutationFn: updatenewarrivals,
    onSuccess: (response) => {
      toast.success(response.message);
      dispatch(setid(null));
      navigate("/catalog/newarrivals");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  useEffect(() => {
    if (id) {
      fetchnewarrivalsById({ id: id });
    }
  }, [id]);

  const handleUpdate = () => {
    if (!validateForm()) return;



    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("show_rate", formData.show_rate);
    formDataToSend.append("new_arrivals_content", formData.new_arrivals_content);
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("expiry_date", formData.expiry_date);
    if (new_arrivals_img_path) formDataToSend.append("new_arrivals_img_path", new_arrivals_img_path);
    updateNewarrivalsmutate({ id: formData._id, data: formDataToSend });
  };


  const handleRemoveDescriptionImage = (index) => {
    setNewarrivalsImgPath((prevState) => prevState.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit newarrivals
          </h2>
        ) : (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Create newarrivals
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">

          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            <div className="flex flex-col">
              {
                id_branch !== "0" && (
                  <div className="flex flex-col lg:mt-2">
                    <label className="text-black mb-1 font-medium">
                      Branch<span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="id_branch"
                        className={`appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${!id_branch !== "0" ? "cursor-not-allowed bg-gray-100" : ""
                          }`}

                        value={formData.id_branch || id_branch}
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
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Display Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="show_rate"
                  value={formData.show_rate}
                  onChange={handleInputChange}
                  className="appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"

                >
                  <option value="">--Select---</option>
                  {filtertype.map((type) => (
                    <option
                      name="type"
                      className="text-gray-700"
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
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
              {formErrors.show_rate && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.show_rate}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-gray-700 mb-2 font-medium">
                Title<span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
                onChange={handleInputChange}
              />
              {formErrors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.name}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Price <span className="text-red-400">*</span>
              </label>
              <input
                onChange={handleInputChange}
                value={formData.price}
                type="number"
                name="price"
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.price && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.price}
                </span>
              )}
            </div>


            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Description<span className="text-red-400">*</span>
              </label>
              <textarea
                name="new_arrivals_content"
                value={formData.new_arrivals_content}
                type="text"
                onChange={handleInputChange}
                className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter Here"
              />
              {formErrors.new_arrivals_content && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.new_arrivals_content}
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
                    htmlFor="new_arrivals_img_path"
                    className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                  >
                    {new_arrivals_img_path.length > 0
                      ? `${new_arrivals_img_path.length} file(s) selected`
                      : "Browse to find or drag image(s) here"}
                  </label>
                  <input
                    onChange={handleDescriptionImageChange}
                    className="hidden max-w-[190px]"
                    name="new_arrivals_img_path"
                    id="new_arrivals_img_path"
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files
                  />
                </div>

                {/* Display the selected images */}
                {new_arrivals_img_path.length > 0 && (
                  <div className="flex gap-4 flex-wrap">
                    {new_arrivals_img_path.map((file, index) => (
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
                              : URL.createObjectURL(file) // Use URL.createObjectURL to preview image
                          }
                          alt="Description image preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.new_arrivals_img_path && (
                <span className="text-red-500 text-sm mt-1">{formErrors.new_arrivals_img_path}</span>
              )}
            </div>




            <div className='flex flex-col'>
              <label className='text-gray-700 mb-1 font-normal'>Start Date<span className='text-red-400'>*</span></label>
              <div className="relative">
                <DatePicker
                  selected={formData.expiry_date}
                  onChange={handleExpriyDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  className="border-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  wrapperClassName="w-full"
                />
                <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-14 h-[43px] justify-center items-center flex rounded-r-md pointer-events-none">
                  <CalendarDays size={20} />
                </span>
              </div>
              {formErrors.expiry_date && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.expiry_date}
                </span>
              )}
            </div>

          </div>
          <hr className="absolute border-gray-300 mt-3 mb-3 right-0 top-[90%] md:top-[85%] lg:top-[84%] w-[100%]"></hr>
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

export default AddNewArrival;