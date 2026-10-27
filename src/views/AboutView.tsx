import React from 'react';
import { ChevronRight, Shield, Smartphone, Code, Globe2, BookOpen, CheckCircle } from 'lucide-react';
import { Card } from '../design-system/Card';

interface AboutViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium">About JibuWise</span>
      </nav>

      {/* Hero Headline */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>Mission & Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Open Public Utility</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0b2d21] tracking-tight mb-4">
          Simple tools. <span className="text-lime-600">Clear answers.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          In Swahili, <strong>Jibu</strong> means <em>answer</em>. JibuWise was built on a simple conviction: everyday calculations—whether planning your take-home pay, sending money via M-Pesa, negotiating a mortgage, or closing on a piece of land—should be immediate, completely free, and fully transparent.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Card padding="md" variant="default">
          <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center text-lime-900 mb-4">
            <Smartphone className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Mobile-First Ergonomics</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Over 85% of Kenyan and African web access happens on mobile devices. Every JibuWise tool is engineered with thumb-friendly touch hitboxes (&ge; 44px), instant feedback under 100ms, and clean responsive tables that don’t require awkward pinching or zooming.
          </p>
        </Card>

        <Card padding="md" variant="default">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0b2d21] mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Free, Accessible & Privacy-Conscious</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            JibuWise provides practical calculators that are easy to access without creating an account or paying a subscription. We respect your privacy and aim to keep calculations simple and secure. Where calculations run in your browser, the values you enter are processed on your device. Please refer to our Privacy Policy for details about data handling and website functionality.
          </p>
        </Card>

        <Card padding="md" variant="default">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-900 mb-4">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Statutory Integrity</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Formulas are continuously audited against official publications: Kenya Revenue Authority (KRA) Tax Act progressive bands, Social Health Insurance Fund (SHIF 2.75%), NSSF Act 2013 tiers, and Safaricom M-Pesa tariff schedules.
          </p>
        </Card>

        <Card padding="md" variant="default">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
            <Code className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Simple, Accessible & Practical</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            JibuWise is designed to make everyday calculations easier to understand and use. With a clean interface, straightforward inputs, and clear results, our tools help you make sense of important financial and everyday decisions without unnecessary complexity.
          </p>
        </Card>
      </div>

      {/* Regional Roadmap */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 mb-14">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Globe2 className="w-4 h-4 text-[#0b2d21]" />
          <span>Regional & Global Roadmap</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d21] mb-3">
          Starting in Kenya, Expanding Across Africa & Globally
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
          While our inaugural release caters directly to the Kenyan market (KES, PAYE, M-Pesa, Ardhisasa stamp duty), our underlying mathematical engines and currency switchers support expansion into Uganda (UGX / URA), Tanzania (TZS / TRA), Rwanda, South Africa (SARS), and universal international utility tools.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle className="w-4 h-4 text-lime-600 shrink-0" />
            <span>Kenya (KES) — Live</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle className="w-4 h-4 text-lime-600 shrink-0" />
            <span>Universal Mortgages & Fuel — Live</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle className="w-4 h-4 text-lime-600 shrink-0" />
            <span>Multi-currency VAT & Margin — Live</span>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="text-center pt-6">
        <a
          href="/tools"
          onClick={(e) => handleLinkClick(e, 'all-tools')}
          className="px-6 py-3 bg-[#0b2d21] hover:bg-[#071f16] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <span>Explore All Calculators</span>
          <ChevronRight className="w-4 h-4 text-lime-400" />
        </a>
      </div>
    </div>
  );
};
