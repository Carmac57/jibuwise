/**
 * JibuWise Kenya PAYE & Statutory Deductions Calculation Engine
 * 
 * Statutory References & Official Guidance:
 * 1. Kenya Revenue Authority (KRA) PAYE Technical Guidance:
 *    https://www.zd.kra.go.ke/individual/filing-paying/types-of-taxes/paye
 *    "Amounts deductible when determining taxable employment income:
 *     - Contributions made to the Social Health Insurance Fund (SHIF)
 *     - The Affordable Housing Levy (AHL) deducted pursuant to the Affordable Housing Act, 2024
 *     - Contributions to a registered pension or provident fund (up to KES 30,000/mo or KES 360,000/yr)
 *     - Contributions to NSSF"
 * 2. Income Tax Act (Cap 470) as amended by the Tax Laws (Amendment) Act, 2024:
 *    - Section 15(2): SHIF contributions and Affordable Housing Levy are allowable deductions
 *      against gross employment income when computing taxable income.
 *    - Section 31: Insurance Relief applies to qualifying private life, education (>= 10 yrs),
 *      and private medical insurance premiums (15% up to KES 5,000/mo). Mandatory SHIF contributions
 *      are deductible under Section 15 and do NOT claim Section 31 insurance relief (preventing double tax benefit).
 *    - Section 30A: Affordable Housing Relief was repealed / does not apply when AHL is deducted under Section 15.
 * 3. NSSF Act 2013: Notice to Employers Year 4 (2026) Contribution Rates (LEL KES 9,000 / UEL KES 108,000, max KES 6,480):
 *    https://www.nssf.or.ke/notice-to-employers-year-4-2026-nssf-contribution-rates/
 */

export type NssfSchedule = 'year4' | 'year3' | 'year2';

export interface NssfTierConfig {
  id: NssfSchedule;
  name: string;
  shortName: string;
  effectivePeriod: string;
  status: 'current' | 'historical';
  lowerLimit: number; // Tier I max
  upperLimit: number; // Tier II max
  rate: number; // 0.06
  maxTier1: number;
  maxTier2: number;
  maxEmployeeTotal: number;
  sourceUrl: string;
}

export const NSSF_SCHEDULES: Record<NssfSchedule, NssfTierConfig> = {
  year4: {
    id: 'year4',
    name: 'Year 4 (2026) — Current Default',
    shortName: 'Year 4 (2026)',
    effectivePeriod: 'Effective February 2026 – Present',
    status: 'current',
    lowerLimit: 9000,
    upperLimit: 108000,
    rate: 0.06,
    maxTier1: 540,
    maxTier2: 5940,
    maxEmployeeTotal: 6480,
    sourceUrl: 'https://www.nssf.or.ke/notice-to-employers-year-4-2026-nssf-contribution-rates/',
  },
  year3: {
    id: 'year3',
    name: 'Year 3 (2025) — Historical',
    shortName: 'Year 3 (2025)',
    effectivePeriod: 'Effective Feb 2025 – Jan 2026',
    status: 'historical',
    lowerLimit: 8000,
    upperLimit: 72000,
    rate: 0.06,
    maxTier1: 480,
    maxTier2: 3840,
    maxEmployeeTotal: 4320,
    sourceUrl: 'https://www.nssf.or.ke/',
  },
  year2: {
    id: 'year2',
    name: 'Year 2 (2024) — Historical',
    shortName: 'Year 2 (2024)',
    effectivePeriod: 'Effective Feb 2024 – Jan 2025',
    status: 'historical',
    lowerLimit: 7000,
    upperLimit: 36000,
    rate: 0.06,
    maxTier1: 420,
    maxTier2: 1740,
    maxEmployeeTotal: 2160,
    sourceUrl: 'https://www.nssf.or.ke/',
  },
};

export interface PayeInputs {
  basicSalary: number;
  benefits?: number;
  voluntaryPension?: number;
  nssfSchedule?: NssfSchedule;
  insuranceScheme?: 'shif' | 'nhif';
  housingLevyEnabled?: boolean;
  hasDisabilityExemption?: boolean;
  qualifyingInsurancePremium?: number; // Optional qualifying private life, education (>= 10 yrs), or medical policies under Sec 31
}

