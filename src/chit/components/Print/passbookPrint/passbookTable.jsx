// import React, { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import {
//   getPaymentDetailsPassBook,
//   //  paymentReceipt, paymentReceiptByIds
// } from "../../../api/Endpoints";
// import { useSelector } from "react-redux";
// import SpinLoading from "../../common/spinLoading";
// import PrintPassbookFront from "./passbookFront";
// import PrintPassbook from "./passbookPaymentPrint";
// import PassbookHeader from "./passbookHeader";
// import { spliceDecimals } from "../../../../utils/Constants";
// import PaymentTable from "./paymentTable";

// const PassbookTable = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [paymentData, setPaymentData] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [accountNumber, setAccountNumber] = useState("");
//   const layout_color = useSelector((state) => state.clientForm.layoutColor);
//   const [openPrintFront, setOpenPrintFront] = useState(false);
//   const [schemeData, setSchemeData] = useState(null);
//   const [printPaymentData, setPrintPaymentData] = useState([]);
//   const [branchData, setBranchData] = useState({});

//   const { mutate: handleSearchAccountNumber } = useMutation({
//     mutationFn: (data) => getPaymentDetailsPassBook(data),
//     onSuccess: (response) => {
//       if (response) {
//         const payments = response?.data?.payments;
//         const schemeInfo = response?.data?.schemeDetails;
//         setPaymentData(payments);
//         setSchemeData(schemeInfo);
//         toast.success(response.message);
//       }
//       setIsLoading(false);
//     },
//     onError: (error) => {
//       setIsLoading(false);
//       toast.error(error.message || "Something went wrong");
//     },
//   });

//   const handleAccountNumberChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     setAccountNumber(value);
//   };

//   const handleSearchSubmit = () => {
//     if (!accountNumber.trim()) {
//       toast.error("Please enter a valid account number");
//       return;
//     }
//     setPaymentData([]);
//     setSelectedRows([]);
//     setIsLoading(true);
//     handleSearchAccountNumber({ accountNumber: accountNumber });
//   };

//   const handleRowSelect = (id) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
//     );

//     // Update the printPaymentData in sync
//     setPrintPaymentData((prevData) => {
//       const isSelected = prevData.some((p) => p.index === id);
//       if (isSelected) {
//         // If already selected, remove it
//         return prevData.filter((p) => p.index !== id);
//       } else {
//         // If not selected, add it
//         const selectedPayment = paymentData.find((p) => p.index === id);
//         return [...prevData, selectedPayment];
//       }
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Payment Print</h2>

//       {/* ✅ Will render after click */}
//       {/* Search Card */}
//       <div className="flex justify-center mb-6">
//         <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
//           <h3 className="text-xl font-semibold mb-4 text-center">
//             Search by Account Number
//           </h3>

//           {/* Search Input */}
//           <div className="flex mb-4">
//             <input
//               type="text"
//               placeholder="Enter Account Number"
//               value={accountNumber}
//               onChange={handleAccountNumberChange}
//               className="px-4 py-2 border rounded-l-md w-full"
//             />
//             <button
//               onClick={handleSearchSubmit}
//               className="px-6 py-2 text-white rounded-r-md "
//               style={{ backgroundColor: layout_color }}
//               disabled={isLoading}
//             >
//               {isLoading ? <SpinLoading /> : "Search"}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex space-x-3">
//         {schemeData && Object.entries(schemeData).length >= 0 && (
//           <PassbookHeader schemeType={schemeData.schemeType} />
//         )}
//         {schemeData && Object.entries(schemeData).length >= 0 && (
//           <PrintPassbookFront
//             isOpen={openPrintFront}
//             setIsOpen={setOpenPrintFront}
//             accountDetails={schemeData}
//           />
//         )}
//         {printPaymentData.length > 0 && (
//           <PrintPassbook
//             paymentData={printPaymentData}
//             schemeType={schemeData.schemeType}
//             selectedIds={printPaymentData.map((p) => p._id)}
//           />
//         )}
//       </div>

