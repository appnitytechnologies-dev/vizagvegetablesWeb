'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { api, ApiOrder, imgUrl } from '@/lib/api';
import { Loader2, MapPin, Clock, CreditCard } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [order,   setOrder]   = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    api.get<ApiOrder>(`/api/orders/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const shortId = id ? id.slice(0, 8).toUpperCase() : '';
  const subtotal = (order?.items || []).reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const delivery = order ? Number(order.total_amount) - subtotal : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Order Placed!</h1>
        {shortId && (
          <p className="text-gray-500">
            Your order <span className="font-semibold text-gray-800">#{shortId}</span> has been confirmed.
          </p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          Estimated delivery: <span className="text-[#2E7D32] font-semibold">45 – 60 minutes</span>
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-400 py-10">
          <Loader2 size={18} className="animate-spin" /> Loading order details…
        </div>
      )}

      {!loading && order && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2">
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

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span>
                  <span>{delivery === 0 ? <span className="text-[#2E7D32]">Free</span> : `₹${delivery}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total</span><span>₹{Number(order.total_amount).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery details + actions */}
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Link href="/orders"
                className="flex items-center justify-center w-full bg-[#2E7D32] text-white font-semibold py-3 rounded-full hover:bg-[#1B5E20] transition-colors text-sm">
                View My Orders
              </Link>
              <Link href="/shop"
                className="flex items-center justify-center w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:border-gray-300 transition-colors text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* Fallback if order details couldn't load */}
      {!loading && !order && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link href="/orders"
            className="bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors text-center">
            View My Orders
          </Link>
          <Link href="/shop"
            className="border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-gray-300 transition-colors text-center">
            Continue Shopping
          </Link>
        </div>
      )}

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
