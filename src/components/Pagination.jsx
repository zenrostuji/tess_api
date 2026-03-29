export default function Pagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxVisible = 7;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  if (start > 1) {
    pages.push(<button key={1} className="page-btn" onClick={() => onPageChange(1)}>1</button>);
    if (start > 2) pages.push(<span key="dots1" className="page-btn" style={{ border: 'none', background: 'none', cursor: 'default' }}>...</span>);
  }

  for (let i = start; i <= end; i++) {
    pages.push(
      <button
        key={i}
        className={`page-btn ${i === currentPage ? 'active' : ''}`}
        onClick={() => onPageChange(i)}
      >
        {i}
      </button>
    );
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push(<span key="dots2" className="page-btn" style={{ border: 'none', background: 'none', cursor: 'default' }}>...</span>);
    pages.push(<button key={totalPages} className="page-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>);
  }

  return (
    <div className="pagination">
      <button className="page-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
      {pages}
      <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
    </div>
  );
}
