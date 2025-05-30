import React from "react";

export default function Modal({

  isOpen,

  setIsOpen,

  title,

  extraClassName = "",

  className = "bg-white rounded-2xl shadow-lg p-6",

  children,
  custom

}) {

  if (!isOpen) return null; 

  const closeModal = () => setIsOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${className} ${extraClassName} relative`}>

        {/* Modal Header */}
        <div className={`flex border-b-2 border-gray-200 justify-between items-center pb-4 mb-4 ${custom} `}>
          <h3 className="text-lg font-medium text-[#232323]">{title}</h3>
          <button

            onClick={closeModal}

            className="flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full border w-8 h-8 border-[#F5F5F5]"
          >
            <svg

              className="h-4 w-4"

              fill="none"

              viewBox="0 0 24 24"

              stroke="currentColor"
            >
              <path

                strokeLinecap="round"

                strokeLinejoin="round"

                strokeWidth={2}

                d="M6 18L18 6M6 6l12 12"

              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div>{children}</div>

      </div>
    </div>

  );

}

