'use client';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, increaseQty, decreaseQty, removeFromCart } from '@/store/cartSlice';
import { imgUrl } from '@/lib/api';

const DELIVERY = 30;

export default function CartPage() {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const finalDelivery = total >= 500 ? 0 : DELIVERY;

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some fresh vegetables to get started</p>
      <Link href="/shop" className="inline-block bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        Shop Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Cart <span className="text-gray-400 font-normal text-xl">({items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => {
            const src = imgUrl(item.image_url);
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-[#E8F5E9] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {src
                    ? <img src={src} alt={item.name} className="w-full h-full object-cover" />
                    : <span className="text-3xl">{item.emoji || '🥬'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">{item.name}</div>
                  <div className="text-xs text-gray-400">per {item.unit}</div>
                  <div className="font-bold text-gray-900 mt-1">₹{item.price * item.quantity}</div>
                </div>
                <div className="flex items-center gap-2 border-2 border-[#2E7D32] rounded-full px-3 py-1">
                  <button onClick={() => dispatch(decreaseQty(item.id))} className="text-[#2E7D32] font-bold w-5 text-center">−</button>
                  <span className="font-bold text-[#2E7D32] text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQty(item.id))} className="text-[#2E7D32] font-bold w-5 text-center">+</button>
                </div>
                <button onClick={() => dispatch(removeFromCart(item.id))} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span>{finalDelivery === 0 ? 'Free' : `₹${finalDelivery}`}</span></div>
              {total >= 500 && <div className="flex justify-between text-sm text-green-600 font-medium"><span>Free delivery applied</span><span>−₹{DELIVERY}</span></div>}
            </div>
            <div className="border-t border-gray-100 pt-3 mb-6">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span><span>₹{total + finalDelivery}</span>
              </div>
              {total < 500 && <p className="text-xs text-gray-400 mt-1">Add ₹{500 - total} more for free delivery</p>}
            </div>
            <Link href="/checkout" className="flex w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-center font-semibold py-3 rounded-full transition-colors items-center justify-center gap-2">
              <ShoppingBag size={18} /> Proceed to Checkout
            </Link>
            <Link href="/shop" className="block w-full text-center text-[#2E7D32] font-medium text-sm mt-3 hover:underline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
