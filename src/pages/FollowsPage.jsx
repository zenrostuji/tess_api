import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, getThumbUrl, timeAgo } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280' fill='%231a1f2e'%3E%3Crect width='200' height='280'/%3E%3C/svg%3E";

export default function FollowsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch('/api/follows/my')
      .then(data => {
        setFollows(data || []);
        setLoading(false);
      })
      .catch(() => {
        setFollows([]);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="container page-padding" style={{ marginTop: '64px' }}>
      <h2 className="page-title">📖 Truyện Theo Dõi</h2>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /><p>Đang tải...</p></div>
      ) : !token ? (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <p>Vui lòng đăng nhập để xem truyện theo dõi</p>
        </div>
      ) : follows.length > 0 ? (
        <div className="comics-grid">
          {follows.map(f => (
            <div key={f.comicId} className="comic-card" onClick={() => navigate(`/comic/${f.comicId}`)}>
              <div className="comic-card-thumb">
                <img
                  src={getThumbUrl(f.thumbUrl) || placeholderImg}
                  alt={f.name}
                  loading="lazy"
                  onError={e => { e.target.src = placeholderImg; }}
                />
                <div className="comic-card-overlay"><span>👁 Đọc ngay</span></div>
              </div>
              <div className="comic-card-info">
                <div className="comic-card-name">{f.name}</div>
                <div className="comic-card-meta">{timeAgo(f.followedAt)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <p>Bạn chưa theo dõi truyện nào</p>
        </div>
      )}
    </div>
  );
}
