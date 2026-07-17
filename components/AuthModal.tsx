'use client';
import { useState } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/authSlice';
import { api, setToken, getToken } from '@/lib/api';

interface Props { onClose: () => void; }

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts) { resolve(); return; }
    const existing = document.getElementById('gsi-script');
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const s = document.createElement('script');
    s.id = 'gsi-script';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(s);
  });
}

/* ─────────────────────────────────────────────────────────────────────────
 * LEGACY: phone number + OTP login/signup. Disabled — Google login is now
 * the only sign-in method (see handleGoogleLogin below). Kept here for
 * future re-enablement:
 *
 *   const [phone, setPhone] = useState('');
 *   const [otp, setOtp] = useState(['', '', '', '', '', '']);
 *   const [timer, setTimer] = useState(30);
 *   const [counting, setCounting] = useState(false);
 *
 *   const sendOtp = async () => {
 *     if (phone.length !== 10) return;
 *     setLoading(true); setError('');
 *     try {
 *       await api.post('/api/auth/send-otp', { phone });
 *       setStep('otp'); setTimer(30); setCounting(true);
 *     } catch (e: any) {
 *       setError(e.message || 'Failed to send OTP');
 *     } finally { setLoading(false); }
 *   };
 *
 *   const verifyOtp = async () => {
 *     const code = otp.join('');
 *     if (code.length !== 6) return;
 *     setLoading(true); setError('');
 *     try {
 *       const res = await api.post('/api/auth/verify-otp', { phone, otp: code, name });
 *       ...
 *     } catch (e: any) {
 *       setError(e.message || 'Invalid OTP');
 *     } finally { setLoading(false); }
 *   };
 * ───────────────────────────────────────────────────────────────────────── */

export default function AuthModal({ onClose }: Props) {
  const dispatch   = useDispatch();
  const [step, setStep]         = useState<'google' | 'profile'>('google');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleGoogleLogin = async () => {
    setGLoading(true);
    setError('');
    try {
      await loadGoogleScript();
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'REPLACE_ME.apps.googleusercontent.com') {
        setError('Google Sign-In is not configured yet.');
        setGLoading(false);
        return;
      }
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            const res = await api.post<{
              token: string;
              user: { id: string; phone: string; name: string };
              isNewUser: boolean;
              needsProfile: boolean;
            }>('/api/auth/google', { idToken: response.credential });

            setToken(res.token);
            const displayName = res.user.name || '';
            localStorage.setItem('user_name', displayName);
            dispatch(loginSuccess({ token: res.token, id: res.user.id, phone: res.user.phone || '', name: displayName }));

            if (res.needsProfile) {
              setName(displayName);
              setStep('profile');
              setGLoading(false);
            } else {
              onClose();
            }
          } catch (e: any) {
            setError(e.message || 'Google sign-in failed');
            setGLoading(false);
          }
        },
      });
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGLoading(false);
          setError('Google sign-in was dismissed. Please try again.');
        }
      });
    } catch (e: any) {
      setError(e.message || 'Failed to load Google Sign-In');
      setGLoading(false);
    }
  };

  const submitProfile = async () => {
    if (!name.trim() || phone.length !== 10) return;
    setLoading(true); setError('');
    try {
      const res = await api.put<{ id: string; phone: string; name: string }>('/api/users/profile', {
        name: name.trim(), phone,
      });
      localStorage.setItem('user_name', res.name);
      dispatch(loginSuccess({ token: getToken() || '', id: res.id, phone: res.phone, name: res.name }));
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Green header */}
        <div className="bg-[#2E7D32] px-6 py-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🥦</span>
            <div>
              <div className="font-bold text-xl">YZAG Fresh</div>
              <div className="text-green-200 text-sm">Welcome!</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">{error}</div>
          )}

          {step === 'google' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in to YZAG Fresh</h2>
              <p className="text-gray-500 text-sm mb-5">Continue with your Google account</p>

              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={gLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {gLoading ? (
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                    <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.000 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.311 0-9.821-3.317-11.387-7.945l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.801 44 34.5 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                  </svg>
                )}
                {gLoading ? 'Signing in…' : 'Sign in with Google'}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Just one more step</h2>
              <p className="text-gray-500 text-sm mb-5">Tell us your name and phone number so we can deliver your order.</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" placeholder="Ravi Kumar" value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#2E7D32] focus-within:ring-1 focus-within:ring-[#2E7D32] mb-5">
                <span className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 border-r border-gray-200 flex items-center gap-1">🇮🇳 +91</span>
                <input
                  type="tel" placeholder="9999999999" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && submitProfile()}
                  className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent"
                />
              </div>

              <button onClick={submitProfile} disabled={!name.trim() || phone.length !== 10 || loading}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <>Continue <ArrowRight size={16} /></>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
