import { markets, weeklyShandhas } from '@/data/markets';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

export default function MarketsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Rythu Bazar Markets</h1>
        <p className="text-gray-500 text-sm">Markets and weekly shandhas in Visakhapatnam</p>
      </div>

      {/* Market cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {markets.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-[#E8F5E9] h-32 flex items-center justify-center text-6xl">🏪</div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{m.name}</h3>
                  <p className="text-gray-500 text-sm">📍 {m.area}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {m.open ? '● OPEN' : '○ CLOSED'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { icon: '📍', val: `${m.km} km` },
                  { icon: '🕐', val: m.opens },
                  { icon: '👥', val: `${m.vendors} vendors` },
                ].map(s => (
                  <div key={s.icon} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <div className="text-base">{s.icon}</div>
                    <div className="text-xs font-semibold text-gray-700 mt-1">{s.val}</div>
                  </div>
                ))}
              </div>
              <a href={m.mapUrl} target="_blank" rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 border-2 border-[#2E7D32] text-[#2E7D32] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#E8F5E9] transition-colors">
                📍 Open in Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Shandhas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Shandhas</h2>
        <p className="text-gray-500 text-sm mb-6">Open-air weekly markets across Vizag districts</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {weeklyShandhas.map(s => {
            const isToday = s.day === today;
            return (
              <div key={s.day} className={`rounded-2xl p-4 border-2 transition-colors ${isToday ? 'border-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${isToday ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {s.day}
                  </span>
                  {isToday && <span className="text-xs font-semibold text-[#2E7D32]">Today</span>}
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{s.name}</div>
                <div className="text-xs text-gray-500">📍 {s.location}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
