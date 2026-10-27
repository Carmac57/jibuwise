import React from 'react';
import { SITE_CONFIG } from '../config/site';
import { CATEGORIES } from '../config/categories';
import { TOOLS } from '../config/tools';
import { getPathForView } from '../utils/routes';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20 pb-20 md:pb-12 pt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Brand & Purpose */}
          <div className="md:col-span-1">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="flex items-center gap-2 mb-3 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0b2d21] flex items-center justify-center text-lime-400 font-bold text-sm">
                J
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0b2d21]">
                Jibu<span className="text-lime-600">Wise</span>
              </span>
            </a>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fast, transparent, and mobile-first practical tools built for real day-to-day decisions. Free forever with zero paywalls.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/category/${cat.id}`}
                    onClick={(e) => handleLinkClick(e, 'category', cat.id)}
                    className="hover:text-[#0b2d21] transition-colors cursor-pointer text-left block"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {TOOLS.slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <a
                    href={`/tools/${tool.slug}`}
                    onClick={(e) => handleLinkClick(e, 'tool', tool.slug)}
                    className="hover:text-[#0b2d21] transition-colors cursor-pointer text-left truncate max-w-full block"
                  >
                    {tool.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Standards & Legal
            </h4>
            <ul className="space-y-2 text-xs mb-4">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="hover:text-[#0b2d21] transition-colors cursor-pointer text-left block"
                >
                  Contact & Feedback
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick(e, 'privacy')}
                  className="hover:text-[#0b2d21] transition-colors cursor-pointer text-left block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick(e, 'terms')}
                  className="hover:text-[#0b2d21] transition-colors cursor-pointer text-left block"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => handleLinkClick(e, 'disclaimer')}
                  className="hover:text-[#0b2d21] transition-colors cursor-pointer text-left block"
                >
                  Statutory Disclaimer
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Mobile-Ready</span>
              <span aria-hidden="true">·</span>
              <span>Easy to Use</span>
              <span aria-hidden="true">·</span>
              <span>Privacy-Conscious</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <p className="max-w-3xl leading-relaxed">
            {SITE_CONFIG.disclaimer}
          </p>
          <div className="shrink-0 text-slate-500 font-medium">
            © {new Date().getFullYear()} JibuWise. Built for Kenya and beyond.
          </div>
        </div>
      </div>
    </footer>
  );
};
