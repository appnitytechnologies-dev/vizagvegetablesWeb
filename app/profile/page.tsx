'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, logout, updateUserName } from '@/store/authSlice';
import { clearToken, api, ApiOrder, ApiOrderItem, imgUrl } from '@/lib/api';
import {
  LogIn, Package, Bell, HeadphonesIcon, Info, LogOut,
  MapPin, Pencil, Check, X, Loader2, ChevronRight, User,
} from 'lucide-react';
import AuthModal              from '@/components/AuthModal';
import AddressSection         from '@/components/profile/AddressSection';
import NotificationsSection   from '@/components/profile/NotificationsSection';
import SupportSection         from '@/components/profile/SupportSection';
import AboutSection           from '@/components/profile/AboutSection';

/* ── Status helpers ─────────────────────────────────────── */
const STATUS_STYLE: Record<string, string> = {
  pending:          'bg-orange-100 text-orange-700',
  confirmed:        'bg-blue-100   text-blue-700',
  preparing:        'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-sky-100    text-sky-700',
  delivered:        'bg-green-100  text-green-700',
  cancelled:        'bg-red-100    text-red-600',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

type Section = 'profile' | 'orders' | 'addresses' | 'notifications' | 'support' | 'about';

/* ── Sidebar nav config ──────────────────────────────────── */
const NAV: { heading: string; items: { id: Section; icon: any; label: string }[] }[] = [
  {
    heading: 'MY ORDERS',
    items: [{ id: 'orders', icon: Package, label: 'My Orders' }],
  },
  {
    heading: 'ACCOUNT SETTINGS',
    items: [
      { id: 'profile',   icon: User,   label: 'Profile Information' },
      { id: 'addresses', icon: MapPin, label: 'Manage Addresses'    },
    ],
  },
  {
    heading: 'MORE',
    items: [
      { id: 'notifications', icon: Bell,           label: 'Notifications' },
      { id: 'support',       icon: HeadphonesIcon, label: 'Support'       },
      { id: 'about',         icon: Info,           label: 'About Us'      },
    ],
  },
];

/* ── Page ────────────────────────────────────────────────── */
export default function ProfilePage() {
  const auth     = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router   = useRouter();

  const [showAuth,       setShowAuth]       = useState(false);
  const [section,        setSection]        = useState<Section>('profile');

  /* Profile */
  const [email,          setEmail]          = useState('');
  const [memberSince,    setMemberSince]    = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  /* Edit name */
  const [editingName, setEditingName] = useState(false);
  const [editName,    setEditName]    = useState('');
  const [savingName,  setSavingName]  = useState(false);
  const [nameError,   setNameError]   = useState('');

  /* Edit email */
  const [editingEmail, setEditingEmail] = useState(false);
  const [editEmail,    setEditEmail]    = useState('');
  const [savingEmail,  setSavingEmail]  = useState(false);
  const [emailError,   setEmailError]   = useState('');

  /* Orders */
  const [orders,        setOrders]        = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError,   setOrdersError]   = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn) return;

    setLoadingProfile(true);
    api.get<{ email?: string; created_at?: string }>('/api/users/profile')
      .then(d => {
        setEmail(d.email || '');
        if (d.created_at) setMemberSince(
          new Date(d.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        );
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));

    setLoadingOrders(true);
    api.get<ApiOrder[]>('/api/orders/my')
      .then(setOrders)
      .catch(e => setOrdersError(e.message || 'Failed to load orders'))
      .finally(() => setLoadingOrders(false));
  }, [auth.isLoggedIn]);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('user_name');
    dispatch(logout());
    router.push('/');
  };

  const saveName = async () => {
    if (!editName.trim()) { setNameError('Name is required'); return; }
    setSavingName(true); setNameError('');
    try {
      await api.put('/api/users/profile', { name: editName.trim(), email: email || undefined });
      dispatch(updateUserName(editName.trim()));
      localStorage.setItem('user_name', editName.trim());
      setEditingName(false);
    } catch (e: any) { setNameError(e.message || 'Failed to save'); }
    finally { setSavingName(false); }
  };

  const saveEmail = async () => {
    setSavingEmail(true); setEmailError('');
    try {
      await api.put('/api/users/profile', { name: auth.name || undefined, email: editEmail.trim() || undefined });
      setEmail(editEmail.trim());
      setEditingEmail(false);
    } catch (e: any) { setEmailError(e.message || 'Failed to save'); }
    finally { setSavingEmail(false); }
  };

  /* ── Not logged in ── */
  if (!auth.isLoggedIn) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">👤</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Not logged in</h2>
      <p className="text-gray-500 mb-6">Log in to view your profile and orders</p>
      <button onClick={() => setShowAuth(true)}
        className="inline-flex items-center gap-2 bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        <LogIn size={18} /> Login
      </button>
      {showAuth && <AuthModal mode="login" onClose={() => setShowAuth(false)} onSwitch={() => {}} />}
    </div>
  );

  const displayName = auth.name || `User ${auth.phone.slice(-4)}`;
  const initials    = displayName.trim().split(/\s+/).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-6 items-start">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* User card */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#2E7D32] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium">Hello,</p>
                <p className="font-bold text-gray-900 truncate">{displayName}</p>
              </div>
            </div>

            {/* Nav */}
            {NAV.map(sec => (
              <div key={sec.heading} className="border-b border-gray-50 last:border-0">
                <p className="px-5 pt-4 pb-2 text-[10px] font-bold text-gray-400 tracking-widest">{sec.heading}</p>
                {sec.items.map(item => {
                  const active = item.id === section;
                  return (
                    <button key={item.id} onClick={() => setSection(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors border-l-2 text-left ${
                        active ? 'border-[#2E7D32] text-[#2E7D32] bg-[#F1F8F1]' : 'border-transparent text-gray-600 hover:text-[#2E7D32] hover:bg-gray-50'
                      }`}>
                      <item.icon size={16} /> {item.label}
                      {item.id === 'orders' && orders.length > 0 && (
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {orders.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Logout */}
            <div className="px-5 py-4">
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* PROFILE */}
          {section === 'profile' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50">
                  <h2 className="font-bold text-gray-900 text-lg">Personal Information</h2>
                </div>

                {/* Name */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-gray-50">
                  <div className="flex-1 min-w-0 mr-6">
                    <p className="text-xs font-semibold text-gray-400 mb-1.5">FULL NAME</p>
                    {editingName ? (
                      <div className="space-y-2">
                        <input value={editName} onChange={e => { setEditName(e.target.value); setNameError(''); }}
                          placeholder="Your full name" autoFocus
                          className="w-full max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]" />
                        {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
                        <div className="flex gap-2">
                          <button onClick={saveName} disabled={savingName}
                            className="flex items-center gap-1.5 bg-[#2E7D32] text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#1B5E20] disabled:opacity-60 transition-colors">
                            {savingName ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                          </button>
                          <button onClick={() => { setEditingName(false); setNameError(''); }}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-900 text-sm">
                        {auth.name || <span className="text-gray-400 font-normal italic">Not set</span>}
                      </p>
                    )}
                  </div>
                  {!editingName && (
                    <button onClick={() => { setEditName(auth.name || ''); setEditingName(true); }}
                      className="text-sm font-semibold text-[#2E7D32] hover:underline flex items-center gap-1 flex-shrink-0">
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-gray-50">
                  <div className="flex-1 min-w-0 mr-6">
                    <p className="text-xs font-semibold text-gray-400 mb-1.5">EMAIL ADDRESS</p>
                    {editingEmail ? (
                      <div className="space-y-2">
                        <input type="email" value={editEmail} onChange={e => { setEditEmail(e.target.value); setEmailError(''); }}
                          placeholder="you@example.com" autoFocus
                          className="w-full max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]" />
                        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                        <div className="flex gap-2">
                          <button onClick={saveEmail} disabled={savingEmail}
                            className="flex items-center gap-1.5 bg-[#2E7D32] text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#1B5E20] disabled:opacity-60 transition-colors">
                            {savingEmail ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                          </button>
                          <button onClick={() => { setEditingEmail(false); setEmailError(''); }}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-500 px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      loadingProfile
                        ? <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                        : <p className="font-semibold text-gray-900 text-sm">
                            {email || <span className="text-gray-400 font-normal italic">Not set</span>}
                          </p>
                    )}
                  </div>
                  {!editingEmail && (
                    <button onClick={() => { setEditEmail(email); setEditingEmail(true); }}
                      className="text-sm font-semibold text-[#2E7D32] hover:underline flex items-center gap-1 flex-shrink-0">
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </div>

                {/* Mobile */}
                <div className="px-6 py-5">
                  <p className="text-xs font-semibold text-gray-400 mb-1.5">MOBILE NUMBER</p>
                  <p className="font-semibold text-gray-900 text-sm">+91 {auth.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Linked to your account — cannot be changed</p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">MEMBER SINCE</p>
                    {loadingProfile
                      ? <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
                      : <p className="font-semibold text-gray-900 text-sm">{memberSince || '—'}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">TOTAL ORDERS</p>
                    <p className="font-semibold text-gray-900 text-sm">{orders.length}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-1">ACCOUNT TYPE</p>
                    <p className="font-semibold text-gray-900 text-sm">Customer</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ORDERS */}
          {section === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="font-bold text-gray-900 text-lg">My Orders</h2>
              </div>
              {loadingOrders ? (
                <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                  <Loader2 size={20} className="animate-spin" /> Loading orders…
                </div>
              ) : ordersError ? (
                <div className="m-6 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
                  <p className="text-gray-400 text-sm mb-5">Start shopping to place your first order!</p>
                  <Link href="/shop" className="inline-block bg-[#2E7D32] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[#1B5E20] transition-colors text-sm">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map(o => {
                    const date     = new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    const shortId  = o.id.slice(0, 8).toUpperCase();
                    const isActive = ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status);
                    return (
                      <div key={o.id} className="hover:bg-gray-50 transition-colors">
                        <Link href={`/orders/${o.id}`} className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">#{shortId}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{date} · {o.delivery_slot}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                              {STATUS_LABEL[o.status] || o.status}
                            </span>
                            <ChevronRight size={15} className="text-gray-400" />
                          </div>
                        </Link>
                        <div className="px-6 py-3 space-y-2">
                          {(o.items || []).slice(0, 3).map((item: ApiOrderItem, i: number) => {
                            const src = imgUrl(item.image_url);
                            return (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <div className="w-7 h-7 rounded bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {src ? <img src={src} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-sm">🥬</span>}
                                </div>
                                <span className="flex-1 text-gray-700 truncate">{item.name}</span>
                                <span className="text-gray-400">×{item.quantity}</span>
                                <span className="font-medium text-gray-900 flex-shrink-0">₹{item.unit_price * item.quantity}</span>
                              </div>
                            );
                          })}
                          {(o.items || []).length > 3 && (
                            <p className="text-xs text-gray-400 pl-9">+{o.items.length - 3} more item{o.items.length - 3 > 1 ? 's' : ''}</p>
                          )}
                        </div>
                        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Total <span className="font-bold text-gray-900">₹{Number(o.total_amount).toFixed(0)}</span>
                            {o.payment_method && <span className="text-xs text-gray-400 ml-2">· {o.payment_method.toUpperCase()}</span>}
                          </div>
                          <div className="flex gap-2">
                            {isActive && (
                              <Link href={`/order-tracking?id=${o.id}`}
                                className="text-xs font-semibold text-white bg-[#2E7D32] px-3 py-1.5 rounded-full hover:bg-[#1B5E20] transition-colors">
                                Track
                              </Link>
                            )}
                            <Link href="/shop"
                              className="text-xs font-semibold text-[#2E7D32] border border-[#2E7D32] px-3 py-1.5 rounded-full hover:bg-[#E8F5E9] transition-colors">
                              Reorder
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION COMPONENTS */}
          {section === 'addresses'     && <AddressSection />}
          {section === 'notifications' && <NotificationsSection />}
          {section === 'support'       && <SupportSection />}
          {section === 'about'         && <AboutSection />}

          {/* Mobile nav */}
          <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="font-bold text-gray-900">Account</p>
            </div>
            {([
              { id: 'orders'        as Section, icon: Package,        label: 'My Orders'           },
              { id: 'profile'       as Section, icon: User,           label: 'Profile Information' },
              { id: 'addresses'     as Section, icon: MapPin,         label: 'Manage Addresses'    },
              { id: 'notifications' as Section, icon: Bell,           label: 'Notifications'       },
              { id: 'support'       as Section, icon: HeadphonesIcon, label: 'Support'             },
              { id: 'about'         as Section, icon: Info,           label: 'About Us'            },
            ] as { id: Section; icon: any; label: string }[]).map(item => (
              <button key={item.id} onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors text-left ${section === item.id ? 'text-[#2E7D32]' : 'text-gray-700'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${section === item.id ? 'bg-[#E8F5E9]' : 'bg-gray-100'}`}>
                  <item.icon size={16} className={section === item.id ? 'text-[#2E7D32]' : 'text-gray-500'} />
                </div>
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                <ChevronRight size={15} className="text-gray-300" />
              </button>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-red-500" />
              </div>
              <span className="font-medium text-sm text-red-500">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
