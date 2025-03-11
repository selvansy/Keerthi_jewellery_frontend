import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import {
  schemePayment,
} from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X, Eye } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import { formatNumber } from "../../utils/commonFunction";

function AccountSummaryReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getPaymentData();
  }, []);

  const { mutate: getPaymentData } = useMutation({
    mutationFn: schemePayment,
    onSuccess: (response) => {
      const { data } = response;
      setPaymentData(data);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  const handleViewDetails = (row) => {
    setSelectedPayment(row);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPayment(null);
  };

  const handleReset = () => {
    getPaymentData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Payment Receipt",
      cell: (row) => row?.payment_receipt,
    },
    {
      header: "Scheme",
      cell: (row) => row?.scheme_name,
    },
    {
      header: "Classification",
      cell: (row) => row?.classification_name,
    },
    {
      header: "Customer",
      cell: (row) => row?.customer_name,
    },
    {
      header: "Mobile",
      cell: (row) => row?.customer_mobile,
    },
    {
      header: "Payment Amount",
      cell: (row) => 
        formatNumber({ value: row?.payment_amount, decimalPlaces: 0 }),
    },
    {
      header: "Total Amount",
      cell: (row) =>
        formatNumber({ value: row?.total_amt,decimalPlaces: 0 }),
         
    },
    {
      header: "Action",
      cell: (row) => (
        <button
          onClick={() => handleViewDetails(row)}
          className="p-2 text-white rounded-md flex items-center justify-center"
          style={{ backgroundColor: layout_color }}
        >
          <Eye size={16} className="mr-1" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-gray-900 font-bold">
        Scheme Payment Report
      </h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="text-gray-500" />
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
          />
        </div>

       
      </div>
      <div className="mt-4">
        <Table data={paymentData} columns={columns} isLoading={isLoading} />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Payment Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-1"> 
                <h4 className="font-semibold text-gray-700">Customer Information</h4>
                <p><span className="font-medium">Name:</span> {selectedPayment.customer_name}</p>
                <p><span className="font-medium">Mobile:</span> {selectedPayment.customer_mobile}</p>
                <p><span className="font-medium">Scheme:</span> {selectedPayment.scheme_name}</p>
                <p><span className="font-medium">Classification:</span> {selectedPayment.classification_name}</p>
              </div>
              
              <div className="space-y-1"> 
                <h4 className="font-semibold text-gray-700">Payment Information</h4>
                <p><span className="font-medium">Receipt No:</span> {selectedPayment.payment_receipt}</p>
                <p><span className="font-medium">Payment Date:</span> {formatDate(selectedPayment.date_payment)}</p>
                <p><span className="font-medium">Payment Amount:</span> {selectedPayment.payment_amount}</p>
                <p><span className="font-medium">Total Amount:</span> {selectedPayment.total_amt}</p>
              </div>
            </div>
            
            {/* Additional Charges Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Additional Charges</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">GST Amount</p>
                    <p className="text-lg font-medium">
                      {selectedPayment.otherCharges?.gst_amount || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fine Amount</p>
                    <p className="text-lg font-medium">
                      {selectedPayment.otherCharges?.fine_amount || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Additional Charges</p>
                    <p className="text-lg font-medium">
                      {(parseFloat(selectedPayment.otherCharges?.gst_amount || 0) + 
                        parseFloat(selectedPayment.otherCharges?.fine_amount || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Breakdown Table */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Payment Breakdown</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="py-2 px-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 text-sm">Base Payment</td>
                      <td className="py-2 px-3 text-sm text-right"> {formatNumber({ value: selectedPayment.payment_amount, decimalPlaces: 0 })}</td>
                    </tr>
                    {selectedPayment.otherCharges?.gst_amount && parseFloat(selectedPayment.otherCharges.gst_amount) > 0 && (
                      <tr>
                        <td className="py-2 px-3 text-sm">GST</td>
                        <td className="py-2 px-3 text-sm text-right"> {formatNumber({ value: selectedPayment.otherCharges.gst_amount, decimalPlaces: 0 })} </td>
                      </tr>
                    )}
                    
                      <tr>
                        <td className="py-2 px-3 text-sm">Fine</td>
                        <td className="py-2 px-3 text-sm text-right"> {formatNumber({ value: selectedPayment.otherCharges.fine_amount, decimalPlaces: 0 })}</td>
                      </tr>
                   
                    <tr className="bg-gray-50 font-medium">
                      <td className="py-2 px-3 text-sm">Total</td>
                      <td className="py-2 px-3 text-sm text-right">{formatNumber({ value: selectedPayment.total_amt, decimalPlaces: 0 })} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Close
              </button>
              <button
                className="px-4 py-2 text-white rounded-md"
                style={{ backgroundColor: layout_color }}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSummaryReport;