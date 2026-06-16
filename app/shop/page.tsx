'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Heart, Loader2, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQty, decreaseQty, selectItemQty } from '@/store/cartSlice';
import { syncToggleFavourite, selectIsFavourite } from '@/store/favouritesSlice';
import { RootState } from '@/store';
import { api, ApiProduct, ApiCategory, imgUrl } from '@/lib/api';

const CAT_ORDER = ['Leafy Greens', 'Vegetables', 'Fruits', 'Flowers'];

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Sort: Popular' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-az',    label: 'Name: A – Z' },
];

function ProductCard({ product }: { product: ApiProduct }) {
  const dispatch = useDispatch();
  const qty  = useSelector(selectItemQty(product.id));
  const isFav = useSelector((s: RootState) => selectIsFavourite(product.id)(s));
  const src  = imgUrl(product.image_url);
  const drop = product.previous_price > product.price
    ? product.previous_price - product.price
    : 0;

  return (
    <div style={{ background: '#EEF8F0', borderRadius: 20, border: '1px solid #E2EFE5', overflow: 'hidden', transition: 'box-shadow 140ms' }}
         className="shop-card-hover">
      {/* Image area */}
      <div style={{ position: 'relative', height: 190 }}>
        <Link href={`/shop/${product.id}`} style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          {src
            ? <img src={src} alt={product.name} style={{ maxWidth: '75%', maxHeight: '75%', objectFit: 'contain' }} />
            : <span style={{ fontSize: 72 }}>{product.emoji || '🥬'}</span>}
        </Link>

        {/* Price drop badge */}
        {drop > 0 && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#C8553D', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, fontFamily: 'monospace', pointerEvents: 'none' }}>
            ↓ ₹{drop}
          </span>
        )}

        {/* Heart button */}
        <button
          onClick={() => dispatch(syncToggleFavourite(product.id))}
          style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: '1px solid #E2EFE5', cursor: 'pointer', display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}
        >
          <Heart size={13} style={isFav ? { fill: '#C8553D', color: '#C8553D' } : { color: '#8E968F' }} />
        </button>
      </div>

      {/* Card body — white section */}
      <div style={{ background: '#fff', borderRadius: '0 0 20px 20px', padding: '14px 16px' }}>
        <div style={{ fontSize: 11.5, color: '#8E968F', marginBottom: 2, fontFamily: 'var(--font-telugu,sans-serif)' }}>
          {product.telugu_name || ''}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0E1612', marginBottom: 8 }}>{product.name}</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#0E1612' }}>
              ₹{Math.round(product.price)}
              <span style={{ fontWeight: 400, fontSize: 12, color: '#8E968F' }}> /{product.unit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, color: '#8E968F', fontSize: 11.5 }}>
              <Clock size={11} />
              <span>45 min</span>
            </div>
          </div>

          {qty === 0 ? (
            <button
              onClick={() => dispatch(addToCart({ id: product.id, name: product.name, te: product.telugu_name || '', emoji: product.emoji, image_url: product.image_url, price: product.price, unit: product.unit, quantity: 1 }))}
              style={{ background: '#166937', color: '#fff', fontWeight: 600, fontSize: 13.5, padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer', transition: 'background 140ms', flexShrink: 0 }}>
              Add to Cart
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '2px solid #166937', borderRadius: 999, padding: '4px 10px', flexShrink: 0 }}>
              <button onClick={() => dispatch(decreaseQty(product.id))} style={{ color: '#166937', fontWeight: 700, fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: 0 }}>−</button>
              <span style={{ fontWeight: 700, color: '#166937', fontSize: 13, minWidth: 16, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => dispatch(increaseQty(product.id))} style={{ color: '#166937', fontWeight: 700, fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: 0 }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products,   setProducts]   = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [cat,        setCat]        = useState('all');
  const [query,      setQuery]      = useState('');
  const [sort,       setSort]       = useState('popular');

  useEffect(() => {
    Promise.all([
      api.get<ApiProduct[]>('/api/products?limit=200'),
      api.get<ApiCategory[]>('/api/categories'),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const ai = CAT_ORDER.indexOf(a.name);
      const bi = CAT_ORDER.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [categories]);

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchCat = cat === 'all' || p.category_id === cat;
      const matchQ   = p.name.toLowerCase().includes(query.toLowerCase())
                    || (p.telugu_name || '').includes(query);
      return matchCat && matchQ;
    });

    if (sort === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'name-az')    result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, cat, query, sort]);

  return (
    <div style={{ background: '#FAFAF7', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ padding: '64px 0 48px' }}>
        <div className="vv-container">
          <div className="eyebrow" style={{ color: '#1F8A4C', marginBottom: 16 }}>Shop</div>
          <h1 style={{ fontFamily: 'var(--font-poppins,Poppins,sans-serif)', fontWeight: 700, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.03em', color: '#0E1612', margin: '0 0 20px', lineHeight: 1.05 }}>
            Fresh from this morning&apos;s{' '}
            <span className="serif-it" style={{ color: '#166937' }}>harvest.</span>
          </h1>
          <p style={{ fontSize: 16, color: '#6B746E', maxWidth: 540, lineHeight: 1.65 }}>
            {products.length > 0 ? products.length : 92} vegetables, fruits and leafy greens · delivered in 45 minutes across Visakhapatnam.
          </p>
        </div>
      </div>

      <div className="vv-container" style={{ paddingBottom: 80 }}>

        {/* ── Controls row ── */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 36, paddingBottom: 20, borderBottom: '1px solid #EAEDEB' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 400, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8E968F', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder={`Search vegetables, fruits, పేరు…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #EAEDEB', borderRadius: 999, fontSize: 14.5, background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#0E1612' }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
            <button onClick={() => setCat('all')} style={{
              padding: '9px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
              border: cat === 'all' ? 'none' : '1px solid #EAEDEB',
              background: cat === 'all' ? '#166937' : '#fff',
              color: cat === 'all' ? '#fff' : '#6B746E',
              fontFamily: 'inherit', transition: 'all 140ms',
            }}>All</button>
            {sortedCategories.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                padding: '9px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                border: cat === c.id ? 'none' : '1px solid #EAEDEB',
                background: cat === c.id ? '#166937' : '#fff',
                color: cat === c.id ? '#fff' : '#6B746E',
                fontFamily: 'inherit', transition: 'all 140ms',
              }}>{c.name}</button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #EAEDEB', borderRadius: 999, fontSize: 13.5, background: '#fff', color: '#0E1612', fontFamily: 'inherit', cursor: 'pointer', outline: 'none', flexShrink: 0 }}>
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── Product grid ── */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192, gap: 12, color: '#8E968F' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#8E968F' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>No products found</div>
            <button onClick={() => { setCat('all'); setQuery(''); }} style={{ marginTop: 12, color: '#166937', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20, position: 'relative' }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
