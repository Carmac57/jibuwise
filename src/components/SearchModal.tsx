import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { CATEGORIES } from '../config/categories';
import { ToolDefinition } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const filteredTools = normalizedQuery
    ? TOOLS.filter((tool) => {
        return (
          tool.title.toLowerCase().includes(normalizedQuery) ||
          tool.shortTitle.toLowerCase().includes(normalizedQuery) ||
          tool.description.toLowerCase().includes(normalizedQuery) ||
          tool.keywords.some((k) => k.toLowerCase().includes(normalizedQuery))
        );
      })
    : TOOLS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools (e.g., PAYE, M-Pesa, loan, stamp duty, VAT)..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded border border-slate-200 cursor-pointer hidden sm:block"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredTools.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              <p>No calculators found matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for salary, tax, interest, fuel, or property.
              </p>
            </div>
          ) : (
            filteredTools.map((tool) => {
              const category = CATEGORIES.find((c) => c.id === tool.category);
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.slug);
                    onClose();
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#0b2d21]">
                        {tool.title}
                      </span>
                      {tool.badge && (
                        <span className="text-[10px] text-lime-700 font-medium">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{category?.name || 'Tool'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="line-clamp-1">{tool.description}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-slate-300 group-hover:text-[#0b2d21] group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filteredTools.length} calculators available</span>
          <span className="flex items-center gap-1">
            <span>Select with</span> <CornerDownLeft className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
