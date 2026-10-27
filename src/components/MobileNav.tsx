import React from 'react';
import { Home, Grid, Search, Receipt } from 'lucide-react';

interface MobileNavProps {
  activeView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-center select-none ${
            activeView === 'home' ? 'text-[#0b2d21] font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-lime-600' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </a>

        <a
          href="/tools"
          onClick={(e) => handleLinkClick(e, 'all-tools')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-center select-none ${
            activeView === 'all-tools' ? 'text-[#0b2d21] font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="All Tools"
        >
          <Grid className={`w-5 h-5 ${activeView === 'all-tools' ? 'text-lime-600' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Tools</span>
        </a>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-center text-slate-500 hover:text-slate-800 select-none cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Search</span>
        </button>

        <a
          href="/tools/kenya-paye-salary-calculator"
          onClick={(e) => handleLinkClick(e, 'tool', 'kenya-paye-salary-calculator')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-center select-none ${
            activeView === 'tool:kenya-paye-salary-calculator' || activeView === 'tool:kenya-paye' ? 'text-[#0b2d21] font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="PAYE Calculator"
        >
          <Receipt className={`w-5 h-5 ${activeView === 'tool:kenya-paye-salary-calculator' || activeView === 'tool:kenya-paye' ? 'text-lime-600' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">PAYE</span>
        </a>
      </div>
    </nav>
  );
};
