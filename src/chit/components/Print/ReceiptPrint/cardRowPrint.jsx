import React from "react";
import { Printer, X } from "lucide-react";
import { useSelector } from "react-redux";

const CardRowPrintModal = ({
  isModalOpen,
  setIsModalOpen,
  rows = [],
  selectedIds = [],
}) => {
      const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const handlePrint = () => {
    // Build HTML string for printing
    const rowContent = rows
      .map((row) => {
        if (!selectedIds.includes(row._id)) {
          // Not selected → blank row
          return `<div style="
          width: 13.6cm;
          height: 0.7cm;
          display: flex;
        "></div>`;
        }

        // Selected → show data
        return `<div style="
        width: 13.6cm;
        height: 0.7cm;
        display: flex;
        font-size: 10px;
        font-weight: bold;
        background: white;
         ">
        <div style="width: 2.5cm; display:flex; align-items:center; justify-content:center;">${row.date}</div>
        <div style="width: 2.2cm; display:flex; align-items:center; justify-content:center;">${row.inNo}</div>
        <div style="width: 2.4cm; display:flex; align-items:center; justify-content:center;">${row.rate}</div>
        <div style="width: 2.3cm; display:flex; align-items:center; justify-content:center;">${row.weight}</div>
        <div style="width: 2.3cm; display:flex; align-items:center; justify-content:center;">${row.amount}</div>
        <div style="width: 3.2cm; display:flex; align-items:center; justify-content:center;">${row.sign}</div>
      </div>`;
      })
      .join("");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Card Rows</title>
        <style>
          body { margin:0; padding:0; font-family: Arial, sans-serif; }
          @media print {
            @page { margin: 0; }
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>${rowContent}</body>
    </html>
  `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Card Rows Preview
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Print Button */}
              <div className="mb-6 flex gap-4 justify-center">
                <button
                  onClick={handlePrint}
                  style={{background:layout_color}}
                  className="flex items-center gap-2  text-white px-6 py-2 rounded-lg  transition-colors shadow-md"
                >
                  <Printer size={18} />
                  Print Rows
                </button>
              </div>

              {/* Preview Rows */}
              <div>
                {rows
                  .filter((row) => selectedIds.includes(row._id)) // Only include selected rows
                  .map((row, index) => (
                    <div
                      key={index}
                      style={{
                        width: "13.6cm",
                        height: "0.7cm",
                        display: "flex",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: "white",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          width: "2.5cm",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {row.date}
                      </div>
                      <div
                        style={{
                          width: "2.2cm",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {row.inNo}
                      </div>
                      <div
                        style={{
                          width: "2.4cm",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {row.rate}
                      </div>
                      <div
                        style={{
                          width: "2.3cm",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {row.weight}
                      </div>
                      <div
                        style={{
                          width: "2.3cm",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {row.amount}
                      </div>
                      <div
                        style={{
                          width: "3.2cm",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {row.sign}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardRowPrintModal;
