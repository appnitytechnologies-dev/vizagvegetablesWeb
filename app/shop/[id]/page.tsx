import { notFound } from 'next/navigation';
import { ApiProduct } from '@/lib/api';
import ShopDetailClient from './ShopDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product: ApiProduct | null = null;
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { cache: 'no-store' });
    if (res.ok) product = await res.json();
  } catch { /* fall through to notFound */ }

  if (!product) notFound();
  return <ShopDetailClient product={product} />;
}
