import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch, getThumbUrl } from '../utils/api';
import AuthModal from './AuthModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const searchTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    apiFetch('/api/Genres').then(setGenres).catch(() => {});
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.user-menu')) setShowUserDropdown(false);
      if (!e.target.closest('.search-bar')) setShowSuggestions(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSearchInput = useCallback((val) => {
    setSearchQuery(val);
    clearTimeout(searchTimeout.current);
    if (val.trim().length < 2) {
      setShowSuggestions(false);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await apiFetch(`/api/Comics/search?keyword=${encodeURIComponent(val.trim())}`);
        if (results && results.length > 0) {
          setSuggestions(results.slice(0, 6));
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch {
        setShowSuggestions(false);
      }
    }, 300);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const openLogin = () => { setAuthTab('login'); setShowAuthModal(true); };
  const openRegister = () => { setAuthTab('register'); setShowAuthModal(true); };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner container">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">Web<span className="logo-accent">Truyện</span></span>
          </Link>

          <nav className="nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Trang Chủ</Link>
            <div className="nav-dropdown">
              <span className="nav-link dropdown-trigger">
                Thể Loại
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              <div className="dropdown-menu">
                {genres.map(g => (
                  <a key={g.genreId} onClick={() => navigate(`/genre/${g.genreId}/${encodeURIComponent(g.name)}`)}>
                    {g.name}
                  </a>
                ))}
              </div>
            </div>
            <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>Tìm Kiếm</Link>
          </nav>

          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm truyện..."
                value={searchQuery}
                onChange={e => handleSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button onClick={handleSearch}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              {showSuggestions && (
                <div className="search-suggestions active">
                  {suggestions.map(c => {
                    const comicId = c.comicId || c.id || c._id;
                    return (
                    <div key={comicId} className="search-suggestion-item" onClick={() => { setShowSuggestions(false); if (comicId) navigate(`/comic/${comicId}`); }}>
                      <img src={getThumbUrl(c.thumbUrl)} alt={c.name} onError={e => { e.target.style.display = 'none'; }} />
                      <span>{c.name}</span>
                    </div>
                  )})}
                </div>
              )}
            </div>

            {!token ? (
              <div className="auth-buttons">
                <button className="btn btn-ghost" onClick={openLogin}>Đăng Nhập</button>
                <button className="btn btn-primary" onClick={openRegister}>Đăng Ký</button>
              </div>
            ) : (
              <div className="user-menu">
                <button className="user-avatar-btn" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                  {user?.image ? (
                    <img src={user.image} alt="avatar" className="user-avatar" />
                  ) : (
                    <span className="user-avatar-letter">
                      {(user?.userName || 'U')[0].toUpperCase()}
                    </span>
                  )}
                  <span>{user?.userName || 'User'}</span>
                </button>
                <div className={`user-dropdown ${showUserDropdown ? 'active' : ''}`}>
                  <a onClick={() => { setShowUserDropdown(false); navigate('/profile'); }}>👤 Trang Cá Nhân</a>
                  <a onClick={() => { setShowUserDropdown(false); navigate('/follows'); }}>📖 Truyện Theo Dõi</a>
                  <hr />
                  <button onClick={() => { setShowUserDropdown(false); logout(); navigate('/'); }}>🚪 Đăng Xuất</button>
                </div>
              </div>
            )}

            <button className="mobile-menu-btn" onClick={() => setShowMobile(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${showMobile ? 'active' : ''}`} onClick={() => setShowMobile(false)} />
      <div className={`mobile-menu ${showMobile ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span className="logo-text">Web<span className="logo-accent">Truyện</span></span>
          <button onClick={() => setShowMobile(false)} className="close-btn">&times;</button>
        </div>
        <div className="mobile-menu-links">
          <a onClick={() => { setShowMobile(false); navigate('/'); }}>🏠 Trang Chủ</a>
          <a onClick={() => { setShowMobile(false); navigate('/search'); }}>🔍 Tìm Kiếm</a>
          <a onClick={() => { setShowMobile(false); navigate('/follows'); }}>📖 Theo Dõi</a>
          {token && <a onClick={() => { setShowMobile(false); navigate('/profile'); }}>👤 Cá Nhân</a>}
          {!token && (
            <>
              <a onClick={() => { setShowMobile(false); openLogin(); }}>🔑 Đăng Nhập</a>
              <a onClick={() => { setShowMobile(false); openRegister(); }}>📝 Đăng Ký</a>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </>
  );
}
