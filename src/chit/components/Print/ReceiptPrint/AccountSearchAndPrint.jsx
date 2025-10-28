import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { paymentReceipt, paymentReceiptByIds } from "../../../api/Endpoints";
import { useSelector } from "react-redux";
import SpinLoading from "../../common/spinLoading";
import ThermalReceipt from "./receiptPrint.jsx";


const AccountSearchAndPrint = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [calculationdata, setcalculationData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [isOpen, setIsOpen] = useState(false);
  const [schemeData, setSchemeData] = useState(null);
  const [printPaymentData, setPrintPaymentData] = useState([]);
  const [branchData,setBranchData]=useState({})



  const { mutate: handleSearchAccountNumber } = useMutation({
    mutationFn: (data) => paymentReceipt(data),
    onSuccess: (response) => {
      if (response) {
        setPaymentData(response?.data);
        setcalculationData(response?.calculations);
        toast.success(response.message);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Something went wrong");
    },
  });

  const { mutate: handleSearchPayments } = useMutation({
    mutationFn: (data) => paymentReceiptByIds(data),
    onSuccess: (response) => {
      if (response) {
        const schemeInfo = response.data.schemeInfo;
        const paymentData = response?.data.data;
        const companyData = response?.data.companyData;
        setSchemeData(schemeInfo);
        setPrintPaymentData(paymentData);
        setBranchData(companyData)
      }
      setIsLoading(false);
      setIsOpen(true)
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    setAccountNumber(value);
  };

  const handleSearchSubmit = () => {
    if (!accountNumber.trim()) {
      toast.error("Please enter a valid account number");
      return;
    }
    setPaymentData([]);
    setSelectedRows([]);
    setIsLoading(true);
    handleSearchAccountNumber({ accountNumber: accountNumber });
  };

  // ✅ Toggle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one row to print");
      return;
    }
    handleSearchPayments({ paymentIds: selectedRows });
    setIsLoading(true)
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Payment Receipt Print
      </h2>
      {isOpen && (
        <ThermalReceipt
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          scheme={schemeData}
          payments={printPaymentData}
          branchData={branchData}
          />
      )}

     
      {/* ✅ Will render after click */}
      {/* Search Card */}
      <div className="flex justify-center mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Search by Account Number
          </h3>

          {/* Search Input */}
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
              className="px-6 py-2 text-white rounded-r-md "
              style={{ backgroundColor: layout_color }}
              disabled={isLoading}
            >
              {isLoading ? <SpinLoading /> : "Search"}
            </button>
          </div>
        </div>
      </div>
      <div className="space-x-2 ">
        <button
          onClick={handlePrint}
          className="mt-4 p-2 text-white rounded "
          style={{ backgroundColor: layout_color }}
        >
          <i className="fa fa-print mr-1"></i> Print 
        </button>
       
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-2">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="uppercase bg-[#e7eef6] text-[#6C7086] text-sm">
              <th className="px-4 py-2 text-left">Select</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Receipt No</th>
              <th className="px-4 py-2 text-left">Total Paid Amount</th>
              <th className="px-4 py-2 text-left">Paid Inst. No.</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((data, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-100 cursor-pointer ${
                  selectedRows.includes(data._id) ? "bg-blue-100" : ""
                }`}
                onClick={() => handleRowSelect(data._id)} // ✅ click row to toggle
              >

                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(data._id)}
                    readOnly // ✅ prevent manual click (row handles toggle)
                  />
                </td>
                <td className="px-4 py-2">
                  {new Date(data.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                      <td className="px-4 py-2">{data.payment_receipt}</td>
                <td className="px-4 py-2">{data.payment_amount}</td>
                <td className="px-4 py-2">{data.paid_installments}</td>
                
          
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountSearchAndPrint;
