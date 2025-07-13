import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
      >
        Previous
      </button>

      <span>
        Page {pagination.page} of {pagination.pages}
      </span>

      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.pages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 