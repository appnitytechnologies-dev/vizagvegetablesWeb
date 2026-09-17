export const metadata = { title: 'Delete Account — YZAG Fresh' };

const SECTIONS = [
  {
    title: '1. How to Request Deletion',
    body: (
      <>
        <p className="mb-3">To request deletion of your YZAG Fresh account and data, email us at <a href="mailto:support@yzagfresh.in" className="text-[#2E7D32] font-semibold hover:underline">support@yzagfresh.in</a> from the email address associated with your account, with the subject line &quot;Delete My Account&quot;.</p>
        <p>Include the phone number or name on your account so we can find it. We&apos;ll confirm your identity, then process the request.</p>
      </>
    ),
  },
  {
    title: '2. What Gets Deleted',
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Your account profile — name, email, Google account link, and phone number</li>
        <li>Saved delivery addresses</li>
        <li>Favourites and cart contents</li>
        <li>Device push token used for notifications</li>
      </ul>
    ),
  },
  {
    title: '3. What We Keep, and Why',
    body: (
      <p>We retain your past order records (items ordered, amounts, and delivery details) even after account deletion, where required for tax, accounting, or legal record-keeping. This data is kept only as long as the law requires and is not used for any other purpose after your account is deleted.</p>
    ),
  },
  {
    title: '4. Timeline',
    body: (
      <p>We process deletion requests within 7 business days of confirming your identity. You&apos;ll receive an email once it&apos;s done.</p>
    ),
  },
  {
    title: '5. Questions',
    body: (
      <p>Reach us at <a href="mailto:support@yzagfresh.in" className="text-[#2E7D32] font-semibold hover:underline">support@yzagfresh.in</a>. See also our <a href="/privacy" className="text-[#2E7D32] font-semibold hover:underline">Privacy Policy</a> for more on how we handle your data.</p>
    ),
  },
];

export default function DeleteAccountPage() {
  return (
    <div>
      <section className="bg-[#2E7D32] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🗑️</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Delete Your Account</h1>
          <p className="text-green-200">YZAG Fresh — how to request account &amp; data deletion</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">
            This page explains how to request deletion of your YZAG Fresh account and the personal data associated with it,
            what gets removed, what we&apos;re required to keep, and how long the process takes.
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
