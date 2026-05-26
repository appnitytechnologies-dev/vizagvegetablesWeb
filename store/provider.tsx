'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { loginSuccess } from './authSlice';
import { getToken, decodeToken } from '@/lib/api';

/* Runs once on the client — restores auth state from localStorage token */
function AuthRehydrator() {
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded?.id) return;
    // name isn't in the customer JWT — read from localStorage if we stored it
    const savedName = localStorage.getItem('user_name') || '';
    store.dispatch(loginSuccess({ token, id: decoded.id, phone: decoded.phone, name: savedName }));
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
