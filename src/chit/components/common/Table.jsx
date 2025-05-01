import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import Loading from "./Loading";

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
  debounceSearch,
  handleSearch,
  showPagination = true,
}) => {
  console.log(totalItems , itemsPerPage)
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

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
    <div className={`antialiased w-full ${className}`}>
      <div className="mx-auto bg-white">
        <div className="bg-white relative   overflow-hidden">
          {/* Search Bar */}
          {/* <div className="flex justify-end p-3">
            <div className="relative">
              <input
                type="text"
                onChange={handleSearch}
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg pl-10 pr-10 p-2.5 w-60"
                placeholder="Search"
              />
              <div className="absolute inset-y-0 right-[204px] pl-1 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
            </div>
          </div> */}

          {/* Table with fixed container to enable horizontal scrolling while keeping Actions column fixed */}
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-[#e7eef6] text-[#6C7086]">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`px-4 py-3 font-semibold whitespace-nowrap ${
                          column.header === "Actions" ||
                          column.header === "ACTIONS" ||
                          column.sticky === "right"
                            ? "sticky right-0 z-10 bg-[#e7eef6]"
                            : ""
                        }`}
                        style={
                          column.header === "Actions" ||
                          column.header === "ACTIONS" ||
                          column.sticky === "right"
                            ? { right: 0 }
                            : {}
                        }
                      >
                        <div className="flex items-center">
                          {column.header}
                          {column.sortable && (
                            <ArrowUpDown className="ml-1 h-3 w-3 text-gray-500" />
                          )}
                        </div>
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
                        className="border-t hover:bg-gray-50"
                      >
                        {columns.map((column, columnIndex) => {

                          if (
                            column.header === "Actions" ||
                            column.header === "ACTIONS" ||
                            column.sticky === "right"
                          ) {
                            return (
                              <td
                                key={columnIndex}
                                className={`sticky right-0  px-4 py-3 z-10 ${
                                  columns.length >= 7 ? "bg-white" : ""
                                }`}
                                style={{ right: 0 }}
                              >
                                {column.cell ? (
                                  column.cell(row, rowIndex)
                                ) : (
                                  <div className="dropdown-container relative">
                                    <button
                                      onClick={() =>
                                        setActiveDropdown(
                                          activeDropdown ===
                                            (row?._id || rowIndex)
                                            ? null
                                            : row?._id || rowIndex
                                        )
                                      }
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      <MoreVertical className="h-5 w-5" />
                                    </button>
                                    {activeDropdown ===
                                      (row?._id || rowIndex) && (
                                      <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                                      >
                                        <div className="py-1">
                                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Edit
                                          </button>
                                          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          }

                          if (
                            column.header === "Status" ||
                            column.header === "Active" ||
                            column.header === "ACTIVE"
                          ) {
                            return (
                              <td
                                key={columnIndex}
                                className="px-4 py-3 whitespace-nowrap"
                              >
                                {column.cell ? (
                                  column.cell(row, rowIndex)
                                ) : (
                                  <div className="inline-block h-5 w-5 rounded-full bg-gray-200"></div>
                                )}
                              </td>
                            );
                          }

                          // For all other columns
                          return (
                            <td
                              key={columnIndex}
                              className="px-4 py-3 whitespace-nowrap "
                            >
                              {column.cell
                                ? column.cell(row, rowIndex)
                                : row[column.accessor]}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-3 text-center"
                      >
                        {noDataMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showPagination && data.length >= 1 && (
            <div className="p-4 flex items-center justify-between text-sm text-gray-600 border-t">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </button>

                {[...Array(Math.ceil(totalItems / itemsPerPage)).keys()].map(
                  (page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page + 1
                          ? "bg-blue-600 text-white"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {page + 1}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage >= Math.ceil(totalItems / itemsPerPage)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;