import React, { useState, useEffect, useRef } from "react";
import Pagination from "./pagination";

const Table = ({
  data = [],
  columns = [],
  className = "",
  loading = false,
  noDataMessage = "No data available",
  totalItems,
  currentPage,
  itemsPerPage,
  handlePageChange,
  handleItemsPerPageChange,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className={`  antialiased ${className}`}>
      <div className="mx-auto">
        <div className="bg-white relative  overflow-hidden ">
          <div className="overflow-x-auto ]">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-[#E7EEF5] h-[37px]">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`px-[20px] py-[12px] ${
                        column.header === "Actions"
                          ? "sticky right-0 bg-[#E7EEF5]"
                          : ""
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-3 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr
                      key={row?._id || rowIndex}
                      className="border-b hover:bg-gray-50"
                    >
                      {columns.map((column, columnIndex) => (
                        <td
                          key={columnIndex}
                          className={`z-1 px-5 py-3 ${
                            column.header === "Actions"
                              ? "sticky right-0  bg-white shadow-md"
                              : ""
                          }`}
                          ref={
                            column.header === "Actions" &&
                            activeDropdown === row?._id
                              ? dropdownRef
                              : null
                          }
                        >
                          {column.cell
                            ? column.cell(row, rowIndex)
                            : row[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-3 text-center "
                    >
                      {noDataMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {data.length >= 1 && (
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </section>
  );
};

export default Table;
