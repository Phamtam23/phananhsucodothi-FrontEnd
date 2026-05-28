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
  const current = Number(currentPage) || 0;
  const total = Number(totalPages) || 0;

  if (total <= 0) return null;

  const getPages = () => {
    const pages: number[] = [];

    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, start + 4);

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
            : current * pageSize + 1}
          {" - "}
          {Math.min((current + 1) * pageSize, totalElements)}
          {" trong số "}
          {totalElements}
        </div>
      )}

      <div className="pagination">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => onPageChange(current - 1)}
        >
          &lt;
        </button>

        {getPages().map((page) => (
          <button
            type="button"
            key={page}
            className={current === page ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}

        {total > 5 && current < total - 3 && (
          <>
            <button type="button" disabled>...</button>

            <button type="button" onClick={() => onPageChange(total - 1)}>
              {total}
            </button>
          </>
        )}

        <button
          type="button"
          disabled={current === total - 1}
          onClick={() => onPageChange(current + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;