import React from "react";

import jsPDF from "jspdf";

import "jspdf-autotable"; // For table support
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const ExportToPDF = ({ apiData = [], fileName = "ExportedData" }) => {
    
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  
    const exportToPDF = (data, fileName) => {
      if (!data || data.length === 0) {
        toast.error("No data to export!");
        return;
      }
   
      const doc = new jsPDF();
   
      // Adding a title
      doc.setFontSize(16);
      doc.text("Exported Data", 14, 15);
   
      // Extract table columns and rows
      const tableColumn = Object.keys(data[0]);
      const tableRows = data.map((item) => Object.values(item));
       
   
      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
      });
   
      // Save the PDF
      doc.save(`${fileName}.pdf`);
    };
   
    return (
  <button
        onClick={() => exportToPDF(apiData, fileName)}
        className="flex items-center p-2  text-white rounded-md gap-2"
        style={{ backgroundColor: layout_color }} >
  <p>PDF</p>
  <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
  >
  <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.55"
            d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5l5-5m-5-7v12"
          />
  </svg>
  </button>
    );
  };
   

