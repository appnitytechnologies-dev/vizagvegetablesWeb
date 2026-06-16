'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Link from 'next/link';
import { syncToggleFavourite, selectIsFavourite } from '@/store/favouritesSlice';
import { selectAuth } from '@/store/authSlice';
import { ApiProduct, imgUrl, api } from '@/lib/api';
import { Heart } from 'lucide-react';
import DragScroll from '@/components/DragScroll';
import AuthModal from '@/components/AuthModal';

function RateCard({ product }: { product: ApiProduct }) {
  const dispatch           = useDispatch();
  const auth               = useSelector(selectAuth);
  const isFav              = useSelector(selectIsFavourite(product.id));
  const [showAuth, setShowAuth] = useState(false);
  const src                = imgUrl(product.image_url);
  const chg                = Math.round(product.price) - Math.round(product.previous_price || product.price);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!auth.isLoggedIn) { setShowAuth(true); return; }
    dispatch(syncToggleFavourite(product.id));
  };

  return (
    <>
      <div className="rate-card">
        <div className="rate-card-media">
          <div className="rate-card-circle">
            {src
              ? <img src={src} alt={product.name} />
              : <span>{product.emoji || '🥬'}</span>
            }
          </div>
          <button
            className={`rate-fav ${isFav ? 'is-active' : ''}`}
            onClick={handleFav}
            aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart size={14} style={isFav ? { fill: '#fff' } : {}} />
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
      {showAuth && (
        <AuthModal mode="login" onClose={() => setShowAuth(false)} onSwitch={() => {}} />
      )}
    </>
  );
}

interface Props {
  products: ApiProduct[];
  totalCount: number;
  today: string;
}

export default function RatesSection({ products, totalCount, today }: Props) {
  return (
    <section className="section-rates" style={{ margin: '32px 16px 0' }}>
      <div className="vv-container" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 8 }}>Live · Updated 6:14 AM</div>
            <h2 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.025em', color: '#0E1612', margin: 0 }}>
              Today&apos;s <span className="telugu-display">రైతు బజార్</span>{' '}
              <span className="serif-it" style={{ color: '#166937' }}>Rates</span>
            </h2>
            <p style={{ color: '#6B746E', marginTop: 10, fontSize: 15 }}>{today} · Wholesale rates from all 4 Rythu Bazars</p>
          </div>
          <Link href="/prices" className="btn-ghost-dark" style={{ padding: '12px 22px', fontSize: 14, whiteSpace: 'nowrap' }}>
            See all {totalCount > 0 ? `${totalCount} items` : 'rates'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E968F' }}>No market data yet.</div>
        ) : (
          <DragScroll className="rates-rail">
            {products.map(p => <RateCard key={p.id} product={p} />)}
          </DragScroll>
        )}
      </div>
    </section>
  );
}
