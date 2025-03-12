import React from "react";

import jsPDF from "jspdf";

import "jspdf-autotable"; // For table support
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FileSpreadsheet } from "lucide-react";

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
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm cursor-pointer`}
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export as Pdf
    </button>
  );
};
