import React from 'react';
import { SearchPaginationProps } from '../../types';

const Pagination: React.FC<SearchPaginationProps> = ({
  currentPage,
  onPageChange,
  startPage,
  endPage,
  totalCount,
  limit,
}) => {
  const getTotalCount = (count: number, limit: number) =>
    Math.ceil(count / limit);
  return (
    <div className="flex justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
      >
        &lt;
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button
          key={startPage + index}
          onClick={() => onPageChange(startPage + index)}
          className={`px-3 py-1 mx-1 rounded-md ${currentPage === startPage + index ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {startPage + index}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === getTotalCount(totalCount, limit)}
        className="px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
