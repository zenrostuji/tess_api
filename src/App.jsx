import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import GenrePage from './pages/GenrePage';
import ComicDetailPage from './pages/ComicDetailPage';
import ReadingPage from './pages/ReadingPage';
import FollowsPage from './pages/FollowsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const location = useLocation();
  const isReadingPage = location.pathname.startsWith('/read/');

  return (
    <ToastProvider>
      {!isReadingPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/genre/:genreId/:genreName" element={<GenrePage />} />
          <Route path="/comic/:comicId" element={<ComicDetailPage />} />
          <Route path="/read/:comicId/:apiUrl/:chapterName" element={<ReadingPage />} />
          <Route path="/follows" element={<FollowsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      {!isReadingPage && <Footer />}
    </ToastProvider>
  );
}
