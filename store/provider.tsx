'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { loginSuccess } from './authSlice';
import { setFavourites } from './favouritesSlice';
import { getToken, decodeToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/* Runs once on the client — restores auth + favourites from DB */
function AuthRehydrator() {
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded?.id) return;
    const savedName = localStorage.getItem('user_name') || '';
    store.dispatch(loginSuccess({ token, id: decoded.id, phone: decoded.phone, name: savedName }));

    // Sync favourites from DB into Redux
    fetch(`${API_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((ids: string[]) => store.dispatch(setFavourites(ids)))
      .catch(() => {});
  }, []);
  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRehydrator />
      {children}
    </Provider>
  );
}
