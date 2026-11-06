import React, { useState, useEffect } from 'react';
import { OrderRecord, ReviewRecord, SystemTelemetry, SystemAuditLog, CmsData } from '../types';

interface AdminConsoleProps {
  apiBaseUrl?: string;
  onClose: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  apiBaseUrl = '/api',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'cms' | 'preview' | 'telemetry'>('orders');
  const [adminToken, setAdminToken] = useState<string>('nomu_admin_sec_token_98400_botanical_2026');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState<number>(Date.now());

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Reviews State
  const [adminReviews, setAdminReviews] = useState<ReviewRecord[]>([]);
  const [reviewStatusFilter, setReviewStatusFilter] = useState<string>('pending');

  // CMS State
  const [cmsData, setCmsData] = useState<CmsData>({
    hero_headline: 'FOUR HERBS. ZERO NONSENSE.',
    hero_sub: 'Ancient South Indian botanical distillates crafted in small batches across Chennai.',
    ticker_text: '100% RECYCLED GLASS · NO CHEMICALS · SMALL-BATCH DISTILLED · CHENNAI EXPRESS',
    font_family: 'editorial-serif',
    whatsapp_phone: '919840000000',
    hero_video_url: '/video/nomu_showcase.mp4',
    hero_poster_url: '/img/nomu/nomu_film_poster.jpg',
    vetiver_bottle_img: '/img/bottles/vetiver_isolated.png',
    vetiver_splash_img: '/img/ingredients/vetiver_khus_root.png',
    vetiver_packshot_img: '/img/bottles/vetiver_packshot.jpg',
    chamomile_bottle_img: '/img/bottles/chamomile_isolated.png',
    chamomile_splash_img: '/img/ingredients/chamomile_lavender_harvest.jpg',
    chamomile_packshot_img: '/img/bottles/chamomile_packshot.jpg',
    grapefruit_bottle_img: '/img/bottles/grapefruit_isolated.png',
    grapefruit_splash_img: '/img/ingredients/grapefruit_harvest.jpg',
    grapefruit_packshot_img: '/img/bottles/grapefruit_packshot.jpg',
    lemongrass_bottle_img: '/img/bottles/lemongrass_isolated.png',
    lemongrass_splash_img: '/img/ingredients/lemongrass_harvest.jpg',
    lemongrass_packshot_img: '/img/bottles/lemongrass_packshot.jpg',
    manifesto_image_url: '/img/nomu/nomu_bottles_hero_real.jpg'
  });
  const [cmsSaveMsg, setCmsSaveMsg] = useState<string>('');
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // File Upload Handler
  const handleFileUpload = async (fieldKey: keyof CmsData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsUploading(fieldKey);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${apiBaseUrl}/admin/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCmsData((prev) => ({ ...prev, [fieldKey]: data.url }));
        setCmsSaveMsg(`Uploaded ${file.name}`);
        setTimeout(() => setCmsSaveMsg(''), 3000);
      } else {
        alert(data.message || 'Media upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  };

  // Telemetry & Logs
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const url = new URL(`${window.location.origin}${apiBaseUrl}/admin/orders`);
      if (orderStatusFilter !== 'all') url.searchParams.set('status', orderStatusFilter);
      if (orderSearch) url.searchParams.set('search', orderSearch);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {}
  };

  const fetchAdminReviews = async () => {
    try {
      const url = new URL(`${window.location.origin}${apiBaseUrl}/admin/reviews`);
      if (reviewStatusFilter !== 'all') url.searchParams.set('status', reviewStatusFilter);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data && data.reviews) {
        setAdminReviews(data.reviews);
      }
    } catch (e) {}
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/admin/system/status`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data) setTelemetry(data);
    } catch (e) {}
  };

  const fetchLogs = async () => {
    try {
      const url = new URL(`${window.location.origin}${apiBaseUrl}/admin/system/logs`);
      if (logLevelFilter !== 'all') url.searchParams.set('level', logLevelFilter);

      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data && data.logs) setLogs(data.logs);
    } catch (e) {}
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await fetch(`${apiBaseUrl}/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (e) {}
  };

