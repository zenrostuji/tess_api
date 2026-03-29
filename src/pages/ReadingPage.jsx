import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChapterImages } from '../utils/api';

export default function ReadingPage() {
  const { comicId, apiUrl, chapterName } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(decodeURIComponent(chapterName || 'Đang tải...'));

  useEffect(() => {
    setLoading(true);
    const decodedUrl = decodeURIComponent(apiUrl);
    fetchChapterImages(decodedUrl)
      .then(data => {
        if (data.data && data.data.item) {
          const item = data.data.item;
          const domain = data.data.domain_cdn || 'https://sv1.otruyencdn.com';
          const chapterPath = item.chapter_path;
          const imgs = (item.chapter_image || []).map(img => ({
            src: `${domain}/${chapterPath}/${img.image_file}`,
            page: img.image_page,
          }));
          setImages(imgs);
          if (item.chapter_name) setTitle(item.chapter_name);
        }
        setLoading(false);
      })
      .catch(() => {
        setImages([]);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <>
      <div className="reading-header">
        <button className="btn btn-ghost" onClick={() => navigate(`/comic/${comicId}`)}>← Quay lại</button>
        <span>{title}</span>
      </div>
      <div className="reading-content">
        {loading ? (
          <div className="loading-spinner" style={{ paddingTop: '4rem' }}>
            <div className="spinner" />
            <p>Đang tải trang truyện...</p>
          </div>
        ) : images.length > 0 ? (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={`Page ${img.page}`}
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ))
        ) : (
          <div className="empty-state" style={{ paddingTop: '4rem' }}>
            <span className="empty-icon">⚠️</span>
            <p>Không thể tải trang truyện</p>
          </div>
        )}
      </div>
    </>
  );
}
