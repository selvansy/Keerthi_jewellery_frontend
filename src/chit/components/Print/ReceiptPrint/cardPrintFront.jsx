import React, { useRef, useState } from "react";
import { CreditCard, Printer, Download, X } from "lucide-react";
import { useSelector } from "react-redux";
import Barcode from "react-barcode";

const CARD_DIMENSIONS = {
  TOTAL_WIDTH: 13.6, // 10.7 Total card width in cm
  TOTAL_HEIGHT: 21, // Total card height in cm
  CONTENT_HEIGHT: 7.7, // Content height from top
  BLANK_BOTTOM: 10.07 - 7.7,
  PADDING: 0.5,
};

const CardPrint = ({ isModalOpen, setIsModalOpen, customer }) => {
  const cardRef = useRef();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
 const handlePrint = () => {
  const printContent = `
    <div style="
      width: ${CARD_DIMENSIONS.TOTAL_WIDTH}cm; 
      height: ${CARD_DIMENSIONS.TOTAL_HEIGHT}cm; 
      display: flex; 
      flex-direction: column;
    ">
      <!-- Top dummy space -->
      <div style="flex: 1; display: flex; justify-content: center; align-items: center;">
      </div>

      <!-- Bottom space with customer info -->
      <div style="
        flex: 0 0 ${CARD_DIMENSIONS.BLANK_BOTTOM}cm;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        box-sizing: border-box;
      ">
        <!-- Customer Details -->
        <div>
          <h2 style="margin: 0; font-size: 14pt;">${customer.name}</h2>
          <p style="margin: 0; font-size: 12pt;">Vadavalli Tamil Nadu</p>
        </div>

        <!-- Barcode -->
        <div>
          <img 
            src="https://barcode.tec-it.com/barcode.ashx?data=${customer.accountNumber}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96" 
            alt="barcode" 
            style="height: 2.5cm; object-fit: contain; width:50%"
          />
        </div>
      </div>
    </div>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Customer Info</title>
        <style>
          body { margin:0; padding:0; }
          @media print {
            @page {
              margin: 0; /* removes default page margins */
            }
            body {
              -webkit-print-color-adjust: exact; /* keep colors accurate */
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



  return (
    <div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Card Print Preview
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4 justify-center no-print">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-white px-6 py-3 rounded-lg  transition-colors shadow-lg"
                style={{background:layout_color}}
              >
                <Printer size={20} />
                Print Customer Info
              </button>
          
            </div>

            {/* Card Preview */}
            <div className="flex justify-center">
              <div
                ref={cardRef}
                style={{
                  width: `${CARD_DIMENSIONS.TOTAL_WIDTH}cm`,
                  // height: `${CARD_DIMENSIONS.TOTAL_HEIGHT}cm`,
                  // border: "2px solid #000",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "0.5cm",
                  background: "#f9f9f9",
                }}
              >
                {/* Top dummy */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                 
                </div>

                {/* Bottom customer info */}
                <div style={{ flex: 0  }}>
                  <h2>{customer.name}</h2>
                  <p>Vadavalli Tamil Nadu</p>
                

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPrint;
