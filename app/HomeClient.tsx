'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQty, decreaseQty, selectItemQty } from '@/store/cartSlice';
import { toggleFavourite, selectIsFavourite } from '@/store/favouritesSlice';
import { RootState } from '@/store';
import { ApiProduct, imgUrl } from '@/lib/api';
import { Heart } from 'lucide-react';

function ProductCard({ product }: { product: ApiProduct }) {
  const dispatch = useDispatch();
  const qty  = useSelector(selectItemQty(product.id));
  const isFav = useSelector((s: RootState) => selectIsFavourite(product.id)(s));

  const src = imgUrl(product.image_url);
  const discount = product.previous_price > product.price
    ? Math.round(((product.previous_price - product.price) / product.previous_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative bg-[#F1F8E9] h-44 flex items-center justify-center">
          {src
            ? <img src={src} alt={product.name} className="w-full h-full object-cover" />
            : <span className="text-6xl group-hover:scale-110 transition-transform">{product.emoji || '🥬'}</span>}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {discount}% off
            </span>
          )}
          <button onClick={e => { e.preventDefault(); dispatch(toggleFavourite(product.id)); }}
            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
            <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <div className="text-[11px] text-gray-400 mb-0.5 font-medium">{product.telugu_name || ''}</div>
        <div className="font-semibold text-gray-900 text-sm mb-1">{product.name}</div>
        <div className="text-xs text-gray-400 mb-3">per {product.unit}</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.previous_price > product.price && (
              <span className="text-xs text-gray-300 line-through ml-1.5">₹{product.previous_price}</span>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => dispatch(addToCart({ id: product.id, name: product.name, te: product.telugu_name || '', emoji: product.emoji, image_url: product.image_url, price: product.price, unit: product.unit, quantity: 1 }))}
              className="bg-[#3D8C40] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#357A38] transition-colors">
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1.5 border-2 border-[#3D8C40] rounded-full px-2 py-0.5">
              <button onClick={() => dispatch(decreaseQty(product.id))} className="text-[#3D8C40] font-bold w-5 text-center text-base leading-none">−</button>
              <span className="font-bold text-[#3D8C40] text-sm w-4 text-center">{qty}</span>
              <button onClick={() => dispatch(increaseQty(product.id))} className="text-[#3D8C40] font-bold w-5 text-center text-base leading-none">+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeClient({ products }: { products: ApiProduct[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
