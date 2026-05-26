'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp, MessageCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const FAQS = [
  { q: 'What are your delivery hours?',        a: 'We deliver between 6 AM – 9 AM, 9 AM – 12 PM, and 4 PM – 7 PM every day. You can choose your preferred slot at checkout.' },
  { q: 'Is there a minimum order value?',       a: 'No minimum order! Orders above ₹500 get free delivery. Below ₹500, a ₹30 delivery charge applies.' },
  { q: 'How fresh are the vegetables?',         a: 'All vegetables are sourced fresh every morning directly from Rythu Bazar, Gajuwaka. We do not store items overnight.' },
  { q: 'Can I cancel or modify my order?',      a: 'You can cancel your order within 15 minutes of placing it. Call us at +91 89195 00000 for immediate assistance.' },
  { q: 'What payment methods do you accept?',   a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.' },
  { q: 'Do you deliver to all areas in Vizag?', a: 'We currently deliver across Gajuwaka, MVP Colony, Seethammadhara, Dwaraka Nagar, Madhurawada, and surrounding areas.' },
  { q: 'How do I track my order?',              a: 'Go to My Orders in your profile to see real-time order status updates.' },
];

export default function SupportSection() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);
  const [form,     setForm]     = useState({ name: '', phone: '', email: '', message: '' });
  const [errors,   setErrors]   = useState({ name: '', phone: '', email: '', message: '' });
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = { name: '', phone: '', email: '', message: '' };
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'At least 2 characters';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Valid 10-digit number';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'At least 10 characters';
    setErrors(e);
    return !e.name && !e.phone && !e.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/api/support', form);
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
      setErrors({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) { setApiError(err.message || 'Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="font-bold text-gray-900 text-lg">Support</h2>
        <p className="text-xs text-gray-400 mt-0.5">We&apos;re here to help. Reach us anytime.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Contact + Form grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Contact Us</h3>

            <a href="tel:+918919500000"
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#2E7D32]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Call / WhatsApp</div>
                <div className="font-bold text-gray-900 text-sm">+91 89195 00000</div>
              </div>
            </a>

            <a href="mailto:support@vizagvegetables.in"
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-[#2E7D32]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Email</div>
                <div className="font-bold text-gray-900 text-sm">support@vizagvegetables.in</div>
              </div>
            </a>

            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#2E7D32]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Location</div>
                <div className="font-bold text-gray-900 text-sm">Gajuwaka, Visakhapatnam</div>
                <div className="text-xs text-gray-400">Andhra Pradesh – 530026</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#2E7D32]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Support Hours</div>
                <div className="font-bold text-gray-900 text-sm">Mon – Sat · 8 AM – 8 PM</div>
                <div className="text-xs text-gray-400">Sunday 9 AM – 1 PM</div>
              </div>
            </div>

            <a href="https://wa.me/918919500000?text=Hi%2C%20I%20need%20help%20with%20my%20order"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 rounded-full transition-colors text-sm">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Send a Message</h3>
            {sent ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-gray-900">Message sent!</p>
                <p className="text-gray-500 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)}
                  className="mt-4 text-sm font-semibold text-[#2E7D32] hover:underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                {[
                  { label: 'Your Name',     key: 'name',    type: 'text',  ph: 'Ravi Kumar',      max: undefined },
                  { label: 'Phone Number',  key: 'phone',   type: 'tel',   ph: '9876543210',      max: 10 },
                ].map(({ label, key, type, ph, max }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input type={type} value={(form as any)[key]} maxLength={max}
                      onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(v => ({ ...v, [key]: '' })); }}
                      placeholder={ph}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${(errors as any)[key] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                    {(errors as any)[key] && <p className="text-red-500 text-xs mt-1">{(errors as any)[key]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input type="email" value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(v => ({ ...v, email: '' })); }}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-[#2E7D32] focus:ring-[#2E7D32]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                  <textarea rows={4} value={form.message}
                    onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(v => ({ ...v, message: '' })); }}
                    placeholder="Describe your issue or question…"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 resize-none ${errors.message ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                {apiError && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl">{apiError}</div>}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 text-sm">
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-sm text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp   size={15} className="text-[#2E7D32] flex-shrink-0" />
                    : <ChevronDown size={15} className="text-gray-400   flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
