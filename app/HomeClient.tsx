'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQty, decreaseQty, selectItemQty } from '@/store/cartSlice';
import { ApiProduct, imgUrl } from '@/lib/api';
import { Plus } from 'lucide-react';

function ProductCard({ product }: { product: ApiProduct }) {
  const dispatch  = useDispatch();
  const qty       = useSelector(selectItemQty(product.id));
  const src       = imgUrl(product.image_url);
  const trend     = product.price - (product.previous_price || product.price);

  return (
    <>
    <Link href={`/shop/${product.id}`} className="prod-card-fresh" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="prod-card-media">
        {/* Discount pill only when price dropped */}
        {trend < 0 && (
          <span className="discount-pill">↓ ₹{Math.abs(trend)}</span>
        )}

        {/* Image or emoji */}
        {src
          ? <img src={src} alt={product.name} style={{ width: '84%', height: '84%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          : <span style={{ fontSize: '3.6rem', lineHeight: 1 }}>{product.emoji || '🥬'}</span>
        }
      </div>

      <div className="prod-card-body-fresh">
        <div className="telugu">{product.telugu_name || ''}</div>
        <div className="prod-name-fresh">{product.name}</div>
        <div className="prod-weight">per {product.unit}</div>
        <div className="prod-foot">
          <span className="prod-price">
            ₹{product.price}
            <span className="prod-price-unit">/{product.unit}</span>
          </span>
          {qty === 0 ? (
            <button
              className="add-btn-circle"
              onClick={e => {
                e.preventDefault();
                dispatch(addToCart({
                  id: product.id, name: product.name,
                  te: product.telugu_name || '', emoji: product.emoji,
                  image_url: product.image_url, price: product.price,
                  unit: product.unit, quantity: 1,
                }));
              }}
              aria-label={`Add ${product.name}`}
            >
              <Plus size={16} />
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1.5px solid #1F8A4C', borderRadius: 999, padding: '3px 10px' }}>
              <button
                onClick={e => { e.preventDefault(); dispatch(decreaseQty(product.id)); }}
                style={{ color: '#1F8A4C', fontWeight: 700, fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
              >−</button>
              <span style={{ fontWeight: 700, color: '#1F8A4C', fontSize: 14, minWidth: 18, textAlign: 'center', fontFamily: 'monospace' }}>{qty}</span>
              <button
                onClick={e => { e.preventDefault(); dispatch(increaseQty(product.id)); }}
                style={{ color: '#1F8A4C', fontWeight: 700, fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
              >+</button>
            </div>
          )}
        </div>
      </div>
    </Link>
</>
  );
}

export default function HomeClient({ products }: { products: ApiProduct[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
