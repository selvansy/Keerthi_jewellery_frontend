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
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { customSelectStyles } from "../../Setup/purity";
import { title } from "framer-motion/client";
import SpinLoading from "../../common/spinLoading";

const AddOffers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleData = useSelector((state) => state.clientForm.roledata);
  const accessBranch = roleData?.branch;
  const [offersType, setOfferstype] = useState([]);
  const [branch, setBranch] = useState(() => (accessBranch === "0" ? [] : {}));
  const [imagePreviews, setImagePreviews] = useState([]);
  const [offer_img_path, setOfferImgPath] = useState([]);
  const [loading, setLoading] = useState();
  const MAX_IMAGES = 1;
  const [product_image, setproductImgPath] = useState([]);
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

      // setIOffersImage(`${response.data.pathUrl}/${response.data.desc_img}`);
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
    if (product_image.length == 3) {
      return toast.error(`Maximum ${MAX_IMAGES} images allowed`);
    }
    if (files.length > 0) {
      const existingImages = product_image.filter(
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

      if (validFiles.length > 0) {
        setproductImgPath((prevState) => [...prevState, ...validFiles]);
      }
    }

    e.target.value = "";
  };

  useEffect(() => {
    const newPreviews = product_image.map((img) =>
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
  }, [product_image]);

  const handleRemoveImage = (index) => {
    const updatedImages = product_image.filter((_, i) => i !== index);
    setproductImgPath(updatedImages);
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
        if (product_image.length === 0) newErrors.image = "Image is required";
        break;
      case "Banner":
        if (product_image.length === 0) newErrors.image = "Image is required";
        break;
      case "Popup":
        if (product_image.length === 0) newErrors.image = "Image is required";
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
          setOfferImgPath([]);
        }

        if (id) {
          updateoffermutate({ formDataToSend, id });
        } else {
          createoffersMutate(formDataToSend);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { mutate: createoffersMutate } = useMutation({
    mutationFn: createoffers,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/catalog/offers");
      setLoading(false);
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
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.response.data.message);
    },
  });

  return (
    <>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-[#023453] font-bold">
          {id ? "Edit Offers" : "Create Offers"}
        </h2>
      </div>

      <div className="w-full flex flex-col bg-[#F5F5F5] border-t-2 border-[#023453] mt-3 overflow-y-auto scrollbar-hide h-[calc(100vh-200px)]">
        <div className="flex flex-col p-4 bg-white relative">
          <div className="grid grid-rows-2 md:grid-cols-2 gap-5 border-gray-300 mb-10">
            {/* Branch Selection */}
            {accessBranch === "0" ? (
              <div>
                <label className="block text-sm font-medium mb-1 mt-5">
                  Branches <span className="text-red-500">*</span>
                </label>
                <Select
                  styles={customSelectStyles}
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
                  styles={customSelectStyles}
                  placeholder="Select Type"
                  onChange={(data) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: data.label,
                     
                    }));
                    // Reset image
                    setImagePreviews([]);
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
                <div className="flex flex-col mt-2">
                  <label className="text-gray-700 mb-2 font-medium">
                    Title<span className="text-red-400">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    className={`border-2 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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

                <div className="flex flex-col mt-2">
                  <label className="text-gray-700 mb-2 font-medium">
                    Description<span className="text-red-400">*</span>
                  </label>
                  <input
                    name="description"
                    type="text"
                    value={formData.description}
                    className={`border-2 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                  className={`border-2 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                  className={`border-2 ${
                    errors.videoId ? "border-red-500" : "border-gray-300"
                  } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
              <div className="flex flex-col col-span-2">
                <label className="text-gray-700 mb-2 mt-2 font-medium">
                  Upload Image<span className="text-red-400">*</span>
                </label>
                <div className="gap-4">
                  {product_image.length < 1 && (
                    <div className="flex-1 max-w-[50%]">
                      <label
                        htmlFor="product_image"
                        className={`flex flex-col justify-center items-center w-full h-20 border-2 ${
                          errors.image
                            ? "border-red-500"
                            : "border-dashed border-gray-300"
                        } text-gray-700 cursor-pointer p-5 text-center`}
                      >
                        Browse to find or drag image(s) here
                      </label>
                      <input
                        onChange={handleImageChange}
                        className="hidden max-w-[190px]"
                        name="product_image"
                        id="product_image"
                        type="file"
                        accept="image/*"
                        multiple
                      />
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="flex gap-4 flex-wrap mt-5 max-w-[50%]">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="h-60 border border-gray-300 rounded-md overflow-hidden relative"
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
                              preview.startsWith("blob:")
                                ? preview
                                : `${pathUrl}${preview}`
                            }
                            alt="Selected preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.image && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.image}
                    </span>
                  )}
                </div>
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
                className="bg-[#61A375] text-white rounded-md p-2 w-full lg:w-20"
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
