import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export default function ProfilePage() {
  const { user, setUser, token, followedComics } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [stats, setStats] = useState({ totalFollows: 0, totalComments: 0 });
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh hợp lệ', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setUser(prev => ({ ...prev, image: base64 }));
      showToast('Đã cập nhật avatar thành công!', 'success');
      try {
        await apiFetch('/api/Auth/update-avatar', {
          method: 'POST',
          body: JSON.stringify({ image: base64 })
        });
      } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    // Load follow count
    apiFetch('/api/follows/my')
      .then(data => {
        setStats(prev => ({ ...prev, totalFollows: data?.length || 0 }));
      })
      .catch(() => {});
  }, [token]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container page-padding">
          <div className="loading-spinner"><div className="spinner" /><p>Đang tải...</p></div>
        </div>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Không rõ';

  const roleLabel = user.role === 'ADMIN' ? 'Admin' : 'Thành viên';
  const roleClass = user.role === 'ADMIN' ? 'admin' : 'user';

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-bg" />
        <div className="container">
          <div className="profile-card">
            <div className="profile-avatar-large" onClick={handleAvatarClick} title="Nhấn để đổi avatar">
              {user.image ? (
                <img src={user.image} alt={user.userName} />
              ) : (
                (user.userName || 'U')[0].toUpperCase()
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                style={{ display: 'none' }} 
              />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.userName || 'Người dùng'}</h1>
              <p className="profile-email">{user.mail || user.email || ''}</p>
              <span className={`profile-role ${roleClass}`}>{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-icon">📖</div>
            <div className="profile-stat-value">{stats.totalFollows}</div>
            <div className="profile-stat-label">Truyện đang theo dõi</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">💬</div>
            <div className="profile-stat-value">{stats.totalComments}</div>
            <div className="profile-stat-label">Bình luận</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">📅</div>
            <div className="profile-stat-value" style={{
              fontSize: '1rem',
              background: 'none',
              WebkitTextFillColor: 'var(--text-primary)',
              color: 'var(--text-primary)'
            }}>
              {joinDate}
            </div>
            <div className="profile-stat-label">Ngày tham gia</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">⭐</div>
            <div className="profile-stat-value" style={{
              fontSize: '1rem',
              background: 'none',
              WebkitTextFillColor: 'var(--text-primary)',
              color: 'var(--text-primary)'
            }}>
              {user.banned ? '🔴 Bị cấm' : '🟢 Hoạt động'}
            </div>
            <div className="profile-stat-label">Trạng thái tài khoản</div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="profile-section">
          <h2 className="profile-section-title">📋 Thông Tin Cá Nhân</h2>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <div className="profile-info-icon">👤</div>
              <div>
                <div className="profile-info-label">Tên người dùng</div>
                <div className="profile-info-value">{user.userName || '—'}</div>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">📧</div>
              <div>
                <div className="profile-info-label">Email</div>
                <div className="profile-info-value">{user.mail || user.email || '—'}</div>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">🛡️</div>
              <div>
                <div className="profile-info-label">Vai trò</div>
                <div className="profile-info-value">{roleLabel}</div>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">🆔</div>
              <div>
                <div className="profile-info-label">ID tài khoản</div>
                <div className="profile-info-value" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {user.accountId || user.id || '—'}
                </div>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">📅</div>
              <div>
                <div className="profile-info-label">Ngày tạo tài khoản</div>
                <div className="profile-info-value">{joinDate}</div>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">🔐</div>
              <div>
                <div className="profile-info-label">Trạng thái</div>
                <div className="profile-info-value">
                  {user.banned ? 'Tài khoản bị cấm' : 'Đang hoạt động bình thường'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="profile-section" style={{ marginBottom: '3rem' }}>
          <h2 className="profile-section-title">⚡ Hành Động Nhanh</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/follows')}>
              📖 Xem Truyện Theo Dõi
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              🏠 Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
