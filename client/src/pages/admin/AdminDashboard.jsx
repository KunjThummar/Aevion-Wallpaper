import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  Upload,
  Layers,
  DollarSign,
  Flag,
  Trash2,
  CheckCircle,
  Eye,
  Download,
  Plus,
  Shield,
  LogOut,
  Image as ImageIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('aevion_admin_token') : null;

  if (!token) {
    return <Navigate to="/Aevion@1277/admin/login" replace />;
  }

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'wallpapers' | 'ads' | 'reports'
  const [stats, setStats] = useState(null);
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('abstract');
  const [tags, setTags] = useState('');
  const [deviceTarget, setDeviceTarget] = useState('universal');
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Dynamic helper for Authorization headers
  const getAuthHeaders = () => {
    const t = localStorage.getItem('aevion_admin_token') || '';
    return { Authorization: `Bearer ${t}` };
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders();
        const [statsRes, wallRes, catRes, adsRes, repRes] = await Promise.allSettled([
          axios.get('/api/admin/stats', { headers }),
          axios.get('/api/wallpapers?limit=100'),
          axios.get('/api/categories'),
          axios.get('/api/ads'),
          axios.get('/api/admin/reports', { headers })
        ]);

        if (
          (statsRes.status === 'rejected' && (statsRes.reason?.response?.status === 401 || statsRes.reason?.response?.status === 403)) ||
          (repRes.status === 'rejected' && (repRes.reason?.response?.status === 401 || repRes.reason?.response?.status === 403))
        ) {
          localStorage.removeItem('aevion_admin_token');
          navigate('/Aevion@1277/admin/login', { replace: true });
          return;
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
          setStats(statsRes.value.data.stats || null);
        }
        if (wallRes.status === 'fulfilled' && wallRes.value.data?.success) {
          setWallpapers(wallRes.value.data.data || []);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
          const cats = catRes.value.data.data || [];
          setCategories(cats);
          if (cats.length > 0) setCategorySlug(cats[0].slug);
        }
        if (adsRes.status === 'fulfilled' && adsRes.value.data?.success) {
          setAds(adsRes.value.data.data || []);
        }
        if (repRes.status === 'fulfilled' && repRes.value.data?.success) {
          setReports(repRes.value.data.data || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('aevion_admin_token');
    navigate('/Aevion@1277/admin/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categorySlug', categorySlug);
      formData.append('tags', tags);
      formData.append('deviceTarget', deviceTarget);
      formData.append('isFeatured', isFeatured);

      const res = await axios.post('/api/admin/wallpapers', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setUploadSuccess('Wallpaper successfully processed and published with Sharp WebP variants!');
        setWallpapers(prev => [res.data.data, ...prev]);
        // Reset form
        setUploadFile(null);
        setUploadPreview(null);
        setTitle('');
        setDescription('');
        setTags('');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteWallpaper = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this wallpaper?')) return;
    try {
      await axios.delete(`/api/admin/wallpapers/${id}`, { headers: getAuthHeaders() });
      setWallpapers(prev => (prev || []).filter(w => w.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleToggleAdSlot = async (slotId, currentStatus) => {
    try {
      const res = await axios.put(`/api/ads/${slotId}`, { isEnabled: !currentStatus }, { headers: getAuthHeaders() });
      if (res.data.success) {
        setAds(prev => (prev || []).map(a => a.slotId === slotId ? res.data.data : a));
      }
    } catch {
      alert('Failed to update ad status');
    }
  };

  const handleSaveAdConfig = async (slotId, adClient, adSlot) => {
    try {
      const res = await axios.put(`/api/ads/${slotId}`, { adClient, adSlot }, { headers: getAuthHeaders() });
      if (res.data.success) {
        alert('Ad placement updated successfully!');
      }
    } catch {
      alert('Failed to save ad settings');
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/resolve`, {}, { headers: getAuthHeaders() });
      setReports(prev => (prev || []).map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    } catch {
      alert('Failed to resolve report');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading Admin Studio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Shield className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Aevion Admin Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish high-resolution wallpapers, configure AdSense units, and monitor platform metrics.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 dark:bg-dark-card dark:text-slate-300 dark:hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Metric Overview Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Wallpapers</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalWallpapers || (wallpapers || []).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Total Downloads</span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {stats?.totalDownloads || 0}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Views</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalViews || 0}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-violet-500">Categories</span>
          <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">
            {(categories || []).length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Pending DMCA</span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {(reports || []).filter(r => r?.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Wallpaper</span>
        </button>

        <button
          onClick={() => setActiveTab('wallpapers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'wallpapers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Wallpapers ({(wallpapers || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ads'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>AdSense Placements</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-card'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>DMCA & Reports ({(reports || []).length})</span>
        </button>
      </div>

      {/* Tab 1: Upload Wallpaper */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              <span>Publish New High-Resolution Wallpaper</span>
            </h2>

            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Drag and Drop Zone */}
              <div className="relative border-2 border-dashed border-slate-300 dark:border-dark-border rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2 pointer-events-none">
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {uploadFile ? uploadFile.name : 'Click or drag wallpaper image here (Up to 30MB)'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports JPEG, PNG, WEBP. Sharp will auto-generate WebP thumbnails & preview sizes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Wallpaper Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Neon Tokyo Cyberpunk Rainy Street 4K"
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border font-semibold"
                  >
                    {(categories || []).map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description (AdSense SEO Content)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the wallpaper scene, atmosphere, and visual appeal..."
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="cyberpunk, neon, 4k, amoled, dark"
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Target Device</label>
                  <select
                    value={deviceTarget}
                    onChange={(e) => setDeviceTarget(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border"
                  >
                    <option value="universal">Universal (All Devices)</option>
                    <option value="desktop">Desktop Monitor (16:9 / 21:9)</option>
                    <option value="mobile">Mobile Phone (9:16)</option>
                    <option value="tablet">Tablet / iPad</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featuredCheck" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Feature in Editor's Choice section on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Processing via Sharp Pipeline...' : 'Publish Wallpaper'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Ingestion Preview */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Image Ingestion Preview
            </h3>

            {uploadPreview ? (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden bg-black shadow-md">
                  <img src={uploadPreview} alt="Preview" className="w-full h-auto object-cover max-h-64 mx-auto" />
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-dark-surface text-[11px] space-y-1">
                  <p><strong>Name:</strong> {uploadFile?.name}</p>
                  <p><strong>Size:</strong> {(uploadFile?.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Status:</strong> Ready for automated Sharp conversion</p>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-400 text-xs text-center p-4">
                Select an image on the left to see the ingestion preview
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Wallpapers */}
      {activeTab === 'wallpapers' && (
        <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Published Wallpapers Catalog ({(wallpapers || []).length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-dark-surface text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Wallpaper</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {(wallpapers || []).map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={w.images?.thumbnailUrl || w.images?.previewUrl}
                        alt={w.title}
                        className="w-12 h-10 object-cover rounded-lg bg-black"
                      />
                      <span className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {w.title}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                        {w.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {w.originalWidth} × {w.originalHeight}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {w.downloadsCount || 0}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {w.viewsCount || 0}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <a
                        href={`/wallpaper/${w.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 inline-block"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteWallpaper(w.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 inline-block"
                        title="Delete Wallpaper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AdSense Placements */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-dark-card border border-blue-200/60 dark:border-dark-border">
            <h3 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Google AdSense Revenue Controller</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Once you have your approved Google AdSense account, enter your Publisher Client ID (e.g., <code className="font-mono bg-white dark:bg-dark-surface px-1 py-0.5 rounded">ca-pub-1234567890123456</code>) and individual Slot IDs below. Ads will automatically start rendering with zero cumulative layout shift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(ads || []).map((ad) => (
              <div
                key={ad.slotId}
                className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Format: {ad.adFormat}
                  </span>
                  <button
                    onClick={() => handleToggleAdSlot(ad.slotId, ad.isEnabled)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      ad.isEnabled
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-slate-200 dark:bg-dark-surface text-slate-500'
                    }`}
                  >
                    {ad.isEnabled ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {ad.name}
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Ad Client ID</label>
                    <input
                      type="text"
                      defaultValue={ad.adClient}
                      id={`client_${ad.slotId}`}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Ad Slot ID</label>
                    <input
                      type="text"
                      defaultValue={ad.adSlot}
                      id={`slot_${ad.slotId}`}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-dark-surface border border-slate-300 dark:border-dark-border font-mono text-[11px]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const client = document.getElementById(`client_${ad.slotId}`).value;
                      const slot = document.getElementById(`slot_${ad.slotId}`).value;
                      handleSaveAdConfig(ad.slotId, client, slot);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-semibold transition-all"
                  >
                    Save Slot Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: DMCA & Reports */}
      {activeTab === 'reports' && (
        <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-xl overflow-hidden p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            DMCA & Copyright Takedown Reports ({(reports || []).length})
          </h3>

          {(reports || []).length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No copyright or inappropriate content reports submitted.
            </div>
          ) : (
            <div className="space-y-3">
              {(reports || []).map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-500">{rep.reason}</span>
                      <span className="text-slate-400">· {new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Details:</strong> {rep.details || 'No additional details'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Wallpaper ID: <code className="font-mono">{rep.wallpaperId}</code>
                    </p>
                  </div>

                  <div>
                    {rep.status === 'resolved' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolveReport(rep.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
