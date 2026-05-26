'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/store/authSlice';
import { api, ApiProduct, ApiOrder } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Notif {
  id:    string;
  icon:  string;
  title: string;
  body:  string;
  time:  string;
  read:  boolean;
  href?: string;
}

const ORDER_ICONS:  Record<string, string> = { pending:'🛒', confirmed:'✅', preparing:'👨‍🍳', out_for_delivery:'🛵', delivered:'📦', cancelled:'❌' };
const ORDER_TITLES: Record<string, string> = { pending:'Order Placed', confirmed:'Order Confirmed', preparing:'Being Prepared', out_for_delivery:'Out for Delivery', delivered:'Order Delivered', cancelled:'Order Cancelled' };
const ORDER_BODY:   Record<string, (id: string) => string> = {
  pending:          id => `Your order #${id} has been placed and is awaiting confirmation.`,
  confirmed:        id => `Your order #${id} is confirmed! We'll start preparing it soon.`,
  preparing:        id => `Your order #${id} is being freshly packed for you.`,
  out_for_delivery: id => `Your order #${id} is on its way — expect delivery soon!`,
  delivered:        id => `Your order #${id} was delivered. Enjoy your fresh vegetables! 🥬`,
  cancelled:        id => `Your order #${id} was cancelled. Contact support if you need help.`,
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000), hours = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

const STORAGE_KEY = 'vv_read_notifs';
function getReadIds() {
  try { const r = localStorage.getItem(STORAGE_KEY); return new Set<string>(r ? JSON.parse(r) : []); }
  catch { return new Set<string>(); }
}
function saveReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export default function NotificationsSection() {
  const auth = useSelector(selectAuth);
  const [notifs,  setNotifs]  = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readIds = getReadIds();

    const buildNotifs = async () => {
      const all: Omit<Notif, 'read'>[] = [];

      /* Price changes (visible to everyone) */
      try {
        const products = await api.get<ApiProduct[]>('/api/products?limit=200');
        products
          .filter(p => p.previous_price && p.previous_price !== p.price)
          .sort((a, b) => Math.abs(b.price - b.previous_price) - Math.abs(a.price - a.previous_price))
          .slice(0, 5)
          .forEach(p => {
            const drop = p.previous_price - p.price;
            const up   = p.price - p.previous_price;
            all.push({
              id:    `price-${p.id}`,
              icon:  drop > 0 ? '📉' : '📈',
              title: drop > 0 ? 'Price Drop!' : 'Price Rise',
              body:  drop > 0
                ? `${p.name} dropped to ₹${p.price}/${p.unit} — down ₹${drop} today.`
                : `${p.name} is now ₹${p.price}/${p.unit} — up ₹${up} today.`,
              time:  'Today',
              href:  `/shop/${p.id}`,
            });
          });
      } catch { /* skip */ }

      /* Order updates (logged-in only) */
      if (auth.isLoggedIn) {
        try {
          const orders = await api.get<ApiOrder[]>('/api/orders/my');
          orders.slice(0, 10).forEach(o => {
            const shortId = o.id.slice(0, 8).toUpperCase();
            all.push({
              id:    `order-${o.id}-${o.status}`,
              icon:  ORDER_ICONS[o.status]  || '📦',
              title: ORDER_TITLES[o.status] || 'Order Update',
              body:  (ORDER_BODY[o.status]  || (() => `Order #${shortId} updated.`))(shortId),
              time:  relativeTime(o.created_at),
              href:  '/orders',
            });
          });
        } catch { /* skip */ }
      }

      /* Orders first, then price changes */
      all.sort((a, b) => {
        const ao = a.id.startsWith('order'), bo = b.id.startsWith('order');
        if (ao && !bo) return -1; if (!ao && bo) return 1; return 0;
      });

      setNotifs(all.map(n => ({ ...n, read: readIds.has(n.id) })));
      setLoading(false);
    };

    buildNotifs();
  }, [auth.isLoggedIn]);

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const ids = getReadIds(); ids.add(id); saveReadIds(ids);
  };
  const markAllRead = () => {
    const ids = getReadIds();
    notifs.forEach(n => ids.add(n.id));
    saveReadIds(ids);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Notifications</h2>
          {unread > 0
            ? <p className="text-xs text-[#2E7D32] font-medium mt-0.5">{unread} unread</p>
            : !loading && <p className="text-xs text-gray-400 mt-0.5">All caught up!</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-[#2E7D32] font-semibold text-sm hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔔</div>
          <p className="font-semibold text-gray-700 mb-1">No notifications yet</p>
          <p className="text-gray-400 text-sm">Place an order or check back for price updates.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {notifs.map(n => {
            const inner = (
              <>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${!n.read ? 'bg-[#E8F5E9]' : 'bg-gray-100'}`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-gray-900">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 bg-[#2E7D32] rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </>
            );
            const cls = `w-full flex items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50 ${!n.read ? 'bg-[#F1F8F1]' : ''}`;
            return n.href ? (
              <Link key={n.id} href={n.href} onClick={() => markRead(n.id)} className={cls}>{inner}</Link>
            ) : (
              <button key={n.id} onClick={() => markRead(n.id)} className={cls}>{inner}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}
