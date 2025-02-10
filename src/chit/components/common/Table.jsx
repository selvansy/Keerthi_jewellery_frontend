import React from "react";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";

const Table = ({
  data = [],
  columns = [],
  isLoading,
  emptyMessage = "No data available",
  selectedRow,
  activeDropdown
}) => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    console.error("Data and columns must be arrays");
    return null;
  }


  if (data.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center h-96 divide-gray-200">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto relative flex flex-col justify-center items-center">
          {
            isLoading ?

              <Loading />

              :

              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="sticky top-0 z-10">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={column.accessor || index}
                        className={`
                      px-6 py-3
                      text-left text-xs font-medium 
                      text-white uppercase tracking-wider
                      ${column.sticky === "right" ? "right-0" : ""}
                      ${column.sticky === "left" ? "left-0" : ""}
                    `}
                        style={{
                          zIndex: column.sticky ? 30 : 20,
                          backgroundColor: layout_color,
                        }}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                  {
                    data.map((row, rowIndex) => (
                      <tr
                        key={row?.id || row?._id || rowIndex}
                        className={`
                    ${selectedRow === row?._id ? "bg-blue-100" : ""}
                    ${selectedRow !== row?._id ? "hover:bg-gray-50" : ""}
                    transition-colors cursor-pointer
                  `}
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={`${rowIndex}-${column.accessor || colIndex}`}
                            className={`
                        px-6 py-4 text-sm text-gray-900
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
                            {column.cell ? (
                              <div className="relative">{column.cell(row, rowIndex)}</div>
                            ) : (
                              <span className="truncate block max-w-xs">
                                {row[column.accessor]}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))

                  }

                </tbody>
              </table>
          }
        </div>
      </div>
    </div>
  );
};

export default Table;
