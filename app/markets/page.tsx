'use client';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { markets, weeklyShandhas } from '@/data/markets';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const todayIdx = new Date().getDay(); // 0=Sun
const today = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];

function MarketPhotoPlaceholder() {
  return (
    <div style={{ background: '#EEF8F0', height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <MapPin size={28} color="#6BAF7A" strokeWidth={1.5} />
      <span style={{ fontSize: 12, color: '#6BAF7A', fontWeight: 500 }}>Market photo</span>
    </div>
  );
}

export default function MarketsPage() {
  const [tab, setTab] = useState<'bazars' | 'shandhas'>('bazars');

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>

      {/* ── Hero ── */}
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

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {([
            ['bazars',    `Daily Rythu Bazars · ${markets.length}`],
            ['shandhas',  `Weekly Shandhas · ${weeklyShandhas.length}`],
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

        {/* ── Rythu Bazars tab ── */}
        {tab === 'bazars' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {markets.map(m => (
              <div key={m.id} style={{ background: '#fff', borderRadius: 20, border: `1.5px dashed ${m.open ? '#A8D5B5' : '#EAEDEB'}`, overflow: 'hidden' }}>
                {/* Photo + status badge */}
                <div style={{ position: 'relative' }}>
                  <MarketPhotoPlaceholder />
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                    background: m.open ? '#EEF8F0' : '#FEE8E8',
                    color: m.open ? '#166937' : '#C8553D',
                  }}>
                    {m.open ? '● Open' : '● Closed'}
                  </span>
                </div>

                <div style={{ padding: '18px 20px 20px' }}>
                  {/* Name + location */}
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#0E1612', marginBottom: 6 }}>{m.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8E968F', fontSize: 13, marginBottom: 18 }}>
                    <MapPin size={12} />
                    {m.area}
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 18 }}>
                    {[
                      { label: 'Distance', value: `${m.km} km` },
                      { label: 'Hours',    value: m.opens },
                      { label: 'Vendors',  value: String(m.vendors) },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#8E968F', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0E1612' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Google Maps button */}
                  <a href={m.mapUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', padding: '11px 0', borderRadius: 12,
                    border: '1.5px solid #EAEDEB', color: '#0E1612', fontSize: 13.5, fontWeight: 600,
                    textDecoration: 'none', transition: 'all 140ms',
                    fontFamily: 'inherit',
                  }}>
                    <MapPin size={14} />
                    Open in Google Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Weekly Shandhas tab ── */}
        {tab === 'shandhas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {weeklyShandhas.map(s => {
              const isToday = s.day === today;
              return (
                <div key={s.day} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: '#fff', borderRadius: 16,
                  border: `1.5px solid ${isToday ? '#166937' : '#EAEDEB'}`,
                  padding: '16px 20px',
                }}>
                  {/* Day */}
                  <div style={{ minWidth: 40, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? '#166937' : '#8E968F' }}>{s.day}</div>
                    {isToday && <div style={{ fontSize: 10, color: '#166937', fontWeight: 600, marginTop: 2 }}>Today</div>}
                  </div>

                  {/* Divider */}
                  <div style={{ width: 1, height: 36, background: '#EAEDEB', flexShrink: 0 }} />

                  {/* Name + location */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5, color: '#0E1612' }}>{s.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: '#8E968F', marginTop: 2 }}>
                      <MapPin size={11} />
                      {s.location}
                    </div>
                  </div>

                  {/* Directions button */}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(s.location)}`}
                     target="_blank" rel="noopener noreferrer"
                     style={{
                       padding: '8px 16px', borderRadius: 999,
                       border: '1.5px solid #EAEDEB', color: '#0E1612',
                       fontSize: 13, fontWeight: 600, textDecoration: 'none',
                       flexShrink: 0, transition: 'all 140ms', fontFamily: 'inherit',
                     }}>
                    Directions
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
