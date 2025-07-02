// import React, { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import { toast } from "sonner";
// import banner_placeholder from "../../../../assets/banner_placeholder.webp";
// import warning from "../../../../assets/icons/warning.svg";

// const Classification = ({
//   formik,
//   layout_color,
//   setMainImg,
//   setDescImg,
//   pathurl,
//   logo,
//   desc_img,
// }) => {
//   const mainImageInputRef = useRef(null);
//   const descImageInputRef = useRef(null);

//   const [mainImageName, setMainImageName] = useState("");
//   const [descImageName, setDescImageName] = useState("");

//   const [mainImagePreview, setMainImagePreview] = useState(null);
//   const [descImagePreview, setDescImagePreview] = useState(null);

//   const handleFileChange = (event, setFileName, setImage, setPreview) => {
//     if (event.target.files.length > 0) {
//       const file = event.target.files[0];

//       if (file.size > 1024 * 1024) {
//         toast.error("File size should not exceed 1 MB.");
//         return;
//       }

//       setFileName(file.name);
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleFileRemove = (id) => {
//     if (id === 1) {
//       setMainImagePreview(null);
//       setMainImageName("");
//       setMainImg(null);
//       if (mainImageInputRef.current) {
//         mainImageInputRef.current.value = "";
//       }
//     } else if (id === 2) {
//       setDescImagePreview(null);
//       setDescImageName("");
//       setDescImg(null);
//       if (descImageInputRef.current) {
//         descImageInputRef.current.value = "";
//       }
//     }
//   };

//   useEffect(() => {
//     if (logo == null) {
//       setMainImagePreview(null);
//       setMainImageName("");
//       if (mainImageInputRef.current) {
//         mainImageInputRef.current.value = "";
//       }
//     }
//     if (desc_img == null) {
//       setDescImagePreview(null);
//       setDescImageName("");
//       if (descImageInputRef.current) {
//         descImageInputRef.current.value = "";
//       }
//     }
//   }, [logo, desc_img]); // Added reset to dependencies

//   return (
//     <div className="p-6 mb-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//         <div className="mb-4">
//           <label className="block mb-2">
//             Upload Main Image <span className="text-red-500">*</span>
//           </label>
//           <div className="flex relative">
//             <input
//               type="text"
//               readOnly
//               value={mainImageName || logo || ""}
//               className="border rounded-l-md p-2 w-full bg-gray-50"
//             />
//             {/* <button
//               type="button"
//               className="bg-gray-200 rounded-r-md px-4 py-2 text-sm whitespace-nowrap"
//               onClick={() => mainImageInputRef.current.click()}
//             >
//               Choose File
//             </button> */}
//             <label
//               htmlFor="mainImageInput"
//               className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-4 flex items-center justify-center rounded-md cursor-pointer text-sm"
//               style={{ backgroundColor: layout_color }}
//               // onClick={() => mainImageInputRef.current.click()}
//             >
//               Choose File
//             </label>
//             <input
//               type="file"
//               id="mainImageInput"
//               ref={mainImageInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={(e) =>
//                 handleFileChange(
//                   e,
//                   setMainImageName,
//                   setMainImg,
//                   setMainImagePreview
//                 )
//               }
//             />
//           </div>
//           <div className="mt-2 relative">
//             <img
//               src={
//                 mainImagePreview ||
//                 (typeof logo === "string"
//                   ? `${pathurl}${logo}`
//                   : banner_placeholder)
//               }
//               alt="Main Image Preview"
//               className="w-full h-52 rounded object-cover"
//             />
//             {mainImagePreview && (
//               <button
//                 type="button"
//                 onClick={() => handleFileRemove(1)}
//                 className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//           {formik?.errors?.main_image && (
//             <div className="text-red-500 text-sm mt-1">
//               {formik.errors.main_image}
//             </div>
//           )}
//         </div>

//         {/* Upload Description Image */}
//         <div className="mb-4">
//           <label className="block mb-2">Upload Description Image</label>
//           <div className="flex relative">
//             <input
//               type="text"
//               readOnly
//               value={descImageName || desc_img || ""}
//               className="border rounded-md p-2 w-full bg-gray-50"
//             />
//             <label
//               htmlFor="descImageInput"
//               className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-4 flex items-center justify-center rounded-md cursor-pointer text-sm"
//               style={{ backgroundColor: layout_color }}
//               // onClick={() => descImageInputRef.current.click()}
//             >
//               Choose File
//             </label>
//             <input
//               type="file"
//               id="descImageInput"
//               ref={descImageInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={(e) =>
//                 handleFileChange(
//                   e,
//                   setDescImageName,
//                   setDescImg,
//                   setDescImagePreview
//                 )
//               }
//             />
//           </div>
//           <div className="mt-2 relative">
//             <img
//               src={
//                 descImagePreview ||
//                 (typeof desc_img === "string"
//                   ? `${pathurl}${desc_img}`
//                   : banner_placeholder)
//               }
//               alt="Description Image Preview"
//               className="w-full h-52 rounded object-cover"
//             />
//             {descImagePreview && (
//               <button
//                 type="button"
//                 onClick={() => handleFileRemove(2)}
//                 className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Description & Terms */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
//         <div className="mb-4">
//           <label className="block mb-2">
//             Description <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             name="description"
//             value={formik?.values?.description || ""}
//             onChange={formik?.handleChange}
//             onBlur={formik?.handleBlur}
//             className="border resize-none rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//           />
//           {formik?.touched?.description && formik?.errors?.description && (
//             <div className="text-red-500 text-sm mt-1">
//               {formik.errors.description}
//             </div>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2">
//             Terms & Conditions <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             name="term_desc"
//             value={formik?.values?.term_desc || ""}
//             onChange={formik?.handleChange}
//             onBlur={formik?.handleBlur}
//             className="border rounded-md resize-none p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
//           />
//           {formik?.touched?.term_desc && formik?.errors?.term_desc && (
//             <div className="text-red-500 text-sm mt-1">
//               {formik.errors.term_desc}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center w-full bg-[#FFF8EA] rounded-md h-[68px] p-3">
//         <div className="flex items-center gap-3">
//           <div className="flex justify-center rounded-full bg-[#FFECC3] p-2">
//           <img src={warning} alt="Warning" />
//           </div>
//           <h5>
//             <span className="font-bold">Note:</span> Please ensure your input
//             does not exceed 850 characters.
//           </h5>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Classification;
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import banner_placeholder from "../../../../assets/banner_placeholder.webp";
import warning from "../../../../assets/icons/warning.svg";

const Classification = ({
  formik,
  layout_color,
  setMainImg,
  setDescImg,
  pathurl,
  logo,
  desc_img,
}) => {
  const mainImageInputRef = useRef(null);
  const descImageInputRef = useRef(null);

  const [mainImageName, setMainImageName] = useState("");
  const [descImageName, setDescImageName] = useState("");

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [descImagePreview, setDescImagePreview] = useState(null);

  const handleFileChange = (event, setFileName, setImage, setPreview, isMainImage = false) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > 1024 * 1024) {
        toast.error("File size should not exceed 1 MB.");
        return;
      }

      setFileName(file.name);
      setImage(file);
      setPreview(URL.createObjectURL(file));
      
      if (isMainImage) {
        formik.setFieldValue('main_image', file);
        formik.setFieldError('main_image', undefined);
      }
    }
  };

  const handleFileRemove = (id) => {
    if (id === 1) {
      setMainImagePreview(null);
      setMainImageName("");
      setMainImg(null);
      formik.setFieldValue('main_image', null);
      formik.setFieldTouched('main_image', true);
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

  useEffect(() => {
    if (logo == null) {
      setMainImagePreview(null);
      setMainImageName("");
      formik.setFieldValue('main_image', null);
      if (mainImageInputRef.current) {
        mainImageInputRef.current.value = "";
      }
    }
    if (desc_img == null) {
      setDescImagePreview(null);
      setDescImageName("");
      if (descImageInputRef.current) {
        descImageInputRef.current.value = "";
      }
    }
  }, [logo, desc_img]);

  return (
    <div className="p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {/* Upload Main Image */}
        <div className="mb-4">
          <label className="block mb-2">
            Upload Main Image <span className="text-red-500">*</span>
          </label>
          <div className="flex relative">
            <input
              type="text"
              readOnly
              value={mainImageName || (typeof logo === 'string' ? logo : "")}
              className="border rounded-l-md p-2 w-full bg-gray-50"
            />
            <label
              htmlFor="mainImageInput"
              className="absolute right-0 top-0 bottom-0 bg-[#004181] text-white px-4 flex items-center justify-center rounded-md cursor-pointer text-sm"
              // style={{ backgroundColor: layout_color }}
            >
              Choose File
            </label>
            <input
              type="file"
              id="mainImageInput"
              ref={mainImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(
                  e,
                  setMainImageName,
                  setMainImg,
                  setMainImagePreview,
                  true
                )
              }
            />
          </div>
          <div className="mt-2 relative">
            <img
              src={
                mainImagePreview ||
                (typeof logo === "string"
                  ? `${pathurl}${logo}`
                  : banner_placeholder)
              }
              alt="Main Image Preview"
              className="w-full h-52 rounded object-cover"
            />
            {(mainImagePreview || logo) && (
              <button
                type="button"
                onClick={() => handleFileRemove(1)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {formik.touched.main_image && formik.errors.main_image && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.main_image}
            </div>
          )}
        </div>

        {/* Upload Description Image */}
        <div className="mb-4">
          <label className="block mb-2">Upload Description Image</label>
          <div className="flex relative">
            <input
              type="text"
              readOnly
              value={descImageName || (typeof desc_img === 'string' ? desc_img : "")}
              className="border rounded-md p-2 w-full bg-gray-50"
            />
            <label
              htmlFor="descImageInput"
              className="absolute right-0 top-0 bottom-0 bg-[#004181] text-white px-4 flex items-center justify-center rounded-md cursor-pointer text-sm"
              // style={{ backgroundColor: layout_color }}
            >
              Choose File
            </label>
            <input
              type="file"
              id="descImageInput"
              ref={descImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(
                  e,
                  setDescImageName,
                  setDescImg,
                  setDescImagePreview
                )
              }
            />
          </div>
          <div className="mt-2 relative">
            <img
              src={
                descImagePreview ||
                (typeof desc_img === "string"
                  ? `${pathurl}${desc_img}`
                  : banner_placeholder)
              }
              alt="Description Image Preview"
              className="w-full h-52 rounded object-cover"
            />
            {(descImagePreview || desc_img) && (
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
            value={formik.values.description || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border resize-none rounded-md p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Terms & Conditions <span className="text-red-500">*</span>
          </label>
          <textarea
            name="term_desc"
            value={formik.values.term_desc || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded-md resize-none p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {formik.touched.term_desc && formik.errors.term_desc && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.term_desc}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center w-full bg-[#FFF8EA] rounded-md h-[68px] p-3">
        <div className="flex items-center gap-3">
          <div className="flex justify-center rounded-full bg-[#FFECC3] p-2">
            <img src={warning} alt="Warning" />
          </div>
          <h5>
            <span className="font-bold">Note:</span> Please ensure your input
            does not exceed 850 characters.
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Classification;