import React, { useRef, useState } from "react";
import { Printer, X, FileText } from "lucide-react";
import { useSelector } from "react-redux";

const HeaderPrintModal = ({ isModalOpen, setIsModalOpen }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  // Header dimensions as constants (in cm)
  const HEADER_DIMENSIONS = {
    TOTAL_WIDTH: 13.6, // Same as card width
    TOTAL_HEIGHT: 0.7, // Maximum 1cm height
  };

  const headerRef = useRef();
  const handleHeaderPrint = () => {
    const printContent = `
   <div style="
  width: ${HEADER_DIMENSIONS.TOTAL_WIDTH}cm;
  height: ${HEADER_DIMENSIONS.TOTAL_HEIGHT}cm;
  display: flex;
  font-size: 10px;
  font-weight: bold;
  background: white;
  border-top: 1px dotted black;
  border-bottom: 1px dotted black;
  box-sizing: border-box;
  page-break-inside: avoid;
">
  <div style="width: 2.5cm; display:flex; align-items:center; justify-content:center;">DATE</div>
  <div style="width: 2.2cm; display:flex; align-items:center; justify-content:center;">IN NO</div>
  <div style="width: 2.4cm; display:flex; align-items:center; justify-content:center;">RATE</div>
  <div style="width: 2.3cm; display:flex; align-items:center; justify-content:center;">WEIGHT</div>
  <div style="width: 2.3cm; display:flex; align-items:center; justify-content:center;">AMOUNT</div>
  <div style="width: 3.2cm; display:flex; align-items:center; justify-content:center;">SIGN</div>
</div>

  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Header</title>
        <style>
          body { margin:0; padding:0; }
          @media print {
            @page {
              margin: 0;
              size: ${HEADER_DIMENSIONS.TOTAL_WIDTH}cm ${HEADER_DIMENSIONS.TOTAL_HEIGHT}cm;
            }
            body {
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const headerStyle = {
    width: `${HEADER_DIMENSIONS.TOTAL_WIDTH}cm`,
    height: `${HEADER_DIMENSIONS.TOTAL_HEIGHT}cm`,
    display: "flex",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "bold",
    backgroundColor: "white",
  };

  // Column widths (total should equal card width)
  const columnWidths = {
    date: "2.5cm",
    installNo: "2.2cm",
    metalRate: "2.4cm",
    weight: "2.3cm",
    amount: "2.3cm",
    sign: "3.2cm",
  };

  const columnStyle = (width) => ({
    width: width,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  });

  return (
    <div>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Header Print Preview
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
              {/* Action Buttons */}
              <div className="mb-6 flex gap-4 justify-center no-print">
                <button
                  onClick={handleHeaderPrint}
                  style={{ background: layout_color }}
                  className="flex items-center gap-2 text-white px-6 py-3 rounded-lg  transition-colors shadow-lg"
                >
                  <Printer size={20} />
                  Print Header
                </button>
              </div>

              {/* Header Container */}
              <div className="flex justify-center">
                <div className=" print-area">
                  <div ref={headerRef} style={headerStyle}>
                    {/* Date Column */}
                    <div style={columnStyle(columnWidths.date)}>DATE</div>

                    {/* Install No Column */}
                    <div style={columnStyle(columnWidths.installNo)}>IN NO</div>

                    {/* Metal Rate Column */}
                    <div style={columnStyle(columnWidths.metalRate)}>RATE</div>
                    <div style={columnStyle(columnWidths.weight)}>Weight</div>

                    {/* Amount Column */}
                    <div style={columnStyle(columnWidths.amount)}>AMOUNT</div>

                    {/* Sign Column */}
                    <div style={columnStyle(columnWidths.sign)}>SIGN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            box-shadow: none;
          }
          @page {
            margin: 0;
            size: ${HEADER_DIMENSIONS.TOTAL_WIDTH}cm
              ${HEADER_DIMENSIONS.TOTAL_HEIGHT}cm;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeaderPrintModal;
