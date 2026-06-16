'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Navigation, Clock, Users, ChevronLeft, X, ChevronRight } from 'lucide-react';
import { marketApi, ApiMarket, imgUrl } from '@/lib/api';

/* ── Helpers ─────────────────────────────────────────────── */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371, dLat = (lat2 - lat1) * (Math.PI / 180), dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function formatKm(km: number) { return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`; }
function isOpen(m: ApiMarket) {
  if (!m.open_hour || !m.close_hour) return false;
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  return h >= m.open_hour && h < m.close_hour;
}

function buildMapHtml(m: ApiMarket) {
  if (!m.lat || !m.lng) return '';
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;overflow:hidden}#map{width:100%;height:100%}.leaflet-control-attribution{display:none}.mpin{width:24px;height:24px;background:#166937;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.4)}.leaflet-tooltip{background:#166937;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;padding:4px 10px;box-shadow:0 2px 8px rgba(0,0,0,.25)}.leaflet-tooltip::before{border-top-color:#166937}</style>
</head><body><div id="map"></div>
<script>
var map=L.map('map',{zoomControl:true,dragging:true,scrollWheelZoom:false,doubleClickZoom:true}).setView([${m.lat},${m.lng}],15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
var pin=L.divIcon({className:'',html:'<div class="mpin"></div>',iconSize:[24,24],iconAnchor:[12,24]});
L.marker([${m.lat},${m.lng}],{icon:pin}).addTo(map).bindTooltip('${m.name.replace(/'/g, "\\'")}',{permanent:true,direction:'top',offset:[0,-8]});
</script></body></html>`;
}

