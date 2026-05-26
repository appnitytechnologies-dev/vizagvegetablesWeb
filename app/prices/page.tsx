'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2, LayoutList, LayoutGrid, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/store/authSlice';
import { api, ApiProduct, imgUrl } from '@/lib/api';
import AuthModal from '@/components/AuthModal';


export default function PricesPage() {
  const auth = useSelector(selectAuth);

  const [products,  setProducts]  = useState<ApiProduct[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [query,     setQuery]     = useState('');
  const [cat,       setCat]       = useState('All');
  const [view,      setView]      = useState<'list' | 'grid'>('list');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAuth,  setShowAuth]  = useState(false);

  useEffect(() => {
    api.get<ApiProduct[]>('/api/products?limit=200')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Load favorites from DB when logged in */
  useEffect(() => {
    if (!auth.isLoggedIn) { setFavorites(new Set()); return; }
    api.get<string[]>('/api/favorites')
      .then(ids => setFavorites(new Set(ids)))
      .catch(() => {});
  }, [auth.isLoggedIn]);

  const toggleFav = (id: string) => {
    if (!auth.isLoggedIn) { setShowAuth(true); return; }
    /* Optimistic update */
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    /* Persist to DB */
    api.post<{ favorited: boolean }>(`/api/favorites/${id}`, {}).catch(() => {
      /* Revert on failure */
      setFavorites(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    });
  };

  const hasFavs = favorites.size > 0;

  /* Category pills — Favorites first, then All, then product categories */
  const productCats = Array.from(new Set(products.map(p => p.category_name).filter(Boolean)));
  const cats = [
    ...(hasFavs ? ['Favorites'] : []),
    'All',
    ...productCats,
  ];

  /* Filter + sort: favorites float to top when viewing All */
  const filtered = products
    .filter(p => {
      if (cat === 'Favorites') return favorites.has(p.id);
      const matchCat = cat === 'All' || p.category_name === cat;
      const matchQ   = p.name.toLowerCase().includes(query.toLowerCase())
                    || (p.telugu_name || '').includes(query);
      return matchCat && matchQ;
    })
    .sort((a, b) => {
      /* When on All/category views, favorites float to the top */
      if (cat !== 'Favorites') {
        const af = favorites.has(a.id) ? 0 : 1;
        const bf = favorites.has(b.id) ? 0 : 1;
        if (af !== bf) return af - bf;
      }
      return 0;
    });

  /* Search also works inside Favorites */
  const display = cat === 'Favorites'
    ? filtered.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.telugu_name || '').includes(query))
    : filtered;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Today&apos;s Rythu Bazar Rates</h1>
        <p className="text-gray-500 text-sm">
          Prices updated this morning ·&nbsp;
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Search + filters + view toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text"
            placeholder={`Search among ${products.length} items…`}
            value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === c
                  ? c === 'Favorites' ? 'bg-red-500 text-white' : 'bg-[#2E7D32] text-white'
                  : c === 'Favorites' ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50'
                                      : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'
              }`}>
              {c === 'Favorites' && <Heart size={13} className={cat === 'Favorites' ? 'fill-white' : 'fill-red-400'} />}
              {c}
              {c === 'Favorites' && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cat === 'Favorites' ? 'bg-white/20' : 'bg-red-100 text-red-500'}`}>{favorites.size}</span>}
            </button>
          ))}
          {/* View toggle */}
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden ml-1">
            <button onClick={() => setView('list')}
              className={`p-2 transition-colors ${view === 'list' ? 'bg-[#2E7D32] text-white' : 'text-gray-400 hover:text-[#2E7D32]'}`}>
              <LayoutList size={16} />
            </button>
            <button onClick={() => setView('grid')}
              className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#2E7D32] text-white' : 'text-gray-400 hover:text-[#2E7D32]'}`}>
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading prices…
        </div>
      ) : display.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">{cat === 'Favorites' ? '❤️' : '🔍'}</div>
          <div className="font-medium">
            {cat === 'Favorites' ? 'No favourites yet' : 'No items found'}
          </div>
          <div className="text-sm mt-1">
            {cat === 'Favorites'
              ? 'Tap the ♡ heart on any item to save it here'
              : 'Try a different search or category'}
          </div>
        </div>
      ) : view === 'list' ? (
        /* ── LIST VIEW ── */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] bg-[#E8F5E9] px-6 py-3 text-xs font-semibold text-[#2E7D32] uppercase tracking-wide">
            <div>Item</div>
            <div className="text-center w-20">Today</div>
            <div className="text-center w-24">Yesterday</div>
            <div className="text-center w-20">Change</div>
            <div className="w-8" />
          </div>
          {display.map((p, i) => {
            const chg  = p.price - (p.previous_price || p.price);
            const prev = p.previous_price || p.price;
            const src  = imgUrl(p.image_url);
            const isFav = favorites.has(p.id);
            return (
              <div key={p.id} className={`grid grid-cols-[1fr_auto_auto_auto_auto] px-6 py-3.5 items-center border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {src
                      ? <img src={src} alt={p.name} className="w-full h-full object-cover" />
                      : <span className="text-xl">{p.emoji || '🥬'}</span>}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.telugu_name || ''} · per {p.unit}</div>
                  </div>
                </div>
                <div className="text-center font-bold text-gray-900 w-20">₹{p.price}</div>
                <div className="text-center text-gray-500 text-sm w-24">₹{prev}</div>
                <div className="text-center w-20">
                  {chg === 0
                    ? <span className="text-gray-400 text-sm font-medium">—</span>
                    : <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${chg < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {chg < 0 ? '↓' : '↑'} ₹{Math.abs(chg)}
                      </span>
                  }
                </div>
                <div className="w-8 flex justify-end">
                  <button onClick={() => toggleFav(p.id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                    <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── GRID VIEW ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {display.map(p => {
            const src   = imgUrl(p.image_url);
            const isFav = favorites.has(p.id);
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="bg-[#E8F5E9] h-36 flex items-center justify-center overflow-hidden relative">
                  {src
                    ? <img src={src} alt={p.name} className="w-full h-full object-cover" />
                    : <span className="text-6xl">{p.emoji || '🥬'}</span>}
                  {/* Heart button */}
                  <button onClick={() => toggleFav(p.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                    <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                  </button>
                </div>
                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  {p.telugu_name && <div className="text-[10px] text-gray-400 mb-0.5">{p.telugu_name}</div>}
                  <div className="font-semibold text-sm text-gray-900 leading-tight mb-1">{p.name}</div>
                  <div className="text-xs text-gray-400 mb-2">per {p.unit}</div>
                  <div className="font-bold text-gray-900">₹{p.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">Prices are indicative rates from Rythu Bazar, Visakhapatnam.</p>

      {showAuth && <AuthModal mode="login" onClose={() => setShowAuth(false)} onSwitch={() => {}} />}
    </div>
  );
}
