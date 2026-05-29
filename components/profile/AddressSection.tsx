'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Loader2, Plus, Pencil, Trash2, Star, Home, Briefcase, MapPin, Check, X } from 'lucide-react';
import { UserAddress, INDIAN_STATES, fmtAddress } from '@/lib/address';

type FormData = Omit<UserAddress, 'id' | 'is_default'>;
type Errors   = Partial<Record<keyof FormData, string>>;

const LABELS: UserAddress['label'][] = ['Home', 'Office', 'Other'];
const LABEL_ICON: Record<string, React.ReactNode> = {
  Home:   <Home      size={14} />,
  Office: <Briefcase size={14} />,
  Other:  <MapPin    size={14} />,
};
const EMPTY: FormData = {
  label: 'Home', name: '', phone: '', house_no: '', area: '',
  landmark: '', city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '',
};

/* ── Field ─────────────────────────────────────────────── */
function Field({ label, field, placeholder, type = 'text', maxLen, optional = false, form, errors, set }: {
  label: string; field: keyof FormData; placeholder: string;
  type?: string; maxLen?: number; optional?: boolean;
  form: FormData; errors: Errors; set: (key: keyof FormData, val: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {optional && <span className="text-gray-400 font-normal">(optional)</span>}
      </label>
      <input type={type} value={String(form[field] ?? '')} maxLength={maxLen}
        onChange={e => set(field, e.target.value)} placeholder={placeholder}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
          errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
        }`} />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );
}

/* ── Address Form ──────────────────────────────────────── */
function AddressForm({ initial, onSave, onCancel, saving, error }: {
  initial: FormData; onSave: (d: FormData) => void;
  onCancel: () => void; saving: boolean; error: string;
}) {
  const [form,   setForm]   = useState<FormData>(initial);
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof FormData, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };
  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim())     e.name     = 'Required';
    if (!form.phone.trim())    e.phone    = 'Required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Valid 10-digit number';
    if (!form.house_no.trim()) e.house_no = 'Required';
    if (!form.area.trim())     e.area     = 'Required';
    if (!form.city.trim())     e.city     = 'Required';
    if (!form.state)           e.state    = 'Required';
    if (!form.pincode.trim())  e.pincode  = 'Required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Address Type</label>
        <div className="flex gap-2">
          {LABELS.map(l => (
            <button key={l} onClick={() => set('label', l)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                form.label === l ? 'border-[#2E7D32] text-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {LABEL_ICON[l]} {l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name"     field="name"  placeholder="Ravi Kumar"   form={form} errors={errors} set={set} />
        <Field label="Mobile Number" field="phone" placeholder="9876543210" type="tel" maxLen={10} form={form} errors={errors} set={set} />
      </div>
      <Field label="House / Flat / Building"  field="house_no" placeholder="Flat 4B, Sunrise Apartments" form={form} errors={errors} set={set} />
      <Field label="Area / Street / Locality" field="area"     placeholder="MVP Colony, Near Park"        form={form} errors={errors} set={set} />
      <Field label="Landmark"                 field="landmark" placeholder="Near Government Hospital" optional form={form} errors={errors} set={set} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Pincode"     field="pincode" placeholder="530026"        type="tel" maxLen={6} form={form} errors={errors} set={set} />
        <Field label="City / Town" field="city"    placeholder="Visakhapatnam"            form={form} errors={errors} set={set} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">State</label>
        <select value={form.state} onChange={e => set('state', e.target.value)}
          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 bg-white ${
            errors.state ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'
          }`}>
          <option value="">-- Select State --</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 transition-colors">
          <X size={15} /> Cancel
        </button>
        <button onClick={() => { if (validate()) onSave(form); }} disabled={saving}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2E7D32] text-white text-sm font-semibold hover:bg-[#1B5E20] transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save Address
        </button>
      </div>
    </div>
  );
}