export interface PayeResult {
  gross: number;
  nssfTier1: number;
  nssfTier2: number;
  totalNssf: number;
  nssfScheduleUsed: NssfTierConfig;
  healthInsurance: number;
  housingLevy: number;
  allowablePension: number;
  totalAllowableDeductions: number;
  taxablePay: number;
  grossTax: number;
  personalRelief: number;
  insuranceRelief: number;
  housingRelief: number;
  totalRelief: number;
  payeTax: number;
  totalDeductions: number;
  netPay: number;
  effectiveTaxRate: number;
  totalDeductionRate: number;
  takeHomePercent: number;
  statutoryTreatment: {
    shifDeductible: boolean;
    housingLevyDeductible: boolean;
    housingReliefApplied: boolean;
    shifInsuranceReliefApplied: boolean;
  };
}

/**
 * Calculates NSSF Tier I and Tier II contributions strictly according to NSSF Act 2013 schedules.
 */
export function calculateNssf(gross: number, scheduleKey: NssfSchedule = 'year4'): {
  tier1: number;
  tier2: number;
  total: number;
  config: NssfTierConfig;
} {
  const config = NSSF_SCHEDULES[scheduleKey] || NSSF_SCHEDULES.year4;
  const clampedGross = Math.max(0, gross);

  // Tier 1: 6% of earnings up to lower limit (LEL)
  const tier1Subject = Math.min(clampedGross, config.lowerLimit);
  const tier1 = Math.round(tier1Subject * config.rate * 100) / 100;

  // Tier 2: 6% of earnings between LEL and upper limit (UEL)
  let tier2 = 0;
  if (clampedGross > config.lowerLimit) {
    const tier2Subject = Math.min(clampedGross, config.upperLimit) - config.lowerLimit;
    tier2 = Math.round(tier2Subject * config.rate * 100) / 100;
  }

  const total = Math.round((tier1 + tier2) * 100) / 100;

  return { tier1, tier2, total, config };
}

/**
 * Main Kenya PAYE tax, statutory deductions, reliefs, and net salary calculator.
 * Conforms to KRA PAYE guidelines and Tax Laws (Amendment) Act 2024.
 */
