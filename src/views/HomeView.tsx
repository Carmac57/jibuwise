import React from 'react';
import { Search, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../config/categories';
import { TOOLS } from '../config/tools';
import { CategoryCard } from '../components/CategoryCard';
import { ToolCard } from '../components/ToolCard';
import { Card } from '../design-system/Card';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenSearch }) => {
  const popularTools = TOOLS.filter((t) => t.isPopular);

  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-[#f0fdf4]/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Unboxed natural kicker */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-700 mb-3">
              <span>Fast & Free Practical Tools</span>
              <span aria-hidden="true">·</span>
              <span>Updated with 2026 Statutory Rates</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b2d21] tracking-tight text-balance leading-tight">
              Simple tools. <span className="text-lime-600">Clear answers.</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
              Instant, verified calculators for Kenya and beyond. Calculate take-home salary after KRA tax and SHIF, M-Pesa transaction fees, loan repayments, land stamp duty, and travel fuel.
            </p>

            {/* Hero Quick Search Trigger */}
            <div className="mt-8 max-w-xl mx-auto">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#0b2d21] shadow-sm text-left text-slate-400 text-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-400 group-hover:text-[#0b2d21] transition-colors" />
                  <span className="text-slate-600">Search calculators (e.g. PAYE, M-Pesa, Loan)...</span>
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  ⌘K
                </span>
              </button>
            </div>

            {/* Quick Popular Links */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Popular:</span>
              <a
                href="/tools/kenya-paye-salary-calculator"
                onClick={(e) => handleLinkClick(e, 'tool', 'kenya-paye-salary-calculator')}
                className="text-[#0b2d21] hover:underline cursor-pointer"
              >
                Kenya PAYE & SHIF
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/tools/mpesa-charges-calculator"
                onClick={(e) => handleLinkClick(e, 'tool', 'mpesa-charges-calculator')}
                className="text-[#0b2d21] hover:underline cursor-pointer"
              >
                M-Pesa Tariffs
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/tools/loan-mortgage-emi-calculator"
                onClick={(e) => handleLinkClick(e, 'tool', 'loan-mortgage-emi-calculator')}
                className="text-[#0b2d21] hover:underline cursor-pointer"
              >
                Loan Repayment
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/tools/kenya-stamp-duty-land-transfer-calculator"
                onClick={(e) => handleLinkClick(e, 'tool', 'kenya-stamp-duty-land-transfer-calculator')}
                className="text-[#0b2d21] hover:underline cursor-pointer"
              >
                Land Stamp Duty
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-lime-100 flex items-center justify-center shrink-0 text-lime-900">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Instant & Private</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Run calculations directly in your browser, with clear results and no account required. See our Privacy Policy for details about website data handling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Statutory Accuracy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Grounded in current Kenyan statutory laws (KRA Finance Acts, SHIF 2.75%, NSSF Act, and Safaricom schedules).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0 text-teal-900">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">100% Free Forever</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero paywalls, hidden subscriptions, or pay-to-unlock formulas. Built as an open public utility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Popular Calculators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              <span>Essential Everyday Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2d21] tracking-tight">
              Most Popular Calculators
            </h2>
          </div>
          <a
            href="/tools"
            onClick={(e) => handleLinkClick(e, 'all-tools')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0b2d21] hover:text-lime-700 cursor-pointer self-start sm:self-auto"
          >
            <span>View all calculators</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(slug) => onNavigate('tool', slug)}
            />
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <span>Explore By Domain</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2d21] tracking-tight">
            Tool Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelect={(catId) => onNavigate('category', catId)}
            />
          ))}
        </div>
      </section>

      {/* Architecture & Methodology Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Card variant="forest" padding="lg">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-wider text-lime-400 font-bold block mb-2">
              JibuWise Engineering & Open Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 text-balance">
              Designed for Speed, Mobile Ergonomics, and Portability
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed mb-6">
              JibuWise is engineered from the ground up to solve everyday Kenyan financial and practical questions with zero ambiguity. Our tools are designed to make everyday calculations easier to understand, with clear formulas, practical inputs, and straightforward results.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/tools"
                onClick={(e) => handleLinkClick(e, 'all-tools')}
                className="px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors cursor-pointer inline-block"
              >
                Explore All 6 Tools
              </a>
              <a
                href="/about"
                onClick={(e) => handleLinkClick(e, 'about')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer inline-block"
              >
                Read Methodology & Standards
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
