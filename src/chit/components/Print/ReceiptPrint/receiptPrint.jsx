import React, { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { useSelector } from "react-redux";

const ThermalReceipt = ({ isOpen, setIsOpen, scheme, payments = [],branchData }) => {
  const receiptRef = useRef();
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const schemeType=[2,6,5,3,4,12,10,14]
  // 🖨 Print / Download
  const handleDownload = () => {
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
  body {
    margin: 0;
    padding: 0;
  }

  .print-area {
    width: 72mm; /* Safe width for 80mm printer */
    max-width: 72mm;
    margin: 0 auto;
    padding: 0 4px; /* Small inner padding */
    overflow: hidden;
  }

  @page {
    size: 80mm auto;
    margin: 0; /* Completely remove page margins */
  }
}

          </style>
        </head>
        <body>
          <div class="bg-white text-xs leading-tight max-w-sm mx-auto print-area">
            ${printContent}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

         function spliceDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(num * factor) / factor;
  }


  return (
    <div className="p-6">
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[90vh] flex flex-col relative">
            {/* Close button (always at top) */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold z-10"
            >
              ×
            </button>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {/* Receipt Content */}
              <div
                ref={receiptRef}
                className="bg-white shadow-lg p-3 text-xs leading-snug max-w-sm mx-auto print-area"
              >
                {/* Header */}
                <div className="text-center mb-1">
                  <h1 className="font-bold text-sm leading-tight">
                   {branchData?.branch_name}
                  </h1>
                  <p className="text-xs">
                   {branchData?.address}
                  </p>
                  <p className="text-xs">
                   Phone:  {branchData?.phone}
                    </p>
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Customer Info */}
                <div className="text-center mb-2">
                  <h2 className="font-bold text-sm">SCHEME RECEIPT</h2>
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Scheme Title */}
                <div className="text-center mb-2">
                  <h3 className="font-bold text-sm">{scheme?.schemeName}</h3>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Customer Name :</span>
                  <span>{scheme?.customerName}</span>
                </div>
                <div className="flex justify-between ">
                  <span>Mobile No :</span>
                  <span>{scheme?.mobile}</span>
                </div>
                <div className="flex justify-between ">
                  <span>Scheme Code :</span>
                  <span>{scheme?.schemeCode}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Accounter Name :</span>
                  <span>{scheme?.accounterName}</span>
                </div>

                {payments.map((p, idx) => (
                  <div key={idx}>
                    <div className="border-t border-dashed border-gray-400 my-2"></div>

                    <div className="space-y-0.5">
                      <div className="flex justify-between">
                        <span>Receipt No</span>
                        <span>{p.receiptNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span>
                          {new Date(p.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Installment No</span>
                        <span>{p.installmentNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount</span>
                        <span>
                          {spliceDecimals( p.amount,3)}
                          </span>
                      </div>
                      {schemeType.includes(scheme.scheme_type)&&(
                        <div className="flex justify-between">
                        <span>Gold Weight</span>
                        <span>
                          {spliceDecimals(p.metal_weight,3)}
                        </span>
                      </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span>Metal Rate</span>
                        <span>{p.metalRate}</span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="text-center my-1">
                      <p className="text-xs">
                        (Amount Paid Through {p.paymentModeName})
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-dashed border-gray-400 my-2"></div>

         
                     <div className="flex justify-between font-bold">
                  <span>{schemeType.includes(scheme.scheme_type)?"Total Accumulated Wt":"Total Accumulated Amount"}</span>
                  <span>{schemeType.includes(scheme.scheme_type)?spliceDecimals(scheme.total_weight,3):spliceDecimals(scheme.total_amt,2)}</span>
                </div>

                <div className="border-t border-dashed border-gray-400 my-2"></div>

                {/* Footer */}
                <div className="text-center mt-2">
                </div>

                <div className="h-8"></div>
              </div>
            </div>

            {/* Print Button (always bottom center) */}
            <div className="p-3 border-t flex justify-center">
              <button
                onClick={handleDownload}
                style={{backgroundColor: layout_color }}
                className="flex items-center gap-2  text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThermalReceipt;
