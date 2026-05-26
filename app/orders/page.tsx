'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/store/authSlice';
import { api, imgUrl, ApiOrder, ApiOrderItem } from '@/lib/api';
import { Loader2, LogIn } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

const STATUS_STYLE: Record<string, string> = {
  pending:          'bg-orange-100 text-orange-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-sky-100 text-sky-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-600',
};

const STATUS_LABEL: Record<string, string> = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

export default function OrdersPage() {
  const auth = useSelector(selectAuth);

  const [orders,   setOrders]   = useState<ApiOrder[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn) { setLoading(false); return; }
    api.get<ApiOrder[]>('/api/orders/my')
      .then(setOrders)
      .catch(e => setError(e.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [auth.isLoggedIn]);

  if (!auth.isLoggedIn) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Login required</h2>
      <p className="text-gray-500 mb-6">Log in to view your order history</p>
      <button onClick={() => setShowAuth(true)}
        className="inline-flex items-center gap-2 bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        <LogIn size={18} /> Login to Continue
      </button>
      {showAuth && <AuthModal mode="login" onClose={() => setShowAuth(false)} onSwitch={() => {}} />}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading orders…
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to place your first order!</p>
          <Link href="/shop" className="inline-block bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => {
            const date = new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const shortId = o.id.slice(0, 8).toUpperCase();
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Header — clicking goes to detail */}
                <Link href={`/orders/${o.id}`} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-bold text-gray-900">#{shortId}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{date} · {o.delivery_slot}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                    <span className="text-gray-400 text-sm">›</span>
                  </div>
                </Link>

                {/* Items */}
                <div className="px-5 py-3 space-y-2">
                  {(o.items || []).slice(0, 3).map((item: ApiOrderItem, i: number) => {
                    const src = imgUrl(item.image_url);
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-7 h-7 rounded bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {src
                            ? <img src={src} alt={item.name} className="w-full h-full object-cover" />
                            : <span className="text-sm">🥬</span>}
                        </div>
                        <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                        <span className="text-gray-400">×{item.quantity}</span>
                        <span className="font-medium text-gray-900">₹{item.unit_price * item.quantity}</span>
                      </div>
                    );
                  })}
                  {(o.items || []).length > 3 && (
                    <div className="text-xs text-gray-400 pl-9">+{o.items.length - 3} more item{o.items.length - 3 > 1 ? 's' : ''}</div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total <span className="font-bold text-gray-900">₹{Number(o.total_amount).toFixed(0)}</span>
                    <span className="text-xs text-gray-400 ml-2">· {o.payment_method?.toUpperCase()}</span>
                  </div>
                  <div className="flex gap-2">
                    {['confirmed','preparing','out_for_delivery'].includes(o.status) && (
                      <Link href={`/order-tracking?id=${o.id}`} className="text-sm font-semibold text-white bg-[#2E7D32] px-3 py-1.5 rounded-full hover:bg-[#1B5E20] transition-colors">
                        Track
                      </Link>
                    )}
                    <Link href="/shop" className="text-sm font-semibold text-[#2E7D32] border border-[#2E7D32] px-3 py-1.5 rounded-full hover:bg-[#E8F5E9] transition-colors">
                      Reorder
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