export function calculateKenyaPaye(inputs: PayeInputs): PayeResult {
  const basic = Math.max(0, inputs.basicSalary || 0);
  const allow = Math.max(0, inputs.benefits || 0);
  const gross = basic + allow;

  const nssfScheduleKey = inputs.nssfSchedule || 'year4';
  const nssfResult = calculateNssf(gross, nssfScheduleKey);

  // Health Insurance: SHIF @ 2.75% (minimum KES 300 per month) or legacy NHIF scale
  const scheme = inputs.insuranceScheme || 'shif';
  const isCurrentScheme = scheme === 'shif';
  let healthInsurance = 0;
  if (isCurrentScheme) {
    healthInsurance = gross > 0 ? Math.max(300, Math.round(gross * 0.0275 * 100) / 100) : 0;
  } else {
    // Legacy NHIF scale
    if (gross <= 0) healthInsurance = 0;
    else if (gross <= 5999) healthInsurance = 150;
    else if (gross <= 7999) healthInsurance = 300;
    else if (gross <= 11999) healthInsurance = 400;
    else if (gross <= 14999) healthInsurance = 500;
    else if (gross <= 19999) healthInsurance = 600;
    else if (gross <= 24999) healthInsurance = 750;
    else if (gross <= 29999) healthInsurance = 850;
    else if (gross <= 49999) healthInsurance = 1000;
    else if (gross <= 99999) healthInsurance = 1500;
    else healthInsurance = 1700;
  }

  // Affordable Housing Levy: 1.5% of gross
  const housingEnabled = inputs.housingLevyEnabled !== false;
  const housingLevy = housingEnabled && gross > 0 ? Math.round(gross * 0.015 * 100) / 100 : 0;

  // Allowable voluntary pension deduction: up to KES 30,000 per month under Tax Laws (Amendment) Act 2024 (previously KES 20,000)
  const rawPension = Math.max(0, inputs.voluntaryPension || 0);
  const allowablePension = Math.min(30000, rawPension);

  // Allowable pre-tax deductions under Section 15(2) of the Income Tax Act:
  // - NSSF contributions
  // - SHIF contributions (deductible when determining taxable employment income per KRA guidelines)
  // - Affordable Housing Levy (deductible under Section 15(2) per Affordable Housing Act 2024 & Tax Laws Amendment Act)
  // - Registered Pension contributions (up to KES 30,000/mo)
  const deductibleNssf = nssfResult.total;
  const deductibleShif = isCurrentScheme ? healthInsurance : 0;
  const deductibleHousing = housingEnabled ? housingLevy : 0;

  const totalAllowableDeductions = Math.round(
    (deductibleNssf + deductibleShif + deductibleHousing + allowablePension) * 100
  ) / 100;

  // Taxable Employment Income
  let taxablePay = Math.max(0, gross - totalAllowableDeductions);

  // Disability Exemption: first KES 150,000 exempt under certified NCPWD/KRA status
  if (inputs.hasDisabilityExemption) {
    taxablePay = Math.max(0, taxablePay - 150000);
  }
  taxablePay = Math.round(taxablePay * 100) / 100;

  // KRA Progressive Monthly Tax Brackets
  // Band 1: First 24,000 @ 10%
  // Band 2: Next 8,333.33 (24,001 - 32,333.33) @ 25%
  // Band 3: Next 467,666.67 (32,333.34 - 500,000) @ 30%
  // Band 4: Next 300,000 (500,001 - 800,000) @ 32.5%
  // Band 5: Above 800,000 @ 35%
  let grossTax = 0;
  let remainingTaxable = taxablePay;

  const b1 = Math.min(remainingTaxable, 24000);
  grossTax += b1 * 0.10;
  remainingTaxable = Math.max(0, remainingTaxable - 24000);

  const b2 = Math.min(remainingTaxable, 8333.33);
  grossTax += b2 * 0.25;
  remainingTaxable = Math.max(0, remainingTaxable - 8333.33);

  const b3 = Math.min(remainingTaxable, 467666.67);
  grossTax += b3 * 0.30;
  remainingTaxable = Math.max(0, remainingTaxable - 467666.67);

  const b4 = Math.min(remainingTaxable, 300000);
  grossTax += b4 * 0.325;
  remainingTaxable = Math.max(0, remainingTaxable - 300000);

  if (remainingTaxable > 0) {
    grossTax += remainingTaxable * 0.35;
  }
  grossTax = Math.round(grossTax * 100) / 100;

  // Statutory Tax Reliefs:
  // Personal Relief: KES 2,400/month for resident individuals
  const personalRelief = gross > 0 ? 2400 : 0;

  // Insurance Relief under Section 31:
  // - 15% of qualifying insurance premiums paid for life, education (>= 10 yrs), or private health policies (capped at KES 5,000/mo)
  // - If legacy NHIF is selected, NHIF qualifies for 15% insurance relief under historical rules
  // - SHIF does NOT receive Section 31 insurance relief because it is an allowable pre-tax deduction under Section 15(2).
  const privateInsurance = Math.max(0, inputs.qualifyingInsurancePremium || 0);
  let qualifyingInsuranceBase = privateInsurance;
  if (!isCurrentScheme) {
    qualifyingInsuranceBase += healthInsurance;
  }
  const insuranceRelief = Math.min(5000, Math.round(qualifyingInsuranceBase * 0.15 * 100) / 100);

  // Housing Relief under Section 30A:
  // Repealed by the Tax Laws (Amendment) Act 2024 because Affordable Housing Levy is now an allowable deduction under Section 15(2).
  const housingRelief = 0;

  const totalRelief = Math.round((personalRelief + insuranceRelief + housingRelief) * 100) / 100;

  // Net PAYE Tax payable to KRA
  const payeTax = Math.max(0, Math.round((grossTax - totalRelief) * 100) / 100);

  // Total statutory deductions from gross salary:
  // PAYE Tax + NSSF + Health Insurance + Housing Levy + Allowable Pension
  const totalDeductions = Math.round(
    (payeTax + nssfResult.total + healthInsurance + housingLevy + allowablePension) * 100
  ) / 100;

  // Net take-home pay: Gross - Total Deductions
  const netPay = Math.max(0, Math.round((gross - totalDeductions) * 100) / 100);

  const effectiveTaxRate = gross > 0 ? Math.round((payeTax / gross) * 1000) / 10 : 0;
  const totalDeductionRate = gross > 0 ? Math.round((totalDeductions / gross) * 1000) / 10 : 0;
  const takeHomePercent = gross > 0 ? Math.round((netPay / gross) * 1000) / 10 : 0;

  return {
    gross,
    nssfTier1: nssfResult.tier1,
    nssfTier2: nssfResult.tier2,
    totalNssf: nssfResult.total,
    nssfScheduleUsed: nssfResult.config,
    healthInsurance,
    housingLevy,
    allowablePension,
    totalAllowableDeductions,
    taxablePay,
    grossTax,
    personalRelief,
    insuranceRelief,
    housingRelief,
    totalRelief,
    payeTax,
    totalDeductions,
    netPay,
    effectiveTaxRate,
    totalDeductionRate,
    takeHomePercent,
    statutoryTreatment: {
      shifDeductible: isCurrentScheme,
      housingLevyDeductible: housingEnabled,
      housingReliefApplied: housingRelief > 0,
      shifInsuranceReliefApplied: !isCurrentScheme,
    },
  };
}
