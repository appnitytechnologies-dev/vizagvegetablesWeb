'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '@/store/cartSlice';
import { selectAuth } from '@/store/authSlice';
import { api, imgUrl } from '@/lib/api';
import { Check, Loader2, LogIn, Plus, ChevronDown, ChevronUp, Home, Briefcase, MapPin } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { UserAddress, INDIAN_STATES, fmtAddress } from '@/lib/address';

type NewAddrForm = {
  label: 'Home' | 'Office' | 'Other';
  name: string; phone: string; house_no: string; area: string;
  landmark: string; city: string; state: string; pincode: string;
  save: boolean;
};
type FormErrors = Partial<Record<keyof NewAddrForm, string>>;

/* ─── Constants ───────────────────────────────────────── */
const DELIVERY = 30;
const SLOTS    = ['6 AM – 9 AM', '9 AM – 12 PM', '4 PM – 7 PM'];
const STEPS    = ['Delivery', 'Payment', 'Confirm'];
const LABELS: UserAddress['label'][] = ['Home', 'Office', 'Other'];
const LABEL_ICON: Record<string, React.ReactNode> = {
  Home:   <Home   size={13} />,
  Office: <Briefcase size={13} />,
  Other:  <MapPin size={13} />,
};

const PAYMENT_METHODS = [
  { id: 'upi',        icon: '📱', label: 'UPI',                sub: 'Recommended' },
  { id: 'card',       icon: '💳', label: 'Credit / Debit Card', sub: '' },
  { id: 'netbanking', icon: '🏦', label: 'Net Banking',         sub: '' },
  { id: 'cod',        icon: '💵', label: 'Cash on Delivery',    sub: '' },
];

const EMPTY_FORM: NewAddrForm = {
  label: 'Home', name: '', phone: '', house_no: '', area: '',
  landmark: '', city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '', save: true,
};



