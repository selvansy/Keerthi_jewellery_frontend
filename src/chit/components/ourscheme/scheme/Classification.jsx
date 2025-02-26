import React from "react";
import Select from "react-select";

const Classification = ({ formik, layout_color }) => {
  return (
    <div className="p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="mb-4">
          <label className="block mb-2">
            Upload Main Image <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value="goldbanner56565dsvd65fd56.jpg"
              className="border rounded-l-md p-2 w-full bg-gray-50"
            />
            <button className="bg-gray-200 rounded-r-md px-4 py-2 text-sm">
              Choose File
            </button>
          </div>
          <div className="mt-2">
            <img 
              src="/api/placeholder/400/150" 
              alt="Gold plan banner" 
              className="w-full h-auto rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Upload Description Image <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value="goldbanner56565dsvd65fd56.jpg"
              className="border rounded-l-md p-2 w-full bg-gray-50"
            />
            <button className="bg-gray-200 rounded-r-md px-4 py-2 text-sm">
              Choose File
            </button>
          </div>
          <div className="mt-2">
            <img 
              src="/api/placeholder/400/150" 
              alt="Gold plan banner" 
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      </div>

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
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Terms & Conditions <span className="text-red-500">*</span>
          </label>
          <textarea
            name="terms"
            value={formik?.values?.terms || ""}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            className="border rounded-md resize-none p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-2">
          Classification Order <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full md:w-1/4">
          <input
            type="number"
            name="classification_order"
            value="0"
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classification;