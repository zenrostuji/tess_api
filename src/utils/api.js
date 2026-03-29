const API_BASE = 'https://cytostomal-nonsubtractive-bryanna.ngrok-free.dev';
const THUMB_CDN = 'https://img.otruyenapi.com/uploads/comics/';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

function getAuthHeaders() {
  const token = localStorage.getItem('wt_token');
  if (token) {
    return { ...defaultHeaders, Authorization: `Bearer ${token}` };
  }
  return defaultHeaders;
}

export async function apiFetch(endpoint, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

export async function fetchChapterImages(apiUrl) {
  const res = await fetch(apiUrl, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  return res.json();
}

export function getThumbUrl(thumbFile) {
  if (!thumbFile) return null;
  if (thumbFile.startsWith('http')) return thumbFile;
  return `${THUMB_CDN}${thumbFile}`;
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

export function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getLatestChapter(chaptersLatestStr) {
  try {
    const arr = JSON.parse(chaptersLatestStr);
    if (arr && arr.length > 0) return arr[0];
  } catch {}
  return null;
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
