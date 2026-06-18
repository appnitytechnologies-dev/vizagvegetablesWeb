'use client';
import { useEffect, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './index';
import { loginSuccess, selectAuth } from './authSlice';
import { setFavourites } from './favouritesSlice';
import { addToCart, clearCart, selectCartItems } from './cartSlice';
import { getToken, decodeToken, api } from '@/lib/api';
import type { AppDispatch } from './index';
import type { CartItem } from './cartSlice';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

/* Restores auth + favourites + cart from server on page load */
function AuthRehydrator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded?.id) return;
    const savedName = localStorage.getItem('user_name') || '';
    dispatch(loginSuccess({ token, id: decoded.id, phone: decoded.phone, name: savedName }));

    // Favourites from server
    fetch(`${API_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((ids: string[]) => dispatch(setFavourites(ids)))
      .catch(() => {});

    // Cart from server
    fetch(`${API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((items: CartItem[]) => {
        if (items.length > 0) {
          dispatch(clearCart());
          items.forEach(item => dispatch(addToCart(item)));
        }
      })
      .catch(() => {});
  }, [dispatch]);

  return null;
}

/* Watches cart state and debounces PUT /api/cart to server */
function CartSyncer() {
  const items  = useSelector(selectCartItems);
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      api.put('/api/cart', { items }).catch(() => {});
    }, 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [items]);

  return null;
}

/* Registers the service worker and subscribes to web push after login */
function WebPushRegistrar() {
  const { isLoggedIn } = useSelector(selectAuth);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;

    (async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
          });
        }
        await api.post('/api/push-tokens', { token: subscription.toJSON(), platform: 'web' });
      } catch {
        // User denied or browser doesn't support — silently skip
      }
    })();
  }, [isLoggedIn]);

  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRehydrator />
      <CartSyncer />
      <WebPushRegistrar />
      {children}
    </Provider>
  );
}
