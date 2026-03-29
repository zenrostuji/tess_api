import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, formatNumber } from '../utils/api';
import ComicCard, { SkeletonCard } from '../components/ComicCard';
import Pagination from '../components/Pagination';

export default function HomePage() {
  const [comics, setComics] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('/api/Genres').then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/Comics/page?page=${page}`)
      .then(data => {
        setComics(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch(() => {
        setComics([]);
        setLoading(false);
      });
  }, [page]);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroSearch = () => {
    if (!searchVal.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <h1 className="hero-title">
            Khám Phá Thế Giới <span className="gradient-text">Truyện Tranh</span>
          </h1>
          <p className="hero-subtitle">
            Hàng nghìn bộ truyện tranh được cập nhật liên tục. Đọc miễn phí, không giới hạn.
          </p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Nhập tên truyện bạn muốn tìm..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') heroSearch(); }}
            />
            <button onClick={heroSearch} className="btn btn-primary btn-lg">Tìm Kiếm</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{formatNumber(totalElements)}</span>
              <span className="stat-label">Bộ Truyện</span>
            </div>
            <div className="stat">
              <span className="stat-num">0</span>
              <span className="stat-label">Chapters</span>
            </div>
            <div className="stat">
              <span className="stat-num">{genres.length}</span>
              <span className="stat-label">Thể Loại</span>
            </div>
          </div>
        </div>
      </div>

      {/* GENRE TAGS */}
      <div className="container">
        <div className="genre-tags">
          {genres.slice(0, 20).map(g => (
            <span
              key={g.genreId}
              className="genre-tag"
              onClick={() => navigate(`/genre/${g.genreId}/${encodeURIComponent(g.name)}`)}
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>

      {/* COMICS */}
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🔥</span>
            Truyện Mới Cập Nhật
          </h2>
        </div>
        <div className="comics-grid">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
            : comics.length > 0
              ? comics.map(c => <ComicCard key={c.comicId} comic={c} />)
              : (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                  <span className="empty-icon">📚</span>
                  <p>Chưa có truyện nào</p>
                </div>
              )
          }
        </div>
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
      </div>
    </>
  );
}
