import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch, getThumbUrl, getLatestChapter, timeAgo, escapeHtml } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280' fill='%231a1f2e'%3E%3Crect width='200' height='280'/%3E%3C/svg%3E";

export default function ComicDetailPage() {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const { token, isFollowed, toggleFollow } = useAuth();
  const showToast = useToast();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch(`/api/Comics/${comicId}`),
      apiFetch(`/api/Chapters/Comic/${comicId}`),
      apiFetch(`/api/comments/comic/${comicId}`).catch(() => []),
    ]).then(([comicData, chaptersData, commentsData]) => {
      setComic(comicData);
      const sorted = (chaptersData || []).sort((a, b) => (b.chapterIndex || 0) - (a.chapterIndex || 0));
      setChapters(sorted);
      setComments(commentsData || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [comicId]);

  const handleFollow = async () => {
    if (!token) {
      showToast('Vui lòng đăng nhập', 'info');
      return;
    }
    const success = await toggleFollow(comicId);
    if (success) {
      showToast(isFollowed(comicId) ? 'Đã bỏ theo dõi' : 'Đã theo dõi truyện!', isFollowed(comicId) ? 'info' : 'success');
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comicId, content: commentText }),
      });
      setCommentText('');
      showToast('Đã gửi bình luận!', 'success');
      const updated = await apiFetch(`/api/comments/comic/${comicId}`).catch(() => []);
      setComments(updated || []);
    } catch {
      showToast('Lỗi gửi bình luận', 'error');
    }
  };

  const readChapter = (chapter) => {
    if (!chapter.chapterApiData) {
      showToast('Chương này chưa có dữ liệu', 'error');
      return;
    }
    navigate(`/read/${comicId}/${encodeURIComponent(chapter.chapterApiData)}/${encodeURIComponent(chapter.chapterName || '')}`);
  };

  if (loading) {
    return (
      <div className="comic-detail-wrapper">
        <div className="comic-detail-banner" style={{ background: 'var(--bg-card)' }} />
        <div className="container page-padding">
          <div className="loading-spinner"><div className="spinner" /><p>Đang tải...</p></div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="comic-detail-wrapper">
        <div className="container page-padding">
          <div className="empty-state"><span className="empty-icon">⚠️</span><p>Không thể tải thông tin truyện</p></div>
        </div>
      </div>
    );
  }

  const latest = getLatestChapter(comic.chaptersLatest);
  const thumbUrl = getThumbUrl(comic.thumbUrl) || placeholderImg;
  const followed = isFollowed(comicId);

  return (
    <div className="comic-detail-wrapper">
      <div className="comic-detail-banner" style={{ backgroundImage: `url(${thumbUrl})` }} />
      <div className="container page-padding">
        <div className="comic-detail">
          <div className="comic-detail-cover">
            <img src={thumbUrl} alt={comic.name} onError={e => { e.target.src = placeholderImg; }} />
          </div>
          <div className="comic-detail-info">
            <h1 className="comic-detail-name">{comic.name}</h1>
            {comic.originName && <p className="comic-detail-origin">{comic.originName}</p>}
            <div className="comic-detail-badges">
              <span className="badge badge-status">{comic.status || 'Đang cập nhật'}</span>
              {latest && <span className="badge badge-chapter">Chap {latest.chapter_name}</span>}
            </div>
            <div className="comic-detail-actions">
              {chapters.length > 0 && (
                <button className="btn btn-primary" onClick={() => readChapter(chapters[chapters.length - 1])}>
                  📖 Đọc Ngay
                </button>
              )}
              {token && (
                <button className={`btn-follow ${followed ? 'following' : ''}`} onClick={handleFollow}>
                  {followed ? '❤️ Đang Theo Dõi' : '🤍 Theo Dõi'}
                </button>
              )}
            </div>
            <p className="comic-detail-updated">🕐 Cập nhật: {timeAgo(comic.updatedAt)}</p>
          </div>
        </div>

        {/* Chapters */}
        {chapters.length > 0 && (
          <div className="chapters-section">
            <h3 className="chapters-title">📑 Danh Sách Chương ({chapters.length})</h3>
            <div className="chapters-list">
              {chapters.map((ch, idx) => (
                <div key={idx} className="chapter-item" onClick={() => readChapter(ch)}>
                  <div>
                    <div className="chapter-item-name">{ch.chapterName || `Chương ${ch.chapterIndex}`}</div>
                    {ch.chapterTitle && <div className="chapter-item-title">{ch.chapterTitle}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="comments-section">
          <h3 className="comments-title">💬 Bình Luận ({comments.length})</h3>
          {token ? (
            <div className="comment-form">
              <input
                type="text"
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleComment(); }}
              />
              <button className="btn btn-primary" onClick={handleComment}>Gửi</button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Đăng nhập để bình luận</p>
          )}
          <div className="comment-list">
            {comments.length > 0 ? comments.map((c, idx) => (
              <div key={idx} className="comment-item">
                <div className="comment-avatar">{(c.account?.userName || 'U')[0].toUpperCase()}</div>
                <div className="comment-body">
                  <div className="comment-author">{c.account?.userName || 'Người dùng'}</div>
                  <div className="comment-content">{c.content || ''}</div>
                  <div className="comment-time">{timeAgo(c.createdAt)}</div>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có bình luận nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
