import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const showToast = useToast();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!loginName || !loginPassword) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(loginName, loginPassword);
      showToast('Đăng nhập thành công!', 'success');
      onClose();
    } catch {
      showToast('Đăng nhập thất bại', 'error');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!regEmail || !regUsername || !regPassword) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }
    setLoading(true);
    try {
      await register(regEmail, regUsername, regPassword);
      showToast('Đăng ký thành công! Hãy đăng nhập.', 'success');
      setTab('login');
    } catch {
      showToast('Đăng ký thất bại', 'error');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 className="modal-title">Đăng Nhập</h2>
            <p className="modal-subtitle">Chào mừng bạn quay trở lại!</p>
            <div className="form-group">
              <label>Email / Username</label>
              <input
                type="text"
                placeholder="Nhập email hoặc tên đăng nhập"
                value={loginName}
                onChange={e => setLoginName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
            <p className="modal-switch">
              Chưa có tài khoản?{' '}
              <button type="button" onClick={() => setTab('register')}>Đăng ký ngay</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 className="modal-title">Đăng Ký</h2>
            <p className="modal-subtitle">Tạo tài khoản mới</p>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Nhập email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tên người dùng</label>
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
            <p className="modal-switch">
              Đã có tài khoản?{' '}
              <button type="button" onClick={() => setTab('login')}>Đăng nhập</button>
            </p>
          </form>
        )}
      </div>
    </>
  );
}
