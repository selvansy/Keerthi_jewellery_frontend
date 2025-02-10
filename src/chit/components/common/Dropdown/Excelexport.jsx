import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from 'react-redux';

export const ExportToExcel = ({ apiData, fileName }) => {

  console.log(apiData)

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
    <button onClick={(e) => exportToCSV(apiData, fileName)}
    className='flex items-center bg-primary p-2 text-white rounded-md gap-4'
    style={{ backgroundColor: layout_color }}>
      <p>Excel</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5l5-5m-5-7v12"/></svg>
    </button>
  );
};