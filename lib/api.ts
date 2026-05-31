const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/* ─── Token helpers (stored as "user_token" to avoid clash with admin) ─── */
export const getToken  = () => typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
export const setToken  = (t: string) => localStorage.setItem('user_token', t);
export const clearToken = () => localStorage.removeItem('user_token');

export function decodeToken(token: string): { id: string; phone: string; role: string } | null {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
}

/* ─── Fetch wrapper ──────────────────────────────────────────────────────── */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  get:    <T>(path: string)                => request<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};

/* ─── Shared types ───────────────────────────────────────────────────────── */
export interface ApiProduct {
  id:             string;
  name:           string;
  telugu_name:    string | null;
  emoji:          string | null;
  description:    string | null;
  price:          number;
  previous_price: number;
  unit:           string;
  category_id:    string;
  category_name:  string;
  stock_quantity: number;
  image_url:      string | null;
  is_active:      boolean;
}

export interface ApiCategory { id: string; name: string; }

export interface ApiOrderItem {
  product_id: string;
  name:       string;
  unit:       string;
  quantity:   number;
  unit_price: number;
  image_url:  string | null;
}

export interface ApiOrder {
  id:               string;
  total_amount:     number;
  delivery_address: string;
  delivery_slot:    string;
  payment_method:   string;
  status:           string;
  created_at:       string;
  items:            ApiOrderItem[];
}

/* ─── Image helper ───────────────────────────────────────────────────────── */
export function imgUrl(image_url: string | null | undefined): string | null {
  if (!image_url) return null;
  if (image_url.startsWith('http')) return image_url;
  return `${BASE_URL}${image_url}`;
}

/* ─── Market types ───────────────────────────────────────────────────────── */
export interface ApiMarketCategory {
  id:          number;
  name:        string;
  slug:        string;
  description: string | null;
}

export interface ApiMarket {
  id:            number;
  category_id:   number;
  category_name: string;
  category_slug: string;
  name:          string;
  area:          string;
  address:       string | null;
  lat:           number | null;
  lng:           number | null;
  distance_km:   number | null;
  rating:        number;
  reviews_count: number;
  vendors_count: number;
  opens:         string | null;
  closes:        string | null;
  open_hour:     number | null;
  close_hour:    number | null;
  days:          string | null;
  holiday:       string | null;
  day_of_week:   string | null;
  bg_color:      string;
  facilities:    string[];
  is_active:     boolean;
}

export const marketApi = {
  getAll: (params?: { type?: string; day?: string }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.day)  qs.set('day',  params.day);
    const q = qs.toString();
    return api.get<ApiMarket[]>(`/api/markets${q ? `?${q}` : ''}`);
  },
  getById: (id: number | string) => api.get<ApiMarket>(`/api/markets/${id}`),
};
