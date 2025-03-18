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
    let startPage, endPage;

    if (totalPages <= 7) {
      // Less than 7 pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 7 pages, calculate what to show
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // Add first page
    if (startPage > 1) {
      pages.push(
        <li key={1}>
          <button
            onClick={() => handlePageChange(1)}
            className={`flex items-center justify-center text-sm py-3 px-3 leading-tight ${
              currentPage === 1
                ? "text-primary-600 bg-[#E7EEF5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            1
          </button>
        </li>
      );
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1">
            <span className="flex items-center justify-center text-sm py-3 px-3 leading-tight text-gray-500">
              ...
            </span>
          </li>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`flex items-center justify-center text-sm py-3 px-3 leading-tight ${
              currentPage === i
                ? "text-primary-600 bg-[#E7EEF5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <li key="ellipsis2">
          <span className="flex items-center justify-center text-sm py-3 px-3 leading-tight text-gray-500">
            ...
          </span>
        </li>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      pages.push(
        <li key={totalPages}>
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`flex items-center justify-center text-sm py-3 px-3 leading-tight ${
              currentPage === totalPages
                ? "text-primary-600 bg-[#E7EEF5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {totalPages}
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
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          </li>

          {renderPageNumbers()}

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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