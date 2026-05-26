'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const shortId = id ? id.slice(0, 8).toUpperCase() : '';

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">✅</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      {shortId && (
        <p className="text-gray-500 mb-2">
          Your order <span className="font-semibold text-gray-800">#{shortId}</span> has been confirmed.
        </p>
      )}
      <p className="text-gray-400 text-sm mb-8">
        Estimated delivery: <span className="text-[#2E7D32] font-semibold">45 – 60 minutes</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders"
          className="bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
          View My Orders
        </Link>
        <Link href="/"
          className="border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-gray-300 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
