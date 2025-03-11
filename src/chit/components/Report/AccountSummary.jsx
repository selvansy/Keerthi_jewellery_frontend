import React, { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExportDropdown from "../../components/common/Dropdown/Export";
import { ExportToExcel } from "../common/Dropdown/Excelexport";
import { ExportToPDF } from "../common/Dropdown/ExportPdf";
import { getaccountSummaryReport } from "../../../chit/api/Endpoints";
import { SlidersHorizontal, Search, X, Eye } from "lucide-react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

function AccountSummaryReport() {
  const roledata = localStorage.getItem("decoded");

  const id_role = roledata?.id_role?.id_role;
  const id_client = roledata?.id_client;
  const id_branch = roledata?.branch;
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const [isLoading, setisLoading] = useState(true);
  const [accountData, setAccountData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAccountReport();
  }, []);

  const { mutate: getAccountReport } = useMutation({
    mutationFn: getaccountSummaryReport,
    onSuccess: (response) => {
      const { data } = response;
      setAccountData(data);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching metal rate:", error);
    },
  });

  const handleViewDetails = (row) => {
    setSelectedAccount(row);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedAccount(null);
  };

  const handleReset = () => {
    getAccountReport();
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
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
      header: "Total Chit Value",
      cell: (row) => row?.totalChitValue,
    },
    {
      header: "Total Paid Amount",
      cell: (row) => row?.totalPaidAmount,
    },
    {
      header: "Total Due Amount",
      cell: (row) => row?.totalDueAmount,
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
        Account Summary
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
        <Table data={accountData} columns={columns} isLoading={isLoading} />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Account Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">
                  Customer Information
                </h4>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedAccount.customer_name}
                </p>
                <p>
                  <span className="font-medium">Mobile:</span>{" "}
                  {selectedAccount.customer_mobile}
                </p>
                <p>
                  <span className="font-medium">Scheme:</span>{" "}
                  {selectedAccount.scheme_name}
                </p>
                <p>
                  <span className="font-medium">Classification:</span>{" "}
                  {selectedAccount.classification_name}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 mb-4">
                  Other Deteails
                </h4>
                <p>
                  <span className="font-medium">Total Payable:</span>{" "}
                  {selectedAccount.totalPayableAmount}
                </p>
                <p>
                  <span className="font-medium">Status</span>{" "}
                  {selectedAccount.Status}
                </p>
                <p>
                  <span className="font-medium">Total Due Amount:</span>{" "}
                  {selectedAccount.totalDueAmount}
                </p>
                <p>
                  <span className="font-medium">Installment Type:</span>{" "}
                  {selectedAccount.installementType}
                </p>
              </div>
            </div>

            {/* Payment history table */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Payment History
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mode
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* If you have actual payment history data, map through it here */}
                    {selectedAccount.paymentHistory
                      ? selectedAccount.paymentHistory.map((payment, index) => (
                          <tr key={index}>
                            <td className="py-2 px-3 text-sm">
                              {new Date(
                                payment.date_payment
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </td>

                            <td className="py-2 px-3 text-sm">
                              {payment.payment_amount}
                            </td>
                            <td className="py-2 px-3 text-sm">
                              {payment.payment_mode}
                            </td>
                          </tr>
                        ))
                      : // Placeholder rows if no payment history is available
                        [1, 2, 3].map((item) => (
                          <tr key={item}>
                            <td className="py-2 px-3 text-sm">
                              01/0{item}/2025
                            </td>
                            <td className="py-2 px-3 text-sm">
                              INV-{2024100 + item}
                            </td>
                            <td className="py-2 px-3 text-sm">{item * 5000}</td>
                            <td className="py-2 px-3 text-sm">
                              {item === 1
                                ? "Cash"
                                : item === 2
                                ? "UPI"
                                : "Bank Transfer"}
                            </td>
                            <td className="py-2 px-3 text-sm">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  item === 1
                                    ? "bg-green-100 text-green-800"
                                    : item === 2
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item === 1
                                  ? "Paid"
                                  : item === 2
                                  ? "Pending"
                                  : "Overdue"}
                              </span>
                            </td>
                          </tr>
                        ))}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSummaryReport;
