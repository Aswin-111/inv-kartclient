import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const paginationRange = [];
  const siblingCount = 1;
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 0);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPages - 1
  );

  for (let i = 0; i < totalPages; i++) {
    if (
      i === 0 ||
      i === totalPages - 1 ||
      (i >= leftSiblingIndex && i <= rightSiblingIndex)
    ) {
      paginationRange.push(i);
    } else if (i === leftSiblingIndex + 1 || i === rightSiblingIndex - 1) {
      paginationRange.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
          currentPage === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 0}
      >
        «
      </button>
      {paginationRange.map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span key={index} className="px-3 py-1 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={pageNumber}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              currentPage === pageNumber
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber + 1}
          </button>
        )
      )}
      <button
        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
          currentPage === totalPages - 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
