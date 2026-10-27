import React from 'react';
import { ChevronRight, ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { Card } from '../design-system/Card';

interface PrivacyPolicyViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>Legal & Transparency</span>
          <span aria-hidden="true">·</span>
          <span>Last Updated: October 2024</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b2d21] tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          At JibuWise, privacy is an architectural principle, not an afterthought. We explain plainly below how your data is treated when using our calculators.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Core highlight card */}
        <Card padding="md" variant="muted">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-[#0b2d21]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">
                Your Financial Numbers Never Leave Your Device
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                All calculations—including salary numbers, loan amounts, property purchase prices, and M-Pesa transfer sums—are executed 100% locally in your browser's memory using client-side JavaScript. We never transmit, store, or log the values you input into any calculator.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">1. Information We Do Not Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>Personal Financial Data:</strong> We do not ask for or collect your name, national ID, KRA PIN, bank account numbers, or M-Pesa details.</li>
            <li><strong>Calculation Inputs:</strong> Numbers entered into sliders, textboxes, or presets remain in your browser session only and disappear upon closing the tab.</li>
            <li><strong>User Accounts & Passwords:</strong> JibuWise does not offer account registration or login functionality.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">2. Information Handled Automatically (Server Logs)</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-2">
            Like standard websites, the hosting server records basic technical requests when your browser fetches web assets (HTML, CSS, JavaScript files). These server logs typically contain:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>Your device's IP address (for routing and DDoS prevention).</li>
            <li>Browser user-agent string and operating system version.</li>
            <li>The date, timestamp, and requested asset path (e.g. <code>/index.html</code>).</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            These logs are used strictly for server health, network diagnostic debugging, and preventing malicious activity. They are never linked to personal identities.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">3. Cookies & Local Storage</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            JibuWise does not use third-party tracking cookies or behavioral advertising pixels. The website may use transient browser memory (or local preferences like a chosen currency) strictly to preserve user choices during a browsing session.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">4. Third-Party Links & Services</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Our calculators reference public documentation and statutory frameworks from third-party entities (e.g., Kenya Revenue Authority, Safaricom PLC, EPRA). While we link or reference their public resources, JibuWise has no control over their privacy practices or website policies.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">5. Updates to This Policy</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            As we introduce new calculators or regional features, this Privacy Policy will be revised to reflect any technical changes. The effective date will always appear at the top of this document.
          </p>
        </section>

        {/* Section 6 */}
        <section className="pt-4 border-t border-slate-200">
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">6. Inquiries</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            For questions regarding this policy, please visit our{' '}
            <button
              onClick={() => onNavigate('contact')}
              className="text-[#0b2d21] font-semibold underline hover:text-lime-700 cursor-pointer"
            >
              Contact Page
            </button>
            {' '}or email <code>support@jibuwise.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