//       {/* Table */}
//       <PaymentTable paymentData={paymentData} />
//     </div>
//   );
// };

// export default PassbookTable;

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getPaymentDetailsPassBook } from "../../../api/Endpoints";
import { useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import PrintPassbookFront from "./passbookFront";
import PrintPassbook from "./passbookPaymentPrint";
import PassbookHeader from "./passbookHeader";
import PaymentTable from "./paymentTable";

const PassbookTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [openPrintFront, setOpenPrintFront] = useState(false);
  const [schemeData, setSchemeData] = useState(null);
  const [printPaymentData, setPrintPaymentData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // match with backend pagination size

  // ✅ Fetch payments by page
  const { mutate: handleSearchAccountNumber } = useMutation({
    mutationFn: (params) => getPaymentDetailsPassBook(params),
    onSuccess: (response) => {
      if (response?.data) {
        const { payments, schemeDetails, pagination } = response.data;

        setPaymentData(payments || []);
        setSchemeData(schemeDetails || null);

        // ✅ Use backend pagination data
        setTotalItems(pagination?.totalItems || payments.length);
        setCurrentPage(pagination?.currentPage || 1);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Something went wrong");
    },
  });

  // 🔍 Search account payments
  const handleSearchSubmit = () => {
    if (!accountNumber.trim()) {
      toast.error("Please enter a valid account number");
      return;
    }
    setPaymentData([]);
    setSelectedRows([]);
    setIsLoading(true);
    setCurrentPage(1);
    handleSearchAccountNumber({
      accountNumber,
      page: 1,
      limit: itemsPerPage,
    });
  };

  // 📄 Pagination handler (trigger new API call)
  const handlePageChange = (page) => {
    if (page < 1) return;
    setIsLoading(true);
    setCurrentPage(page);
    handleSearchAccountNumber({
      accountNumber,
      page,
      limit: itemsPerPage,
    });
  };

  // ✅ Row selection sync with print data
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

    setPrintPaymentData((prevData) => {
      const exists = prevData.some((p) => p.index === id);
      if (exists) return prevData.filter((p) => p.index !== id);
      const selected = paymentData.find((p) => p.index === id);
      return [...prevData, selected];
    });
  };

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value.toUpperCase());
  };

  const handleSelectAll = (checked) => {
  if (checked) {
    // ✅ Select all items on the current page
    const allIds = paymentData.map((d) => d.index);

    // Update selected rows
    setSelectedRows((prev) => [...new Set([...prev, ...allIds])]);

    setPrintPaymentData((prevData) => {
      const newItems = paymentData.filter(
        (item) => !prevData.some((p) => p.index === item.index)
      );
      return [...prevData, ...newItems];
    });
  } else {
    setSelectedRows((prev) =>
      prev.filter((id) => !paymentData.some((d) => d.index === id))
    );

    setPrintPaymentData((prevData) =>
      prevData.filter((p) => !paymentData.some((d) => d.index === p.index))
    );
  }
};

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Passbook Print</h2>

      {/* Search Box */}
      <div className="flex justify-center mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Search by Account Number
          </h3>

          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              className="px-4 py-2 border rounded-l-md w-full"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-6 py-2 text-white rounded-r-md"
              style={{ backgroundColor: layout_color }}
              disabled={isLoading}
            >
              {isLoading ? <SpinLoading /> : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Passbook Header & Print */}
      <div className="flex space-x-3">
       
        {schemeData && (
          <PrintPassbookFront
            isOpen={openPrintFront}
            setIsOpen={setOpenPrintFront}
            accountDetails={schemeData}
          />
        )}
        {printPaymentData.length > 0 && (
          <PrintPassbook
            paymentData={printPaymentData}
            schemeType={schemeData.schemeType}
            selectedIds={printPaymentData.map((p) => p._id)}
          />
        )}
      </div>

      {/* Payment Table with Pagination */}
      <PaymentTable
        paymentData={paymentData}
        selectedRows={selectedRows}
        handleRowSelect={handleRowSelect}
        handleSelectAll={handleSelectAll} 
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PassbookTable;
