import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('wt_token') || null);
  const [user, setUser] = useState(null);
  const [followedComics, setFollowedComics] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await apiFetch('/api/Auth/me');
      setUser(userData);
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem('wt_token');
    }
    setLoading(false);
  }, [token]);

  const loadFollowedIds = useCallback(async () => {
    if (!token) return;
    try {
      const follows = await apiFetch('/api/follows/my');
      if (follows) {
        setFollowedComics(new Set(follows.map(f => f.comicId)));
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    loadCurrentUser();
    loadFollowedIds();
  }, [loadCurrentUser, loadFollowedIds]);

  const login = async (loginName, password) => {
    const data = await apiFetch('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginName, password }),
    });
    if (data.token) {
      localStorage.setItem('wt_token', data.token);
      setToken(data.token);
      return data;
    } else if (typeof data === 'string') {
      localStorage.setItem('wt_token', data);
      setToken(data);
      return { token: data };
    }
    throw new Error(data.message || 'Sai thông tin đăng nhập');
  };

  const register = async (email, userName, password) => {
    await apiFetch('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, userName, password }),
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFollowedComics(new Set());
    localStorage.removeItem('wt_token');
  };

  const toggleFollow = async (comicId) => {
    if (!token) return false;
    const isFollowed = followedComics.has(comicId);
    try {
      if (isFollowed) {
        await apiFetch(`/api/follows/${comicId}`, { method: 'DELETE' });
        setFollowedComics(prev => {
          const next = new Set(prev);
          next.delete(comicId);
          return next;
        });
      } else {
        await apiFetch(`/api/follows/${comicId}`, { method: 'POST' });
        setFollowedComics(prev => new Set(prev).add(comicId));
      }
      return true;
    } catch {
      return false;
    }
  };

  const isFollowed = (comicId) => followedComics.has(comicId);

  return (
    <AuthContext.Provider value={{
      token, user, setUser, loading,
      login, register, logout,
      toggleFollow, isFollowed, followedComics,
      loadCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
