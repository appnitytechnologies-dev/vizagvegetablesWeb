export const metadata = { title: 'Terms of Service — YZAG Fresh' };

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: (
      <p>By creating an account or using YZAG Fresh, you agree to these Terms of Service. If you don&apos;t agree, please don&apos;t use the app.</p>
    ),
  },
  {
    title: '2. What YZAG Fresh Is',
    body: (
      <p>YZAG Fresh helps you check daily Rythu Bazar and local market prices in Visakhapatnam, find nearby markets, and order fresh vegetables and fruits for delivery. Prices shown reflect market rates and may change day to day.</p>
    ),
  },
  {
    title: '3. Your Account',
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>You sign in with Google, and we ask for a phone number so we can reach you about your order and delivery.</li>
        <li>You&apos;re responsible for keeping the information on your account accurate and up to date.</li>
        <li>One account is for one person or household — please don&apos;t share your account or use someone else&apos;s.</li>
      </ul>
    ),
  },
  {
    title: '4. Orders &amp; Delivery',
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Placing an order is an offer to buy at the price shown at checkout; we&apos;ll confirm your order once it&apos;s accepted.</li>
        <li>Delivery windows are estimates. Weather, market supply, and traffic in Visakhapatnam can occasionally cause delays.</li>
        <li>We may need to substitute or remove an item if it&apos;s out of stock at the market that day — we&apos;ll let you know before delivery where possible.</li>
        <li>We reserve the right to cancel or refuse an order, for example if an address is outside our delivery area or the order looks fraudulent.</li>
      </ul>
    ),
  },
  {
    title: '5. Payments, Cancellations &amp; Refunds',
    body: (
      <>
        <p className="mb-3">Payments are processed securely by Razorpay. We don&apos;t see or store your card, UPI, or bank details.</p>
        <p>If you need to cancel an order or request a refund — for example an item arrived damaged or missing — contact us using the details below as soon as possible so we can help.</p>
      </>
    ),
  },
  {
    title: '6. Acceptable Use',
    body: (
      <p>Please use YZAG Fresh honestly — no fraudulent orders, no attempting to disrupt or misuse the app or its systems, and no using the service for anything unlawful.</p>
    ),
  },
  {
    title: '7. Our Content',
    body: (
      <p>The YZAG Fresh app, its design, and its content belong to us. You&apos;re welcome to use the app for your own personal shopping — please don&apos;t copy, resell, or repurpose it.</p>
    ),
  },
  {
    title: '8. Disclaimer &amp; Limitation of Liability',
    body: (
      <p>We work to keep prices and stock accurate, but market conditions change quickly and we can&apos;t guarantee every detail will be perfectly up to date at all times. To the extent permitted by law, YZAG Fresh isn&apos;t liable for indirect or incidental losses arising from delays, substitutions, or unavailability of items.</p>
    ),
  },
  {
    title: '9. Changes to These Terms',
    body: (
      <p>We may update these Terms from time to time. If we make a material change, we&apos;ll let you know in the app before it takes effect. Continuing to use YZAG Fresh after a change means you accept the update.</p>
    ),
  },
  {
    title: '10. Governing Law',
    body: (
      <p>These Terms are governed by the laws of India, and any disputes will be subject to the courts of Visakhapatnam, Andhra Pradesh.</p>
    ),
  },
  {
    title: '11. Contact Us',
    body: (
      <p>Questions about these Terms? Email us at <a href="mailto:yzagfresh@gmail.com" className="text-[#2E7D32] font-semibold hover:underline">yzagfresh@gmail.com</a>.</p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="bg-[#2E7D32] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-green-200">Last updated: August 10, 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">
            These Terms of Service govern your use of the YZAG Fresh app and website. They&apos;re written in plain language on
            purpose — if anything is unclear, reach out using the contact details at the bottom.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{s.title}</h2>
              <div className="text-gray-600 leading-relaxed text-[15px]">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
