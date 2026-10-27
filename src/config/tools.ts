import { ToolDefinition } from '../types';

export const TOOLS: ToolDefinition[] = [
  {
    id: 'kenya-paye',
    slug: 'kenya-paye-salary-calculator',
    title: 'Kenya PAYE & Net Salary Calculator',
    shortTitle: 'PAYE Tax & Net Pay',
    category: 'tax-salary',
    description: 'Calculate your exact net take-home salary under KRA PAYE tax, official Year 4 (2026) NSSF rates (max KES 6,480), pre-tax SHIF (2.75%), and pre-tax Affordable Housing Levy (1.5%) under the Tax Laws (Amendment) Act.',
    seoDescription: 'Accurate Kenya PAYE calculator updated with official Year 4 (2026) NSSF rates, SHIF allowable pre-tax deduction, KRA tax bands, and Affordable Housing Levy.',
    region: 'KE',
    isPopular: true,
    badge: 'Updated: Year 4 (2026) NSSF & SHIF',
    keywords: ['paye', 'net salary', 'kra tax', 'kenya salary calculator', 'nssf year 4 2026', 'shif deduction', 'housing levy', 'nssf 6480', 'personal relief', 'payslip'],
    lastUpdated: 'February 2026 NSSF Notice & KRA PAYE Rules',
    formulaNote: 'Calculated using KRA Tax Act progressive brackets (10% to 35%), NSSF Act 2013 Year 4 (2026) notice (LEL KES 9,000 / UEL KES 108,000, max employee contribution KES 6,480), SHIF @ 2.75% of gross pay as an allowable deduction under Section 15(2), Affordable Housing Levy @ 1.5% as an allowable deduction under Section 15(2), KES 2,400 monthly personal relief, and Section 31 qualifying private insurance relief (15% up to KES 5,000/mo).',
    faqs: [
      {
        question: 'What are the official NSSF Year 4 (2026) contribution rates?',
        answer: 'Effective February 2026, the Lower Earnings Limit (LEL) is KES 9,000 (Tier I: 6% = max KES 540) and the Upper Earnings Limit (UEL) is KES 108,000 (Tier II: 6% = max KES 5,940). The total maximum employee contribution is KES 6,480 per month, matched equally by the employer.'
      },
      {
        question: 'What are the current KRA PAYE tax bands in Kenya?',
        answer: 'Monthly taxable income is taxed progressively: First KES 24,000 at 10%, next KES 8,333.33 at 25%, next KES 467,666.67 at 30%, next KES 300,000 at 32.5%, and any amount above KES 800,000 at 35%.'
      },
      {
        question: 'How is SHIF (Social Health Insurance Fund) treated for PAYE?',
        answer: 'Under the Social Health Insurance Act and official KRA PAYE technical guidance, SHIF contributions (2.75% of gross income, minimum KES 300) are an allowable deduction under Section 15(2) of the Income Tax Act. They reduce gross taxable employment income before PAYE tax brackets are applied, rather than acting as a separate insurance relief.'
      },
      {
        question: 'How is the Affordable Housing Levy (AHL) treated for PAYE?',
        answer: 'Under the Affordable Housing Act 2024 and Tax Laws (Amendment) Act 2024, the employee 1.5% Affordable Housing Levy is an allowable deduction in determining taxable employment income under Section 15(2). Consequently, Section 30A Affordable Housing Relief ceased to apply to avoid double tax benefits.'
      },
      {
        question: 'What is the monthly Personal Relief in Kenya?',
        answer: 'All resident employees receive a statutory personal relief of KES 2,400 per month (KES 28,800 per year) directly deducted from their gross tax liability.'
      }
    ]
  },
  {
    id: 'mpesa-fees',
    slug: 'mpesa-charges-calculator',
    title: 'M-Pesa Transaction & Withdrawal Calculator',
    shortTitle: 'M-Pesa Tariffs & Fees',
    category: 'money-banking',
    description: 'Find exact Safaricom M-Pesa transaction costs for sending money to registered/unregistered numbers, withdrawing from an agent or ATM, and reverse calculating send amounts.',
    seoDescription: 'Free M-Pesa tariff calculator. Check current Safaricom charges for agent withdrawals, P2P transfers, and reverse transfer calculations.',
    region: 'KE',
    isPopular: true,
    keywords: ['mpesa charges', 'mpesa withdrawal fee', 'safaricom tariffs', 'send money fee', 'agent fee', 'atm withdrawal', 'fuliza'],
    lastUpdated: '2024 Tariffs',
    formulaNote: 'Based on official Safaricom M-Pesa published tariff bands. Includes reverse calculator to compute exact amount to send so recipient receives net amount after withdrawal fees.',
    faqs: [
      {
        question: 'Is sending KES 100 or less free on M-Pesa?',
        answer: 'Yes, transfers of KES 1 to KES 100 between registered M-Pesa users have zero transaction fee.'
      },
      {
        question: 'What is the maximum M-Pesa transaction and account limit?',
        answer: 'The maximum single transaction limit is KES 250,000 and the maximum daily account holding/transaction limit is KES 500,000.'
      },
      {
        question: 'How does the Reverse Send Calculator work?',
        answer: 'If you want someone to withdraw an exact amount from an agent (e.g., KES 5,000), JibuWise adds the recipient’s agent withdrawal fee (KES 69) so you send KES 5,069.'
      }
    ]
  },
  {
    id: 'loan-mortgage',
    slug: 'loan-mortgage-emi-calculator',
    title: 'Loan & Mortgage EMI Calculator',
    shortTitle: 'Loan & EMI Repayment',
    category: 'money-banking',
    description: 'Calculate monthly loan repayments (EMI), total interest paid, loan payoff date, and complete month-by-month principal amortization breakdown in KES, USD, or any currency.',
    seoDescription: 'Accurate loan repayment and mortgage EMI calculator. Plan bank loans, SACCO loans, asset financing, and home mortgages with amortization schedules.',
    region: 'GLOBAL',
    isPopular: true,
    keywords: ['loan calculator', 'mortgage emi', 'sacco loan', 'bank loan repayment', 'interest rate', 'amortization schedule', 'reducing balance'],
    lastUpdated: 'Standard Banking Formula',
    formulaNote: 'Uses standard reducing-balance annuity formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is Principal, r is periodic interest rate, and n is number of repayment periods.',
    faqs: [
      {
        question: 'What is the difference between Flat Rate and Reducing Balance?',
        answer: 'A reducing balance loan calculates interest only on the remaining unpaid principal each month, decreasing interest as you repay. A flat rate loan charges interest on the initial total borrowing amount throughout the life of the loan.'
      },
      {
        question: 'Can I use this for SACCO or commercial bank loans in Kenya?',
        answer: 'Yes. Most SACCOs and Kenyan banks (such as KCB, Equity, Stanbic, Co-op) use reducing balance compounding for mortgages, personal loans, and asset financing.'
      }
    ]
  },
  {
    id: 'stamp-duty',
    slug: 'kenya-stamp-duty-land-transfer-calculator',
    title: 'Kenya Stamp Duty & Land Transfer Calculator',
    shortTitle: 'Stamp Duty & Land Transfer',
    category: 'property-land',
    description: 'Estimate legal fees, government stamp duty (4% urban vs 2% rural), title transfer charges, valuation fees, and total closing costs when buying land or property in Kenya.',
    seoDescription: 'Kenya stamp duty and property closing cost calculator. Calculate land transfer costs, Ardhisasa registration fees, and legal conveyance fees.',
    region: 'KE',
    isPopular: false,
    keywords: ['stamp duty kenya', 'land transfer fees', 'property conveyance', 'advocate legal fees', 'ardhisasa', 'title deed transfer', 'real estate kenya'],
    lastUpdated: 'Stamp Duty Act (Cap 480)',
    formulaNote: 'Stamp duty is statutory at 4% for urban/municipal properties and 2% for agricultural/rural properties. Legal conveyance follows the Advocates Remuneration Order scale estimate.',
    faqs: [
      {
        question: 'When is 4% vs 2% stamp duty applied in Kenya?',
        answer: 'Property located within declared municipalities, cities, and urban areas (e.g., Nairobi, Mombasa, Kisumu, Nakuru, Eldoret) attracts 4% stamp duty. Property outside urban municipalities in agricultural or rural zoning attracts 2%.'
      },
      {
        question: 'What other costs are incurred during property transfer?',
        answer: 'In addition to stamp duty, buyers typically pay legal conveyance fees (1% to 2%), government valuation inspection fees, registration fees at the lands registry (Ardhisasa), and search fees.'
      }
    ]
  },
  {
    id: 'fuel-commute',
    slug: 'fuel-cost-commute-calculator',
    title: 'Fuel & Trip Commute Cost Calculator',
    shortTitle: 'Fuel & Commute Costs',
    category: 'travel-fuel',
    description: 'Calculate fuel expenditure for road trips, daily office commutes, and safari travels. Features verified EPRA Nairobi maximum pump price benchmarks (Oct–Nov 2026), manual pump station entry, and carpool splitting.',
    seoDescription: 'Free fuel and commute cost calculator for Kenya. Features EPRA maximum pump benchmarks, trip costs, liters consumed, cost per km, and carpool splits.',
    region: 'GLOBAL',
    isPopular: false,
    badge: 'EPRA Oct–Nov 2026 Benchmark',
    keywords: ['fuel calculator', 'commute cost', 'epra fuel prices', 'nairobi pump prices', 'trip cost', 'petrol diesel cost', 'carpool split', 'cost per km'],
    lastUpdated: '15 Oct – 14 Nov 2026 EPRA Cycle',
    formulaNote: 'Liters consumed = (Total km ÷ km/L) or (Total km × L/100km ÷ 100). Total Cost = Liters × Price per liter. EPRA gazetted maximum retail pump prices (Nairobi cycle: 15 Oct – 14 Nov 2026) are Super Petrol KES 214.03/L, Diesel (AGO) KES 217.86/L, and Kerosene KES 191.38/L. Users outside Nairobi can enter their local station pump price to reflect transport differentials.',
    faqs: [
      {
        question: 'What are the current EPRA fuel pump prices in Nairobi?',
        answer: 'For the pricing cycle running from 15 October 2026 to 14 November 2026, the Energy and Petroleum Regulatory Authority (EPRA) announced maximum retail pump prices in Nairobi at KES 214.03 per litre for Super Petrol (PMS), KES 217.86 per litre for Diesel (AGO), and KES 191.38 per litre for Illuminating Kerosene (IK).'
      },
      {
        question: 'Why do fuel prices vary across different Kenyan towns?',
        answer: 'EPRA maximum prices vary across towns (e.g. Mombasa, Nairobi, Nakuru, Kisumu, Eldoret) based on pipeline transportation and road tanker freight costs from the Port of Mombasa. JibuWise allows you to type your local station pump price directly.'
      },
      {
        question: 'How do I estimate vehicle fuel consumption in km/L?',
        answer: 'Standard compact hatchbacks (Demio, Vitz, Note) typically achieve 14–18 km/L; mid-size sedans and station wagons (Axio, Fielder, Premio) average 12–15 km/L; crossovers and SUVs average 9–13 km/L; large 4WDs average 6–9 km/L depending on traffic.'
      },
      {
        question: 'How does the carpool split calculation work?',
        answer: 'Enter your one-way or round-trip distance and number of passengers. JibuWise divides total fuel expenditure evenly so each rider pays their fair contribution with zero disputes.'
      }
    ]
  },
  {
    id: 'vat-margin',
    slug: 'vat-margin-markup-calculator',
    title: 'VAT, Profit Margin & Markup Calculator',
    shortTitle: 'VAT, Margin & Markup',
    category: 'business-trade',
    description: 'Quickly add or remove Value Added Tax (standard 16% in Kenya or custom rates), find true gross profit margins, and calculate sales markups for product pricing.',
    seoDescription: 'Free VAT, profit margin, and markup calculator. Easily compute 16% VAT inclusive/exclusive pricing, profit amounts, and commercial markup percentages.',
    region: 'GLOBAL',
    isPopular: false,
    keywords: ['vat calculator', 'kenya 16% vat', 'margin calculator', 'markup calculator', 'gross profit', 'retail pricing', 'inclusive exclusive vat'],
    lastUpdated: 'Kenya VAT Act standard 16%',
    formulaNote: 'VAT Exclusive = Price ÷ (1 + VAT Rate). VAT Component = Exclusive × VAT Rate. Gross Margin % = (Profit ÷ Selling Price) × 100. Markup % = (Profit ÷ Cost Price) × 100.',
    faqs: [
      {
        question: 'What is the standard VAT rate in Kenya?',
        answer: 'The standard VAT rate is 16% on taxable goods and services. Certain petroleum products may attract 16%, while zero-rated items (like unprocessed food exports) are at 0%.'
      },
      {
        question: 'What is the difference between Margin and Markup?',
        answer: 'Markup is the percentage added to your cost price to determine selling price. Margin is the percentage of the selling price that is gross profit. A 50% markup on a KES 1,000 item gives a selling price of KES 1,500, which is a 33.3% profit margin.'
      }
    ]
  }
];

export const TOOL_SLUG_ALIASES: Record<string, string> = {
  'fuel-commute-cost-calculator': 'fuel-cost-commute-calculator',
  'vat-profit-margin-markup-calculator': 'vat-margin-markup-calculator',
};

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  const resolved = TOOL_SLUG_ALIASES[slug] || slug;
  return TOOLS.find((t) => t.slug === resolved || t.id === resolved);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === categoryId);
}