/* ─── Page ────────────────────────────────────────────── */
export default function CheckoutPage() {
  const router   = useRouter();
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const auth     = useSelector(selectAuth);
  const delivery = total >= 500 ? 0 : DELIVERY;

  /* Step state */
  const [step,    setStep]    = useState(0);
  const [method,  setMethod]  = useState('upi');
  const [upiId,   setUpiId]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [slot,    setSlot]    = useState(SLOTS[0]);

  /* Address state */
  const [addresses,    setAddresses]    = useState<UserAddress[]>([]);
  const [loadingAddrs, setLoadingAddrs] = useState(true);
  const [selectedId,   setSelectedId]  = useState<string | null>(null);
  const [useNew,       setUseNew]       = useState(false);
  const [newForm,      setNewForm]      = useState<NewAddrForm>(EMPTY_FORM);
  const [formErrors,   setFormErrors]   = useState<FormErrors>({});
  const [showNewForm,  setShowNewForm]  = useState(false);

  useEffect(() => {
    if (items.length === 0) router.replace('/shop');
  }, [items.length, router]);

  /* Load saved addresses when logged in */
  useEffect(() => {
    if (!auth.isLoggedIn) { setLoadingAddrs(false); setShowNewForm(true); return; }
    api.get<UserAddress[]>('/api/addresses')
      .then(data => {
        setAddresses(data);
        const def = data.find(a => a.is_default) ?? data[0];
        if (def) { setSelectedId(def.id); setUseNew(false); setShowNewForm(false); }
        else     { setUseNew(true); setShowNewForm(true); }
      })
      .catch(() => { setUseNew(true); setShowNewForm(true); })
      .finally(() => setLoadingAddrs(false));
  }, [auth.isLoggedIn]);

  if (items.length === 0) return null;

  if (!auth.isLoggedIn) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Login required</h2>
      <p className="text-gray-500 mb-6">Please log in to place your order</p>
      <button onClick={() => setShowAuth(true)}
        className="inline-flex items-center gap-2 bg-[#2E7D32] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
        <LogIn size={18} /> Login to Continue
      </button>
      {showAuth && <AuthModal mode="login" onClose={() => setShowAuth(false)} onSwitch={() => {}} />}
    </div>
  );

  /* ── Validate new address form ── */
  const validateNew = (): boolean => {
    const e: FormErrors = {};
    if (!newForm.name.trim())     e.name     = 'Required';
    if (!newForm.phone.trim())    e.phone    = 'Required';
    else if (!/^[6-9]\d{9}$/.test(newForm.phone.trim())) e.phone = 'Enter valid 10-digit number';
    if (!newForm.house_no.trim()) e.house_no = 'Required';
    if (!newForm.area.trim())     e.area     = 'Required';
    if (!newForm.city.trim())     e.city     = 'Required';
    if (!newForm.state.trim())    e.state    = 'Required';
    if (!newForm.pincode.trim())  e.pincode  = 'Required';
    else if (!/^\d{6}$/.test(newForm.pincode.trim())) e.pincode = 'Valid 6-digit pincode';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Step 0 → 1 ── */
  const goToPayment = async () => {
    setError('');
    if (useNew || (!selectedId && addresses.length === 0)) {
      if (!validateNew()) return;
      if (newForm.save) {
        try {
          const created = await api.post<UserAddress>('/api/addresses', {
            label: newForm.label, name: newForm.name, phone: newForm.phone,
            house_no: newForm.house_no, area: newForm.area,
            landmark: newForm.landmark || undefined,
            city: newForm.city, state: newForm.state, pincode: newForm.pincode,
          });
          setAddresses(prev => [created, ...prev]);
          setSelectedId(created.id);
          setUseNew(false);
          setShowNewForm(false);
        } catch { /* non-fatal */ }
      }
    } else if (!selectedId) {
      setError('Please select a delivery address');
      return;
    }
    setError('');
    setStep(1);
  };

  /* ── Place order ── */
  const placeOrder = async () => {
    let deliveryAddress = '';
    if (useNew || (!selectedId && addresses.length === 0)) {
      const f = newForm;
      const parts = [f.house_no.trim(), f.area.trim()];
      if (f.landmark.trim()) parts.push(f.landmark.trim());
      parts.push(`${f.city.trim()}, ${f.state.trim()} – ${f.pincode.trim()}`);
      deliveryAddress = parts.join(', ');
    } else {
      const addr = addresses.find(a => a.id === selectedId);
      deliveryAddress = addr ? fmtAddress(addr) : 'N/A';
    }

    setLoading(true); setError('');
    try {
      const res = await api.post<{ id: string }>('/api/orders', {
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity, unit_price: i.price })),
        delivery_address: deliveryAddress,
        delivery_slot:    slot,
        payment_method:   method,
      });
      dispatch(clearCart());
      router.push(`/order-success?id=${res.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to place order. Please try again.');
    } finally { setLoading(false); }
  };

  const setField = (key: keyof NewAddrForm, val: any) =>
    setNewForm(f => ({ ...f, [key]: val }));

  /* ── Selected address summary (shown in step 1) ── */
  const selectedAddr = addresses.find(a => a.id === selectedId);
  const addressSummary = selectedAddr
    ? `${selectedAddr.name} · ${fmtAddress(selectedAddr)}`
    : newForm.house_no
      ? `${newForm.house_no}, ${newForm.area}, ${newForm.city}`
      : '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? 'bg-[#2E7D32] text-white'
                : i === step ? 'bg-[#2E7D32] text-white ring-4 ring-[#C8E6C9]'
                : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-[#2E7D32]' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-[#2E7D32]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {/* ══ Step 0: Delivery ══ */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Delivery Details</h2>

              {/* Delivery slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Slot</label>
                <div className="flex gap-2 flex-wrap">
                  {SLOTS.map(s => (
                    <button key={s} onClick={() => setSlot(s)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                        slot === s ? 'border-[#2E7D32] text-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 text-gray-600 hover:border-[#2E7D32]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved addresses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>

                {loadingAddrs ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-3">
                    <Loader2 size={16} className="animate-spin" /> Loading addresses…
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Saved address cards */}
                    {addresses.map(addr => {
                      const isSelected = !useNew && selectedId === addr.id;
                      return (
                        <label key={addr.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            isSelected ? 'border-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="addr" checked={isSelected}
                            onChange={() => { setSelectedId(addr.id); setUseNew(false); setShowNewForm(false); }}
                            className="mt-1 accent-[#2E7D32]" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {LABEL_ICON[addr.label]} {addr.label}
                              </span>
                              {addr.is_default && (
                                <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">DEFAULT</span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{addr.name} &nbsp;<span className="font-normal text-gray-500">{addr.phone}</span></p>
                            <p className="text-sm text-gray-600 mt-0.5">{fmtAddress(addr)}</p>
                          </div>
                        </label>
                      );
                    })}

                    {/* Add / use different address toggle */}
                    <button
                      onClick={() => { setShowNewForm(v => !v); setUseNew(true); setSelectedId(null); }}
                      className={`w-full flex items-center justify-between gap-2 p-4 rounded-xl border-2 transition-colors text-sm font-medium ${
                        useNew ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]' : 'border-dashed border-gray-300 text-gray-500 hover:border-[#2E7D32] hover:text-[#2E7D32]'}`}>
                      <span className="flex items-center gap-2">
                        <Plus size={16} />
                        {addresses.length === 0 ? 'Enter delivery address' : 'Use a different address'}
                      </span>
                      {showNewForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* New address form */}
                    {showNewForm && (
                      <div className="border border-gray-200 rounded-xl p-4 space-y-4">
                        {/* Label */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Address Type</label>
                          <div className="flex gap-2">
                            {LABELS.map(l => (
                              <button key={l} onClick={() => setField('label', l)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                                  newForm.label === l ? 'border-[#2E7D32] text-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                {LABEL_ICON[l]} {l}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name + Phone */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                            <input value={newForm.name} onChange={e => setField('name', e.target.value)}
                              placeholder="Ravi Kumar"
                              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${formErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number</label>
                            <input value={newForm.phone} onChange={e => setField('phone', e.target.value.replace(/\D/g,''))}
                              placeholder="9876543210" maxLength={10} inputMode="numeric"
                              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${formErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                            {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                          </div>
                        </div>

                        {/* House */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">House / Flat / Building</label>
                          <input value={newForm.house_no} onChange={e => setField('house_no', e.target.value)}
                            placeholder="Flat 4B, Sunrise Apartments"
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${formErrors.house_no ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                          {formErrors.house_no && <p className="text-red-500 text-xs mt-1">{formErrors.house_no}</p>}
                        </div>

                        {/* Area */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Area / Street / Locality</label>
                          <input value={newForm.area} onChange={e => setField('area', e.target.value)}
                            placeholder="MVP Colony, Near Park"
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${formErrors.area ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                          {formErrors.area && <p className="text-red-500 text-xs mt-1">{formErrors.area}</p>}
                        </div>

                        {/* Landmark */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Landmark <span className="text-gray-400 font-normal">(optional)</span></label>
                          <input value={newForm.landmark} onChange={e => setField('landmark', e.target.value)}
                            placeholder="Near Government Hospital"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32]" />
                        </div>

                        {/* Pincode + City */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Pincode</label>
                            <input value={newForm.pincode} onChange={e => setField('pincode', e.target.value.replace(/\D/g,''))}
                              placeholder="530026" maxLength={6} inputMode="numeric"
                              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${formErrors.pincode ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                            {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">City / Town</label>
                            <input value={newForm.city} onChange={e => setField('city', e.target.value)}
                              placeholder="Visakhapatnam"
                              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${formErrors.city ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                            {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                          </div>
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                          <select value={newForm.state} onChange={e => setField('state', e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 bg-white ${formErrors.state ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`}>
                            <option value="">-- Select State --</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                        </div>

                        {/* Save checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={newForm.save}
                            onChange={e => setField('save', e.target.checked)}
                            className="accent-[#2E7D32] w-4 h-4" />
                          <span className="text-sm text-gray-600">Save this address to my account</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={goToPayment}
                className="w-full bg-[#2E7D32] text-white font-semibold py-3 rounded-full hover:bg-[#1B5E20] transition-colors">
                Continue to Payment
              </button>
            </div>
          )}

          {/* ══ Step 1: Payment ══ */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              {/* Address + slot summary */}
              <div className="bg-[#E8F5E9] rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[#2E7D32] font-semibold mb-0.5">📍 Delivery to · {slot}</p>
                  <p className="text-sm text-gray-700">{addressSummary}</p>
                </div>
                <button onClick={() => setStep(0)} className="text-xs font-semibold text-[#2E7D32] hover:underline whitespace-nowrap">Change</button>
              </div>

              <h2 className="font-bold text-gray-900 text-lg">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(m => (
                  <div key={m.id}>
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${method === m.id ? 'border-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{m.label}</div>
                        {m.sub && <div className="text-xs text-[#2E7D32]">{m.sub}</div>}
                      </div>
                      <input type="radio" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-[#2E7D32]" />
                    </label>
                    {method === 'upi' && m.id === 'upi' && (
                      <div className="mt-2 border border-[#2E7D32] rounded-xl px-4 py-2">
                        <input type="text" placeholder="Enter UPI ID (e.g. name@upi)"
                          value={upiId} onChange={e => setUpiId(e.target.value)}
                          className="w-full text-sm focus:outline-none" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(0)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-full hover:border-gray-300 transition-colors">← Back</button>
                <button onClick={placeOrder} disabled={loading}
                  className="flex-1 bg-[#2E7D32] text-white font-semibold py-3 rounded-full hover:bg-[#1B5E20] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Placing…</> : `Place Order · ₹${total + delivery}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map(i => {
              const src = imgUrl(i.image_url);
              return (
                <div key={i.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded bg-[#E8F5E9] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {src ? <img src={src} alt={i.name} className="w-full h-full object-cover" /> : <span className="text-xs">{i.emoji || '🥬'}</span>}
                  </div>
                  <span className="flex-1 text-gray-600 truncate">{i.name} ×{i.quantity}</span>
                  <span className="font-medium flex-shrink-0">₹{i.price * i.quantity}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{total}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span>{delivery === 0 ? 'Free 🎉' : `₹${delivery}`}</span></div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2"><span>Total</span><span>₹{total + delivery}</span></div>
          </div>
          <div className="mt-4 text-xs text-gray-400 text-center">🔒 Secure checkout</div>
        </div>
      </div>
    </div>
  );
}
