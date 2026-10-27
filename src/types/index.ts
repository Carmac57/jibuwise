export type RegionCode = 'KE' | 'GLOBAL' | 'UG' | 'TZ' | 'NG' | 'ZA' | 'US' | 'UK';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  exchangeRateToKES?: number; // Approximate baseline for conversion hints
}

export type CategoryId = 'tax-salary' | 'money-banking' | 'property-land' | 'business-trade' | 'travel-fuel';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: CategoryId;
  description: string;
  seoDescription: string;
  region: 'KE' | 'GLOBAL';
  badge?: string;
  isPopular?: boolean;
  keywords: string[];
  lastUpdated: string;
  formulaNote?: string;
  faqs: FAQItem[];
}
