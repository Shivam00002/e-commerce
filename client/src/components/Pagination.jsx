import React from "react";

export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 7;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  return (
    <nav className="flex justify-center mt-4">
      {currentPage > 1 && (
        <button
          className={`mx-2 px-4 py-2 text-gray-500   text-sm rounded cursor-pointer`}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {"<<<"}
        </button>
      )}
      <ul className="flex">
        {generatePageNumbers().map((pageNumber, index) => (
          <li key={index}>
            <button
              className={`mx-1 px-1 py-2  text-sm rounded  cursor-pointer ${
                currentPage === pageNumber
                  ? "text-black font-bold"
                  : "text-gray-500 "
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
      {currentPage < totalPages && (
        <button
          className={`mx-2 px-4 py-2  text-gray-500  text-sm rounded cursor-pointer`}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {">>>"}
        </button>
      )}
    </nav>
  );
};
