import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import banner_placeholder from '../../../../assets/banner_placeholder.webp'

const Classification = ({ formik, layout_color, setMainImg, setDescImg,pathurl,logo,desc_img}) => {
  const mainImageInputRef = useRef(null);
  const descImageInputRef = useRef(null);
  
  const [mainImageName, setMainImageName] = useState("");
  const [descImageName, setDescImageName] = useState("");

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [descImagePreview, setDescImagePreview] = useState(null);

  const handleFileChange = (event, setFileName, setImage, setPreview) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > 1024 * 1024) {
        toast.error("File size should not exceed 1 MB.");
        return;
      }

      setFileName(file.name);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileRemove = (id) => {
    if (id === 1) {
      setMainImagePreview(null);
      setMainImageName("");
      setMainImg(null);
      if (mainImageInputRef.current) {
        mainImageInputRef.current.value = "";
      }
    } else if (id === 2) {
      setDescImagePreview(null);
      setDescImageName("");
      setDescImg(null);
      if (descImageInputRef.current) {
        descImageInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      <div className="mb-4">
          <label className="block mb-2">Upload Main Image <span className="text-red-500">*</span></label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={mainImageName || logo}
              className="border rounded-l-md p-2 w-full bg-gray-50"
            />
            <button
              type="button"
              className="bg-gray-200 rounded-r-md px-4 py-2 text-sm whitespace-nowrap"
              onClick={() => mainImageInputRef.current.click()}
            >
              Choose File
            </button>
            <input
              type="file"
              ref={mainImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setMainImageName, setMainImg, setMainImagePreview)
              }
            />
          </div>
          <div className="mt-2 relative">
            <img
              src={mainImagePreview || (typeof logo === "string" ? `${pathurl}${logo}` : banner_placeholder)}
              alt="Main Image Preview"
              className="w-full h-52 rounded object-cover"
            />
            {mainImagePreview && (
              <button
                type="button"
                onClick={() => handleFileRemove(1)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {formik?.errors?.main_image && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.main_image}</div>
          )}
        </div>

        {/* Upload Description Image */}
        <div className="mb-4">
          <label className="block mb-2">Upload Description Image</label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={descImageName || desc_img}
              className="border rounded-l-md p-2 w-full bg-gray-50"
            />
            <button
              type="button"
              className="bg-gray-200 rounded-r-md px-4 py-2 text-sm whitespace-nowrap"
              onClick={() => descImageInputRef.current.click()}
            >
              Choose File
            </button>
            <input
              type="file"
              ref={descImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, setDescImageName, setDescImg, setDescImagePreview)
              }
            />
          </div>
          <div className="mt-2 relative">
            <img
              src={descImagePreview || (typeof desc_img === "string" ? `${pathurl}${desc_img}` : banner_placeholder)}
              alt="Description Image Preview"
              className="w-full h-52 rounded object-cover"
            />
            {descImagePreview && (
              <button
                type="button"
                onClick={() => handleFileRemove(2)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
        <div className="mb-4">
          <label className="block mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formik?.values?.description || ""}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            className="border resize-none rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {formik?.touched?.description && formik?.errors?.description && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Terms & Conditions <span className="text-red-500">*</span>
          </label>
          <textarea
            name="term_desc"
            value={formik?.values?.term_desc || ""}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            className="border rounded-md resize-none p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {formik?.touched?.term_desc && formik?.errors?.term_desc && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.term_desc}</div>
          )}
        </div>
      </div>

      {/* Classification Order */}
      <div className="mt-4">
        <label className="block mb-2">Display Order</label>
        <div className="relative w-full md:w-1/4">
          <input
            type="number"
            name="classification_order"
            value={formik?.values?.classification_order}
            onWheel={(e)=>e.target.blur()}
            onChange={(e) => {
              if (e.target.value < 50) {
                formik.handleChange(e);
              }else{
                formik.setFieldError("classification_order", "Value must be less than 50");
              }
            }}            
            onBlur={formik?.handleBlur}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </div> */}
        </div>
        {formik?.touched?.classification_order && formik?.errors?.classification_order && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.classification_order}</div>
          )}
      </div>
    </div>
  );
};

export default Classification;