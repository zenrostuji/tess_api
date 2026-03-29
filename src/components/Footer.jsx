import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-text">Web<span className="logo-accent">Truyện</span></span>
            <p>Trang đọc truyện tranh online miễn phí chất lượng cao.</p>
          </div>
          <div className="footer-links">
            <h4>Liên Kết</h4>
            <Link to="/">Trang Chủ</Link>
            <Link to="/search">Tìm Kiếm</Link>
            <Link to="/follows">Theo Dõi</Link>
          </div>
          <div className="footer-links">
            <h4>Thể Loại Hot</h4>
            <Link to="/genre/6508654905d5791ad671a491/Action">Action</Link>
            <Link to="/genre/6508654905d5791ad671a4ea/Romance">Romance</Link>
            <Link to="/genre/6508654905d5791ad671a4c7/Fantasy">Fantasy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 WebTruyện. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
