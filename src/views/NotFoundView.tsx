import React from 'react';
import { ArrowLeft, Search, Calculator, Home } from 'lucide-react';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { TOOLS } from '../config/tools';

interface NotFoundViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch?: () => void;
  requestedRoute?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigate,
  onOpenSearch,
  requestedRoute,
}) => {
  const popularTools = TOOLS.filter((t) => t.isPopular);

  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      {/* 404 Kicker */}
      <span className="text-xs uppercase font-bold tracking-widest text-lime-700 block mb-2">
        Error 404 · Page Not Found
      </span>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0b2d21] tracking-tight mb-4">
        Calculator or Page Not Found
      </h1>

      <p className="text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
        The tool, category, or address you requested {requestedRoute ? <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-sm font-mono">{requestedRoute}</code> : ''} does not exist or may have been moved.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors bg-[#0b2d21] text-white hover:bg-[#071f16] cursor-pointer min-h-[40px]"
        >
          <Home className="w-4 h-4 text-lime-400" />
          <span>Return to Homepage</span>
        </a>

        <a
          href="/tools"
          onClick={(e) => handleLinkClick(e, 'all-tools')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer min-h-[40px]"
        >
          <Calculator className="w-4 h-4 text-slate-500" />
          <span>Browse All Calculators</span>
        </a>

        {onOpenSearch && (
          <Button
            variant="ghost"
            size="md"
            icon={<Search className="w-4 h-4 text-slate-500" />}
            onClick={onOpenSearch}
          >
            Search Tools (⌘K)
          </Button>
        )}
      </div>

      {/* Popular Tools Fallback Grid */}
      <div className="text-left pt-10 border-t border-slate-200">
        <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-4">
          Popular Working Calculators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <a
              key={tool.id}
              href={`/tools/${tool.slug}`}
              onClick={(e) => handleLinkClick(e, 'tool', tool.slug)}
              className="group block p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0b2d21] transition-all cursor-pointer"
            >
              <span className="block text-xs font-bold text-slate-900 group-hover:text-[#0b2d21] transition-colors mb-1">
                {tool.title}
              </span>
              <span className="block text-[11px] text-slate-500 line-clamp-2">
                {tool.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
