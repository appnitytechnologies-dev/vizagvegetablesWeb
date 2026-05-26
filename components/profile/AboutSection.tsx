const STATS = [
  { v: '20+',  l: 'Vegetables'  },
  { v: '4',    l: 'Markets'     },
  { v: '2K+',  l: 'Happy Users' },
  { v: '100%', l: 'Fresh'       },
];

const LINKS = [
  { label: 'Privacy Policy',      icon: '🔒', href: '#' },
  { label: 'Terms of Service',    icon: '📄', href: '#' },
  { label: 'Rate the App',        icon: '⭐', href: '#' },
  { label: 'Follow on Instagram', icon: '📸', href: '#' },
];

export default function AboutSection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-50">
        <h2 className="font-bold text-gray-900 text-lg">About Us</h2>
        <p className="text-xs text-gray-400 mt-0.5">Farm to Table · Rythu Bazar Prices</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="bg-[#2E7D32] rounded-2xl p-6 text-white text-center">
          <div className="text-4xl mb-2">🥦</div>
          <h3 className="font-bold text-lg mb-4">Vizag Vegetables</h3>
          <div className="flex justify-center gap-8">
            {STATS.map(s => (
              <div key={s.l}>
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-green-300 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌾</span>
            <h3 className="font-bold text-gray-900">Our Mission</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            We connect Vizag residents with the freshest vegetables straight from Rythu Bazar.
            By making daily market prices transparent and deliveries easy, we support both local
            farmers and households across Visakhapatnam — no middlemen, no markups, just fresh produce.
          </p>
        </div>

        {/* Links */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          {LINKS.map((l, i) => (
            <a key={l.label} href={l.href}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < LINKS.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="w-9 h-9 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-base flex-shrink-0">{l.icon}</div>
              <span className="flex-1 font-medium text-sm text-gray-900">{l.label}</span>
              <span className="text-gray-400 text-sm">↗</span>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">Made with ❤️ in Visakhapatnam · © 2026 Vizag Vegetables</p>
      </div>
    </div>
  );
}
