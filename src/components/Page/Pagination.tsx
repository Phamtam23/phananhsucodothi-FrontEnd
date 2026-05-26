import "./Pagination.scss";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalElements?: number;
  pageSize?: number;

  onPageChange: (page: number) => void;

  showInfo?: boolean;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize = 10,
  onPageChange,
  showInfo = true,
}: PaginationProps) => {
  if (totalPages <= 0) return null;

  const getPages = () => {
    const pages: number[] = [];

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + 4);

    if (end - start < 4) {
      start = Math.max(0, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      {showInfo && totalElements !== undefined && (
        <div className="pagination-info">
          Hiển thị{" "}
          {totalElements === 0
            ? 0
            : currentPage * pageSize + 1}
          {" - "}
          {Math.min((currentPage + 1) * pageSize, totalElements)}
          {" trong số "}
          {totalElements}
        </div>
      )}

      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &lt;
        </button>

        {getPages().map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}

        {totalPages > 5 && currentPage < totalPages - 3 && (
          <>
            <button disabled>...</button>

            <button onClick={() => onPageChange(totalPages - 1)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;