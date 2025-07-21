import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { getCustomerSummary } from "../../api/Endpoints";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDecimal } from "../../utils/commonFunction";

const CustomerModal = ({ close }) => {
  const [searchNumber, setSearchNumber] = useState("");
  const inputRef = useRef(null);
  const modalRootRef = useRef(document.createElement("div"));
  const [isLoading, setIsLoading] = useState("");
  const debouncedSearch = useDebounce(searchNumber, 1000);
  const [customerData, setCustomerData] = useState({
    name: "-",
    phone: "-",
    address: "-",
    wallet_point: "-",
    active_scheme: "-",
    total_overdues: "-",
    total_closed: "-",
    total_completed: "-",
    overall_overdues: "-",
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    document.body.appendChild(modalRootRef.current);
    return () => {
      document.body.removeChild(modalRootRef.current);
    };
  }, []);

  useEffect(() => {
    getCustomerData(debouncedSearch);
  }, [debouncedSearch]);

  const handleClose = () => {
    close();
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIsLoading(true);
      setSearchNumber(value);
    }
  };

  const { mutate: getCustomerData } = useMutation({
    mutationFn: (searchNumber) => getCustomerSummary(searchNumber),
    onSuccess: (response) => {
      try {
        if (response.data) {
          setIsLoading(false);
          // const custData = response.data?.custData ?? {};
          const walletData = response.data ?? {};

          setCustomerData({
            name: `${walletData.firstname ?? "N/A"} ${
              walletData.lastname ?? ""
            }`.trim(),
            phone: walletData.mobile ?? "N/A",
            address: walletData.address ?? "N/A",
            wallet_point: walletData.balance_amt ?? "N/A",
            active_scheme: walletData?.active_scheme_count ?? "N/A",
            total_overdues: "-",
            total_closed: response.data?.closedSchemeCount ?? "N/A",
            total_completed: response.data?.completedSchemeCount ?? "N/A",
            total_overdues: response?.data?.overDue
            // overall_overdues: "-",
          });
        } else {
          setIsLoading(false);
          setCustomerData({});
        }
      } catch (err) {
        ;
      }
    },
    onError: (err) => {
      setIsLoading(false);
      setCustomerData({});
    },
  });

  const handleSearch = () => {
    getCustomerData(searchNumber);
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#F2F2F9] rounded-[16px] shadow-lg w-full max-w-2xl p-6"
        >
          {/* Search and close button row */}
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2" onClick={handleSearch}>
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <span
                    className="text-gray-500 ms-6 mr-2 cursor-pointer"
                    onClick={handleSearch}
                  >
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
                )}
              </span>
              <input
                ref={inputRef}
                type="string"
                value={searchNumber}
                onChange={handleSearchChange}
                onWheel={(e) => e.target.blur()}
                placeholder="Enter the mobile number"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
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

          <div className="min-h-[350px] flex flex-col justify-center">
            {Object.keys(customerData).length > 0 ? (
              <>
                {/* Customer details */}
                <div className="grid grid-cols-2 border-b border-t pb-6 mb-6 pt-6">
                  <div className="pr-4">
                    <h3 className="text-black mb-2">Name:</h3>
                    <p className="text-gray-700 text-lg">{customerData.name}</p>

                    <h3 className="text-black mt-6 mb-2">Phone no:</h3>
                    <p className="text-gray-700">{searchNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-black mb-2">Address:</h3>
                    <p className="text-gray-700">{customerData.address}</p>
                  </div>
                </div>

                {/* Stats first row */}
                <div className="grid grid-cols-3">
                  <div className="text-center border p-4 shadow-sm">
                    <h3 className="text-black font-medium mb-4">
                      Wallet amount
                    </h3>
                    <p className="text-gray-600 text-xl">
                      ₹{formatDecimal(customerData.wallet_point,2)}
                    </p>
                  </div>
                  <div className="text-center border p-4 shadow-sm">
                    <h3 className="text-black font-medium mb-4">
                      Active Scheme
                    </h3>
                    <p className="text-gray-600 text-xl">
                      {customerData.active_scheme}
                    </p>
                  </div>
                  <div className="text-center border p-4 shadow-sm">
                    <h3 className="text-black font-medium mb-4">
                      Total Overdues
                    </h3>
                    <p className="text-gray-600 text-xl">
                      {customerData.total_overdues}
                    </p>
                  </div>
                </div>

                {/* Stats second row */}
                <div className="grid grid-cols-3">
                  <div className="text-center border p-4 shadow-sm">
                    <h3 className="text-black font-medium mb-4">
                      Total Closed
                    </h3>
                    <p className="text-gray-600 text-xl">
                      {customerData.total_closed}
                    </p>
                  </div>
                  <div className="text-center border p-4 shadow-sm">
                    <h3 className="text-black font-medium mb-4">
                      Total Completed
                    </h3>
                    <p className="text-gray-600 text-xl">
                      {customerData.total_completed}
                    </p>
                  </div>
                  {/* <div className="text-center border p-4 shadow-sm">
                    <h3 className="text-black font-medium mb-4">
                      Total OverDue Amount
                    </h3>
                    <p className="text-gray-600 text-xl">
                      {customerData.overall_overdues}
                    </p>
                  </div> */}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-700 text-lg">Customer not found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    modalRootRef.current
  );
};

export default CustomerModal;
