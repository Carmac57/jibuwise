import React from 'react';
import { Search, Compass } from 'lucide-react';
import { getPathForView } from '../utils/routes';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  selectedCurrency: string;
  onChangeCurrency: (curr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onOpenSearch,
}) => {
  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark in display face */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none"
            aria-label="JibuWise Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0b2d21] flex items-center justify-center text-lime-400 font-bold text-lg shadow-xs group-hover:bg-[#071f16] transition-colors">
              J
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold tracking-tight text-[#0b2d21]">
                Jibu<span className="text-lime-600">Wise</span>
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="/tools"
              onClick={(e) => handleLinkClick(e, 'all-tools')}
              className={`hover:text-[#0b2d21] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                activeView === 'all-tools' ? 'text-[#0b2d21] font-semibold border-b-2 border-lime-500' : ''
              }`}
            >
              All Tools
            </a>
            <a
              href="/category/tax-salary"
              onClick={(e) => handleLinkClick(e, 'category', 'tax-salary')}
              className={`hover:text-[#0b2d21] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                activeView === 'category:tax-salary' ? 'text-[#0b2d21] font-semibold border-b-2 border-lime-500' : ''
              }`}
            >
              Tax & Salary
            </a>
            <a
              href="/tools/mpesa-charges-calculator"
              onClick={(e) => handleLinkClick(e, 'tool', 'mpesa-charges-calculator')}
              className={`hover:text-[#0b2d21] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                activeView === 'tool:mpesa-charges-calculator' || activeView === 'tool:mpesa-fees' ? 'text-[#0b2d21] font-semibold border-b-2 border-lime-500' : ''
              }`}
            >
              M-Pesa Rates
            </a>
            <a
              href="/tools/loan-mortgage-emi-calculator"
              onClick={(e) => handleLinkClick(e, 'tool', 'loan-mortgage-emi-calculator')}
              className={`hover:text-[#0b2d21] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                activeView === 'tool:loan-mortgage-emi-calculator' || activeView === 'tool:loan-mortgage' ? 'text-[#0b2d21] font-semibold border-b-2 border-lime-500' : ''
              }`}
            >
              Loan & EMI
            </a>
            <a
              href="/about"
              onClick={(e) => handleLinkClick(e, 'about')}
              className={`hover:text-[#0b2d21] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                activeView === 'about' ? 'text-[#0b2d21] font-semibold border-b-2 border-lime-500' : ''
              }`}
            >
              About
            </a>
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer border border-slate-200/60 min-h-[40px]"
              aria-label="Search all tools"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Search calculators...</span>
              <span className="hidden lg:inline text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                ⌘K
              </span>
            </button>

            <a
              href="/tools"
              onClick={(e) => handleLinkClick(e, 'all-tools')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d21] hover:bg-[#071f16] rounded-xl transition-colors cursor-pointer min-h-[40px]"
            >
              <Compass className="w-3.5 h-3.5 text-lime-400" />
              <span>Explore Tools</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
