import React from "react";

const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage,
  handlePageChange,
  handleItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`flex items-center justify-center text-sm py-3 px-3 leading-tight ${
              currentPage === i
                ? "text-primary-600 bg-[#E7EEF5]"
                : "text-gray-500     hover:text-gray-700"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <nav
      className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
      aria-label="Table navigation"
    >
      <div className="flex items-center space-x-3">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing
          <span className="font-semibold text-gray-900 dark:text-white mx-1">
            {(currentPage - 1) * itemsPerPage + 1}
            <span className="mx-1 text-gray-500">to</span>
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>
          of
          <span className="font-semibold text-gray-900 dark:text-white mx-1">
            {totalItems} entries
          </span>
        </span>
      </div>
      <div className="flex space-x-2">
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 py-2">Rows per page: </span>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="px-2 border border-gray-300 rounded-md text-sm"
        >
          {[10, 15, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              Previous
            </button>
          </li>

          {renderPageNumbers()}

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Pagination;
