import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';

// Route-based code splitting for secondary pages to minimize initial bundle size
const WallpaperDetailPage = React.lazy(() =>
  import('./pages/WallpaperDetailPage').then((m) => ({ default: m.WallpaperDetailPage }))
);
const CategoriesPage = React.lazy(() =>
  import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage }))
);
const CategoryDetailPage = React.lazy(() =>
  import('./pages/CategoryDetailPage').then((m) => ({ default: m.CategoryDetailPage }))
);
const FavoritesPage = React.lazy(() =>
  import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
);
const AboutPage = React.lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PrivacyPolicyPage = React.lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = React.lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const DMCAPage = React.lazy(() =>
  import('./pages/DMCAPage').then((m) => ({ default: m.DMCAPage }))
);
const AdminLoginPage = React.lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboard = React.lazy(() =>
  import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

// Lightweight fallback spinner for secondary routes
const PageLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading page content" />
  </div>
);

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-base text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Public Endpoints */}
            <Route path="/" element={<HomePage />} />
            <Route path="/wallpaper/:slug" element={<WallpaperDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            
            {/* Legal, Support & AdSense Compliance */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/dmca" element={<DMCAPage />} />

            {/* Secret Administrative Portal */}
            <Route path="/Aevion@1277/admin" element={<Navigate to="/Aevion@1277/admin/dashboard" replace />} />
            <Route path="/Aevion@1277/admin/login" element={<AdminLoginPage />} />
            <Route path="/Aevion@1277/admin/dashboard" element={<AdminDashboard />} />

            {/* Lowercase alias for user convenience */}
            <Route path="/aevion@1277/admin" element={<Navigate to="/Aevion@1277/admin/dashboard" replace />} />
            <Route path="/aevion@1277/admin/login" element={<Navigate to="/Aevion@1277/admin/login" replace />} />
            <Route path="/aevion@1277/admin/dashboard" element={<Navigate to="/Aevion@1277/admin/dashboard" replace />} />

            {/* Obscure old /admin routes for security */}
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/admin" element={<Navigate to="/" replace />} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};
export default App;
