/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './views/HomeView';
import { AllToolsView } from './views/AllToolsView';
import { CategoryView } from './views/CategoryView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsOfUseView } from './views/TermsOfUseView';
import { DisclaimerView } from './views/DisclaimerView';
import { NotFoundView } from './views/NotFoundView';
import { KenyaPayeCalculator } from './tools/KenyaPayeCalculator';
import { MpesaFeesCalculator } from './tools/MpesaFeesCalculator';
import { LoanMortgageCalculator } from './tools/LoanMortgageCalculator';
import { StampDutyCalculator } from './tools/StampDutyCalculator';
import { FuelCommuteCalculator } from './tools/FuelCommuteCalculator';
import { VatMarginCalculator } from './tools/VatMarginCalculator';
import { CategoryId } from './types';
import { getToolBySlug } from './config/tools';
import { CATEGORIES } from './config/categories';
import { parseRoute, getPathForView } from './utils/routes';

export interface AppProps {
  initialPath?: string;
}

export default function App({ initialPath }: AppProps = {}) {
  const [currentView, setCurrentView] = useState<string>(() => {
    const pathname = initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const initial = parseRoute(pathname, hash);
    return initial.view;
  });

  const [viewParam, setViewParam] = useState<string | undefined>(() => {
    const pathname = initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const initial = parseRoute(pathname, hash);
    return initial.param;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('KES');

  // Legacy hash migration on initial load
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const initial = parseRoute(window.location.pathname, window.location.hash);
      const cleanPath = initial.canonicalPath;
      window.history.replaceState(null, '', cleanPath);
      setCurrentView(initial.view);
      setViewParam(initial.param);
    }
  }, []);

  // Handle route changes and update browser History state
  const handleNavigate = useCallback((view: string, param?: string) => {
    let targetView = view;
    let targetParam = param;

    if (view === 'tool' && param) {
      const tool = getToolBySlug(param);
      if (tool) {
        targetParam = tool.slug;
      } else {
        targetView = 'not-found';
        targetParam = `/tools/${param}`;
      }
    } else if (view === 'category' && param) {
      const category = CATEGORIES.find((c) => c.id === param);
      if (category) {
        targetParam = category.id;
      } else {
        targetView = 'not-found';
        targetParam = `/category/${param}`;
      }
    }

    const targetPath = getPathForView(targetView, targetParam);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setCurrentView(targetView);
    setViewParam(targetParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRoute(window.location.pathname, window.location.hash);
      setCurrentView(parsed.view);
      setViewParam(parsed.param);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync document title, meta description, and canonical URL dynamically
  useEffect(() => {
    let title = 'JibuWise — Simple Tools. Clear Answers.';
    let description = 'Fast, free online calculators and practical everyday tools for Kenya and beyond. Accurate PAYE tax, M-Pesa fees, loans, land stamp duty, fuel costs, and VAT.';

    if (currentView === 'tool' && viewParam) {
      const tool = getToolBySlug(viewParam);
      if (tool) {
        title = `${tool.title} — JibuWise`;
        description = tool.seoDescription || tool.description;
      }
    } else if (currentView === 'category' && viewParam) {
      const category = CATEGORIES.find((c) => c.id === viewParam);
      if (category) {
        title = `${category.name} Calculators — JibuWise`;
        description = category.description;
      }
    } else if (currentView === 'all-tools') {
      title = 'All Online Calculators & Practical Tools — JibuWise';
      description = 'Complete directory of free financial, tax, salary, and business calculators built for Kenya and beyond.';
    } else if (currentView === 'about') {
      title = 'About JibuWise — Mission & Calculation Methodology';
      description = 'Learn about JibuWise, our commitment to transparent formulas, mobile ergonomics, and free public utility tools.';
    } else if (currentView === 'contact') {
      title = 'Contact & Rate Updates — JibuWise';
      description = 'Get in touch with the JibuWise team. Report statutory rate changes, suggest new calculators, or provide feedback.';
    } else if (currentView === 'privacy') {
      title = 'Privacy Policy — JibuWise';
      description = 'JibuWise privacy policy. All calculations run client-side in your browser; we do not store, track, or sell your financial figures.';
    } else if (currentView === 'terms') {
      title = 'Terms of Use — JibuWise';
      description = 'Terms governing access and free usage of JibuWise calculators and computational utilities.';
    } else if (currentView === 'disclaimer') {
      title = 'Statutory & Calculation Disclaimer — JibuWise';
      description = 'Important legal and regulatory notice on calculations for KRA PAYE, Safaricom tariffs, EPRA fuel prices, and property stamp duty.';
    } else if (currentView === 'not-found') {
      title = 'Page Not Found — JibuWise';
      description = 'The requested calculator or page could not be found on JibuWise.';
    }

    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    // Update canonical link to clean path
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const currentCanonicalUrl = `https://jibuwise.com${getPathForView(currentView, viewParam)}`;
    canonicalLink.setAttribute('href', currentCanonicalUrl);

    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', currentCanonicalUrl);
  }, [currentView, viewParam]);

  // Render current view
  const renderContent = () => {
    if (currentView === 'not-found') {
      return (
        <NotFoundView
          onNavigate={handleNavigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          requestedRoute={viewParam}
        />
      );
    }

    if (currentView === 'all-tools') {
      return <AllToolsView onNavigate={handleNavigate} />;
    }

    if (currentView === 'category' && viewParam) {
      return (
        <CategoryView
          categoryId={viewParam as CategoryId}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentView === 'about') {
      return <AboutView onNavigate={handleNavigate} />;
    }

    if (currentView === 'contact') {
      return <ContactView onNavigate={handleNavigate} />;
    }

    if (currentView === 'privacy') {
      return <PrivacyPolicyView onNavigate={handleNavigate} />;
    }

    if (currentView === 'terms') {
      return <TermsOfUseView onNavigate={handleNavigate} />;
    }

    if (currentView === 'disclaimer') {
      return <DisclaimerView onNavigate={handleNavigate} />;
    }

    if (currentView === 'tool' && viewParam) {
      switch (viewParam) {
        case 'kenya-paye':
        case 'kenya-paye-salary-calculator':
          return <KenyaPayeCalculator onNavigate={handleNavigate} />;
        case 'mpesa-fees':
        case 'mpesa-charges-calculator':
          return <MpesaFeesCalculator onNavigate={handleNavigate} />;
        case 'loan-mortgage':
        case 'loan-mortgage-emi-calculator':
          return <LoanMortgageCalculator onNavigate={handleNavigate} />;
        case 'stamp-duty':
        case 'kenya-stamp-duty-land-transfer-calculator':
          return <StampDutyCalculator onNavigate={handleNavigate} />;
        case 'fuel-commute':
        case 'fuel-cost-commute-calculator':
        case 'fuel-commute-cost-calculator':
          return <FuelCommuteCalculator onNavigate={handleNavigate} />;
        case 'vat-margin':
        case 'vat-margin-markup-calculator':
        case 'vat-profit-margin-markup-calculator':
          return <VatMarginCalculator onNavigate={handleNavigate} />;
        default:
          return (
            <NotFoundView
              onNavigate={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
              requestedRoute={viewParam}
            />
          );
      }
    }

    // Default: Home View
    return (
      <HomeView
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    );
  };

  const navKey = currentView === 'category' && viewParam
    ? `category:${viewParam}`
    : currentView === 'tool' && viewParam
    ? `tool:${viewParam}`
    : currentView;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-lime-200 selection:text-emerald-950">
      {/* Top Bar Contract (1-line wordmark - 4-5 single-line nav links - 1 primary action) */}
      <Header
        activeView={navKey}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedCurrency={selectedCurrency}
        onChangeCurrency={setSelectedCurrency}
      />

      {/* Main Page Content */}
      <main className="flex-1 pb-16 md:pb-0" id="main-content">
        {renderContent()}
      </main>

      {/* Site Footer with Essential Legal Links */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile-first bottom navigation bar */}
      <MobileNav
        activeView={navKey}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Fast Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(toolId) => handleNavigate('tool', toolId)}
      />
    </div>
  );
}
