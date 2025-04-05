import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { FileSpreadsheet } from "lucide-react";

export const ExportToExcel = ({ apiData, fileName }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      onClick={(e) => exportToCSV(apiData, fileName)}
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm cursor-pointer`}
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export as Excel
    </button>
  );
};
