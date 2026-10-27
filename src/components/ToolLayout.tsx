import React, { useState } from 'react';
import { ChevronRight, Share2, Printer, RotateCcw, Check, HelpCircle, ChevronDown, BookOpen } from 'lucide-react';
import { ToolDefinition } from '../types';
import { CATEGORIES } from '../config/categories';
import { TOOLS } from '../config/tools';
import { ToolCard } from './ToolCard';
import { Card } from '../design-system/Card';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: {
    inputs: React.ReactNode;
    results: React.ReactNode;
    breakdown?: React.ReactNode;
  };
  onReset: () => void;
  onNavigate: (view: string, param?: string) => void;
  summaryTextForCopy?: string;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  children,
  onReset,
  onNavigate,
  summaryTextForCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 2);

  const handleLinkClick = (e: React.MouseEvent, view: string, param?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(view, param);
    }
  };

  const handleCopy = () => {
    const directUrl = `${window.location.origin}/tools/${tool.slug}`;
    const textToCopy = summaryTextForCopy
      ? `${summaryTextForCopy}\n\nLink: ${directUrl}`
      : `${tool.title} on JibuWise: ${directUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
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
          href={`/category/${category?.id || 'all'}`}
          onClick={(e) => handleLinkClick(e, 'category', category?.id)}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          {category?.name || 'Category'}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{tool.shortTitle}</span>
      </nav>

      {/* Tool Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div className="max-w-3xl">
          {/* Zero-Pill text metadata with typographic separator */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>{category?.name}</span>
            <span aria-hidden="true">·</span>
            <span>{tool.region === 'KE' ? 'Kenya Statutory Rules' : 'Universal Calculation'}</span>
            {tool.badge && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-lime-700 font-medium">{tool.badge}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b2d21] tracking-tight text-balance">
            {tool.title}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="Reset to defaults"
            aria-label="Reset calculator inputs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="Copy calculation summary"
            aria-label="Copy calculation summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-lime-600" />
                <span className="text-lime-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
            title="Print or save as PDF"
            aria-label="Print calculator result"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-14">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="md" variant="default">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Calculator Inputs</span>
              <span className="text-[11px] font-normal text-slate-400">Live Updating</span>
            </h2>
            {children.inputs}
          </Card>
        </div>

        {/* Right Column: Live Results & Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <Card padding="md" variant="default">
            <h2 className="text-sm font-bold text-[#0b2d21] uppercase tracking-wider mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Calculation Results</span>
              <span className="text-[11px] font-normal text-slate-400">Updated Instantly</span>
            </h2>
            {children.results}
          </Card>

          {children.breakdown && (
            <Card padding="md" variant="muted">
              {children.breakdown}
            </Card>
          )}
        </div>
      </div>

      {/* Explanation & Statutory Method Section */}
      {tool.formulaNote && (
        <section className="mb-14 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#0b2d21]" />
            <h2 className="text-lg font-bold text-[#0b2d21]">
              How This Calculation Works & Statutory Guidelines
            </h2>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-sm text-slate-700 leading-relaxed">
            <p className="mb-3">{tool.formulaNote}</p>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-slate-200/60">
              <span>Verified for accuracy</span>
              <span>·</span>
              <span>Last standard review: {tool.lastUpdated}</span>
              <span>·</span>
              <span>Formula transparency guarantee</span>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle className="w-4 h-4 text-[#0b2d21]" />
            <h2 className="text-lg font-bold text-[#0b2d21]">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {tool.faqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left gap-4 font-semibold text-sm text-slate-900 hover:text-[#0b2d21] cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180 text-[#0b2d21]' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-lg font-bold text-[#0b2d21] mb-5">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                onSelect={(slug) => onNavigate('tool', slug)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
