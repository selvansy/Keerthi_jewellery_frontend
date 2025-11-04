import React from "react";
import { useSelector } from "react-redux";

const PassbookHeader = ({schemeType}) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const schemeTypeNo=[2,6,5,3,4,12,10,14]
  
  const handlePrint = () => {
    const showWeight = schemeTypeNo.includes(schemeType);
    const headerHTML = `
      <div class="passbook-page">
        <div style="
          width: 100%; 
          height: 1cm; 
          font-size: 10px;
          display: flex; 
          align-items: center;
          border-bottom: 1px solid #000;
        ">
          <div style="width: 10%; padding-left:4px;">Installment</div>
          <div style="width: 18%; padding-left:4px;">Rate</div>
          ${showWeight ? `<div style="width: 18%; padding-left:4px;">Weight</div>` : ""}
          <div style="width: 20%; padding-left:4px;">Date</div>
          <div style="width: 17%; padding-right:4px;">Amount</div>
          ${showWeight ? `<div style="width: 18%; padding-left:4px;">Acc. Wt</div>` : ""}
          <div style="width: 17%; padding-right:4px;">Receipt No</div>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Passbook Header</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body { 
              margin: 0; 
              padding: 0; 
              width: 100%;
              height: 100%;
              background: white;
            }
            
            .passbook-page {
              width: 18cm;
              height: 9cm;
              padding: 0.5cm;
              background: white;
              box-sizing: border-box;
            }
            
            @page { 
              margin: 0; 
              size: 18cm 9cm landscape;
            }
            
            @media print {
              html, body {
                width: 18cm;
                height: 9cm;
                margin: 0;
                padding: 0;
              }
              
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .passbook-page {
                margin: 0;
                page-break-after: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${headerHTML}
        </body>
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
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 rounded text-white"
        style={{ backgroundColor: layout_color }}
      >
        Print Header
      </button>
    </div>
  );
};

export default PassbookHeader;