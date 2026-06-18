'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp, MessageCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const FAQS = [
  {
    q: 'What are your delivery hours?',
    a: 'We deliver between 6 AM – 9 AM, 9 AM – 12 PM, and 4 PM – 7 PM every day. You can choose your preferred slot at checkout.',
  },
  {
    q: 'Is there a minimum order value?',
    a: 'No minimum order! Orders above ₹500 get free delivery. Below ₹500, a ₹30 delivery charge applies.',
  },
  {
    q: 'How fresh are the vegetables?',
    a: 'All vegetables are sourced fresh every morning directly from Rythu Bazar, Gajuwaka. We do not store items overnight.',
  },
  {
    q: 'Can I cancel or modify my order?',
    a: 'You can cancel your order within 15 minutes of placing it. Call us at +91 89195 00000 for immediate assistance.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.',
  },
  {
    q: 'Do you deliver to all areas in Visakhapatnam?',
    a: 'We currently deliver across Gajuwaka, MVP Colony, Seethammadhara, Dwaraka Nagar, Madhurawada, and surrounding areas.',
  },
  {
    q: 'How do I track my order?',
    a: 'Go to My Orders in your profile to see real-time order status updates.',
  },
];

export default function SupportPage() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);
  const [form,     setForm]     = useState({ name: '', phone: '', email: '', message: '' });
  const [errors,   setErrors]   = useState({ name: '', phone: '', email: '', message: '' });
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = { name: '', phone: '', email: '', message: '' };
    if (!form.name.trim())
      e.name = 'Name is required';
    else if (form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';

    if (!form.phone.trim())
      e.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = 'Enter a valid 10-digit Indian mobile number';

    if (!form.message.trim())
      e.message = 'Message is required';
    else if (form.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters';

    setErrors(e);
    return !e.name && !e.phone && !e.message;
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/api/support', form);
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
      setErrors({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setApiError(err.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
      <p className="text-gray-500 mb-10">We&apos;re here to help. Reach us anytime.</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h2>

          <a href="tel:+918919500000"
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-[#2E7D32]" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Call / WhatsApp</div>
              <div className="font-bold text-gray-900">+91 89195 00000</div>
            </div>
          </a>

          <a href="mailto:support@yzagfresh.in"
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-[#2E7D32]" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Email</div>
              <div className="font-bold text-gray-900">support@yzagfresh.in</div>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-[#2E7D32]" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Location</div>
              <div className="font-bold text-gray-900">Gajuwaka, Visakhapatnam</div>
              <div className="text-xs text-gray-400">Andhra Pradesh – 530026</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-[#2E7D32]" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Support Hours</div>
              <div className="font-bold text-gray-900">Mon – Sat · 8 AM – 8 PM</div>
              <div className="text-xs text-gray-400">Sunday 9 AM – 1 PM</div>
            </div>
          </div>

          <a href="https://wa.me/918919500000?text=Hi%2C%20I%20need%20help%20with%20my%20order"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 rounded-full transition-colors">
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Send a Message</h2>
          {sent ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold text-gray-900">Message sent!</p>
              <p className="text-gray-500 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                <input type="text" value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(v => ({ ...v, name: '' })); }}
                  placeholder="Ravi Kumar"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" value={form.phone} maxLength={10}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(v => ({ ...v, phone: '' })); }}
                  placeholder="9876543210"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input type="email" value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(v => ({ ...v, email: '' })); }}
                  placeholder="you@example.com"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                  <span className="text-gray-400 font-normal ml-1">({form.message.trim().length}/10 min)</span>
                </label>
                <textarea rows={4} value={form.message}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(v => ({ ...v, message: '' })); }}
                  placeholder="Describe your issue or question…"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 resize-none ${errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]'}`} />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              {/* API error */}
              {apiError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{apiError}</div>
              )}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-sm text-gray-900 pr-4">{faq.q}</span>
              {openFaq === i
                ? <ChevronUp size={16} className="text-[#2E7D32] flex-shrink-0" />
                : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
