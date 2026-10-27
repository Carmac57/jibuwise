import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'tax-salary',
    name: 'Tax & Salary',
    description: 'Calculate net pay, PAYE brackets, statutory reliefs, SHIF, and housing levy.',
    icon: 'Receipt',
    color: 'emerald',
  },
  {
    id: 'money-banking',
    name: 'Money & Banking',
    description: 'M-Pesa tariffs, bank transfers, savings interest, and loan amortization.',
    icon: 'Wallet',
    color: 'lime',
  },
  {
    id: 'property-land',
    name: 'Property & Land',
    description: 'Stamp duty, legal conveyance fees, title registration, and mortgage estimates.',
    icon: 'Building2',
    color: 'teal',
  },
  {
    id: 'business-trade',
    name: 'Business & Trade',
    description: 'VAT calculations, gross profit margins, markups, and break-even pricing.',
    icon: 'TrendingUp',
    color: 'green',
  },
  {
    id: 'travel-fuel',
    name: 'Travel & Fuel',
    description: 'Trip fuel consumption, commute budgets, carpool splits, and distance costs.',
    icon: 'Fuel',
    color: 'amber',
  },
];
