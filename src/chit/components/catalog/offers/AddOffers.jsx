import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  getallbranch,
  getBranchById,
  allofferstype,
  updateoffers,
  createoffers,
  offersbyid,
} from "../../../api/Endpoints";
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const AddOffers = () => {
  const roledata = useSelector((state) => state.clientForm.roledata);
  let id_client = roledata?.id_client;

  const id_branch = roledata?.branch;
  const {id} = useParams()
  console.log(id);

  let dispatch = useDispatch();

  const navigate = useNavigate();

  const [filtertype, setOfferstype] = useState([]);

  const [offer_img_path, setOfferImgPath] = useState([]);
  const [displayname, setDispname] = useState(true);
  const [displayvideo, setDispvideo] = useState(true);
  const [displaycontent, setDispcontent] = useState(true);
  const [displayimage, setDispimage] = useState(true);
  const [branchList, setBranchList] = useState([]);
  let [branch, setbranch] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    id_branch: id_branch,
    video: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchoffersById(id);
    }
  }, [id]);

  useEffect(() => {
    if (id_branch === "0") {
      getallbranchmuate();
    } else {
      branchbyId(id_branch);
    }

    if (id_branch !== "0") {
      setFormData({ ...formData, id_branch: id_branch });
    }
  }, [id_branch]);

  //mutation to get offers type
  const { mutate: getallofferstype } = useMutation({
    mutationFn: allofferstype,
    onSuccess: (response) => {
      setOfferstype(response.data);
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    handletypeChange(name, value);
  };

  const handletypeChange = (name, value) => {
    if (name === "type") {
      console.log(value);
      if (parseInt(value) === 0) {
        setDispname(true);
        setDispvideo(false);
        setDispcontent(true);
        setDispimage(true);
      } else if (parseInt(value) === 1) {
        setDispname(false);
        setDispvideo(false);
        setDispcontent(false);
        setDispimage(true);
      } else if (parseInt(value) === 2) {
        setDispname(false);
        setDispvideo(false);
        setDispcontent(false);
        setDispimage(true);
      } else if (parseInt(value) === 3) {
        setDispname(false);
        setDispvideo(false);
        setDispcontent(true);
        setDispimage(false);
      } else if (parseInt(value) === 4) {
        setDispname(false);
        setDispvideo(true);
        setDispcontent(false);
        setDispimage(false);
      }
    }
  };


  const MAX_IMAGES = 1;

const handleDescriptionImageChange = (e) => {
  const files = Array.from(e.target.files);

  if (offer_img_path.length >= MAX_IMAGES) {
    return toast.error(`Maximum ${MAX_IMAGES} images allowed`);
  }

  if (files.length > 0) {
    const existingImages = offer_img_path.filter(
      (img) => typeof img === "string"
    );
    let totalImages = existingImages.length;

    const validFiles = [];

    for (const file of files) {
      // Allowed image formats
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedFormats.includes(file.type)) {
        toast.error("Invalid image format. Only JPEG, PNG, and WEBP are allowed.");
        continue;
      }

      if (totalImages >= MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        e.target.value = "";
        return;
      }

      if (file.size > 500 * 1024) {
        toast.error(`${file.name} exceeds the 500 KB limit`);
      } else {
        validFiles.push(file);
        totalImages++;
      }
    }

    if (validFiles.length > 0) {
      setOfferImgPath((prevState) => [...prevState, ...validFiles]);
    }
  }

  e.target.value = "";
};

const handleRemoveOfferImage = (index) => {
  setOfferImgPath((prevState) => prevState.filter((_, i) => i !== index));
};


  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.type) errors.type = "Type is required";
    if (!formData.id_branch) errors.id_branch = "Branch is required";
    if (parseInt(formData.type) === 0) {
      if (!formData.name) errors.name = "Title is required";
      if (!formData.offer_content)
        errors.offer_content = "Description is required";
      if (!formData.id_branch) errors.id_branch = "Branch is required";
      if (offer_img_path.length === 0)
        errors.offer_img_path = "Upload image is required";
    } else if (parseInt(formData.type) === 1) {
      if (offer_img_path.length === 0)
        errors.offer_img_path = "Upload image is required";
    } else if (parseInt(formData.type) === 2) {
      if (offer_img_path.length === 0)
        errors.offer_img_path = "Upload image is required";
    } else if (parseInt(formData.type) === 3) {
      if (!formData.offer_content)
        errors.offer_content = "Description is required";
    } else if (parseInt(formData.type) === 4) {
      if (formData.video.length === 0) errors.video = "Video is required";
    } else {
      if (!formData.name) errors.name = "Title is required";
      if (!formData.offer_content)
        errors.offer_content = "Description is required";
      if (!formData.id_branch) errors.id_branch = "Branch is required";
      if (offer_img_path.length === 0)
        errors.offer_img_path = "Upload image is required";
      if (formData.video.length === 0) errors.video = "Video is required";
    }

    console.log(errors);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //mutation to create Offers
  const { mutate: createoffersMutate } = useMutation({
    mutationFn: createoffers,
    onSuccess: (response) => {
      toast.success(response.message);
      dispatch(setid(null));
      navigate("/catalog/offers");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  //handle submit
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    

    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("description", formData.offer_content);
    formDataToSend.append("id_branch", formData.id_branch);
      if(formData.type=="4"){
        formDataToSend.append("video", formData.video); 
      }
    if (offer_img_path && offer_img_path.length > 0) {
      offer_img_path.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append("offer_image", image);  
        } else if (typeof image === "string") {
          formDataToSend.append("offer_image", image);
        }
      });
      setOfferImgPath([])
    }
    createoffersMutate(formDataToSend);
};

  useEffect(() => {
    getallofferstype();
  }, []);

  const handleCancle = () => {
    dispatch(setid(null));
    navigate("/catalog/offers");
  };

  //Edit form --------------------------

  //get offers by id
  const { mutate: fetchoffersById } = useMutation({
    mutationFn: offersbyid,
    onSuccess: (response) => {
      console.log(response);
      
      setFormData(response.data);
      console.log(formData.description);
      
      // setIOffersImage(`${response.data.pathUrl}/${response.data.desc_img}`);
      handletypeChange("type", response.data.type);
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  //update offers
  const { mutate: updateoffermutate } = useMutation({
    mutationFn: updateoffers,
    onSuccess: (response) => {
      dispatch(setid(null));
      toast.success(response.message);
      navigate("/catalog/offers");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleUpdate = () => {
    if (!validateForm()) return;
    console.log("heeeeelllllo")
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("description", formData.offer_content);
    formDataToSend.append("id_branch", formData.id_branch);
    formDataToSend.append("video", formData.video);
    if(formData.description){
      console.log(formData.description)      
      formDataToSend.append('description',formData.description)
    }
    if (offer_img_path && offer_img_path.length > 0) {
      offer_img_path.forEach((image, index) => {
        if (image instanceof File) {
          formDataToSend.append("offer_image", image);  
        } else if (typeof image === "string") {
          formDataToSend.append("offer_image", image);
        }
      });
      setOfferImgPath([])
    }
        updateoffermutate({ id: formData._id, data: formDataToSend });
  };

  const handleRemoveDescriptionImage = (index) => {
    setOfferImgPath((prevState) => prevState.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        {id ? (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Edit Offers
          </h2>
        ) : (
          <h2 className="text-2xl text-[#023453] font-bold justify-between">
            Create Offers
          </h2>
        )}
      </div>
      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            <div className="flex flex-col">
              {id_branch === "0" && (
                <div className="flex flex-col lg:mt-2">
                  <label className="text-black mb-1 font-medium">
                    Branch<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="id_branch"
                      className={`appearance-none border-2 border-gray-300 rounded-md p-3 w-full bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-700 ${
                        !id_branch !== "0"
                          ? "cursor-not-allowed bg-gray-100"
                          : ""
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
          </div>

          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-2 font-medium">
                Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
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
              {formErrors.type && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.type}
                </span>
              )}
            </div>
            {displayname === true && (
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
            )}

            {displayvideo === true && (
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 mt-2 font-medium">
                  Youtube video(Player Id){" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleInputChange}
                  value={formData.video}
                  type="text"
                  name="video"
                  className="border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter Here"
                />
                {formErrors.type && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.type}
                  </span>
                )}
              </div>
            )}

            {displayimage === true && (
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 mt-2 font-medium">
                  Upload Image<span className="text-red-400">*</span>
                </label>
                <div className="flex gap-4">
                {offer_img_path.length < MAX_IMAGES && (
                  <div className="flex-1">
                    <label
                      htmlFor="offer_img_path"
                      className="flex flex-col justify-center items-center w-full h-20 border-2 border-dashed border-gray-300 text-gray-700 cursor-pointer p-5 text-center"
                    >
                      {offer_img_path.length > 0
                        ? `${offer_img_path.length} file(s) selected`
                        : "Browse to find or drag image(s) here"}
                    </label>
                    <input
                      onChange={handleDescriptionImageChange}
                      className="hidden max-w-[190px]"
                      name="offer_img_path"
                      id="offer_img_path"
                      type="file"
                      accept="image/*"
                      multiple
                    />
                  </div>
                )}

                  {offer_img_path.length > 0 && (
                    <div className="flex gap-4 flex-wrap">
                      {offer_img_path.map((file, index) => (
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
                {formErrors.offer_img_path && (
                  <span className="text-red-500 text-sm mt-1">
                    {formErrors.offer_img_path}
                  </span>
                )}
              </div>
            )}

            {displaycontent === true && (
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
            )}
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

export default AddOffers;
