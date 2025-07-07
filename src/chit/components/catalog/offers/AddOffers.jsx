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
  getAllBranch,
  getbranchbyid,
} from "../../../api/Endpoints";
import { setid } from "../../../../redux/clientFormSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity";
import { title } from "framer-motion/client";
import SpinLoading from "../../common/spinLoading";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import { customStyles } from "../../ourscheme/scheme/AddScheme";

const AddOffers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const [offersType, setOfferstype] = useState([]);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState();
  const MAX_IMAGES = 1;
  const [offer_img_path, setOfferImgPath] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id_branch: "",
    type: "",
    title: "",
    description: "",
    videoId: "",
  });

  useEffect(() => {
    getallofferstype();
  }, []);

  useEffect(() => {
    if (!roleData) return;
    if (accessBranch !== "0") {
      getBranchData({ id: accessBranch });
    } else if (accessBranch == "0") {
      getAllBranches();
    }
  }, [roleData]);

  useEffect(() => {
    if (id) {
      fetchoffersById(id);
    }
  }, [id]);

  const { mutate: getBranchData } = useMutation({
    mutationFn: (data) => getbranchbyid(data),
    onSuccess: (response) => {
      const { data } = response;
      setBranch({
        _id: data._id,
        branch_name: data.branch_name,
      });
      setFormData((prev) => ({
        ...prev,
        id_branch: data._id,
      }));
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  const { mutate: getAllBranches } = useMutation({
    mutationFn: () => getAllBranch(),
    onSuccess: (response) => {
      setBranch(
        response.data.map((branch) => ({
          value: branch._id,
          label: branch.branch_name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching branches:", error);
    },
  });

  const { mutate: fetchoffersById } = useMutation({
    mutationFn: offersbyid,
    onSuccess: (response) => {
      setFormData(response.data);
      const {data}=response
      
      // setIOffersImage(`${response.data.pathUrl}/${response.data.desc_img}`);
      if (data.offer_image && data.offer_image.length > 0 && data.pathurl) {
        const fullImageUrl = `${data.pathurl}${data.offer_image[0]}`;
        
        // setSelectedImage(data.offer_image[0]);
        setImagePreviews((prev) => [
          ...prev,
          fullImageUrl
        ]);
        
      }

    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  const { mutate: getallofferstype } = useMutation({
    mutationFn: allofferstype,
    onSuccess: (response) => {
      setOfferstype(
        response.data.map((offerType) => ({
          value: offerType.id,
          label: offerType.name,
        }))
      );
    },
    onError: (error) => {
      console.error("Error fetching countries:", error);
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (offer_img_path.length == 3) {
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
          toast.error(
            "Invalid image format. Only JPEG, PNG, and WEBP are allowed."
          );
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
          totalImages++; // Increment count only when adding a valid image
        }
      }
      if (validFiles.length >= 0) {
        setOfferImgPath((prevState) => [...prevState, ...validFiles]);
      }
    }

    e.target.value = "";
  };

  useEffect(() => {
    const newPreviews = offer_img_path.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [offer_img_path]);

  const handleRemoveImage = (index) => {
    const updatedImages = offer_img_path.filter((_, i) => i !== index);
    setOfferImgPath(updatedImages);
  };

  const validateForm = () => {
    const newErrors = {};

    // Branch validation
    if (!formData.id_branch) {
      newErrors.id_branch = "Branch is required";
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    // Validation based on type
    switch (formData.type) {
      case "Offers":
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.description)
          newErrors.description = "Description is required";
        if (offer_img_path.length === 0) newErrors.image = "Image is required";
        break;
      case "Banner":
        if (offer_img_path.length === 0) newErrors.image = "Image is required";
        break;
      case "Popup":
        if (offer_img_path.length === 0) newErrors.image = "Image is required";
        break;
      case "Marquee":
        if (!formData.description)
          newErrors.description = "Description is required";
        break;
      case "Video":
        if (!formData.videoId) newErrors.videoId = "Video ID is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    try {
      if (validateForm()) {
        setLoading(true);
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            key !== "_id" &&
            key !== "active" &&
            key !== "offer_image" &&
            key !== "pathurl"
          ) {
            formDataToSend.append(key, value);
          }
        });
        
        if (offer_img_path && offer_img_path.length > 0) {
          offer_img_path.forEach((image) => {
            if (image instanceof File || typeof image === "string") {
              formDataToSend.append("offer_image", image);
            }
          });
          
        }

        if (id) {
          updateoffermutate({ formDataToSend, id });
        } else {
          createoffersMutate(formDataToSend);
        }
        
      }
    } catch (err) {
      ;
    }
  };

  const { mutate: createoffersMutate } = useMutation({
    mutationFn: createoffers,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/catalog/offers");
      setLoading(false);
      setOfferImgPath([]);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      setLoading(false);
    },
  });

  const { mutate: updateoffermutate } = useMutation({
    mutationFn: ({ formDataToSend, id }) => updateoffers(formDataToSend, id),
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/catalog/offers");
      setLoading(false);
      setOfferImgPath([]);
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
    },
  });

  return (
    <>
      
      <Breadcrumb items={[
            {label:"Catelogue"},
            {label:"Offers",active:true}
          ]}/>
      <div className="w-full flex flex-col bg-white mt-3 overflow-y-auto scrollbar-hide rounded-[16px] px-4 border border-[#F2F2F9] min-h-[400px]">
        
        <div className="flex flex-col p-4 bg-white relative">
          <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-[#023453] font-bold">
          {id ? "Edit Offers" : "Create Offers"}
        </h2>
      </div>
          <div className="grid grid-rows-2 md:grid-cols-3 gap-5 border-gray-300 mb-5 mt-2">
            {/* Branch Selection */}
            {accessBranch === "0" ? (
              <div>
                <label className="block text-sm font-medium mb-1 mt-5">
                  Branches <span className="text-red-500">*</span>
                </label>
                <Select
                  styles={customStyles(true)}
                  options={Array.isArray(branch) ? branch : []}
                  placeholder="Select Branch"
                  value={
                    Array.isArray(branch)
                      ? branch.find(
                          (option) => option.value === formData.id_branch
                        ) || null
                      : null
                  }
                  onChange={(option) => {
                    setFormData((prev) => ({
                      ...prev,
                      id_branch: option.value,
                    }));
                    // Clear branch error when selected
                    setErrors((prev) => ({ ...prev, id_branch: "" }));
                  }}
                />
                {errors.id_branch && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.id_branch}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-500 font-medium mb-1 mt-5">
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={branch?.branch_name || ""}
                  className="w-full border rounded-md px-3 py-2 text-gray-500"
                />
              </div>
            )}

            {/* Type Selection */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2 mt-3  font-medium">
                Type<span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Select
                  options={offersType}
                  className="z-30"
                  styles={customStyles(true)}
                  placeholder="Select Type"
                  onChange={(data) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: data.label,
                     
                    }));
                    
                    // setImagePreviews([]);
                    // Clear type error
                    setErrors((prev) => ({ ...prev, type: "" }));
                  }}
                  value={offersType.find((p) => p.label === formData.type)}
                />
                {errors.type && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.type}
                  </span>
                )}
              </div>
            </div>

            {/* Conditional Rendering Based on Type */}
            {formData.type === "Offers" && (
              <>
                <div className="flex flex-col mt-3">
                  <label className="text-gray-700 mb-2 font-medium">
                    Title<span className="text-red-400">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"

                    placeholder="Enter Title"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.title}
                    </span>
                  )}
                </div>

                <div className="flex flex-col mt-3">
                  <label className="text-gray-700 mb-2 font-medium">
                    Description<span className="text-red-400">*</span>
                  </label>
                  <input
                    name="description"
                    type="text"
                    value={formData.description}
                    className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"

                    placeholder="Enter Description"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  {errors.description && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </span>
                  )}
                </div>
              </>
            )}

            {formData.type === "Marqueee" && (
              <div className="flex flex-col mt-2 col-span-2 max-w-[50%]">
                <label className="text-gray-700 mb-2 font-medium">
                  Description<span className="text-red-400">*</span>
                </label>
                <input
                  name="description"
                  type="text"
                  value={formData.description}
                  className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"

                  placeholder="Enter Description"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                {errors.description && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </span>
                )}
              </div>
            )}

            {formData.type === "Video" && (
              <div className="flex flex-col mt-2 col-span-2 max-w-[50%]">
                <label className="text-gray-700 mb-2 font-medium">
                  Video ID<span className="text-red-400">*</span>
                </label>
                <input
                  name="videoId"
                  type="text"
                  value={formData.videoId}
                  className="border-2 border-[#F2F2F9] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent h-[42px]"

                  placeholder="Enter Video ID"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      videoId: e.target.value,
                    }))
                  }
                />
                {errors.videoId && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.videoId}
                  </span>
                )}
              </div>
            )}

            {/* Image Upload for Applicable Types */}
            {["Offers", "Banner", "Popup"].includes(formData.type) && (
              <div className="flex flex-col mt-3 w-full">
              <label className="text-gray-700 mb-2 font-medium">
                Upload Image<span className="text-red-400">*</span>{" "}
                <span className="text-sm font-normal">
                  (File size must be at least 500KB)
                </span>
              </label>
            
              <div className="flex gap-4 items-start">
                {/* File input box */}
                
                <div className="flex rounded-[8px] items-center border-2 border-[#F2F2F9] bg-white  h-[44px] overflow-hidden relative w-full max-w-xs">
                  
                    <input
                      onChange={handleImageChange}
                      className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
                      name="offer_img_path"
                      id="offer_img_path"
                      type="file"
                      accept="image/*"
                      disabled={offer_img_path.length >=1}
                      multiple
                    />
               
                    <div className="px-3 text-sm text-gray-500 w-full">
                      {offer_img_path.length > 0
                        ? `${offer_img_path.length} file(s) selected`
                        : "Browse"}
                    </div>
            
                    <label
                      htmlFor="offer_img_path"
                      className="bg-[#004181] h-full px-4 rounded-[8px] text-white text-sm flex items-center justify-center cursor-pointer whitespace-nowrap"
                    >
                      Choose File
                    </label>
                  </div>
               
            
                {/* Multiple image previews */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 border border-[#F2F2F9] rounded-md overflow-hidden relative shrink-0"
                      >
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs rounded-full hover:bg-red-600 "
                          type="button"
                        >
                          ×
                        </button>
                        <img
                          src={
                            preview
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            
              {errors.offer_img_path && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.offer_img_path}
                </span>
              )}
            </div>
            
            )}
          </div>

          {/* Submit/Update Button */}
          <div className="bg-white">
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#E2E8F0] text-black rounded-md p-3 w-full lg:w-20"
                type="button"
                disabled={loading}
                onClick={() => navigate("/catalog/offers")}
              >
                Cancel
              </button>
              <button
                className="bg-[#004181] text-white rounded-md p-2 w-full lg:w-20"
                type="button"
                disabled={loading}
                onClick={handleFormSubmit}
              >
                {loading ? <SpinLoading /> : id ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOffers;
