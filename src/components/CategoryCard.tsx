import React from 'react';
import { Receipt, Wallet, Building2, TrendingUp, Fuel, ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { getToolsByCategory } from '../config/tools';

interface CategoryCardProps {
  category: Category;
  onSelect: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const tools = getToolsByCategory(category.id);

  const handleClick = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelect(category.id);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-emerald-800" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-lime-800" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-teal-800" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-green-800" />;
      case 'Fuel':
        return <Fuel className="w-5 h-5 text-amber-800" />;
      default:
        return <Receipt className="w-5 h-5 text-[#0b2d21]" />;
    }
  };

  return (
    <a
      href={`/category/${category.id}`}
      onClick={handleClick}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 sm:p-6 transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between block"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-lime-50 transition-colors">
            {getIcon(category.icon)}
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono-numbers">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0b2d21] transition-colors mb-1.5">
          {category.name}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {category.description}
        </p>
      </div>

      <div className="flex items-center text-xs font-semibold text-[#0b2d21] gap-1 group-hover:gap-1.5 transition-all">
        <span>Browse category</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </a>
  );
};
