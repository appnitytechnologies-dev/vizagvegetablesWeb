import Link from 'next/link';
import HomeClient from './HomeClient';
import { ApiProduct } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchProducts(limit = 6): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

const FEATURES = [
  { icon: '🌾', title: 'Farm Fresh',        sub: 'Sourced daily from Rythu Bazar farmers' },
  { icon: '⚡', title: '45-Min Delivery',   sub: 'Fast delivery across Visakhapatnam' },
  { icon: '💰', title: 'Rythu Bazar Price', sub: 'Wholesale rates, zero markup' },
  { icon: '✅', title: 'Quality Assured',   sub: 'Fresh produce or full refund' },
];

const WHY = [
  { icon: '🚜', title: 'Direct from Farmers',  body: 'We partner directly with Rythu Bazar farmers — no middlemen, no cold storage, just farm-fresh produce every morning.' },
  { icon: '📊', title: 'Live Price Tracking',   body: 'Vegetable prices updated every morning from all 4 Rythu Bazar locations across Visakhapatnam.' },
  { icon: '🛵', title: 'Morning Delivery',      body: 'Order by 9 PM and receive your vegetables the next morning, fresh from the market, right at your doorstep.' },
  { icon: '🔒', title: 'Safe & Secure',         body: 'Secure UPI, card, and cash-on-delivery options. Cancel any order within 15 minutes, no questions asked.' },
  { icon: '🌱', title: 'Support Local Farmers', body: 'Every order directly supports local Visakhapatnam farmers, helping them earn fair prices for their hard work.' },
  { icon: '📱', title: 'App + Web',             body: 'Shop seamlessly on our mobile app or website. Your cart and orders sync across all devices instantly.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  role: 'Homemaker, Madhurawada',   text: 'I love how fresh the vegetables are! The prices are exactly what I see at Rythu Bazar but delivered to my door. Saves me so much time every morning.', initials: 'PS' },
  { name: 'Ravi Kumar',    role: 'Office Worker, MVP Colony', text: "The price transparency is brilliant. I know exactly what I'm paying and there's no surprise markup. My family loves the freshness!", initials: 'RK' },
  { name: 'Ananya Reddy',  role: 'Teacher, Gajuwaka',        text: 'Ordered for the first time last week. Vegetables were delivered within 45 minutes, all fresh and well-packed. Will definitely order again!', initials: 'AR' },
];

export default async function HomePage() {
  const [allProducts, shopProducts] = await Promise.all([
    fetchProducts(6),
    fetchProducts(4),
  ]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const topRates = allProducts.slice(0, 6);

  return (
    <div className="bg-[#FAFAFA]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F1F8E9] border border-[#C8E6C9] rounded-full px-4 py-1.5 text-sm font-medium text-[#3D8C40] mb-6">
                <span className="w-2 h-2 bg-[#3D8C40] rounded-full animate-pulse" />
                Rythu Bazar prices updated daily
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                Fresh Vegetables<br />
                <span className="text-[#3D8C40]">from Farm to Table</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                Order directly at Rythu Bazar prices. No middlemen, no markups —
                delivered fresh to your door every morning across Visakhapatnam.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/shop" className="bg-[#3D8C40] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#357A38] transition-colors shadow-sm text-base">
                  Shop Now →
                </Link>
                <Link href="/prices" className="border-2 border-gray-200 text-gray-700 font-semibold px-7 py-3 rounded-full hover:border-[#3D8C40] hover:text-[#3D8C40] transition-colors text-base">
                  Today&apos;s Prices
                </Link>
              </div>
              <div className="flex flex-wrap gap-8">
                {[['20+','Vegetables'], ['4','Markets'], ['2K+','Customers'], ['45 min','Delivery']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-bold text-gray-900">{v}</div>
                    <div className="text-[#3D8C40] text-sm font-medium">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-3 gap-3">
                {['🍅','🧅','🥦','🥕','🍆','🌿','🫑','🌽','🥒'].map((e, i) => (
                  <div key={i} className="bg-[#F1F8E9] rounded-2xl p-6 text-5xl text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-default border border-[#E8F5E9]">
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F9FFF9] transition-colors">
                <div className="w-10 h-10 bg-[#F1F8E9] rounded-xl flex items-center justify-center text-xl flex-shrink-0">{f.icon}</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{f.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TODAY'S RATES ──────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#3D8C40] font-semibold text-sm mb-1">Live Market Prices</p>
              <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Rythu Bazar Rates</h2>
              <p className="text-gray-400 text-sm mt-2">{today} · Updated every morning 6–8 AM</p>
            </div>
            <Link href="/prices" className="text-[#3D8C40] font-semibold text-sm hover:underline hidden sm:block">View all prices →</Link>
          </div>

          {topRates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              No market data yet — add products in the admin dashboard.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-4 bg-[#F1F8E9] px-6 py-3.5 text-xs font-bold text-[#3D8C40] uppercase tracking-wider">
                <div className="col-span-2">Vegetable</div>
                <div className="text-center">Price / unit</div>
                <div className="text-center">Change</div>
              </div>
              {topRates.map((p, i) => {
                const chg = p.price - (p.previous_price || p.price);
                return (
                  <div key={p.id} className={`grid grid-cols-4 px-6 py-4 items-center ${i < topRates.length - 1 ? 'border-b border-gray-50' : ''} ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <div className="col-span-2 flex items-center gap-3">
                      <span className="text-2xl">{p.emoji || '🥬'}</span>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-400">{p.telugu_name || ''}</div>
                      </div>
                    </div>
                    <div className="text-center font-bold text-gray-900">₹{p.price}<span className="text-xs font-normal text-gray-400">/{p.unit}</span></div>
                    <div className="text-center">
                      {chg === 0
                        ? <span className="text-gray-300 text-sm">—</span>
                        : <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${chg < 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {chg < 0 ? '↓' : '↑'} ₹{Math.abs(chg)}
                          </span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── SHOP FRESH ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#3D8C40] font-semibold text-sm mb-1">Fresh Picks</p>
              <h2 className="text-3xl font-bold text-gray-900">Shop Fresh Vegetables</h2>
            </div>
            <Link href="/shop" className="text-[#3D8C40] font-semibold text-sm hover:underline hidden sm:block">View all →</Link>
          </div>
          {shopProducts.length === 0
            ? <p className="text-gray-400 text-center py-10">No products yet — add them in the admin dashboard.</p>
            : <HomeClient products={shopProducts} />
          }
          <div className="text-center mt-8">
            <Link href="/shop" className="inline-block border-2 border-[#3D8C40] text-[#3D8C40] font-semibold px-8 py-3 rounded-full hover:bg-[#F1F8E9] transition-colors">
              Browse All Vegetables →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#3D8C40] font-semibold text-sm mb-2">Why Vizag Vegetables?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything your kitchen needs</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We connect Vizag households directly with Rythu Bazar — fresh produce, fair prices, and fast delivery.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map(w => (
              <div key={w.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 bg-[#F1F8E9] rounded-xl flex items-center justify-center text-2xl mb-4">{w.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{w.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#3D8C40] font-semibold text-sm mb-2">Happy Customers</p>
            <h2 className="text-3xl font-bold text-gray-900">What Vizag families say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-[#FAFAFA] rounded-2xl border border-gray-100 p-6">
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3D8C40] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{t.initials}</div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#3D8C40] rounded-3xl px-8 py-14 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />
            <div className="relative">
              <p className="text-green-200 font-medium text-sm mb-3">Start Fresh Today</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Get ₹50 off your first order</h2>
              <p className="text-green-100 text-lg mb-8 max-w-md mx-auto">Join 2,000+ Vizag families getting farm-fresh vegetables delivered every morning.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/shop" className="bg-white text-[#3D8C40] font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors text-base shadow-sm">Order Now →</Link>
                <Link href="/about" className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-base">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
