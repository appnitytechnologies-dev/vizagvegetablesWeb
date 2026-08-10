export const metadata = { title: 'Privacy Policy — YZAG Fresh' };

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: (
      <>
        <p className="mb-3"><strong>Account information.</strong> When you sign in with Google, we receive your name, email address, profile photo, and a unique Google account identifier. We ask you to add a phone number so we can coordinate delivery — this is entered by you and is not verified by SMS or call.</p>
        <p className="mb-3"><strong>Location information.</strong> With your permission, we use your device&apos;s approximate or precise location to show nearby Rythu Bazars and local markets, and to estimate delivery. You can deny or revoke this permission at any time in your device settings; the nearby-markets feature won&apos;t work without it, but the rest of the app will.</p>
        <p className="mb-3"><strong>Order &amp; delivery information.</strong> We store your delivery address, the items you order, and your order history so we can fulfill and let you track your orders.</p>
        <p className="mb-3"><strong>Payment information.</strong> Payments are processed by Razorpay, a third-party payment processor. YZAG Fresh does not receive or store your card, UPI, or bank account details — Razorpay handles this directly and shares only the payment status with us.</p>
        <p className="mb-3"><strong>Device &amp; notification information.</strong> If you enable notifications, we store a device push token so we can send you order updates and price-drop alerts.</p>
        <p><strong>Usage information.</strong> We store the items you save to favourites and keep in your cart so they&apos;re there the next time you open the app.</p>
      </>
    ),
  },
  {
    title: '2. How We Use Your Information',
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>To create and manage your account</li>
        <li>To process, deliver, and let you track your orders</li>
        <li>To show relevant market rates and nearby markets based on your location</li>
        <li>To send order status updates and price-drop notifications, if enabled</li>
        <li>To maintain, secure, and improve the app</li>
      </ul>
    ),
  },
  {
    title: '3. How We Share Your Information',
    body: (
      <>
        <p className="mb-3">We do not sell your personal information. We share it only as needed to run the service:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Google</strong> — for Sign-In authentication. We never see or store your Google password.</li>
          <li><strong>Razorpay</strong> — to process payments for your orders.</li>
          <li><strong>Delivery personnel</strong> — your name, phone number, and delivery address, solely to fulfill your order.</li>
          <li><strong>Cloud hosting &amp; database providers</strong> — to store account and order data securely.</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Data Retention',
    body: (
      <p>We keep your account and order information for as long as your account is active. If you'd like your data deleted, contact us using the details below and we&apos;ll remove it, except where we&apos;re required to keep records (for example, for tax or legal purposes).</p>
    ),
  },
  {
    title: '5. Your Choices',
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Update your name and phone number any time from your profile in the app</li>
        <li>Turn off location access in your device settings (this disables the nearby-markets feature only)</li>
        <li>Turn off notifications from the app or your device settings</li>
        <li>Request a copy or deletion of your data by emailing us</li>
      </ul>
    ),
  },
  {
    title: '6. Children’s Privacy',
    body: (
      <p>YZAG Fresh is not directed at children, and we do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, please contact us and we&apos;ll remove it.</p>
    ),
  },
  {
    title: '7. Security',
    body: (
      <p>We use reasonable technical and organizational measures to protect your information. No method of storage or transmission over the internet is completely secure, so we can&apos;t guarantee absolute security.</p>
    ),
  },
  {
    title: '8. Changes to This Policy',
    body: (
      <p>We may update this policy from time to time. If we make material changes, we&apos;ll let you know in the app before they take effect.</p>
    ),
  },
  {
    title: '9. Contact Us',
    body: (
      <p>Questions about this policy or your data? Email us at <a href="mailto:yzagfresh@gmail.com" className="text-[#2E7D32] font-semibold hover:underline">yzagfresh@gmail.com</a>.</p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div>
      <section className="bg-[#2E7D32] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-green-200">Last updated: August 10, 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">
            This Privacy Policy explains what information YZAG Fresh (&quot;we,&quot; &quot;us&quot;) collects when you use our app or website,
            why we collect it, and the choices you have. By using YZAG Fresh, you agree to the collection and use of information
            described here.
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
