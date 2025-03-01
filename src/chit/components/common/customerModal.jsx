import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const CustomerModal = ({ close }) => {
  const [searchNumber, setSearchNumber] = useState("");

  const handleClose = () => {
    close();
  };

  const handleSearchChange = (e) => {
    setSearchNumber(e.target.value);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-6">
        {/* Framer Motion Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#F2F2F9] rounded-[16px] shadow-lg w-full max-w-2xl p-6"
        >
          {/* Search and close button row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="number"
                value={searchNumber}
                onChange={handleSearchChange}
                placeholder="Enter the mobile number"
                className="text-xl border-none focus:outline-none focus:ring-0 bg-[#F2F2F9]"
              />
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 border rounded-full p-1"
              onClick={handleClose}
            >
              <X size={24} />
            </button>
          </div>

          {/* Customer details */}
          <div className="grid grid-cols-2 border-b border-t pb-6 mb-6 pt-3">
            <div className="pr-4">
              <h3 className="text-black mb-2">Name:</h3>
              <p className="text-gray-700 text-lg">Gokul</p>

              <h3 className="text-black mt-6 mb-2">Phone no:</h3>
              <p className="text-gray-700">+91-9789321256</p>
            </div>
            <div>
              <h3 className="text-black mb-2">Address:</h3>
              <p className="text-gray-700">
                DNO 282, A2 282B2, Marudhamalai Rd,<br />
                Mullai Nagar, P N Pudur,<br />
                Coimbatore, Tamil Nadu, 641041
              </p>
            </div>
          </div>

          {/* Stats first row */}
          <div className="grid grid-cols-3">
            <div className="text-center border p-4 shadow-sm">
              <h3 className="text-black font-medium mb-4">Wallet point</h3>
              <p className="text-gray-600 text-xl">563.2</p>
            </div>
            <div className="text-center border p-4 shadow-sm">
              <h3 className="text-black font-medium mb-4">Total Joined</h3>
              <p className="text-gray-600 text-xl">563.2</p>
            </div>
            <div className="text-center border p-4 shadow-sm">
              <h3 className="text-black font-medium mb-4">Total Overdues</h3>
              <p className="text-gray-600 text-xl">563.2</p>
            </div>
          </div>

          {/* Stats second row */}
          <div className="grid grid-cols-3">
            <div className="text-center border p-4 shadow-sm">
              <h3 className="text-black font-medium mb-4">Total Closed</h3>
              <p className="text-gray-600 text-xl">563.2</p>
            </div>
            <div className="text-center border p-4 shadow-sm">
              <h3 className="text-black font-medium mb-4">Total Completed</h3>
              <p className="text-gray-600 text-xl">563.2</p>
            </div>
            <div className="text-center border p-4 shadow-sm">
              <h3 className="text-black font-medium mb-4">Overall Overdues</h3>
              <p className="text-gray-600 text-xl">563.2</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerModal;
