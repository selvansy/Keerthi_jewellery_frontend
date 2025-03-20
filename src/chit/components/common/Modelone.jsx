import React from "react";

export default function Modal({

  isOpen,

  setIsOpen,

  title,

  extraClassName = "",

  className = "w-full bg-white rounded-2xl shadow-lg p-6",

  children,

}) {

  if (!isOpen) return null; 

  const closeModal = () => setIsOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${className} ${extraClassName} relative`}>

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button

            onClick={closeModal}

            className="text-gray-500 hover:text-gray-700"
          >
            <svg

              className="h-6 w-6"

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

