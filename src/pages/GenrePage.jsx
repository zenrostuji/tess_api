import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import ComicCard, { SkeletonCard } from '../components/ComicCard';

export default function GenrePage() {
  const { genreId, genreName } = useParams();
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/Comics/Genre/${genreId}`)
      .then(data => {
        setComics(data || []);
        setLoading(false);
      })
      .catch(() => {
        setComics([]);
        setLoading(false);
      });
  }, [genreId]);

  return (
    <div className="container page-padding" style={{ marginTop: '64px' }}>
      <h2 className="page-title">📂 {decodeURIComponent(genreName || 'Thể Loại')}</h2>

      {loading ? (
        <div className="comics-grid">
          {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : comics.length > 0 ? (
        <div className="comics-grid">
          {comics.map(c => <ComicCard key={c.comicId} comic={c} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <p>Chưa có truyện trong thể loại này</p>
        </div>
      )}
    </div>
  );
}
