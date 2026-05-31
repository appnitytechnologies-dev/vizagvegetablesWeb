'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2, LayoutList, LayoutGrid, Heart, Share2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '@/store/authSlice';
import { selectIsFavourite, selectFavouriteIds, toggleFavourite } from '@/store/favouritesSlice';
import { api, ApiProduct, imgUrl } from '@/lib/api';
import AuthModal from '@/components/AuthModal';
import { RootState } from '@/store';

const CATS = [
  { id: 'All',        label: 'All' },
  { id: 'Leafy Greens', label: 'Leafy Greens' },
  { id: 'Vegetables', label: 'Vegetables' },
  { id: 'Fruits',     label: 'Fruits' },
  { id: 'Flowers',    label: 'Flowers' },
];

function PriceRow({ p, showAuth }: { p: ApiProduct; showAuth: () => void }) {
  const dispatch = useDispatch();
  const auth     = useSelector(selectAuth);
  const isFav    = useSelector((s: RootState) => selectIsFavourite(p.id)(s));
  const src      = imgUrl(p.image_url);
  const chg      = p.price - (p.previous_price || p.price);

  const handleFav = () => {
    if (!auth.isLoggedIn) { showAuth(); return; }
    dispatch(toggleFavourite(p.id));
    api.post(`/api/favorites/${p.id}`, {}).catch(() => {});
  };

  const handleShare = () => {
    const text = `${p.name}${p.telugu_name ? ` (${p.telugu_name})` : ''} at Vizag Vegetables — today's Rythu Bazar rate: ₹${p.price}/${p.unit}`;
    if (navigator.share) navigator.share({ title: p.name, text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px 150px', gap: 16, padding: '14px 24px', borderBottom: '1px solid #EAEDEB', alignItems: 'center' }}
         className="price-row-hover">
      {/* Item */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          {src
            ? <img src={src} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 22 }}>{p.emoji || '🥬'}</span>}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#0E1612' }}>{p.name}</div>
          <div style={{ fontSize: 12.5, color: '#8E968F', fontFamily: 'var(--font-telugu,sans-serif)' }}>
            {p.telugu_name || ''}{p.telugu_name ? ' · ' : ''}per {p.unit}
          </div>
        </div>
      </div>

      {/* Today */}
      <div style={{ fontFamily: 'monospace', fontSize: 17, fontWeight: 700, color: '#0E1612', textAlign: 'right' }}>
        ₹{Number(p.price).toFixed(2)}
      </div>

      {/* Yesterday */}
      <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#8E968F', textAlign: 'right' }}>
        ₹{Number(p.previous_price || p.price).toFixed(2)}
      </div>

      {/* Change + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        {chg === 0
          ? <span style={{ color: '#B7BDB8', fontSize: 14 }}>—</span>
          : <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, color: chg > 0 ? '#C8553D' : '#166937' }}>
              {chg > 0 ? '↑' : '↓'} ₹{Math.abs(chg)}
            </span>
        }
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={handleFav} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'transparent',
            display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none',
            color: isFav ? '#C8553D' : '#B7BDB8', transition: 'all 140ms',
          }}>
            <Heart size={15} style={isFav ? { fill: '#C8553D' } : {}} />
          </button>
          <button onClick={handleShare} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'transparent',
            display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none',
            color: '#B7BDB8', transition: 'all 140ms',
          }}>
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceGridCard({ p, showAuth }: { p: ApiProduct; showAuth: () => void }) {
  const dispatch = useDispatch();
  const auth     = useSelector(selectAuth);
  const isFav    = useSelector((s: RootState) => selectIsFavourite(p.id)(s));
  const src      = imgUrl(p.image_url);
  const chg      = p.price - (p.previous_price || p.price);

  const handleFav = () => {
    if (!auth.isLoggedIn) { showAuth(); return; }
    dispatch(toggleFavourite(p.id));
    api.post(`/api/favorites/${p.id}`, {}).catch(() => {});
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: '#fff', border: '1px solid #EAEDEB', borderRadius: 14, transition: 'all 140ms' }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, background: '#EEF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
        {src
          ? <img src={src} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 28 }}>{p.emoji || '🥬'}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#8E968F', fontFamily: 'var(--font-telugu,sans-serif)' }}>{p.telugu_name || ''}</div>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#0E1612' }}>{p.name}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 600, color: '#0E1612', marginTop: 2 }}>
          ₹{Math.round(p.price)}<span style={{ opacity: 0.55, fontSize: 11, fontWeight: 400 }}>/{p.unit}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        {chg !== 0 && (
          <span style={{ fontFamily: 'monospace', fontSize: 11.5, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: chg < 0 ? '#EEF8F0' : '#FBEDE8', color: chg < 0 ? '#166937' : '#C8553D' }}>
            {chg > 0 ? '↑' : '↓'} ₹{Math.abs(chg)}
          </span>
        )}
        <button onClick={handleFav} style={{ width: 28, height: 28, borderRadius: '50%', background: 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', border: 'none', color: isFav ? '#C8553D' : '#B7BDB8' }}>
          <Heart size={14} style={isFav ? { fill: '#C8553D' } : {}} />
        </button>
      </div>
    </div>
  );
}

export default function PricesPage() {
  const favIds = useSelector(selectFavouriteIds);
  const [products,  setProducts]  = useState<ApiProduct[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [cat,       setCat]       = useState('All');
  const [view,      setView]      = useState<'list' | 'grid'>('list');
  const [showAuth,  setShowAuth]  = useState(false);

  useEffect(() => {
    api.get<ApiProduct[]>('/api/market-rates?limit=500')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = cat === 'All' || (cat === 'Favourites' ? favIds.includes(p.id) : p.category_name === cat);
    const matchQ   = !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.telugu_name || '').includes(query);
    return matchCat && matchQ;
  });

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>
      {showAuth && <AuthModal mode="login" onClose={() => setShowAuth(false)} onSwitch={() => {}} />}

      {/* ── Page Hero ── */}
      <div style={{ padding: '64px 0 48px' }}>
        <div className="vv-container">
          <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 16 }}>Live · {today}</div>
          <h1 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(36px,5vw,72px)', letterSpacing: '-0.035em', color: '#0E1612', margin: '0 0 20px', lineHeight: 1.05 }}>
            Today&apos;s <span className="serif-it" style={{ color: '#166937' }}>Rythu Bazar</span> rates.
          </h1>
          <p style={{ fontSize: 16, color: '#6B746E', maxWidth: 560, lineHeight: 1.65 }}>
            Updated this morning at 6:14 AM from all 4 Rythu Bazar locations across Visakhapatnam. Prices are indicative.
          </p>
        </div>
      </div>

      <div className="vv-container" style={{ paddingBottom: 80 }}>

        {/* ── Controls ── */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #EAEDEB' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 480, minWidth: 220 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8E968F', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder={`Search ${products.length} items…`}
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #EAEDEB', borderRadius: 999, fontSize: 14.5, background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#0E1612' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {/* All button */}
            <button onClick={() => setCat('All')} style={{
              padding: '9px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
              border: cat === 'All' ? 'none' : '1px solid #EAEDEB',
              background: cat === 'All' ? '#166937' : '#fff',
              color: cat === 'All' ? '#fff' : '#6B746E',
              fontFamily: 'inherit', transition: 'all 140ms',
            }}>All</button>

            {/* Favourites — right after All */}
            {favIds.length > 0 && (
              <button onClick={() => setCat(cat === 'Favourites' ? 'All' : 'Favourites')} style={{
                padding: '9px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                border: cat === 'Favourites' ? 'none' : '1px solid #EAEDEB',
                background: cat === 'Favourites' ? '#C8553D' : '#fff',
                color: cat === 'Favourites' ? '#fff' : '#C8553D',
                fontFamily: 'inherit', transition: 'all 140ms',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Heart size={13} style={cat === 'Favourites' ? { fill: '#fff' } : { fill: '#C8553D' }} />
                Favourites ({favIds.length})
              </button>
            )}

            {/* Remaining categories (skip All since it's rendered above) */}
            {CATS.filter(c => c.id !== 'All').map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                padding: '9px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                border: cat === c.id ? 'none' : '1px solid #EAEDEB',
                background: cat === c.id ? '#166937' : '#fff',
                color: cat === c.id ? '#fff' : '#6B746E',
                fontFamily: 'inherit', transition: 'all 140ms',
              }}>{c.label}</button>
            ))}
          </div>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #EAEDEB', borderRadius: 999, padding: 3, marginLeft: 'auto' }}>
            {([['list', LayoutList], ['grid', LayoutGrid]] as const).map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)} style={{
                width: 36, height: 32, display: 'grid', placeItems: 'center', borderRadius: 999,
                background: view === v ? '#166937' : 'transparent', color: view === v ? '#fff' : '#8E968F',
                border: 'none', cursor: 'pointer', transition: 'all 140ms',
              }}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192, gap: 12, color: '#8E968F' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading prices…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#8E968F' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600 }}>No items found</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Try a different search or category</div>
          </div>
        ) : view === 'list' ? (
          <div style={{ background: '#fff', border: '1px solid #EAEDEB', borderRadius: 20, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 100px 150px', gap: 16, padding: '12px 24px', background: '#EEF8F0' }}>
              {['Item', 'Today', 'Yesterday', 'Change'].map((h, i) => (
                <div key={h} style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#166937', textAlign: i > 0 ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>
            {filtered.map(p => <PriceRow key={p.id} p={p} showAuth={() => setShowAuth(true)} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 12 }}>
            {filtered.map(p => <PriceGridCard key={p.id} p={p} showAuth={() => setShowAuth(true)} />)}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: '#8E968F' }}>
          Prices are indicative rates aggregated from Rythu Bazar, Visakhapatnam.
        </p>
      </div>
    </div>
  );
}
