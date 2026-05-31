'use client';
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Users, Star } from 'lucide-react';
import { marketApi, ApiMarket } from '@/lib/api';

// ── Haversine distance ────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatKm(km: number) {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function isOpenNow(openHour: number | null, closeHour: number | null) {
  if (!openHour || !closeHour) return false;
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  return h >= openHour && h < closeHour;
}

// ── Day mapping (API uses 'Sun','Mon'… JS getDay() 0=Sun) ─────
const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS: Record<string, string> = {
  Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday',
};

function MarketPhotoPlaceholder({ bgColor }: { bgColor: string }) {
  return (
    <div style={{ background: bgColor, height: 156, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <span style={{ fontSize: 52 }}>🏪</span>
    </div>
  );
}

export default function MarketsPage() {
  const [tab,          setTab]          = useState<'bazars' | 'shandhas'>('bazars');
  const [rythuMarkets, setRythuMarkets] = useState<ApiMarket[]>([]);
  const [localMarkets, setLocalMarkets] = useState<ApiMarket[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [userCoords,   setUserCoords]   = useState<{ lat: number; lng: number } | null>(null);
  const [selDay,       setSelDay]       = useState(DAY_KEYS[new Date().getDay()]);

  // Fetch all markets from API
  useEffect(() => {
    marketApi.getAll()
      .then(all => {
        setRythuMarkets(all.filter(m => m.category_slug === 'rythu-bazar'));
        setLocalMarkets(all.filter(m => m.category_slug === 'local-market'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Get real GPS coordinates for distance calculation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, []);

  const getDist = (m: ApiMarket) => {
    if (userCoords && m.lat && m.lng)
      return formatKm(haversineKm(userCoords.lat, userCoords.lng, m.lat, m.lng));
    return m.distance_km ? `${m.distance_km} km` : '—';
  };

  // Sort by real distance when GPS available
  const sorted = (list: ApiMarket[]) => {
    if (!userCoords) return list;
    return [...list].sort((a, b) => {
      const da = a.lat && a.lng ? haversineKm(userCoords.lat, userCoords.lng, a.lat, a.lng) : 999;
      const db = b.lat && b.lng ? haversineKm(userCoords.lat, userCoords.lng, b.lat, b.lng) : 999;
      return da - db;
    });
  };

  const todayKey = DAY_KEYS[new Date().getDay()];
  const filteredLocal = sorted(localMarkets.filter(m => m.day_of_week === selDay));

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ padding: '64px 0 48px' }}>
        <div className="vv-container">
          <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 16 }}>Markets</div>
          <h1 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-0.03em', color: '#0E1612', margin: '0 0 16px', lineHeight: 1.05 }}>
            Rythu Bazars &amp; weekly{' '}
            <span className="serif-it" style={{ color: '#166937' }}>shandhas.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#6B746E', maxWidth: 480, lineHeight: 1.65 }}>
            Where we source — and where you can visit. Daily Rythu Bazars across Visakhapatnam, plus the weekly village shandhas.
          </p>
        </div>
      </div>

      <div className="vv-container" style={{ paddingBottom: 80 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {([
            ['bazars',   `Daily Rythu Bazars · ${rythuMarkets.length}`],
            ['shandhas', `Weekly Shandhas · ${localMarkets.length}`],
          ] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: tab === key ? '1.5px solid #166937' : '1.5px solid #EAEDEB',
              background: tab === key ? '#EEF8F0' : '#fff',
              color: tab === key ? '#166937' : '#6B746E',
              fontFamily: 'inherit', transition: 'all 140ms',
            }}>{label}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8E968F', fontSize: 14 }}>
            Loading markets…
          </div>
        )}

        {/* ── Rythu Bazars ── */}
        {!loading && tab === 'bazars' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {sorted(rythuMarkets).map(m => {
              const open = isOpenNow(m.open_hour, m.close_hour);
              return (
                <div key={m.id} style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${open ? '#A8D5B5' : '#EAEDEB'}`, overflow: 'hidden' }}>

                  {/* Photo + badge */}
                  <div style={{ position: 'relative' }}>
                    <MarketPhotoPlaceholder bgColor={m.bg_color} />
                    <span style={{
                      position: 'absolute', top: 12, right: 12,
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                      background: open ? '#EEF8F0' : '#FEE8E8',
                      color: open ? '#166937' : '#C8553D',
                    }}>
                      {open ? '● Open' : '● Closed'}
                    </span>
                  </div>

                  <div style={{ padding: '18px 20px 20px' }}>
                    {/* Name */}
                    <div style={{ fontWeight: 700, fontSize: 17, color: '#0E1612', marginBottom: 3 }}>{m.name}</div>

                    {/* Area + rating */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8E968F', fontSize: 13 }}>
                        <MapPin size={12} /> {m.area}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12.5, color: '#8E968F' }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" /> {m.rating}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 16 }}>
                      {[
                        { icon: <Navigation size={10} />, label: 'Distance', value: getDist(m) },
                        { icon: <Clock size={10} />,      label: 'Opens',    value: m.opens ?? '—' },
                        { icon: <Users size={10} />,      label: 'Vendors',  value: String(m.vendors_count) },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8E968F', marginBottom: 4 }}>
                            {s.icon} {s.label}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0E1612' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Schedule badge */}
                    {(m.days || m.holiday) && (
                      <div style={{ fontSize: 11.5, color: '#6B746E', background: '#F5FAF6', borderRadius: 8, padding: '5px 10px', marginBottom: 14 }}>
                        {m.days}
                        {m.holiday && m.holiday !== 'None' && ` · Closed on ${m.holiday}`}
                      </div>
                    )}

                    {/* Google Maps */}
                    <a
                      href={m.lat && m.lng
                        ? `https://maps.google.com/?q=${m.lat},${m.lng}`
                        : `https://maps.google.com/?q=${encodeURIComponent(m.name + ' ' + m.area + ' Visakhapatnam')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', padding: '11px 0', borderRadius: 12,
                        border: '1.5px solid #EAEDEB', color: '#0E1612', fontSize: 13.5, fontWeight: 600,
                        textDecoration: 'none', transition: 'all 140ms', fontFamily: 'inherit',
                      }}
                    >
                      <MapPin size={14} /> Open in Google Maps
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Weekly Shandhas ── */}
        {!loading && tab === 'shandhas' && (
          <>
            {/* Day picker */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {DAY_KEYS.map(d => {
                const isToday = d === todayKey;
                const active  = d === selDay;
                return (
                  <button key={d} onClick={() => setSelDay(d)} style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 140ms',
                    border: active ? '1.5px solid #166937' : '1.5px solid #EAEDEB',
                    background: active ? '#166937' : '#fff',
                    color: active ? '#fff' : isToday ? '#166937' : '#6B746E',
                  }}>
                    {isToday ? `${d} · Today` : d}
                  </button>
                );
              })}
            </div>

            {/* Markets for selected day */}
            <div style={{ fontSize: 13, color: '#8E968F', marginBottom: 16, fontWeight: 500 }}>
              {filteredLocal.length} market{filteredLocal.length !== 1 ? 's' : ''} on {DAY_LABELS[selDay]}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredLocal.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E968F', fontSize: 14 }}>
                  No markets on {DAY_LABELS[selDay]}
                </div>
              ) : filteredLocal.map(m => {
                const open = isOpenNow(m.open_hour, m.close_hour);
                return (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    background: '#fff', borderRadius: 16,
                    border: `1.5px solid ${m.day_of_week === todayKey ? '#166937' : '#EAEDEB'}`,
                    padding: '16px 20px',
                  }}>
                    {/* Emoji icon */}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: m.bg_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      🏪
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5, color: '#0E1612' }}>{m.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12.5, color: '#8E968F' }}>
                          <MapPin size={11} /> {m.area}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12.5, color: '#8E968F' }}>
                          <Navigation size={11} /> {getDist(m)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12.5, color: '#8E968F' }}>
                          <Clock size={11} /> {m.opens} – {m.closes}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, flexShrink: 0,
                      background: open ? '#EEF8F0' : '#FEE8E8',
                      color: open ? '#166937' : '#C8553D',
                    }}>
                      {open ? '● Open' : '● Closed'}
                    </span>

                    {/* Directions */}
                    <a
                      href={m.lat && m.lng
                        ? `https://maps.google.com/?q=${m.lat},${m.lng}`
                        : `https://maps.google.com/?q=${encodeURIComponent(m.name + ' Visakhapatnam')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        padding: '8px 16px', borderRadius: 999, flexShrink: 0,
                        border: '1.5px solid #EAEDEB', color: '#0E1612',
                        fontSize: 13, fontWeight: 600, textDecoration: 'none',
                        transition: 'all 140ms', fontFamily: 'inherit',
                      }}
                    >
                      Directions
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
