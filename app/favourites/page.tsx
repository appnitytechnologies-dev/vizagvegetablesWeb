'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { selectFavouriteIds, syncToggleFavourite } from '@/store/favouritesSlice';
import { addToCart } from '@/store/cartSlice';
import { api, ApiProduct, imgUrl } from '@/lib/api';
import type { AppDispatch } from '@/store';

export default function FavouritesPage() {
  const dispatch   = useDispatch<AppDispatch>();
  const ids        = useSelector(selectFavouriteIds);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [added,    setAdded]    = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.get<ApiProduct[]>('/api/products?limit=200')
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const favProducts = products.filter(p => ids.includes(p.id));

  const handleAddToCart = (p: ApiProduct) => {
    dispatch(addToCart({
      id: p.id, name: p.name, te: p.telugu_name ?? '',
      emoji: p.emoji, image_url: p.image_url,
      price: p.price, unit: p.unit, quantity: 1,
    }));
    setAdded(prev => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [p.id]: false })), 1500);
  };

  const handleShare = (p: ApiProduct) => {
    if (navigator.share) {
      navigator.share({ title: p.name, text: `${p.name} ₹${Math.round(p.price)}/${p.unit} — YZAG Fresh`, url: `${window.location.origin}/shop/${p.id}` }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/shop/${p.id}`).catch(() => {});
    }
  };

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1.5px solid #EAEDEB', padding: '28px 0 24px' }}>
        <div className="vv-container">
          <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 10 }}>My Account</div>
          <h1 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 800, fontSize: 'clamp(24px,4vw,40px)', color: '#0E1612', margin: 0, letterSpacing: '-0.02em' }}>
            Saved Favourites
          </h1>
          {!loading && favProducts.length > 0 && (
            <p style={{ marginTop: 6, color: '#6B746E', fontSize: 14 }}>
              {favProducts.length} saved product{favProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="vv-container" style={{ paddingTop: 32 }}>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #eee', borderTopColor: '#166937', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* Empty */}
        {!loading && favProducts.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Heart size={40} color="#EF4444" />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 22, color: '#0E1612', margin: '0 0 10px' }}>No favourites yet</h2>
            <p style={{ color: '#6B746E', fontSize: 14, marginBottom: 28 }}>Tap ♡ on any product to save it here.</p>
            <Link href="/shop" style={{ display: 'inline-block', background: '#166937', color: '#fff', fontWeight: 600, fontSize: 14, padding: '12px 28px', borderRadius: 999, textDecoration: 'none' }}>
              Browse Products
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && favProducts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {favProducts.map(p => {
              const src    = imgUrl(p.image_url);
              const onSale = p.previous_price > p.price;
              const disc   = onSale ? Math.round(((p.previous_price - p.price) / p.previous_price) * 100) : 0;
              return (
                <div key={p.id} style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #EAEDEB', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                  {/* Image */}
                  <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
                    <div style={{ height: 160, background: '#F5FAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {src
                        ? <img src={src} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
                        : <span style={{ fontSize: 72 }}>{p.emoji || '🥦'}</span>
                      }
                      {onSale && (
                        <span style={{ position: 'absolute', top: 12, left: 12, background: '#EEF8F0', color: '#166937', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>
                          -{disc}%
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#0E1612', lineHeight: 1.3 }}>{p.name}</div>
                      {p.telugu_name && <div style={{ fontSize: 12, color: '#8E968F', marginTop: 2 }}>{p.telugu_name}</div>}
                      <div style={{ fontSize: 11.5, color: '#8E968F', marginTop: 2 }}>per {p.unit}</div>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 20, color: '#166937' }}>₹{Math.round(p.price)}</span>
                      {onSale && <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#B0B8B1', textDecoration: 'line-through' }}>₹{Math.round(p.previous_price)}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleAddToCart(p)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
                        background: added[p.id] ? '#EEF8F0' : '#166937',
                        color:      added[p.id] ? '#166937' : '#fff',
                        transition: 'all 200ms',
                      }}
                    >
                      <ShoppingCart size={14} />
                      {added[p.id] ? 'Added!' : 'Add to Cart'}
                    </button>

                    {/* Unfavourite */}
                    <button
                      onClick={() => dispatch(syncToggleFavourite(p.id))}
                      title="Remove from favourites"
                      style={{ width: 40, height: 40, borderRadius: 12, border: '1.5px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <Heart size={16} fill="#EF4444" color="#EF4444" />
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(p)}
                      title="Share"
                      style={{ width: 40, height: 40, borderRadius: 12, border: '1.5px solid #EAEDEB', background: '#F5FAF6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <Share2 size={15} color="#166937" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
