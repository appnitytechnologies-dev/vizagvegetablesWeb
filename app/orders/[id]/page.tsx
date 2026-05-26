'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api, ApiOrder, imgUrl } from '@/lib/api';
import { Loader2, ChevronLeft, Check, MapPin, Clock, CreditCard, Package } from 'lucide-react';

/* ── Tracking steps ──────────────────────────────────────── */
const STEPS = [
  { key: 'pending',          icon: '🛒', label: 'Order Placed',    desc: 'Your order has been received'       },
  { key: 'confirmed',        icon: '✅', label: 'Confirmed',        desc: 'Order confirmed by the store'       },
  { key: 'preparing',        icon: '👨‍🍳', label: 'Being Prepared',  desc: 'Your vegetables are being packed'   },
  { key: 'out_for_delivery', icon: '🛵', label: 'Out for Delivery', desc: 'On the way to your address'         },
  { key: 'delivered',        icon: '📦', label: 'Delivered',        desc: 'Delivered! Enjoy your fresh veggies 🥬' },
];
const STEP_INDEX: Record<string, number> = {
  pending: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4,
};

const STATUS_STYLE: Record<string, string> = {
  pending:          'bg-orange-100 text-orange-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-sky-100 text-sky-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-600',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const [order,   setOrder]   = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get<ApiOrder>(`/api/orders/${id}`)
      .then(setOrder)
      .catch(e => setError(e.message || 'Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" /> Loading order…
    </div>
  );

  if (error || !order) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">❌</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <Link href="/orders" className="bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        Back to Orders
      </Link>
    </div>
  );

  const shortId     = order.id.slice(0, 8).toUpperCase();
  const date        = new Date(order.created_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const currentStep = order.status === 'cancelled' ? -1 : (STEP_INDEX[order.status] ?? 0);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back */}
      <Link href="/orders" className="inline-flex items-center gap-1 text-[#2E7D32] font-medium text-sm mb-6 hover:underline">
        <ChevronLeft size={16} /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{shortId}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{date}</p>
        </div>
        <span className={`self-start sm:self-auto text-sm font-bold px-4 py-1.5 rounded-full ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {STATUS_LABEL[order.status] || order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left: Tracking + Items ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tracking Timeline */}
          {!isCancelled ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Package size={17} className="text-[#2E7D32]" /> Order Progress
              </h2>
              <div>
                {STEPS.map((step, i) => {
                  const done    = i < currentStep;
                  const active  = i === currentStep;
                  const pending = i > currentStep;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
                          ${done   ? 'bg-[#2E7D32] text-white'
                          : active ? 'bg-[#2E7D32] text-white ring-4 ring-[#C8E6C9]'
                          :          'bg-gray-100 text-gray-400'}`}>
                          {done ? <Check size={14} /> : step.icon}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 min-h-[28px] ${done ? 'bg-[#2E7D32]' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className={`pb-6 pt-1.5 ${pending ? 'opacity-40' : ''}`}>
                        <div className={`font-semibold text-sm ${active ? 'text-[#2E7D32]' : 'text-gray-900'}`}>
                          {step.label}
                          {active && <span className="ml-2 text-[10px] bg-[#2E7D32] text-white px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">❌</div>
              <p className="font-semibold text-red-700">This order was cancelled</p>
              <p className="text-red-500 text-sm mt-1">Contact support if you need help.</p>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Items Ordered ({order.items?.length || 0})</h2>
            <div className="space-y-3">
              {(order.items || []).map((item, i) => {
                const src = imgUrl(item.image_url);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {src
                        ? <img src={src} alt={item.name} className="w-full h-full object-cover" />
                        : <span className="text-2xl">🥬</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-400">₹{item.unit_price} per {item.unit}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm text-gray-900">₹{item.unit_price * item.quantity}</div>
                      <div className="text-xs text-gray-400">×{item.quantity} {item.unit}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{(order.items || []).reduce((s, i) => s + i.unit_price * i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>{Number(order.total_amount) - (order.items || []).reduce((s, i) => s + i.unit_price * i.quantity, 0) === 0 ? 'Free' : `₹${Number(order.total_amount) - (order.items || []).reduce((s, i) => s + i.unit_price * i.quantity, 0)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>₹{Number(order.total_amount).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Delivery Info ── */}
        <div className="space-y-4">

          {/* Delivery details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <MapPin size={16} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Address</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{order.delivery_address}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={16} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Delivery Slot</div>
                  <div className="text-sm text-gray-700">{order.delivery_slot}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard size={16} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Payment</div>
                  <div className="text-sm text-gray-700 capitalize">{order.payment_method?.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
            <Link href="/shop"
              className="flex items-center justify-center w-full border-2 border-[#2E7D32] text-[#2E7D32] font-semibold py-2.5 rounded-full hover:bg-[#E8F5E9] transition-colors text-sm">
              🔄 Reorder
            </Link>
            <Link href="/support"
              className="flex items-center justify-center w-full border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-full hover:border-gray-300 transition-colors text-sm">
              🤝 Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
