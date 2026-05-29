'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { selectFavouriteIds, toggleFavourite } from '@/store/favouritesSlice';
import { ApiProduct, imgUrl, api } from '@/lib/api';
import { Heart } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function FavCard({ product, onUnfav }: { product: ApiProduct; onUnfav: () => void }) {
  const src   = imgUrl(product.image_url);
  const chg   = Math.round(product.price) - Math.round(product.previous_price || product.price);

  return (
    <div className="rate-card">
      <div className="rate-card-media">
        <div className="rate-card-circle">
          {src
            ? <img src={src} alt={product.name} />
            : <span>{product.emoji || '🥬'}</span>
          }
        </div>
        <button className="rate-fav is-active" onClick={onUnfav} aria-label="Remove from favourites">
          <Heart size={14} style={{ fill: '#fff' }} />
        </button>
      </div>
      <div className="rate-card-body">
        <div className="prod-name-fresh" style={{ fontSize: 14 }}>{product.name}</div>
        <div className="telugu" style={{ fontSize: 11.5, marginTop: 2 }}>{product.telugu_name || ''}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="prod-price">
            ₹{Math.round(product.price)}<span className="prod-price-unit">/{product.unit}</span>
          </span>
          {chg === 0
            ? <span style={{ color: '#B7BDB8', fontFamily: 'monospace', fontSize: 12 }}>—</span>
            : <span style={{
                fontFamily: 'monospace', fontSize: 12, fontWeight: 600,
                padding: '4px 9px', borderRadius: 999,
                background: chg < 0 ? '#EEF8F0' : '#FBEDE8',
                color: chg < 0 ? '#166937' : '#C8553D',
              }}>
                {chg > 0 ? '↑' : '↓'} ₹{Math.abs(chg)}
              </span>
          }
        </div>
      </div>
    </div>
  );
}

export default function FavouritesSection() {
  const dispatch   = useDispatch();
  const favIds     = useSelector(selectFavouriteIds);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (favIds.length === 0) { setProducts([]); return; }
    setLoading(true);
    Promise.all(
      favIds.map(id =>
        fetch(`${API_URL}/api/products/${id}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      setProducts(results.filter(Boolean) as ApiProduct[]);
    }).finally(() => setLoading(false));
  }, [favIds]);

  return (
    <section style={{ padding: '80px 0' }}>
      <div className="vv-container">
        {/* Section head */}
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ color: '#C8553D', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={12} style={{ display: 'inline' }} /> Your shortlist
            </div>
            <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0 }}>
              Favourite <span className="serif-it" style={{ color: '#166937' }}>Items</span>
            </h2>
          </div>
          {products.length > 0 && (
            <Link href="/prices" className="btn-ghost-dark" style={{ padding: '12px 22px', fontSize: 14 }}>
              Manage favourites
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          )}
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1.1fr',
            background: '#F5FAF6', border: '1px solid #DCF1E2',
            borderRadius: 28, overflow: 'hidden', minHeight: 340,
          }}>
            {/* Illustration */}
            <div style={{ background: 'linear-gradient(135deg, #F5F0E6 0%, #FBEDE8 100%)', display: 'grid', placeItems: 'center', padding: 32 }}>
              <svg viewBox="0 0 480 320" width="100%" height="100%" style={{ maxWidth: 380 }} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="favbg" cx="0.5" cy="0.5" r="0.7">
                    <stop offset="0%" stopColor="#FBEDE8"/>
                    <stop offset="100%" stopColor="#FAFAF7"/>
                  </radialGradient>
                </defs>
                <rect width="480" height="320" fill="url(#favbg)"/>
                <g transform="translate(240 160)">
                  <path d="M0 54 C -48 20 -78 -30 -35 -58 C -15 -70 0 -52 0 -38 C 0 -52 15 -70 35 -58 C 78 -30 48 20 0 54 Z"
                        fill="#FBEDE8" stroke="#C8553D" strokeWidth="2.5" strokeLinejoin="round" strokeDasharray="6 6"/>
                  <g transform="translate(-18 -6)">
                    <circle r="17" fill="#D94F38"/>
                    <ellipse cx="-5" cy="-5" rx="5" ry="9" fill="#F4B6A6" opacity="0.6"/>
                    <path d="M-3 -16 q 3 -7 10 -5 M2 -19 q 3 -3 8 0" stroke="#1F8A4C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  </g>
                  <g transform="translate(16 -2)">
                    <path d="M0 0 q -14 -3 -20 -20 q 12 -3 24 7 q 5 10 -4 13 Z" fill="#2BA15D"/>
                  </g>
                  <g transform="translate(0 20) rotate(-12)">
                    <path d="M0 0 L3 18 L6 0 Z" fill="#E8843D"/>
                    <path d="M0 0 q -3 -6 -2 -10 M3 -1 q 0 -8 3 -12 M6 0 q 5 -5 8 -8" stroke="#1F8A4C" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </g>
                </g>
                <g stroke="#C8553D" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5">
                  <path d="M80 70 l6 -6 M83 73 l6 6"/><path d="M390 90 l5 -5 M393 93 l5 5"/>
                  <path d="M85 260 l5 -5 M88 263 l5 5"/><path d="M375 270 l6 -6 M378 273 l6 6"/>
                </g>
                <g fill="#F4B6A6" opacity="0.5">
                  <path d="M110 120 c -7 -5 -10 -12 -3 -17 c 3 -2 7 0 7 3 c 0 -3 4 -5 7 -3 c 7 5 3 12 -3 17 c -2 2 -6 2 -8 0 Z"/>
                  <path d="M370 210 c -5 -4 -8 -10 -2 -14 c 3 -1 5 0 5 2 c 0 -2 3 -3 5 -2 c 5 4 3 10 -2 14 c -2 1 -5 1 -6 0 Z"/>
                </g>
              </svg>
            </div>
            {/* Content */}
            <div style={{ padding: '48px 52px 48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                borderRadius: 999, background: '#FBEDE8', color: '#C8553D',
                fontSize: 12.5, fontWeight: 500, marginBottom: 18, alignSelf: 'flex-start',
              }}>
                <Heart size={12} /> Your shortlist is empty
              </span>
              <h3 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(22px,2.5vw,32px)', letterSpacing: '-0.02em', color: '#0E1612', marginBottom: 14 }}>
                Pin the vegetables you <span className="serif-it" style={{ color: '#C8553D' }}>care about.</span>
              </h3>
              <p style={{ color: '#6B746E', fontSize: 15, lineHeight: 1.65, marginBottom: 28, maxWidth: 400 }}>
                Tap the <Heart size={13} style={{ display: 'inline', verticalAlign: '-2px', color: '#C8553D' }} /> on any vegetable to track its price every morning. We&apos;ll notify you when a favourite drops in price.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/prices" className="btn-primary" style={{ padding: '13px 22px', fontSize: 14 }}>
                  Browse today&apos;s rates
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/shop" className="btn-ghost-dark" style={{ padding: '13px 22px', fontSize: 14 }}>
                  Or shop fresh
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E968F' }}>Loading favourites…</div>
        )}

        {/* Filled state */}
        {!loading && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {products.map(p => (
              <FavCard key={p.id} product={p} onUnfav={() => {
                dispatch(toggleFavourite(p.id));
                api.post(`/api/favorites/${p.id}`, {}).catch(() => {});
              }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
