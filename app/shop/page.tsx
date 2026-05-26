'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQty, decreaseQty, selectItemQty } from '@/store/cartSlice';
import { toggleFavourite, selectIsFavourite } from '@/store/favouritesSlice';
import { RootState } from '@/store';
import { api, ApiProduct, ApiCategory, imgUrl } from '@/lib/api';

function ProductCard({ product }: { product: ApiProduct }) {
  const dispatch = useDispatch();
  const qty  = useSelector(selectItemQty(product.id));
  const isFav = useSelector((s: RootState) => selectIsFavourite(product.id)(s));
  const src  = imgUrl(product.image_url);
  const discount = product.previous_price > product.price
    ? Math.round(((product.previous_price - product.price) / product.previous_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative bg-[#E8F5E9] h-44 flex items-center justify-center">
          {src
            ? <img src={src} alt={product.name} className="w-full h-full object-cover" />
            : <span className="text-7xl">{product.emoji || '🥬'}</span>}
          <span className="absolute top-3 left-3 bg-[#2E7D32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">VV</span>
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discount}% off</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-sm truncate">{product.name}</div>
            <div className="text-xs text-gray-400">{product.telugu_name || ''}</div>
          </div>
          <button onClick={() => dispatch(toggleFavourite(product.id))} className="ml-2 p-1 hover:scale-110 transition-transform">
            <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>per {product.unit}</span>
          <span>·</span>
          <span>🕐 45 min</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.previous_price > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{product.previous_price}</span>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => dispatch(addToCart({ id: product.id, name: product.name, te: product.telugu_name || '', emoji: product.emoji, image_url: product.image_url, price: product.price, unit: product.unit, quantity: 1 }))}
              className="bg-[#2E7D32] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#1B5E20] transition-colors">Add</button>
          ) : (
            <div className="flex items-center gap-2 border-2 border-[#2E7D32] rounded-full px-2 py-0.5">
              <button onClick={() => dispatch(decreaseQty(product.id))} className="text-[#2E7D32] font-bold w-5 text-center">−</button>
              <span className="font-bold text-[#2E7D32] text-sm w-4 text-center">{qty}</span>
              <button onClick={() => dispatch(increaseQty(product.id))} className="text-[#2E7D32] font-bold w-5 text-center">+</button>
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

  useEffect(() => {
    Promise.all([
      api.get<ApiProduct[]>('/api/products?limit=100'),
      api.get<ApiCategory[]>('/api/categories'),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = cat === 'all' || p.category_id === cat;
    const matchQ   = p.name.toLowerCase().includes(query.toLowerCase())
                  || (p.telugu_name || '').includes(query);
    return matchCat && matchQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop Fresh Vegetables</h1>
          <p className="text-gray-500 text-sm mt-1">All products by Vizag Vegetables · Delivered in 45 min</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products…" value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setCat('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === 'all' ? 'bg-[#2E7D32] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'}`}>
          All
        </button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat === c.id ? 'bg-[#2E7D32] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading products…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <div className="font-medium text-lg">No products found</div>
          <button onClick={() => { setCat('all'); setQuery(''); }} className="mt-4 text-[#2E7D32] font-semibold hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
