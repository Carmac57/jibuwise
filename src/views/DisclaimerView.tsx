import React from 'react';
import { ChevronRight, AlertOctagon, Scale, FileCheck2, Info } from 'lucide-react';
import { Card } from '../design-system/Card';

interface DisclaimerViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const DisclaimerView: React.FC<DisclaimerViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium">Statutory Disclaimer</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>Regulatory Notice</span>
          <span aria-hidden="true">·</span>
          <span>Scope & Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b2d21] tracking-tight mb-3">
          Statutory & Calculation Disclaimer
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Transparent information on the boundaries, assumptions, and legal context governing JibuWise calculators.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Main Notice */}
        <Card padding="md" variant="default" className="border-l-4 border-l-[#0b2d21]">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-[#0b2d21]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">
                Not Professional Financial, Tax, or Legal Advice
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                The tools and calculators on JibuWise are engineered strictly for estimation, personal budgeting, educational modeling, and preliminary analysis. They do not constitute formal tax representations to the Kenya Revenue Authority (KRA), binding conveyance contracts, or formal credit offers from banks or SACCOs.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 1: KRA PAYE & Deductions */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2 flex items-center gap-2">
            <span>1. Kenya PAYE & Statutory Deductions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
            Tax legislation in Kenya undergoes periodic changes via annual Finance Acts, statutory court appeals, and administrative circulars. Please keep in mind:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li><strong>Social Health Insurance Fund (SHIF):</strong> Contributions reflect the statutory 2.75% rate (minimum KES 300/month) under the Social Health Insurance Act. Under official KRA guidance and Section 15(2) of the Income Tax Act, SHIF is an allowable pre-tax deduction reducing taxable employment income.</li>
            <li><strong>Affordable Housing Levy (AHL):</strong> Reflects the 1.5% employee contribution under the Affordable Housing Act 2024 and Tax Laws (Amendment) Act 2024, treated as an allowable pre-tax deduction under Section 15(2). (Section 30A Affordable Housing Relief ceased to apply to prevent double tax benefit).</li>
            <li><strong>NSSF Act 2013:</strong> Contributions default to the official Year 4 (2026) schedule effective February 2026 (LEL KES 9,000 / Tier I max KES 540; UEL KES 108,000 / Tier II max KES 5,940; total employee ceiling KES 6,480/month). Historical Year 2 and Year 3 schedules remain available for retrospective payslip reviews.</li>
            <li><strong>Disability & Pension Deductions:</strong> Allowable pension contributions are deductible up to KES 30,000/month under the Tax Laws (Amendment) Act. Entitlement to PWD tax exemptions requires a certified registration and active certificate issued by KRA.</li>
          </ul>
        </section>

        {/* Section 2: Safaricom M-Pesa Tariffs */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">2. Safaricom M-Pesa Charges</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            M-Pesa transaction costs are based on Safaricom's published consumer tariff schedules. Rates do not account for third-party commercial bank-to-Mpesa transfer fees, Fuliza overdraft interest/facility charges, ATM network surcharges, or merchant-specific Paybill handling fees where the recipient does not absorb transaction costs.
          </p>
        </section>

        {/* Section 3: Energy & Petroleum (EPRA) */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">3. EPRA Fuel Price Determinations</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Pump prices in Kenya are regulated by the Energy and Petroleum Regulatory Authority (EPRA) and updated on the 14th of every month. Maximum pump prices vary by geographic town/county due to transportation and distribution differentials from the Port of Mombasa. Preset fuel figures on JibuWise are indicative baselines; users should input their actual local pump price.
          </p>
        </section>

        {/* Section 4: Property Conveyance & Stamp Duty */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">4. Property Conveyance, Legal & Land Registry Charges</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
            Property transfer estimations use the statutory 4% (Urban/Municipality) and 2% (Rural/Agricultural) rates under the Stamp Duty Act (Cap 480). Legal conveyance costs are estimated using the Advocates (Remuneration) Order scale:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
            <li>Actual legal fees may vary based on attorney agreement, title complexity, mortgage discharge, or encumbrance negotiations.</li>
            <li>Government valuation figures for stamp duty are ultimately determined by the Government Valuer upon physical site inspection.</li>
            <li>First-time home buyers acquiring residential property under certified affordable housing programmes may qualify for statutory stamp duty exemptions under Section 10A of the Stamp Duty Act.</li>
          </ul>
        </section>

        {/* Section 5: Banking & Loan Amortization */}
        <section>
          <h2 className="text-lg font-bold text-[#0b2d21] mb-2">5. Loans & Mortgage Amortization</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The Loan and Mortgage calculator utilizes the standard mathematical reducing-balance compound annuity formula. Commercial lenders and SACCOs often apply ancillary charges such as loan processing fees (typically 1%–3%), mandatory credit-life insurance, statutory excise duty on loan fees (20%), appraisal costs, and annual ledger fees. Please check your official loan offer letter and amortization schedule with your lender.
          </p>
        </section>
      </div>
    </div>
  );
};
