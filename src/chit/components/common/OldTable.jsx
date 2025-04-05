import React from "react";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";

const Table = ({
  data = [],
  columns = [],
  isLoading,
  selectedRow,
  activeDropdown

}) => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    console.error("Data and columns must be arrays");
    return null;
  }

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  return (
    <div className="flex flex-col  overflow-y-auto">
    <div className="overflow-x-auto ">
      <div className="relative">
        <table className="w-full divide-y divide-gray-200">
       
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.accessor || index}
                  className={`
                 p-3 text-left text-xs font-medium text-slate-50 uppercase
                    ${column.sticky === "right" ? "right-0" : ""}
                    ${column.sticky === "left" ? "left-0" : ""}
                  `}
                  style={{
                    backgroundColor: layout_color, 
                    position: "sticky",
                    top: 10,
                    zIndex: 50,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
  
       
          <tbody className="bg-white divide-y divide-gray-200 text-start">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4 my-10">
                  <Loading />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row?._id || rowIndex}

                className={`
                  ${selectedRow === row?._id ? "bg-blue-100" : ""}
                  ${selectedRow !== row?._id ? "hover:bg-gray-50" : ""}
                  transition-colors cursor-pointer 
                `} >

                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                  
                      className={`
                       px-6 py-4 text-sm text-gray-900 text-start
                        ${column.sticky === "right" ? "right-0" : ""}
                        ${column.sticky === "left" ? "left-0" : ""}
                        ${selectedRow === row?._id && activeDropdown
                                  ? "bg-slate-100"
                                  : ""
                                }
                        ${selectedRow !== row?._id && rowIndex % 2 !== 0 ? "bg-[#F3F7FF]" : ""}
                      `}
                              style={{
                                zIndex: column.sticky ? 10 : 0,
                              }}

                    >
                      {column.cell ? column.cell(row, rowIndex) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-40 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  );
};

export default Table;