/* ── Main Section ──────────────────────────────────────── */
export default function AddressSection() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [mode,      setMode]      = useState<'list' | 'add' | 'edit'>('list');
  const [editId,    setEditId]    = useState<string | null>(null);
  const [initForm,  setInitForm]  = useState<FormData>(EMPTY);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setAddresses(await api.get<UserAddress[]>('/api/addresses')); }
    catch (e: any) { setError(e.message || 'Failed to load addresses'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: FormData) => {
    setSaving(true); setSaveError('');
    try {
      if (mode === 'add') {
        const created = await api.post<UserAddress>('/api/addresses', data);
        setAddresses(prev => {
          const list = created.is_default ? prev.map(a => ({ ...a, is_default: false })) : prev;
          return [created, ...list];
        });
      } else if (editId) {
        const updated = await api.put<UserAddress>(`/api/addresses/${editId}`, data);
        setAddresses(prev => prev.map(a => a.id === editId ? updated : a));
      }
      setMode('list');
    } catch (e: any) { setSaveError(e.message || 'Failed to save address'); }
    finally { setSaving(false); }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/api/addresses/${id}/default`, {});
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
    } catch (e: any) { alert(e.message || 'Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/addresses/${id}`);
      setAddresses(prev => {
        const remaining = prev.filter(a => a.id !== id);
        const wasDefault = prev.find(a => a.id === id)?.is_default;
        if (wasDefault && remaining.length > 0) remaining[0] = { ...remaining[0], is_default: true };
        return remaining;
      });
    } catch (e: any) { alert(e.message || 'Failed to delete'); }
    setDeleteId(null);
  };

  const startEdit = (a: UserAddress) => {
    setInitForm({ label: a.label, name: a.name, phone: a.phone, house_no: a.house_no,
      area: a.area, landmark: a.landmark || '', city: a.city, state: a.state, pincode: a.pincode });
    setEditId(a.id); setSaveError(''); setMode('edit');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Manage Addresses</h2>
          <p className="text-xs text-gray-400 mt-0.5">Save addresses for faster checkout</p>
        </div>
        {mode === 'list' && (
          <button onClick={() => { setInitForm(EMPTY); setEditId(null); setSaveError(''); setMode('add'); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#2E7D32] border-2 border-[#2E7D32] px-4 py-2 rounded-full hover:bg-[#E8F5E9] transition-colors">
            <Plus size={15} /> Add New
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Form */}
        {(mode === 'add' || mode === 'edit') && (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">
              {mode === 'add' ? 'Add New Address' : 'Edit Address'}
            </h3>
            <AddressForm initial={initForm} onSave={handleSave}
              onCancel={() => setMode('list')} saving={saving} error={saveError} />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" /> Loading addresses…
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
        ) : addresses.length === 0 && mode === 'list' ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📍</div>
            <p className="font-semibold text-gray-700 text-lg mb-1">No saved addresses</p>
            <p className="text-gray-400 text-sm">Add your home or office for faster checkout</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id}
                className={`rounded-2xl border-2 overflow-hidden transition-colors ${addr.is_default ? 'border-[#2E7D32]' : 'border-gray-100'}`}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        addr.is_default ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {LABEL_ICON[addr.label]} {addr.label.toUpperCase()}
                      </span>
                      {addr.is_default && (
                        <span className="text-xs font-bold text-[#2E7D32] border border-[#2E7D32] px-2 py-0.5 rounded-full">DEFAULT</span>
                      )}
                    </div>
                    {deleteId === addr.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">Delete this address?</span>
                        <button onClick={() => handleDelete(addr.id)} className="text-red-600 font-semibold text-xs hover:underline">Yes</button>
                        <button onClick={() => setDeleteId(null)} className="text-gray-500 font-semibold text-xs hover:underline">No</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {!addr.is_default && (
                          <button onClick={() => handleSetDefault(addr.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2E7D32] px-2 py-1.5 rounded-lg hover:bg-[#E8F5E9] transition-colors font-medium">
                            <Star size={13} /> Default
                          </button>
                        )}
                        <button onClick={() => startEdit(addr)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2E7D32] px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(addr.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {addr.name}&nbsp;&nbsp;<span className="font-normal text-gray-500">{addr.phone}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{fmtAddress(addr)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
