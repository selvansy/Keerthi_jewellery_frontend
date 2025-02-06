import React, { useState, useEffect } from "react";
import axios from "axios";  // Ensure axios is installed or you can use fetch

const CardPrint = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    // Fetch payment data from your API or server
    const fetchPaymentData = async () => {
      const response = await axios.get("/api/payments");  // Replace with your actual API endpoint
      setPaymentData(response.data);
    };

    fetchPaymentData();
  }, []);

  const handleRowSelect = (paymentId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(paymentId)) {
        return prevSelected.filter((id) => id !== paymentId);
      } else {
        return [...prevSelected, paymentId];
      }
    });
  };

  const handlePrint = () => {
    const selectedRowsData = paymentData.filter((data) =>
      selectedRows.includes(data.id_payment)
    );

    if (selectedRowsData.length === 0) {
      alert("No rows selected for printing.");
      return;
    }

    // Create the print content
    let printContent = "<html><body>";
    printContent += `<h1>Selected Payment Records</h1><table border="1" cellpadding="5" cellspacing="0"><tr><th>Action</th><th>Installment</th><th>Date</th><th>Receipt No</th><th>Amount</th><th>Total Amount</th><th>A/c No</th></tr>`;

    selectedRowsData.forEach((row) => {
      printContent += `
        <tr>
          <td>${row.action}</td>
          <td>${row.sno}</td>
          <td>${row.date_payment}</td>
          <td>${row.total_amt}</td>
          <td>${row.id_payment}</td>
          <td>${row.metal_rate}</td>
          <td>${row.metal_weight}</td>
          <td>${row.total_weight}</td>
        </tr>
      `;
    });

    printContent += "</table></body></html>";

    const newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write(printContent);
    newWin.document.close();
    setTimeout(() => {
      newWin.print();
      newWin.close();
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6">Payment Print Table</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={(e) => handleRowSelect(e.target.value)}
                />
              </th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Installment</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Receipt No</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Total Amount</th>
              <th className="px-4 py-2 text-left">A/c No</th>
            </tr>
          </thead>
          <tbody>
            {/* {paymentData.length > 0 ? (
              paymentData.map((row) => (
                <tr key={row.id_payment} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={() => handleRowSelect(row.id_payment)}
                      checked={selectedRows.includes(row.id_payment)}
                      className="form-checkbox"
                    />
                  </td>
                  <td className="px-4 py-2">{row.action}</td>
                  <td className="px-4 py-2">{row.sno}</td>
                  <td className="px-4 py-2">{row.date_payment}</td>
                  <td className="px-4 py-2">{row.total_amt}</td>
                  <td className="px-4 py-2">{row.id_payment}</td>
                  <td className="px-4 py-2">{row.metal_rate}</td>
                  <td className="px-4 py-2">{row.metal_weight}</td>
                  <td className="px-4 py-2">{row.total_weight}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-2">Loading...</td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <i className="fa fa-print mr-2"></i> Print Selected Rows
      </button>
    </div>
  );
};

export default CardPrint;
