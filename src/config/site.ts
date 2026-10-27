import { CurrencyConfig, RegionCode } from '../types';

export const SITE_CONFIG = {
  name: 'JibuWise',
  tagline: 'Simple tools. Clear answers.',
  domain: 'jibuwise.com',
  defaultRegion: 'KE' as RegionCode,
  defaultCurrency: 'KES',
  description: 'Fast, free online calculators and practical tools designed for Kenya and adaptable worldwide. Accurate, transparent, and mobile-ready.',
  disclaimer: 'Calculations are for informational and planning purposes only and reflect standard regulations (including Kenya KRA 2024/2025 tax acts, Safaricom tariffs, and standard financial banking equations). Please consult an accredited accountant, tax advisor, or legal advocate for formal filings.',
};

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', exchangeRateToKES: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRateToKES: 130 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRateToKES: 142 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRateToKES: 168 },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', exchangeRateToKES: 7.2 },
  UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', exchangeRateToKES: 0.035 },
  TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', exchangeRateToKES: 0.05 },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', exchangeRateToKES: 0.085 },
};

export function formatCurrency(amount: number, currencyCode: string = 'KES', decimals: number = 0): string {
  if (isNaN(amount) || !isFinite(amount)) return '0';
  const curr = SUPPORTED_CURRENCIES[currencyCode] || { symbol: currencyCode };
  const formattedNumber = Math.abs(amount).toLocaleString('en-KE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${curr.symbol} ${formattedNumber}`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
