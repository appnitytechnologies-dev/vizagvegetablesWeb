'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, ApiOrder, imgUrl } from '@/lib/api';
import { Loader2, ChevronLeft, Check } from 'lucide-react';

/* ── Steps ───────────────────────────────────────────────── */
const STEPS = [
  { key: 'pending',          icon: '🛒', label: 'Order Placed',      desc: 'Your order has been received'         },
  { key: 'confirmed',        icon: '✅', label: 'Confirmed',          desc: 'Order confirmed by the store'         },
  { key: 'preparing',        icon: '👨‍🍳', label: 'Being Prepared',    desc: 'Your vegetables are being packed'     },
  { key: 'out_for_delivery', icon: '🛵', label: 'Out for Delivery',   desc: 'On the way to your address'           },
  { key: 'delivered',        icon: '📦', label: 'Delivered',          desc: 'Delivered successfully. Enjoy! 🥬'    },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4,
};

function TrackingContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [order,   setOrder]   = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    api.get<ApiOrder>(`/api/orders/${id}`)
      .then(setOrder)
      .catch(e => setError(e.message || 'Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Loading ── */
  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" /> Loading order…
    </div>
  );

  /* ── No ID ── */
  if (!id) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">📦</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No order selected</h2>
      <p className="text-gray-500 mb-6">Go to My Orders and tap Track on an active order.</p>
      <Link href="/orders" className="bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        My Orders
      </Link>
    </div>
  );

  /* ── Error ── */
  if (error || !order) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">❌</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <Link href="/orders" className="bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        My Orders
      </Link>
    </div>
  );

  const currentStep = STATUS_INDEX[order.status] ?? 0;
  const shortId     = order.id.slice(0, 8).toUpperCase();
  const date        = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/orders" className="inline-flex items-center gap-1 text-[#2E7D32] font-medium text-sm mb-6 hover:underline">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Track Order</h1>
      <p className="text-gray-500 text-sm mb-8">#{shortId} · Placed {date}</p>

      {/* ── Status Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{STEPS[currentStep]?.icon}</span>
          <div>
            <div className="font-bold text-gray-900">{STEPS[currentStep]?.label}</div>
            <div className="text-sm text-gray-500">{STEPS[currentStep]?.desc}</div>
          </div>
          {order.status === 'delivered' && (
            <span className="ml-auto text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Done ✓</span>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const done    = i < currentStep;
            const active  = i === currentStep;
            const pending = i > currentStep;
            return (
              <div key={step.key} className="flex gap-4">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors
                    ${done   ? 'bg-[#2E7D32] text-white'
                    : active ? 'bg-[#2E7D32] text-white ring-4 ring-[#C8E6C9]'
                    :          'bg-gray-100 text-gray-400'}`}>
                    {done ? <Check size={14} /> : step.icon}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${done ? 'bg-[#2E7D32]' : 'bg-gray-200'}`} />
                  )}
                </div>
                {/* Label */}
                <div className={`pb-5 pt-1.5 ${pending ? 'opacity-40' : ''}`}>
                  <div className={`font-semibold text-sm ${active ? 'text-[#2E7D32]' : 'text-gray-900'}`}>{step.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Delivery Details ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Delivery Details</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex gap-2"><span className="text-base">📍</span><span>{order.delivery_address}</span></div>
          <div className="flex gap-2"><span className="text-base">🕐</span><span>{order.delivery_slot}</span></div>
          <div className="flex gap-2"><span className="text-base">💳</span><span className="capitalize">{order.payment_method?.replace('_', ' ')}</span></div>
        </div>
      </div>

      {/* ── Items ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-3">Items Ordered</h3>
        <div className="space-y-2">
          {(order.items || []).map((item, i) => {
            const src = imgUrl(item.image_url);
            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {src ? <img src={src} alt={item.name} className="w-full h-full object-cover" /> : <span>🥬</span>}
                </div>
                <span className="flex-1 text-gray-700">{item.name}</span>
                <span className="text-gray-400">×{item.quantity} {item.unit}</span>
                <span className="font-medium text-gray-900">₹{item.unit_price * item.quantity}</span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>₹{Number(order.total_amount).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
        <Loader2 size={20} className="animate-spin" /> Loading…
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
