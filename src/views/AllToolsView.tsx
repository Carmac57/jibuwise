import React, { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { TOOLS } from '../config/tools';
import { CATEGORIES } from '../config/categories';
import { ToolCard } from '../components/ToolCard';
import { SegmentedControl } from '../design-system/SegmentedControl';

interface AllToolsViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AllToolsView: React.FC<AllToolsViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'ke' | 'global'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  const filteredTools = TOOLS.filter((tool) => {
    // Category filter
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
      return false;
    }
    // Region filter
    if (selectedRegion === 'ke' && tool.region !== 'KE') return false;
    if (selectedRegion === 'global' && tool.region !== 'GLOBAL') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium">All Calculators</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>Complete Calculator Directory</span>
          <span aria-hidden="true">·</span>
          <span>{TOOLS.length} Verified Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b2d21] tracking-tight">
          All Online Calculators & Practical Tools
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore our complete suite of free financial and practical calculators. Built with precision formulas for Kenyan taxpayers, businesses, and everyday savers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword (e.g. tax, interest, fuel, stamp)..."
              className="w-full min-h-[40px] pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0b2d21]"
            />
          </div>

          {/* Region selector */}
          <div className="sm:w-64">
            <SegmentedControl
              value={selectedRegion}
              onChange={(v) => setSelectedRegion(v as 'all' | 'ke' | 'global')}
              options={[
                { value: 'all', label: 'All Regions' },
                { value: 'ke', label: 'Kenya (KSh)' },
                { value: 'global', label: 'Universal' },
              ]}
            />
          </div>
        </div>

        {/* Category horizontal filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#0b2d21] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            All Categories ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0b2d21] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-1">No calculators matched your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search keyword or switching category tabs.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedRegion('all');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#0b2d21] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={(slug) => onNavigate('tool', slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
