import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../config/categories';
import { getToolsByCategory } from '../config/tools';
import { ToolCard } from '../components/ToolCard';
import { CategoryId } from '../types';

interface CategoryViewProps {
  categoryId: CategoryId;
  onNavigate: (view: string, param?: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ categoryId, onNavigate }) => {
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const tools = getToolsByCategory(category.id);

  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <a
          href="/tools"
          onClick={(e) => handleLinkClick(e, 'all-tools')}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Categories
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>Category Directory</span>
          <span aria-hidden="true">·</span>
          <span>{tools.length} {tools.length === 1 ? 'Calculator' : 'Calculators'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b2d21] tracking-tight">
          {category.name}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Category Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onSelect={(slug) => onNavigate('tool', slug)}
          />
        ))}
      </div>

      {/* Back button */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <a
          href="/tools"
          onClick={(e) => handleLinkClick(e, 'all-tools')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b2d21] hover:text-lime-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </a>
      </div>
    </div>
  );
};
