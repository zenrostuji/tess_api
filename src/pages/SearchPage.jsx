import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import ComicCard, { SkeletonCard } from '../components/ComicCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setSearched(true);
    apiFetch(`/api/Comics/search?keyword=${encodeURIComponent(query)}`)
      .then(data => {
        setResults(data || []);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="container page-padding" style={{ marginTop: '64px' }}>
      <h2 className="page-title">🔍 Tìm Kiếm</h2>
      {query && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Kết quả cho: "{query}"</p>}

      {loading ? (
        <div className="comics-grid">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="comics-grid">
          {results.map(c => <ComicCard key={c.comicId} comic={c} />)}
        </div>
      ) : searched ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>Không tìm thấy kết quả nào</p>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>Nhập từ khóa để tìm kiếm truyện</p>
        </div>
      )}
    </div>
  );
}
