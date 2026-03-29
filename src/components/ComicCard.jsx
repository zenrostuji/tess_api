import { getThumbUrl, getLatestChapter, timeAgo } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='280' fill='%231a1f2e'%3E%3Crect width='200' height='280'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2364748b' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ComicCard({ comic }) {
  const navigate = useNavigate();
  const latest = getLatestChapter(comic.chaptersLatest);
  const chapterText = latest ? `Chap ${latest.chapter_name}` : '';
  const thumbUrl = getThumbUrl(comic.thumbUrl) || placeholderImg;

  const comicId = comic.comicId || comic.id || comic._id;

  return (
    <div className="comic-card" onClick={() => comicId && navigate(`/comic/${comicId}`)}>
      <div className="comic-card-thumb">
        <img
          src={thumbUrl}
          alt={comic.name}
          loading="lazy"
          onError={e => { e.target.src = placeholderImg; }}
        />
        {chapterText && <span className="comic-chapter-badge">{chapterText}</span>}
        <div className="comic-card-overlay">
          <span>👁 Đọc ngay</span>
        </div>
      </div>
      <div className="comic-card-info">
        <div className="comic-card-name">{comic.name}</div>
        <div className="comic-card-meta">{timeAgo(comic.updatedAt)}</div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumb"></div>
      <div className="skeleton-text skeleton" style={{ width: '80%' }}></div>
      <div className="skeleton-text skeleton-text-sm skeleton"></div>
    </div>
  );
}
