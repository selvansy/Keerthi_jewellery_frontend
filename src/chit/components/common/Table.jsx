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
  perItemSelect = true,
  itemsPerPageOptions = [10, 25, 50, 100]
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const dropdownRefs = useRef({});
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setActiveDropdown(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentPage !== prevPageRef.current) {
      setIsPageChanging(true);
      const timer = setTimeout(() => {
        setIsPageChanging(false);
      }, 300); // Small delay to prevent flickering if data loads very quickly
      return () => clearTimeout(timer);
    }
    prevPageRef.current = currentPage;
  }, [currentPage]);

  const setDropdownRef = (id, node) => {
    if (node) {
      dropdownRefs.current[id] = node;
    } else {
      delete dropdownRefs.current[id];
    }
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: itemsPerPage }).map((_, rowIndex) => (
      <tr key={`skeleton-${rowIndex}`} className="border-t">
        {columns.map((column, columnIndex) => {
          const isStickyAction =
            column.header === "Actions" ||
            column.header === "ACTIONS" ||
            column.sticky === "right";

          if (isStickyAction) {
            return (
              <td
                key={`skeleton-action-${columnIndex}`}
                className="sticky right-0 px-4 py-3 z-10 bg-white w-[120px]"
                style={{ right: 0 }}
              >
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </td>
            );
          }

          return (
            <td
              key={`skeleton-${columnIndex}`}
              className="px-4 py-3 whitespace-nowrap"
            >
              <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <div className={`antialiased w-full ${className}`}>
      <div className="mx-auto bg-white">
        <div className="bg-white relative overflow-hidden">
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
                    renderSkeletonRows()
                  ) : data.length > 0 ? (
                    data.map((row, rowIndex) => (
                      <tr
                        key={row?._id || rowIndex}
                        className="border-t hover:bg-gray-50"
                      >
                        {columns.map((column, columnIndex) => {
                          const isStickyAction =
                            column.header === "Actions" ||
                            column.header === "ACTIONS" ||
                            column.sticky === "right";

                          if (isStickyAction) {
                            return (
                              <td
                                key={columnIndex}
                                className="sticky right-0 px-4 py-3 z-10 bg-white hover:bg-gray-50 w-[120px]"
                                style={{ right: 0 }}
                              >
                                {column.cell ? (
                                  column.cell(row, rowIndex)
                                ) : (
                                  <div className="relative">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(
                                          activeDropdown === (row?._id || rowIndex)
                                            ? null
                                            : row?._id || rowIndex
                                        );
                                      }}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      <MoreVertical className="h-5 w-5" />
                                    </button>
                                    {activeDropdown === (row?._id || rowIndex) && (
                                      <div
                                        ref={(node) => setDropdownRef(row?._id || rowIndex, node)}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100"
                                      >
                                        <div className="py-1">
                                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Edit
                                          </button>
                                          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
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

                          return (
                            <td
                              key={columnIndex}
                              className="px-4 py-3 text-[#232323] text-[14px] font-medium whitespace-nowrap"
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
                      <td colSpan={columns.length} className="px-4 py-3 text-center">
                        {noDataMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showPagination && !loading && data.length >= 1 && (
            <div className="p-4 flex items-center justify-between text-sm text-gray-600 border-t">
              <div className="flex items-center space-x-4">
                <div>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                
                {/* Items per page dropdown - only shown when perItemSelect is true */}
                {perItemSelect && (
                  <div className="flex items-center space-x-2">
                    {/* <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                      Items per page:
                    </label> */}
                    <select
                      id="itemsPerPage"
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {/* <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option> */}
                      {itemsPerPageOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsPageChanging(true);
                    handlePageChange(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded border ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#1e3b8b] hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </button>

                {/* Pagination buttons */}
                {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === Math.ceil(totalItems / itemsPerPage) ||
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, i, array) => (
                    <React.Fragment key={page}>
                      <button
                        onClick={() => {
                          console.log(page)
                          setIsPageChanging(true);
                          handlePageChange(page);
                        }}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? "bg-[#1e3b8b] text-white"
                            : "text-[#1e3b8b] hover:bg-blue-50"
                        }`}
                      >
                        {page}
                      </button>
                      {array[i + 1] - page > 1 && (
                        <span className="px-2">...</span>
                      )}
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => {
                    setIsPageChanging(true);
                    handlePageChange(currentPage + 1);
                  }}
                  disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                  className={`flex items-center px-3 py-1 rounded border ${
                    currentPage >= Math.ceil(totalItems / itemsPerPage)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#1e3b8b] hover:bg-blue-50"
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