import Link from 'next/link';
import HomeClient from './HomeClient';
import FavouritesSection from '@/components/FavouritesSection';
import RatesSection from '@/components/RatesSection';
import { ApiProduct } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchProducts(limit = 8): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function fetchRates(limit = 8): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_URL}/api/market-rates?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function fetchTotalCount(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/api/market-rates?limit=500`, { cache: 'no-store' });
    if (!res.ok) return 0;
    const data: ApiProduct[] = await res.json();
    return data.length;
  } catch { return 0; }
}

const MARKETS = [
  { id: 'gajuwaka',     name: 'Gajuwaka Rythu Bazar',     area: 'Gajuwaka',     dist: 0.5, vendors: 120, status: 'open' },
  { id: 'mvp',          name: 'MVP Colony Rythu Bazar',   area: 'MVP Colony',   dist: 12,  vendors: 110, status: 'closed' },
  { id: 'gopalapatnam', name: 'Gopalapatnam Rythu Bazar', area: 'Gopalapatnam', dist: 8,   vendors: 95,  status: 'open' },
  { id: 'pendurthi',    name: 'Pendurthi Rythu Bazar',    area: 'Pendurthi',    dist: 18,  vendors: 75,  status: 'closed' },
];

const HERO_VEGS = ['🍅','🥕','🥦','🍆','🫑','🌶️','🧄','🧅'];

const WHY_ITEMS = [
  { icon: '📊', title: 'Daily Rythu Bazar rates',  body: 'Live wholesale prices from all 4 Rythu Bazars, refreshed every morning at 7 AM. No markup, no haggling.' },
  { icon: '🚚', title: 'Morning delivery',          body: 'Order by 9 PM, receive by 9 AM. We deliver across Visakhapatnam in under 45 minutes.' },
  { icon: '🌱', title: 'Picked at 5 AM',            body: 'Sourced directly from farmer vendors. Most produce reaches you within 4 hours of harvest.' },
  { icon: '🛡️', title: 'Freshness guarantee',       body: 'Anything not fresh? We refund the full item, no questions asked. 15-minute cancellation window too.' },
];

const HOW_STEPS = [
  { n: '01', title: 'Browse this morning\'s prices', body: 'Live Rythu Bazar rates, updated every morning by 7 AM.' },
  { n: '02', title: 'Order by 9 PM',                 body: 'Fill your basket. Pay UPI, card, or cash on delivery.' },
  { n: '03', title: 'Wake up to fresh produce',      body: 'Picked at dawn. At your door before breakfast.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',    role: 'Homemaker · Madhurawada',    initials: 'PS', body: 'Prices are exactly what I see at Rythu Bazar but delivered to my door. Saves so much time every morning.' },
  { name: 'Ravi Kumar',      role: 'Office Worker · MVP Colony',  initials: 'RK', body: 'The price transparency is brilliant. No surprise markup. My family loves the freshness!' },
  { name: 'Ananya Reddy',    role: 'Teacher · Gajuwaka',          initials: 'AR', body: 'First order arrived in 45 minutes, all fresh and well-packed. Definitely ordering again!' },
  { name: 'Daniel Rao',      role: 'Pharmacist · Pendurthi',      initials: 'DR', body: 'My order arrived earlier than expected, and everything was neatly packed. Very impressed!' },
  { name: 'Olivia Thompson', role: 'Designer · Madhurawada',      initials: 'OT', body: 'Prices are better than my local store, and I save so much time. Highly recommend to busy families.' },
  { name: 'Sai Prasad',      role: 'Engineer · Gopalapatnam',     initials: 'SP', body: 'Had a small issue with one item, and the support team resolved it immediately. Great service.' },
];

export default async function HomePage() {
  const [rateProducts, shopProducts, totalCount] = await Promise.all([
    fetchRates(12),
    fetchProducts(8),
    fetchTotalCount(),
  ]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ background: '#FAFAF7' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hero-village">
        {/* Village scene background */}
        <div className="hero-village-scene">
          <svg viewBox="0 0 1200 520" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5F0E6"/><stop offset="100%" stopColor="#FCF4E4"/>
              </linearGradient>
              <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5BB87A"/><stop offset="100%" stopColor="#2BA15D"/>
              </linearGradient>
              <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4DBE7B"/><stop offset="100%" stopColor="#1F8A4C"/>
              </linearGradient>
              <linearGradient id="hill3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#166937"/><stop offset="100%" stopColor="#0A3D24"/>
              </linearGradient>
              <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A878"/><stop offset="100%" stopColor="#A88556"/>
              </linearGradient>
            </defs>
            <rect width="1200" height="520" fill="url(#sky)"/>
            <circle cx="950" cy="120" r="60" fill="#F2C97B" opacity="0.7"/>
            <circle cx="950" cy="120" r="42" fill="#E8A33D"/>
            <g fill="#FFFFFF" opacity="0.78">
              <ellipse cx="200" cy="100" rx="60" ry="14"/><ellipse cx="240" cy="90" rx="40" ry="12"/>
              <ellipse cx="600" cy="80" rx="80" ry="16"/><ellipse cx="650" cy="68" rx="50" ry="12"/>
            </g>
            <path d="M0 280 Q 200 200 400 250 T 800 230 T 1200 260 L 1200 520 L 0 520 Z" fill="url(#hill3)"/>
            <path d="M0 320 Q 150 260 320 300 T 640 280 T 960 300 T 1200 290 L 1200 520 L 0 520 Z" fill="url(#hill2)"/>
            <path d="M0 360 Q 180 320 360 350 T 720 330 T 1080 360 T 1200 340 L 1200 520 L 0 520 Z" fill="url(#hill1)"/>
            <g transform="translate(80 280)">
              <rect x="4" y="0" width="6" height="60" fill="#5B3A1A"/>
              <path d="M7 0 Q -10 -12 -22 -8 M7 0 Q 24 -12 36 -8 M7 0 Q -4 -22 -16 -28 M7 0 Q 18 -22 30 -28 M7 0 Q 7 -28 7 -36" stroke="#0E5C2F" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </g>
            <g transform="translate(1080 270)">
              <rect x="4" y="0" width="6" height="70" fill="#5B3A1A"/>
              <path d="M7 0 Q -10 -12 -22 -8 M7 0 Q 24 -12 36 -8 M7 0 Q -4 -22 -16 -28 M7 0 Q 18 -22 30 -28 M7 0 Q 7 -28 7 -36" stroke="#0E5C2F" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </g>
            <g transform="translate(700 290)">
              <polygon points="0,40 30,0 60,40" fill="#A85420"/>
              <rect x="6" y="40" width="48" height="36" fill="#F2C97B"/>
              <rect x="22" y="54" width="16" height="22" fill="#5B3A1A"/>
              <rect x="6" y="40" width="48" height="4" fill="#7A4216"/>
            </g>
            <g transform="translate(770 282)">
              <polygon points="0,48 36,0 72,48" fill="#8B4220"/>
              <rect x="6" y="48" width="60" height="44" fill="#E8A33D"/>
              <rect x="28" y="64" width="16" height="28" fill="#5B3A1A"/>
              <rect x="6" y="48" width="60" height="4" fill="#7A4216"/>
              <rect x="14" y="60" width="10" height="10" fill="#F4D690"/>
              <rect x="48" y="60" width="10" height="10" fill="#F4D690"/>
            </g>
            <g transform="translate(852 296)">
              <polygon points="0,36 26,0 52,36" fill="#A85420"/>
              <rect x="4" y="36" width="44" height="30" fill="#D49B5F"/>
              <rect x="18" y="48" width="14" height="18" fill="#5B3A1A"/>
            </g>
            <path d="M0 430 Q 600 400 1200 430 L 1200 520 L 0 520 Z" fill="url(#ground)"/>
            <g stroke="#7A4216" strokeWidth="1.2" opacity="0.35" fill="none">
              <path d="M0 460 Q 600 440 1200 460"/><path d="M0 480 Q 600 470 1200 480"/><path d="M0 500 Q 600 494 1200 500"/>
            </g>
            {Array.from({length: 24}).map((_, i) => {
              const x = 30 + i * 50 + (i % 2) * 16;
              return <g key={i} transform={`translate(${x} 440)`}>
                <ellipse cx="0" cy="6" rx="8" ry="3" fill="#0E5C2F" opacity="0.3"/>
                <path d="M0 6 Q -8 -8 -4 -16 M0 6 Q 8 -8 4 -16 M0 6 Q 0 -10 0 -20" stroke="#1F8A4C" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </g>;
            })}
            <g transform="translate(180 320)">
              <ellipse cx="0" cy="170" rx="36" ry="4" fill="#0E1410" opacity="0.15"/>
              <rect x="-10" y="120" width="8" height="50" fill="#3A4D8A"/>
              <rect x="2" y="120" width="8" height="50" fill="#3A4D8A"/>
              <ellipse cx="-6" cy="170" rx="8" ry="3" fill="#2A2418"/>
              <ellipse cx="6" cy="170" rx="8" ry="3" fill="#2A2418"/>
              <path d="M-20 80 L20 80 L24 130 L-24 130 Z" fill="#FCF4E4"/>
              <path d="M-22 80 L-26 110 L-20 130" stroke="#E8843D" strokeWidth="3" fill="#FCF4E4"/>
              <path d="M22 80 L26 110 L20 130" stroke="#E8843D" strokeWidth="3" fill="#FCF4E4"/>
              <rect x="-6" y="56" width="12" height="14" fill="#C9966B"/>
              <circle cx="0" cy="40" r="22" fill="#D9A678"/>
              <path d="M-20 32 Q -22 18 0 14 Q 22 18 20 32 Q 22 22 14 16 Q 0 10 -14 16 Q -22 22 -20 32 Z" fill="#2A2418"/>
              <circle cx="-7" cy="40" r="2" fill="#2A2418"/>
              <circle cx="7" cy="40" r="2" fill="#2A2418"/>
              <path d="M-6 50 Q 0 54 6 50" stroke="#2A2418" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
              <g transform="translate(30 110)">
                <ellipse cx="0" cy="40" rx="46" ry="10" fill="#7A4216"/>
                <path d="M-46 40 L-40 0 L40 0 L46 40 Z" fill="#B89968"/>
                <path d="M-40 0 L-44 -8 L42 -8 L40 0" stroke="#7A4216" strokeWidth="2" fill="#A88556"/>
                <circle cx="-22" cy="-4" r="9" fill="#D94F38"/>
                <circle cx="-4" cy="-7" r="9" fill="#D94F38"/>
                <circle cx="14" cy="-5" r="9" fill="#D94F38"/>
                <circle cx="28" cy="-2" r="9" fill="#D94F38"/>
                <path d="M-20 -10 Q -24 -22 -16 -28 M-12 -12 Q -8 -26 0 -28 M4 -12 Q 6 -26 14 -28 M20 -10 Q 22 -22 30 -24" stroke="#1F8A4C" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </g>
              <path d="M18 88 Q 30 100 38 116" stroke="#D9A678" strokeWidth="12" strokeLinecap="round" fill="none"/>
            </g>
            <g transform="translate(440 386)">
              <ellipse cx="40" cy="44" rx="90" ry="4" fill="#0E1410" opacity="0.15"/>
              <g transform="translate(-90 -10)">
                <ellipse cx="0" cy="20" rx="34" ry="20" fill="#F4D690"/>
                <ellipse cx="-28" cy="14" rx="14" ry="12" fill="#F4D690"/>
                <path d="M-38 6 L-44 -4 M-32 4 L-36 -8" stroke="#7A4216" strokeWidth="3" strokeLinecap="round"/>
                <rect x="-14" y="34" width="4" height="14" fill="#7A4216"/>
                <rect x="6" y="34" width="4" height="14" fill="#7A4216"/>
                <rect x="22" y="34" width="4" height="14" fill="#7A4216"/>
              </g>
              <rect x="-50" y="-10" width="120" height="34" fill="#A85420"/>
              <rect x="-50" y="-10" width="120" height="6" fill="#7A4216"/>
              <ellipse cx="-30" cy="-14" rx="14" ry="8" fill="#FCF4E4"/>
              <ellipse cx="0" cy="-16" rx="14" ry="9" fill="#F4D690"/>
              <ellipse cx="30" cy="-14" rx="14" ry="8" fill="#FCF4E4"/>
              <circle cx="-30" cy="-18" r="4" fill="#D94F38"/>
              <circle cx="-24" cy="-20" r="4" fill="#D94F38"/>
              <g transform="translate(-30 30)">
                <circle r="16" fill="#3A2410"/>
                <circle r="10" fill="#7A4216"/>
                <circle r="3" fill="#3A2410"/>
                <path d="M0 -14 L0 14 M-14 0 L14 0 M-10 -10 L10 10 M10 -10 L-10 10" stroke="#3A2410" strokeWidth="2"/>
              </g>
              <g transform="translate(40 30)">
                <circle r="16" fill="#3A2410"/>
                <circle r="10" fill="#7A4216"/>
                <circle r="3" fill="#3A2410"/>
                <path d="M0 -14 L0 14 M-14 0 L14 0 M-10 -10 L10 10 M10 -10 L-10 10" stroke="#3A2410" strokeWidth="2"/>
              </g>
            </g>
            <g stroke="#2A2418" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
              <path d="M380 130 q 8 -8 16 0 q 8 -8 16 0"/>
              <path d="M460 100 q 6 -6 12 0 q 6 -6 12 0"/>
              <path d="M540 140 q 7 -7 14 0 q 7 -7 14 0"/>
            </g>
          </svg>
        </div>

        {/* Content overlay */}
        <div className="vv-container hero-village-inner">
          {/* Left: white card with text */}
          <div className="hero-village-card">
            <span className="chip-soft">
              <span className="chip-dot" />
              Direct from Vizag Rythu Bazar
            </span>
            <h1 className="hero-village-title">
              Daily <span className="telugu-display">రైతు బజార్</span> rates,<br />
              market updates &amp;<br />
              <span className="serif-it">fresh shopping.</span>
            </h1>
            <p className="hero-village-sub">
              Live wholesale prices from all 4 Visakhapatnam Rythu Bazars, our own farm-fresh products, and morning delivery — all in one place.
            </p>
            <div className="hero-village-cta">
              <Link href="/shop" className="btn-primary">
                Shop Now
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/prices" className="btn-ghost-dark">
                Today&apos;s prices
              </Link>
            </div>
          </div>

          {/* Right: floating veg circles */}
          <div className="hero-collage">
            {HERO_VEGS.map((emoji, i) => (
              <div key={i} className={`hero-veg-photo hero-veg-${i + 1}`}>
                <span>{emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-village-stats">
          <div className="hero-village-stats-inner">
            <div><b>Daily</b><span>Rythu Bazar rates</span></div>
            <div><b>2,000+</b><span>Vizag families</span></div>
            <div><b>45 min</b><span>avg delivery</span></div>
            <div><b>4</b><span>Rythu Bazars covered</span></div>
          </div>
        </div>
      </section>

      {/* ── TODAY'S RATES ──────────────────────────────────────────── */}
      <RatesSection products={rateProducts} totalCount={totalCount} today={today} />

      {/* ── FAVOURITES ─────────────────────────────────────────────── */}
      <FavouritesSection />

      {/* ── FRESH PICKS ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="vv-container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 8 }}>Fresh picks</div>
              <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0 }}>
                Today&apos;s Fresh <span className="serif-it" style={{ color: '#166937' }}>Picks</span>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost-dark" style={{ padding: '12px 22px', fontSize: 14 }}>
              See all
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>

          {shopProducts.length === 0
            ? <p style={{ color: '#8E968F', textAlign: 'center', padding: '40px 0' }}>No products yet — add them in the admin dashboard.</p>
            : <HomeClient products={shopProducts} />
          }
        </div>
      </section>

      {/* ── WHY VIZAG VEGETABLES ───────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#F5FAF6' }}>
        <div className="vv-container">
          <div className="section-head" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 8 }}>Why Vizag Vegetables</div>
            <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0, maxWidth: 640 }}>
              More than delivery. We&apos;re your <span className="serif-it" style={{ color: '#166937' }}>daily price companion.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {WHY_ITEMS.map((it, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #EAEDEB', borderRadius: 20, padding: 28, transition: 'all 200ms' }}
                   className="hover:-translate-y-0.5 hover:shadow-md">
                <div className="value-icon"><span style={{ fontSize: 22 }}>{it.icon}</span></div>
                <h3 style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: '#0E1612', marginBottom: 10 }}>{it.title}</h3>
                <p style={{ fontSize: 14.5, color: '#6B746E', lineHeight: 1.6 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="vv-container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 8 }}>How it works</div>
              <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0 }}>
                Three steps to a stocked kitchen.
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} style={{ padding: '44px 36px', border: '1px solid #EAEDEB', borderRadius: 24, background: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div className="how-num">{s.n}</div>
                <h3 style={{ fontWeight: 600, fontSize: 20, letterSpacing: '-0.015em', color: '#0E1612', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: '#6B746E', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKETS PREVIEW ────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#F5FAF6' }}>
        <div className="vv-container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 8 }}>Where we source</div>
              <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0 }}>
                Four Rythu Bazars across Visakhapatnam.
              </h2>
            </div>
            <Link href="/markets" className="btn-ghost-dark" style={{ padding: '12px 22px', fontSize: 14 }}>
              All markets
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }} className="markets-grid-resp">
            {/* SVG map */}
            <div style={{ background: '#EEF8F0', border: '1px solid #EAEDEB', borderRadius: 24, overflow: 'hidden', aspectRatio: '16/10', position: 'relative' }}>
              <div className="map-placeholder">
                <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="mgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(31,138,76,0.08)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="800" height="400" fill="url(#mgrid)"/>
                  <path d="M0 200 Q 200 150 400 200 T 800 220" stroke="rgba(31,138,76,0.18)" strokeWidth="2" fill="none"/>
                  <path d="M780 0 Q 760 200 780 400 L 800 400 L 800 0 Z" fill="rgba(64,156,204,0.08)"/>
                  <text x="770" y="200" fill="rgba(64,156,204,0.45)" fontSize="11" fontFamily="sans-serif" textAnchor="end">Bay of Bengal</text>
                </svg>
                {[['18%','46%'],['62%','32%'],['38%','68%'],['82%','18%']].map(([l, t], i) => (
                  <div key={i} className="map-pin" style={{ left: l, top: t }}>{i + 1}</div>
                ))}
              </div>
            </div>
            {/* Market list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MARKETS.map((m, i) => (
                <div className="market-mini" key={m.id}>
                  <div className="market-mini-num">{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#0E1612' }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: '#6B746E', marginTop: 2 }}>{m.area} · {m.dist} km · {m.vendors} vendors</div>
                  </div>
                  <span className={m.status === 'open' ? 'status-open' : 'status-closed'}>
                    {m.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="vv-container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 14 }}>Happy households</div>
            <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0 }}>
              What Our <span className="serif-it" style={{ color: '#166937' }}>Customers Say</span>
            </h2>
            <p style={{ color: '#6B746E', maxWidth: 480, margin: '14px auto 0', fontSize: 15.5 }}>
              Real reviews from 2,000+ Vizag families ordering with us every week.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="test-card-fresh">
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#E8A33D', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#2C342F', marginBottom: 24 }}>&ldquo;{t.body}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF8F0', color: '#0E5C2F', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0E1612' }}>{t.name}</div>
                    <div style={{ fontSize: 12.5, color: '#8E968F' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="vv-container">
          <div className="cta-band">
            <div className="cta-decor cta-decor-1" />
            <div className="cta-decor cta-decor-2" />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="eyebrow" style={{ color: '#A8DDB5', marginBottom: 14 }}>Start fresh today</div>
              <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '-0.03em', color: '#fff', margin: '0 auto 16px', maxWidth: 680 }}>
                ₹50 off your first order.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 17, maxWidth: 460, margin: '0 auto 36px' }}>
                Join 2,000+ Vizag families getting farm-fresh vegetables delivered every morning.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 999, background: '#fff', color: '#0A3D24', fontWeight: 700, fontSize: 15 }}>
                  Order Now
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 500, fontSize: 15 }}>
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HELP SECTION ───────────────────────────────────────────── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="vv-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {/* Email */}
            <div className="help-card-email" style={{ padding: 32, border: '1px solid', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'all 200ms' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166937" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
              </svg>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#0E1612', margin: '16px 0 8px' }}>Got a question?</h3>
              <p style={{ fontSize: 14.5, color: '#6B746E', marginBottom: 20, lineHeight: 1.6 }}>
                Reach out by email — we respond within an hour during support hours (Mon–Sat · 8 AM – 8 PM).
              </p>
              <a href="mailto:support@vizagvegetables.in" className="help-link">
                support@vizagvegetables.in
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            {/* WhatsApp */}
            <div className="help-card-whatsapp" style={{ padding: 32, border: '1px solid #EAEDEB', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'all 200ms' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#0E1612', margin: '16px 0 8px' }}>Quick help on WhatsApp</h3>
              <p style={{ fontSize: 14.5, color: '#6B746E', marginBottom: 20, lineHeight: 1.6 }}>
                Chat with our team for order issues, delivery updates or to share what you&apos;d like to see next.
              </p>
              <span className="help-link">+91 89195 00000
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
            {/* Feedback */}
            <div className="help-card-feedback" style={{ padding: 32, border: '1px solid', borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transition: 'all 200ms' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#E8A33D', fontSize: 20 }}>★</span>)}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#0E1612', margin: '16px 0 8px' }}>Share feedback</h3>
              <p style={{ fontSize: 14.5, color: '#6B746E', marginBottom: 20, lineHeight: 1.6 }}>
                Missing a vegetable? Found a bug? Want a feature? Tell us — we read every message.
              </p>
              <Link href="/support" className="help-link">
                Send feedback
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
