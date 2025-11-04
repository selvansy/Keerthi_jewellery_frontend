import React from "react";
import { Printer } from "lucide-react";
import { useSelector } from "react-redux";

const PrintPassbookFrontButton = ({ accountDetails }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const handlePrint = () => {
    const printContent = `
    <div style="
      font-family: Arial, sans-serif; 
      width: 18cm; 
      height: 18cm; 
      padding: 4px 4px; 
      margin-top:9.6cm;      
    ">
      <div style="   display: flex; flex-direction: column;   padding: 10px 20px 10px 20px; ">
      
      
      <div style="display: flex; flex-direction: column;  padding: 10px 20px 10px 20px; ">
      <div style="text-align: center; margin-bottom: 20px;"> 
        <strong style="font-size: 16px;">Customer Details</strong> 
      </div>
      
        <div style="display: flex; margin-bottom: 12px;">
          <strong style="width: 130px;">Scheme Name</strong>
          <span> <strong style="width: 130px;">:</strong> ${" "}   ${accountDetails.schemeName}</span>
        </div>
        <div style="display: flex; margin-bottom: 12px;">
          <strong style="width: 130px;">Account No</strong>
          <span><strong style="width: 130px;">:</strong> ${" "}  ${accountDetails.schemeCode}</span>
        </div>
        <div style="display: flex; margin-bottom: 12px;">
          <strong style="width: 130px;">Name</strong>
          <span><strong style="width: 130px;">:</strong> ${" "}  ${accountDetails.name}</span>
        </div>
        <div style="display: flex; margin-bottom: 12px;">
          <strong style="width: 130px;">Address</strong>
          <span><strong style="width: 130px;">:</strong> ${" "}  ${accountDetails.address}</span>
        </div>
        <div style="display: flex; margin-bottom: 12px;">
          <strong style="width: 130px;">Mobile</strong>
          <span> <strong style="width: 130px;">:</strong> ${" "}  ${accountDetails.mobile}</span>
        </div>
      </div>
       </div>
    </div>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Passbook Front</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            
          }
          
          @page { 
            size: 18cm 9cm landscape;
            margin: 0;
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
            
            /* Remove headers and footers */
            @page {
              margin: 0;
              
            }
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 18cm;
            height: 9cm;
          
          }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();

    // Small delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 rounded text-white"
      style={{ backgroundColor: layout_color }}
    >
      <Printer size={18} />
      Print Front Page
    </button>
  );
};



export default PrintPassbookFrontButton;


  // <div style="display: flex; margin-bottom: 12px;">
  //         <strong style="width: 130px;">Branch Name:</strong>
  //         <span>${accountDetails.branchName}</span>
  //       </div>