'use client';
import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/authSlice';
import { api, setToken } from '@/lib/api';

interface Props { mode: 'login' | 'signup'; onClose: () => void; onSwitch: (m: 'login' | 'signup') => void; }

export default function AuthModal({ mode, onClose, onSwitch }: Props) {
  const dispatch   = useDispatch();
  const [step, setStep]       = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone]     = useState('');
  const [name, setName]       = useState('');
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [timer, setTimer]     = useState(30);
  const [counting, setCounting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const inputRefs             = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(id); setCounting(false); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [counting]);

  const sendOtp = async () => {
    if (phone.length !== 10) return;
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/send-otp', { phone, mode });
      setStep('otp'); setTimer(30); setCounting(true);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (e: any) {
      setError(e.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setLoading(true); setError('');
    try {
      const res = await api.post<{ token: string; user: { id: string; phone: string; name?: string }; isNewUser: boolean }>(
        '/api/auth/verify-otp', { phone, otp: code, name: name || undefined, mode }
      );
      setToken(res.token);
      const displayName = res.user.name || name || `User ${res.user.phone.slice(-4)}`;
      localStorage.setItem('user_name', displayName);
      dispatch(loginSuccess({ token: res.token, id: res.user.id, phone: res.user.phone, name: displayName }));
      onClose();
    } catch (e: any) {
      setError(e.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally { setLoading(false); }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (val && idx === 5) {
      // auto-submit when last digit filled
      const code = [...next].join('');
      if (code.length === 6) setTimeout(verifyOtp, 100);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
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
              <div className="font-bold text-xl">Vizag Vegetables</div>
              <div className="text-green-200 text-sm">{mode === 'login' ? 'Welcome back!' : 'Create your account'}</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">{error}</div>
          )}

          {step === 'phone' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {mode === 'login' ? 'Login to your account' : 'Sign up for free'}
              </h2>
              <p className="text-gray-500 text-sm mb-5">Enter your mobile number to get an OTP</p>

              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text" placeholder="Ravi Kumar" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]"
                  />
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#2E7D32] focus-within:ring-1 focus-within:ring-[#2E7D32] mb-5">
                <span className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 border-r border-gray-200 flex items-center gap-1">🇮🇳 +91</span>
                <input
                  type="tel" placeholder="9999999999" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && sendOtp()}
                  className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent"
                />
              </div>

              <button onClick={sendOtp} disabled={phone.length !== 10 || loading}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Send OTP <ArrowRight size={16} /></>}
              </button>

              <p className="text-center text-sm text-gray-500 mt-5">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => onSwitch(mode === 'login' ? 'signup' : 'login')} className="text-[#2E7D32] font-semibold hover:underline">
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="text-[#2E7D32] text-sm font-medium mb-4 hover:underline">← Change number</button>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Verify your number</h2>
              <p className="text-gray-500 text-sm mb-1">Enter the 6-digit OTP sent to +91 {phone}</p>

              {/* Dev hint */}
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg mb-5">
                🔧 Testing mode — check API console for the OTP
              </p>

              <div className="flex gap-2 justify-center mb-5">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="tel" maxLength={1} value={d}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className="w-11 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-[#2E7D32] transition-colors"
                    style={{ borderColor: d ? '#2E7D32' : undefined }}
                  />
                ))}
              </div>

              <button onClick={verifyOtp} disabled={otp.some(d => !d) || loading}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : 'Verify & Continue'}
              </button>

              <div className="text-center mt-4 text-sm text-gray-500">
                {counting ? (
                  <span>Resend OTP in <span className="font-semibold text-[#2E7D32]">0:{String(timer).padStart(2, '0')}</span></span>
                ) : (
                  <button onClick={sendOtp} className="text-[#2E7D32] font-semibold hover:underline flex items-center gap-1 mx-auto">
                    <RotateCcw size={14} /> Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
