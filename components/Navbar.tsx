'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Bell, Heart, Menu, X, ChevronDown, MapPin, LocateFixed } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '@/store/cartSlice';
import { selectAuth, logout } from '@/store/authSlice';
import { clearToken } from '@/lib/api';
import { useLocation } from '@/hooks/useLocation';
import AuthModal from './AuthModal';

const NAV_LINKS = [
  { href: '/',        label: 'Home'    },
  { href: '/prices',  label: 'Prices'  },
  { href: '/markets', label: 'Markets' },
  { href: '/shop',    label: 'Shop'    },
];

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const dispatch  = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const auth      = useSelector(selectAuth);

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [authModal,     setAuthModal]     = useState<'login' | 'signup' | null>(null);
  const [userDropdown,  setUserDropdown]  = useState(false);
  const [locOpen,       setLocOpen]       = useState(false);
  const [locInput,      setLocInput]      = useState('');
  const locRef = useRef<HTMLDivElement>(null);
  const { locationText, loading: locLoading, isCustom, setCustomLocation, resetToGPS } = useLocation();

  /* close location popover on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('user_name');
    dispatch(logout());
    setUserDropdown(false);
    router.push('/');
  };

  const initials = auth.name
    ? auth.name.trim().split(/\s+/).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : auth.phone.slice(-2);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo + Location */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#3D8C40] flex items-center justify-center text-xl shadow-sm">🥦</div>
                <div className="text-gray-900 font-bold text-base leading-none">Vizag Vegetables</div>
              </Link>

              {/* Location picker */}
              <div ref={locRef} className="relative hidden sm:block">
                <button
                  onClick={() => { setLocInput(locationText); setLocOpen(v => !v); }}
                  className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#3D8C40] transition-colors border border-gray-200 hover:border-[#3D8C40] rounded-full px-2.5 py-1"
                >
                  <MapPin size={11} className="text-[#3D8C40] flex-shrink-0" />
                  <span className="max-w-[140px] truncate">
                    {locLoading ? 'Locating…' : locationText || 'Set location'}
                  </span>
                  <ChevronDown size={10} className="text-gray-400 flex-shrink-0" />
                </button>

                {locOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                    <p className="text-sm font-semibold text-gray-800 mb-1">Set your area</p>
                    <p className="text-xs text-gray-400 mb-3">Type your neighbourhood, area or city</p>
                    <input
                      autoFocus
                      type="text"
                      placeholder="e.g. Gajuwaka, Vizag"
                      value={locInput}
                      onChange={e => setLocInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && locInput.trim()) {
                          setCustomLocation(locInput.trim());
                          setLocOpen(false);
                        }
                      }}
                      className="w-full border border-gray-200 focus:border-[#3D8C40] rounded-lg px-3 py-2 text-sm outline-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        disabled={!locInput.trim()}
                        onClick={() => { if (locInput.trim()) { setCustomLocation(locInput.trim()); setLocOpen(false); } }}
                        className="flex-1 bg-[#3D8C40] disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#357A38] transition-colors"
                      >
                        Save
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => { resetToGPS(); setLocOpen(false); }}
                          className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <LocateFixed size={13} className="text-[#3D8C40]" />
                          GPS
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pathname === l.href ? 'bg-[#F1F8E9] text-[#3D8C40] font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart size={20} className="text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Favourites */}
              <Link href="/favourites" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex">
                <Heart size={20} className="text-gray-600" />
              </Link>

              {/* Notifications */}
              <Link href="/profile?tab=notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex">
                <Bell size={20} className="text-gray-600" />
              </Link>

              {/* Auth */}
              {auth.isLoggedIn ? (
                <div className="relative ml-1">
                  <button onClick={() => setUserDropdown(v => !v)}
                    className="flex items-center gap-2 border border-gray-200 hover:border-[#3D8C40] text-gray-700 rounded-full pl-1.5 pr-3 py-1.5 text-sm font-medium transition-colors">
                    <span className="w-7 h-7 rounded-full bg-[#3D8C40] text-white flex items-center justify-center font-bold text-xs">
                      {initials}
                    </span>
                    <span className="hidden sm:block">{auth.name ? auth.name.split(' ')[0] : auth.phone.slice(-4)}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {[
                        { href: '/profile',                    label: '👤 My Profile'    },
                        { href: '/profile?tab=orders',         label: '📦 My Orders'     },
                        { href: '/favourites',                 label: '❤️ Favourites'    },
                        { href: '/order-tracking',             label: '🛵 Track Order'   },
                        { href: '/profile?tab=notifications',  label: '🔔 Notifications' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{item.label}</Link>
                      ))}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                        🚪 Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <button onClick={() => setAuthModal('login')}
                    className="text-gray-700 text-sm font-medium hover:text-[#3D8C40] px-3 py-1.5 rounded-full transition-colors">
                    Login
                  </button>
                  <button onClick={() => setAuthModal('signup')}
                    className="bg-[#3D8C40] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#357A38] transition-colors shadow-sm">
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors ml-1">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium ${pathname === l.href ? 'bg-[#F1F8E9] text-[#3D8C40]' : 'text-gray-700 hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
            {!auth.isLoggedIn && (
              <div className="flex gap-2 pt-2 border-t border-gray-100 mt-1">
                <button onClick={() => { setAuthModal('login'); setMobileOpen(false); }}
                  className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50">Login</button>
                <button onClick={() => { setAuthModal('signup'); setMobileOpen(false); }}
                  className="flex-1 bg-[#3D8C40] text-white text-sm font-semibold py-2 rounded-xl hover:bg-[#357A38]">Sign Up</button>
              </div>
            )}
          </div>
        )}
      </nav>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={m => setAuthModal(m)} />}
    </>
  );
}
