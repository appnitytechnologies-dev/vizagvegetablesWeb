'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Heart, Share2, ShoppingCart, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQty, decreaseQty, selectItemQty } from '@/store/cartSlice';
import { toggleFavourite, selectIsFavourite } from '@/store/favouritesSlice';
import { RootState } from '@/store';
import { ApiProduct, imgUrl } from '@/lib/api';

const QTY_OPTIONS = ['1', '2', '5', '10'];

export default function ShopDetailClient({ product }: { product: ApiProduct }) {
  const dispatch  = useDispatch();
  const [qty,    setQty]    = useState(QTY_OPTIONS[0]);
  const [shared, setShared] = useState(false);
  const cartQty = useSelector(selectItemQty(product.id));
  const isFav   = useSelector((s: RootState) => selectIsFavourite(product.id)(s));

  const src      = imgUrl(product.image_url);
  const discount = product.previous_price > product.price
    ? Math.round(((product.previous_price - product.price) / product.previous_price) * 100)
    : 0;

  const handleShare = async () => {
    await navigator.share?.({ title: product.name, text: `${product.name} — ₹${product.price}/${product.unit}` }).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/shop" className="inline-flex items-center gap-1 text-[#2E7D32] font-medium text-sm mb-6 hover:underline">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-[#E8F5E9] rounded-3xl h-80 flex items-center justify-center relative overflow-hidden">
          {src
            ? <img src={src} alt={product.name} className="w-full h-full object-cover rounded-3xl" />
            : <span className="text-[120px]">{product.emoji || '🥬'}</span>}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {discount}% off
            </span>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => dispatch(toggleFavourite(product.id))}
              className="p-2.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
              <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
            <button onClick={handleShare}
              className="p-2.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
              {shared ? <Check size={18} className="text-green-600" /> : <Share2 size={18} className="text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-sm text-gray-400 mb-1">{product.telugu_name || ''}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.previous_price > product.price && (
              <span className="text-lg text-gray-400 line-through">₹{product.previous_price}</span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                {discount}% off
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-6">per {product.unit} · 🕐 45 min delivery</p>

          {/* Quantity selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Select Quantity ({product.unit})</p>
            <div className="flex gap-2">
              {QTY_OPTIONS.map(q => (
                <button key={q} onClick={() => setQty(q)}
                  className={`px-5 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${qty === q ? 'border-[#2E7D32] text-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 text-gray-600 hover:border-[#2E7D32]'}`}>
                  {q} {product.unit}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Product Detail</p>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['Farm Fresh', 'Pesticide-free', 'Daily Fresh'].map(t => (
              <span key={t} className="text-xs font-medium text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">✓ {t}</span>
            ))}
            {product.category_name && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.category_name}</span>
            )}
          </div>

          {/* Add to cart */}
          <div className="space-y-3">
            {cartQty > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#2E7D32] rounded-full" />
                {cartQty} {product.unit} already in cart
                <div className="flex items-center gap-2 border-2 border-[#2E7D32] rounded-full px-3 py-1 ml-auto">
                  <button onClick={() => dispatch(decreaseQty(product.id))} className="text-[#2E7D32] font-bold text-base w-5 text-center">−</button>
                  <span className="font-bold text-[#2E7D32] text-sm w-5 text-center">{cartQty}</span>
                  <button onClick={() => dispatch(increaseQty(product.id))} className="text-[#2E7D32] font-bold text-base w-5 text-center">+</button>
                </div>
              </div>
            )}
            <button
              onClick={() => dispatch(addToCart({
                id: product.id, name: product.name, te: product.telugu_name || '',
                emoji: product.emoji, image_url: product.image_url,
                price: product.price, unit: product.unit, quantity: parseInt(qty),
              }))}
              className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold py-3.5 px-6 rounded-full transition-colors text-base"
            >
              <ShoppingCart size={18} />
              {cartQty > 0 ? `Add ${qty} More` : `Add ${qty} ${product.unit} to Cart`}
              <span className="ml-1 text-green-200 text-sm">· ₹{product.price * parseInt(qty)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