export default function MarketDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [market, setMarket]   = useState<ApiMarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<'about' | 'photos'>('about');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      p => setUserCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
    );
  }, []);

  useEffect(() => {
    if (!id) return;
    marketApi.getById(id)
      .then(setMarket)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #eee', borderTopColor: '#166937', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!market) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ fontSize: 48 }}>🏪</div>
      <p style={{ color: '#6B746E' }}>Market not found.</p>
      <button onClick={() => router.back()} style={{ background: '#166937', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Go back</button>
    </div>
  );

  const open   = isOpen(market);
  const photos = market.images ?? [];
  const dist   = userCoords && market.lat && market.lng
    ? formatKm(haversineKm(userCoords.lat, userCoords.lng, market.lat, market.lng))
    : market.distance_km ? `${market.distance_km} km` : '—';

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh', paddingBottom: 64 }}>

      {/* Hero — green background, blurred sides, full image centered */}
      <div style={{ position: 'relative', height: 320, background: '#0E3A20', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {photos[0] && (
          /* Blurred background — green-tinted blur fills the sides */
          <>
            <img
              src={imgUrl(photos[0]) || ''}
              alt=""
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px) brightness(0.35) saturate(0.6)', transform: 'scale(1.1)', pointerEvents: 'none' }}
            />
            {/* Green tint overlay on the blurred bg */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,58,32,0.55)', pointerEvents: 'none' }} />
          </>
        )}

        {/* Main image — fully visible, not cropped left or right */}
        {photos[0]
          ? <img
              src={imgUrl(photos[0]) || ''}
              alt={market.name}
              style={{ position: 'relative', zIndex: 1, maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
            />
          : <span style={{ fontSize: 96, lineHeight: 1 }}>🏪</span>
        }

        {/* Gradient for text readability at bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,42,24,0.85) 0%, transparent 55%)', zIndex: 2, pointerEvents: 'none' }} />

        {/* Back button — pill with text */}
        <button onClick={() => router.back()} style={{
          position: 'absolute', top: 20, left: 20, zIndex: 3,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: 999,
          padding: '8px 16px 8px 10px', cursor: 'pointer', color: '#fff',
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <ChevronLeft size={18} color="#fff" strokeWidth={2.5} />
          Markets
        </button>

        {/* Open/Closed badge */}
        <span style={{
          position: 'absolute', top: 20, right: 20, fontSize: 12, fontWeight: 700, zIndex: 3,
          padding: '5px 12px', borderRadius: 999,
          background: open ? '#EEF8F0' : '#FEE8E8', color: open ? '#166937' : '#C8553D',
        }}>
          {open ? '● Open now' : '● Closed'}
        </span>

        {/* Name overlay */}
        <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 3 }}>
          <div style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 1px 4px rgba(0,0,0,.3)' }}>{market.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} /> {market.area}
          </div>
        </div>
      </div>

      <div className="vv-container" style={{ paddingTop: 32 }}>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { icon: <Navigation size={16} color="#166937" />, label: 'Distance',  value: dist },
            { icon: <Clock      size={16} color="#166937" />, label: 'Opens',     value: market.opens ?? '—' },
            { icon: <Users      size={16} color="#166937" />, label: 'Vendors',   value: String(market.vendors_count) },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', border: '1.5px solid #EAEDEB', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.icon}
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0E1612' }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8E968F' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Leaflet map */}
        {market.lat && market.lng && (
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid #EAEDEB', marginBottom: 28 }}>
            <iframe
              srcDoc={buildMapHtml(market)}
              style={{ width: '100%', height: 220, border: 'none', display: 'block' }}
              title="Market location"
            />
            <div style={{ background: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EAEDEB' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0E1612' }}>{market.name}</div>
                <div style={{ fontSize: 12, color: '#8E968F', marginTop: 2 }}>{market.address}</div>
              </div>
              <a
                href={`https://maps.google.com/?q=${market.lat},${market.lng}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#166937', color: '#fff', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                <Navigation size={13} /> Directions
              </a>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #EAEDEB', marginBottom: 24, gap: 0 }}>
          {(['about', 'photos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '12px 0', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              background: 'none', border: 'none', fontFamily: 'inherit', transition: 'color 140ms',
              color: tab === t ? '#166937' : '#8E968F',
              borderBottom: tab === t ? '2px solid #166937' : '2px solid transparent',
              marginBottom: -2,
              textTransform: 'capitalize',
            }}>{t === 'about' ? 'About' : `Photos (${photos.length})`}</button>
          ))}
        </div>

        {/* About */}
        {tab === 'about' && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #EAEDEB', overflow: 'hidden', marginBottom: 24 }}>
            {[
              ['Hours',    `${market.opens ?? '—'} – ${market.closes ?? '—'}`],
              ['Days',     market.days ?? '—'],
              ['Vendors',  String(market.vendors_count)],
              ['Distance', userCoords && market.lat && market.lng
                ? `${formatKm(haversineKm(userCoords.lat, userCoords.lng, market.lat, market.lng))} from you`
                : market.distance_km ? `${market.distance_km} km from city centre` : '—'],
              ...(market.rating ? [['Rating', `⭐ ${market.rating} (${market.reviews_count} reviews)`]] : []),
            ].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderTop: i > 0 ? '1px solid #F0F2F1' : 'none' }}>
                <span style={{ fontSize: 13, color: '#6B746E', fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: 13, color: '#0E1612', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
              </div>
            ))}
            {(market.facilities ?? []).length > 0 && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid #F0F2F1' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8E968F', marginBottom: 10 }}>Facilities</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {market.facilities.map(f => (
                    <span key={f} style={{ background: '#EEF8F0', color: '#166937', borderRadius: 999, padding: '4px 12px', fontSize: 12.5, fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photos grid */}
        {tab === 'photos' && (
          photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#8E968F', fontSize: 14 }}>No photos available yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {photos.map((img, i) => (
                <button key={i} onClick={() => setLightbox(i)} style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 16, overflow: 'hidden', aspectRatio: '1', display: 'block', width: '100%' }}>
                  <img src={imgUrl(img) || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(null)}>
          <img
            src={imgUrl(photos[lightbox]) || ''}
            alt=""
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
            onClick={e => e.stopPropagation()}
          />
          {/* Close */}
          <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
          {/* Prev */}
          {lightbox > 0 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(lightbox - 1); }} style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} />
            </button>
          )}
          {/* Next */}
          {lightbox < photos.length - 1 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(lightbox + 1); }} style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={24} />
            </button>
          )}
          {/* Counter */}
          <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600 }}>
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
