import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FileSpreadsheet } from "lucide-react";
import { body, style } from "framer-motion/client";

export const ExportToPDF = ({ apiData, fileName = "ExportedData" }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);


  const exportToPDF = (data, fileName) => {
    if (!data || data.length === 0) {
      toast.error("No data to export!");
      return;
    }

    

    const doc = new jsPDF('landscape');
    
    doc.setFontSize(15);
    doc.text(`${fileName.slice(0,-10)}`, 120, 13);

    
    const tableColumn = Object.keys(apiData[0]);
    const tableRows = apiData.map((item) => Object.values(item));

    const lastColumnIndex = tableColumn.length - 1;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20  ,
      styles: {
        fontSize: 7, 
        lineHeight: 1.2,
        cellPadding: { top: 5, right: 3, bottom: 4, left: 4 },
        overflow: 'wrap',
        // cellWidth:'wrap'
        // overflow: 'linebreak'
      },
      headStyles: {
       fontStyle: 'bold',
       overflow: 'linebreak',
      //  whiteSpace: 'wrap',
       lineHeight:"20px",
        fontSize: 9, 
        align: 'middle',         
        cellPadding: { top: 5, right: 1, bottom: 4, left: 5 },
      },
      columnStyles: {
        0: { cellWidth: 'wrap' },
        1: { cellWidth: 'wrap' },
        [lastColumnIndex]: { cellWidth: 'wrap' },
      },
      margin: { left: 3, right: 3,top:8 },
      // pageBreak: 'auto',
    });

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  };
  return (
    <button
      onClick={() => exportToPDF(apiData, fileName)}
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm cursor-pointer`}
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export as Pdf
    </button>
  );
};