  const handleModerateReview = async (reviewId: number, action: 'approve' | 'reject' | 'delete') => {
    try {
      await fetch(`${apiBaseUrl}/admin/reviews/${reviewId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ action })
      });
      fetchAdminReviews();
    } catch (e) {}
  };

  const handleSaveCms = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/admin/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(cmsData)
      });
      if (res.ok) {
        setCmsSaveMsg('Changes published successfully.');
        setTimeout(() => setCmsSaveMsg(''), 3000);
      }
    } catch (e) {}
  };

  const handleExportCsv = () => {
    window.open(`${apiBaseUrl}/admin/orders?export=csv&token=${encodeURIComponent(adminToken)}`, '_blank');
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'reviews') fetchAdminReviews();
    if (activeTab === 'telemetry') { fetchTelemetry(); fetchLogs(); }
  }, [activeTab, orderStatusFilter, reviewStatusFilter, logLevelFilter]);

  return (
    <div className="admin-console-view" style={{ backgroundColor: '#121110', minHeight: '100vh', color: '#F4EFEB' }}>
      {/* Top Header */}
      <div className="admin-nav" style={{ backgroundColor: '#171615', borderBottom: '1px solid #2C2926', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#D5360C', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, borderRadius: '6px' }}>N</div>
          <span style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.1rem' }}>NOMU OPERATIONS CONSOLE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1A1918', border: '1px solid #2C2926', borderRadius: '6px', padding: '0.25rem 0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>Token:</span>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '0.75rem', width: '160px', outline: 'none' }}
            />
          </div>
          <button type="button" className="btn btn-outline" style={{ color: '#FFF', borderColor: '#444' }} onClick={onClose}>
            Back to Storefront
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#171615', borderBottom: '1px solid #2C2926', padding: '0 1.5rem', display: 'flex', gap: '1.5rem' }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'orders' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders Ledger ({orders.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'reviews' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Review Moderation ({adminReviews.filter(r => r.status === 'pending').length} Pending)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'cms' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('cms')}
        >
          Content Management (CMS)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'preview' ? 'is-active' : ''}`}
          onClick={() => {
            setActiveTab('preview');
            setIframeKey(Date.now());
          }}
        >
          Live Website Preview
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'telemetry' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          System Telemetry & Runtime Logs
        </button>
      </div>

      {/* Content Panes */}
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            <div className="toolbar-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Search customer, phone, ref..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="search-input"
                  style={{ background: '#1A1918', border: '1px solid #2C2926', color: '#FFF', padding: '0.5rem 0.85rem', borderRadius: '6px' }}
                />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="select-input"
                  style={{ background: '#1A1918', border: '1px solid #2C2926', color: '#FFF', padding: '0.5rem 0.85rem', borderRadius: '6px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button type="button" className="btn btn-secondary" onClick={fetchOrders}>Refresh</button>
              </div>

              <button type="button" className="btn btn-burnt-orange" onClick={handleExportCsv}>
                Export CSV
              </button>
            </div>

            <div className="table-card" style={{ background: '#1A1918', borderRadius: '10px', border: '1px solid #2C2926', overflow: 'hidden' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#161514', borderBottom: '1px solid #2C2926' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Order Ref</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Items</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Bottles</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No orders found.</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #2C2926' }}>
                        <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>{o.order_ref}</td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <div>{o.customer_name}</div>
                          <small style={{ color: '#888' }}>{o.customer_email}</small>
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <a href={`https://wa.me/91${o.customer_phone}`} target="_blank" rel="noreferrer" style={{ color: '#60A5FA', textDecoration: 'none' }}>
                            {o.customer_phone} ↗
                          </a>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', maxWidth: '240px', fontSize: '0.78rem' }}>
                          {Array.isArray(o.items) ? o.items.map(it => `${it.quantity}x ${it.flavor}`).join(', ') : 'Ritual Box'}
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>{o.total_bottles}</td>
                        <td style={{ padding: '0.8rem 1rem', color: '#D5360C', fontWeight: 700 }}>₹{o.total_amount}</td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.72rem', background: 'rgba(217, 119, 6, 0.2)', color: '#F59E0B' }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            style={{ background: '#242220', color: '#FFF', border: '1px solid #333', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <select
                value={reviewStatusFilter}
                onChange={(e) => setReviewStatusFilter(e.target.value)}
                style={{ background: '#1A1918', border: '1px solid #2C2926', color: '#FFF', padding: '0.5rem 0.85rem', borderRadius: '6px' }}
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending Moderation</option>
                <option value="approved">Approved & Live</option>
                <option value="rejected">Rejected</option>
              </select>
              <button type="button" className="btn btn-secondary" onClick={fetchAdminReviews}>Refresh</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {adminReviews.map((r) => (
                <div key={r.id} style={{ background: '#1A1918', border: '1px solid #2C2926', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#333' }}>{r.status}</span>
                      <span style={{ color: '#D97706', display: 'flex', gap: '2px' }}>
                        {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                          <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </span>
                    </div>
                    <strong>{r.customer_name}</strong> <span style={{ color: '#D5360C', fontSize: '0.8rem' }}>({r.flavor_key})</span>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>{r.customer_email} · {r.created_at}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>"{r.headline}"</div>
                    <p style={{ fontSize: '0.85rem', color: '#CCC', lineHeight: 1.45 }}>{r.review_text}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #2C2926' }}>
                    {r.status !== 'approved' && (
                      <button type="button" className="btn btn-secondary" style={{ background: '#1E3A24', color: '#4ADE80', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }} onClick={() => handleModerateReview(r.id, 'approve')}>
                        Approve
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button type="button" className="btn btn-secondary" style={{ background: '#3B1D1D', color: '#F87171', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }} onClick={() => handleModerateReview(r.id, 'reject')}>
                        Reject
                      </button>
                    )}
                    <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }} onClick={() => handleModerateReview(r.id, 'delete')}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: CMS Content & Media Management */}
        {activeTab === 'cms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1A1918', border: '1px solid #2C2926', padding: '1rem 1.5rem', borderRadius: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Content Management System & Media Asset Vault</h3>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Upload videos, high-resolution photography, and adjust live copy across the storefront.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {cmsSaveMsg && <span style={{ color: '#4ADE80', fontSize: '0.85rem' }}>{cmsSaveMsg}</span>}
                <button type="button" className="btn btn-burnt-orange" onClick={handleSaveCms}>
                  Save & Publish Changes
                </button>
              </div>
            </div>

            {/* Block 1: Copywriting & Headlines */}
            <div style={{ background: '#1A1918', border: '1px solid #2C2926', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#D5360C' }}>1. Headline & Brand Messaging</h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#AAA' }}>Hero Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#121110', border: '1px solid #333', color: '#FFF' }}
                    value={cmsData.hero_headline || ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero_headline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#AAA' }}>Announcement Ticker Bar</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#121110', border: '1px solid #333', color: '#FFF' }}
                    value={cmsData.ticker_text || ''}
                    onChange={(e) => setCmsData({ ...cmsData, ticker_text: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#AAA' }}>WhatsApp Concierge Number</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: '#121110', border: '1px solid #333', color: '#FFF' }}
                    value={cmsData.whatsapp_phone || ''}
                    onChange={(e) => setCmsData({ ...cmsData, whatsapp_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#AAA' }}>Hero Subtitle</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  style={{ background: '#121110', border: '1px solid #333', color: '#FFF' }}
                  value={cmsData.hero_sub || ''}
                  onChange={(e) => setCmsData({ ...cmsData, hero_sub: e.target.value })}
                />
              </div>
            </div>

            {/* Block 2: Hero Section Media */}
            <div style={{ background: '#1A1918', border: '1px solid #2C2926', borderRadius: '10px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#D5360C', marginBottom: '1rem' }}>2. Hero Video & Poster Photography</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: '#121110', border: '1px solid #282522', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Hero Video (MP4/WebM)</span>
                  <div style={{ height: '140px', background: '#000', borderRadius: '6px', overflow: 'hidden' }}>
                    <video key={cmsData.hero_video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay playsInline>
                      <source src={cmsData.hero_video_url || '/video/nomu_showcase.mp4'} type="video/mp4" />
                    </video>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      style={{ flex: 1, background: '#1A1918', border: '1px solid #333', color: '#FFF', fontSize: '0.75rem', padding: '0.35rem 0.6rem', borderRadius: '4px' }}
                      value={cmsData.hero_video_url || ''}
                      onChange={(e) => setCmsData({ ...cmsData, hero_video_url: e.target.value })}
                    />
                    <label style={{ background: '#2C2926', border: '1px solid #444', color: '#FFF', fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isUploading === 'hero_video_url' ? 'Uploading...' : 'Upload'}
                      <input type="file" accept="video/mp4,video/webm" style={{ display: 'none' }} onChange={(e) => handleFileUpload('hero_video_url', e)} />
                    </label>
                  </div>
                </div>

                <div style={{ background: '#121110', border: '1px solid #282522', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Hero Video Poster Image</span>
                  <div style={{ height: '140px', background: '#000', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={cmsData.hero_poster_url || '/img/nomu/nomu_film_poster.jpg'} alt="Hero Poster" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      style={{ flex: 1, background: '#1A1918', border: '1px solid #333', color: '#FFF', fontSize: '0.75rem', padding: '0.35rem 0.6rem', borderRadius: '4px' }}
                      value={cmsData.hero_poster_url || ''}
                      onChange={(e) => setCmsData({ ...cmsData, hero_poster_url: e.target.value })}
                    />
                    <label style={{ background: '#2C2926', border: '1px solid #444', color: '#FFF', fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isUploading === 'hero_poster_url' ? 'Uploading...' : 'Upload'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload('hero_poster_url', e)} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 3: Botanical Quartet Media (Vetiver, Chamomile, Grapefruit, Lemongrass) */}
            <div style={{ background: '#1A1918', border: '1px solid #2C2926', borderRadius: '10px', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#D5360C', marginBottom: '1rem' }}>3. Botanical Quartet Media (Bottles & Splashes)</h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {/* Vetiver */}
                <div style={{ background: '#121110', border: '1px solid #282522', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#E6D5BD' }}>Blend I: Vetiver</strong>
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <img src={cmsData.vetiver_bottle_img || '/img/bottles/vetiver_isolated.png'} alt="Vetiver" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                  <label style={{ display: 'block', background: '#2C2926', textAlign: 'center', fontSize: '0.75rem', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}>
                    {isUploading === 'vetiver_bottle_img' ? 'Uploading...' : 'Change Bottle'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload('vetiver_bottle_img', e)} />
                  </label>
                </div>

                {/* Chamomile */}
                <div style={{ background: '#121110', border: '1px solid #282522', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#FDF3D6' }}>Blend II: Chamomile</strong>
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <img src={cmsData.chamomile_bottle_img || '/img/bottles/chamomile_isolated.png'} alt="Chamomile" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                  <label style={{ display: 'block', background: '#2C2926', textAlign: 'center', fontSize: '0.75rem', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}>
                    {isUploading === 'chamomile_bottle_img' ? 'Uploading...' : 'Change Bottle'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload('chamomile_bottle_img', e)} />
                  </label>
                </div>

                {/* Grapefruit */}
                <div style={{ background: '#121110', border: '1px solid #282522', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#FDE7E3' }}>Blend III: Grapefruit</strong>
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <img src={cmsData.grapefruit_bottle_img || '/img/bottles/grapefruit_isolated.png'} alt="Grapefruit" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                  <label style={{ display: 'block', background: '#2C2926', textAlign: 'center', fontSize: '0.75rem', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}>
                    {isUploading === 'grapefruit_bottle_img' ? 'Uploading...' : 'Change Bottle'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload('grapefruit_bottle_img', e)} />
                  </label>
                </div>

                {/* Lemongrass */}
                <div style={{ background: '#121110', border: '1px solid #282522', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#E3F2D4' }}>Blend IV: Lemongrass</strong>
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <img src={cmsData.lemongrass_bottle_img || '/img/bottles/lemongrass_isolated.png'} alt="Lemongrass" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                  <label style={{ display: 'block', background: '#2C2926', textAlign: 'center', fontSize: '0.75rem', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}>
                    {isUploading === 'lemongrass_bottle_img' ? 'Uploading...' : 'Change Bottle'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload('lemongrass_bottle_img', e)} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Live Website Preview */}
        {activeTab === 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 160px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1A1918', border: '1px solid #2C2926', padding: '0.75rem 1.25rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 700, marginRight: '0.5rem' }}>VIEWPORT:</span>
                <button
                  type="button"
                  className={`btn ${previewMode === 'desktop' ? 'btn-burnt-orange' : 'btn-outline'}`}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  onClick={() => setPreviewMode('desktop')}
                >
                  Desktop (1366px)
                </button>
                <button
                  type="button"
                  className={`btn ${previewMode === 'tablet' ? 'btn-burnt-orange' : 'btn-outline'}`}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  onClick={() => setPreviewMode('tablet')}
                >
                  Tablet (768px)
                </button>
                <button
                  type="button"
                  className={`btn ${previewMode === 'mobile' ? 'btn-burnt-orange' : 'btn-outline'}`}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  onClick={() => setPreviewMode('mobile')}
                >
                  Mobile Portrait (390px · Android/iOS)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
                  onClick={() => setIframeKey(Date.now())}
                >
                  Reload Preview
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', textDecoration: 'none' }}
                >
                  Open in New Tab ↗
                </a>
              </div>
            </div>

            <div style={{ flex: 1, background: '#0A0908', border: '1px solid #2C2926', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: '1.5rem' }}>
              <div
                style={{
                  width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '390px',
                  height: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '880px' : '844px',
                  maxWidth: previewMode === 'desktop' ? '1366px' : undefined,
                  border: previewMode === 'mobile' ? '10px solid #1E1D1B' : previewMode === 'tablet' ? '8px solid #222' : '2px solid #333',
                  borderRadius: previewMode === 'mobile' ? '36px' : previewMode === 'tablet' ? '20px' : '8px',
                  overflow: 'hidden',
                  background: '#000',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {previewMode === 'mobile' && (
                  <div style={{ height: '26px', background: '#1E1D1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60px', height: '4px', background: '#333', borderRadius: '9999px' }} />
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src="/"
                  title="NOMU Live Storefront"
                  style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: '#121110' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Telemetry */}
        {activeTab === 'telemetry' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#1A1918', border: '1px solid #2C2926', padding: '1.25rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>PHP RUNTIME</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>{telemetry?.runtime.php_version || 'PHP 8.3'}</div>
                <small style={{ color: '#888' }}>{telemetry?.runtime.sapi || 'FastCGI'}</small>
              </div>
              <div style={{ background: '#1A1918', border: '1px solid #2C2926', padding: '1.25rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>MEMORY ALLOCATED</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0' }}>{telemetry?.runtime.memory_allocated_mb || 0} MB</div>
                <small style={{ color: '#888' }}>Peak: {telemetry?.runtime.memory_peak_mb || 0} MB</small>
              </div>
              <div style={{ background: '#1A1918', border: '1px solid #2C2926', padding: '1.25rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>OPCACHE STATUS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.25rem 0', color: '#4ADE80' }}>
                  {telemetry?.runtime.opcache_active ? 'Active' : 'Standby'}
                </div>
                <small style={{ color: '#888' }}>Bytecode Pre-compiled</small>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Audit Event Log Stream</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value)}
                  style={{ background: '#1A1918', border: '1px solid #333', color: '#FFF', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                >
                  <option value="all">All Levels</option>
                  <option value="INFO">INFO</option>
                  <option value="NOTICE">NOTICE</option>
                  <option value="WARNING">WARNING</option>
                  <option value="ERROR">ERROR</option>
                </select>
                <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={fetchLogs}>
                  Refresh Logs
                </button>
              </div>
            </div>
            <div style={{ background: '#0E0D0C', border: '1px solid #2C2926', padding: '1rem', borderRadius: '10px', maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {logs.map((l) => (
                <div key={l.id} style={{ padding: '0.25rem 0', borderBottom: '1px solid #1E1D1C', display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#666' }}>[{new Date(l.created_at).toLocaleTimeString()}]</span>
                  <span style={{ color: l.level === 'NOTICE' ? '#F59E0B' : '#60A5FA', fontWeight: 700 }}>{l.level}</span>
                  <span style={{ color: '#FFF' }}>{l.action}</span>
                  <span style={{ color: '#AAA' }}>{l.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
