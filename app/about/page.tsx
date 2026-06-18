const STATS = [{ v: '20+', l: 'Vegetables' }, { v: '4', l: 'Markets' }, { v: '2K+', l: 'Happy Users' }, { v: '100%', l: 'Fresh' }];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#2E7D32] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🥦</div>
          <h1 className="text-4xl font-bold mb-3">About YZAG Fresh</h1>
          <p className="text-green-200 text-lg">Local. Fresh. Connected.</p>
          <div className="flex justify-center gap-12 mt-10">
            {STATS.map(s => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-bold">{s.v}</div>
                <div className="text-green-300 text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌾</span>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-base">
            We connect Vizag residents with the freshest vegetables straight from Rythu Bazar.
            By making daily market prices transparent and deliveries easy, we support both local
            farmers and households across Visakhapatnam — no middlemen, no markups, just fresh produce.
          </p>
        </div>

        {/* Links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            { label: 'Privacy Policy',     icon: '🔒', href: '#' },
            { label: 'Terms of Service',   icon: '📄', href: '#' },
            { label: 'Rate the App',       icon: '⭐', href: '#' },
            { label: 'Follow on Instagram',icon: '📸', href: '#' },
          ].map((l, i, arr) => (
            <a key={l.label} href={l.href} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-lg">{l.icon}</div>
              <span className="flex-1 font-medium text-sm text-gray-900">{l.label}</span>
              <span className="text-gray-400">↗</span>
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400">Made with ❤️ in Visakhapatnam · © 2026 YZAG Fresh</p>
      </div>
    </div>
  );
}
