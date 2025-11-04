import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaymentTable = ({
  paymentData = [],
  selectedRows = [],
  handleRowSelect,
  handlePageChange,
  handleSelectAll, // ✅ new prop
  currentPage,
  totalItems,
  itemsPerPage,
  isLoading,
}) => {
  const spliceDecimals = (value, decimals) =>
    value ? Number(value).toFixed(decimals) : "0.00";

  // ✅ Determine if all visible rows are selected
  const allSelected =
    paymentData.length > 0 &&
    paymentData.every((data) => selectedRows.includes(data.index));

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-2">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="uppercase bg-[#e7eef6] text-[#6C7086] text-sm">
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-2 text-left">Installment</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Receipt No</th>
              <th className="px-4 py-2 text-left">Total Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : paymentData.length > 0 ? (
              paymentData.map((data, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${
                    selectedRows.includes(data.index) ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleRowSelect(data.index)}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(data.index)}
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-2">{data.index}</td>
                  <td className="px-4 py-2">
                    {new Date(data.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">{data.payment_receipt}</td>
                  <td className="px-4 py-2">
                    {spliceDecimals(data.payment_amount, 2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > itemsPerPage && (
        <div className="p-4 flex items-center justify-between text-sm text-gray-600 border-t bg-white shadow rounded-b-lg">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            entries
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1e3b8b] hover:bg-blue-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </button>

            {Array.from(
              { length: Math.ceil(totalItems / itemsPerPage) },
              (_, i) => i + 1
            )
              .filter(
                (page) =>
                  page === 1 ||
                  page === Math.ceil(totalItems / itemsPerPage) ||
                  Math.abs(page - currentPage) <= 1
              )
              .map((page, i, array) => (
                <React.Fragment key={page}>
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-[#1e3b8b] text-white"
                        : "text-[#1e3b8b] hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                  {array[i + 1] - page > 1 && <span className="px-2">...</span>}
                </React.Fragment>
              ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
              className={`flex items-center px-3 py-1 rounded border ${
                currentPage >= Math.ceil(totalItems / itemsPerPage)
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1e3b8b] hover:bg-blue-50"
              }`}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
