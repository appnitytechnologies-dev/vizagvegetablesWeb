import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#3D8C40] flex items-center justify-center text-xl">🥦</div>
              <div>
                <div className="font-bold text-base">YZAG Fresh</div>
                <div className="text-gray-400 text-xs mt-0.5">Local. Fresh. Connected.</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Farm-fresh vegetables from Visakhapatnam&apos;s Rythu Bazar, delivered to your door every morning.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#3D8C40]/20 text-[#6DBF6F] rounded-full px-3 py-1.5 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-[#6DBF6F] rounded-full animate-pulse" />
              Prices updated daily
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {[['/', 'Home'], ['/prices', "Today's Prices"], ['/markets', 'Markets'], ['/shop', 'Shop']].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {[['/orders', 'My Orders'], ['/profile', 'My Profile'], ['/notifications', 'Notifications'], ['/support', 'Support']].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-4">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2"><span>📞</span> +91 89195 00000</li>
              <li className="flex items-center gap-2"><span>✉️</span> support@yzagfresh.in</li>
              <li className="flex items-center gap-2"><span>📍</span> Gajuwaka, Visakhapatnam</li>
              <li className="flex items-center gap-2 pt-1"><span>🕐</span> <span className="text-gray-500">Mon–Sat · 8 AM – 8 PM</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>© 2026 YZAG Fresh · Made with ❤️ in Visakhapatnam</span>
          <div className="flex gap-5">
            <Link href="/about"   className="hover:text-gray-300 transition-colors">About</Link>
            <Link href="/support" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/support" className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
