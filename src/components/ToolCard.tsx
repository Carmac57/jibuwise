import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../types';
import { CATEGORIES } from '../config/categories';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const category = CATEGORIES.find((c) => c.id === tool.category);

  const handleClick = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelect(tool.slug);
    }
  };

  return (
    <a
      href={`/tools/${tool.slug}`}
      onClick={handleClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 sm:p-6 transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between block"
    >
      <div>
        {/* Zero-Pill unboxed metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
          <span className="font-medium text-[#0b2d21]">{category?.name}</span>
          <span aria-hidden="true">·</span>
          <span>{tool.region === 'KE' ? 'Kenya' : 'Universal'}</span>
          {tool.badge && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-lime-700 font-medium">{tool.badge}</span>
            </>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0b2d21] transition-colors mb-2 tracking-tight">
          {tool.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {tool.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0b2d21]">
        <span>Open Calculator</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
};
