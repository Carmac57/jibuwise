import React, { useState, useMemo } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { getToolBySlug } from '../config/tools';
import { formatCurrency, formatNumber } from '../config/site';
import { Input } from '../design-system/Input';
import { SegmentedControl } from '../design-system/SegmentedControl';
import { Select } from '../design-system/Select';

interface LoanMortgageCalculatorProps {
  onNavigate: (view: string, param?: string) => void;
}

export const LoanMortgageCalculator: React.FC<LoanMortgageCalculatorProps> = ({ onNavigate }) => {
  const tool = getToolBySlug('loan-mortgage')!;

  const [currency, setCurrency] = useState<string>('KES');
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(14.5);
  const [termYears, setTermYears] = useState<number>(5);
  const [termType, setTermType] = useState<'years' | 'months'>('years');
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [amortizationView, setAmortizationView] = useState<'yearly' | 'monthly'>('yearly');

  const handleReset = () => {
    setLoanAmount(2500000);
    setAnnualInterestRate(14.5);
    setTermYears(5);
    setExtraPayment(0);
  };

  const results = useMemo(() => {
    const P = Math.max(0, loanAmount || 0);
    const annualRate = Math.max(0, annualInterestRate || 0) / 100;
    const r = annualRate / 12; // Monthly interest rate
    const n = Math.max(1, termType === 'years' ? (termYears || 1) * 12 : termYears || 1);
    const extra = Math.max(0, extraPayment || 0);

    // Standard EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    let baseEmi = 0;
    if (r > 0 && n > 0) {
      baseEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      baseEmi = P / n; // 0% interest loan
    }

    const totalMonthlyPayment = baseEmi + extra;

    // Build Amortization Schedule
    let balance = P;
    let totalInterest = 0;
    let totalPaid = 0;
    let monthsToPayoff = 0;

    interface ScheduleRow {
      month: number;
      year: number;
      beginningBalance: number;
      principalPayment: number;
      interestPayment: number;
      totalPayment: number;
      endingBalance: number;
    }

    const monthlySchedule: ScheduleRow[] = [];

    for (let m = 1; m <= n && balance > 0; m++) {
      const interestForMonth = balance * r;
      let principalForMonth = baseEmi - interestForMonth + extra;

      if (principalForMonth > balance) {
        principalForMonth = balance;
      }

      const paymentForMonth = principalForMonth + interestForMonth;
      const endingBalance = Math.max(0, balance - principalForMonth);

      monthlySchedule.push({
        month: m,
        year: Math.ceil(m / 12),
        beginningBalance: balance,
        principalPayment: principalForMonth,
        interestPayment: interestForMonth,
        totalPayment: paymentForMonth,
        endingBalance,
      });

      totalInterest += interestForMonth;
      totalPaid += paymentForMonth;
      balance = endingBalance;
      monthsToPayoff = m;
    }

    // Aggregate Yearly Schedule
    const yearlySchedule: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      endingBalance: number;
    }[] = [];

    let currentYear = 1;
    let yrPrincipal = 0;
    let yrInterest = 0;
    let yrEndingBalance = P;

    monthlySchedule.forEach((row) => {
      if (row.year !== currentYear) {
        yearlySchedule.push({
          year: currentYear,
          principalPaid: yrPrincipal,
          interestPaid: yrInterest,
          endingBalance: yrEndingBalance,
        });
        currentYear = row.year;
        yrPrincipal = 0;
        yrInterest = 0;
      }
      yrPrincipal += row.principalPayment;
      yrInterest += row.interestPayment;
      yrEndingBalance = row.endingBalance;
    });

    if (yrPrincipal > 0 || yrInterest > 0) {
      yearlySchedule.push({
        year: currentYear,
        principalPaid: yrPrincipal,
        interestPaid: yrInterest,
        endingBalance: yrEndingBalance,
      });
    }

    const interestToPrincipalRatio = P > 0 ? (totalInterest / P) * 100 : 0;

    return {
      baseEmi,
      totalMonthlyPayment,
      totalInterest,
      totalPaid,
      monthsToPayoff,
      yearsToPayoff: (monthsToPayoff / 12).toFixed(1),
      interestToPrincipalRatio,
      monthlySchedule,
      yearlySchedule,
    };
  }, [loanAmount, annualInterestRate, termYears, termType, extraPayment]);

  const summaryCopyText = `JibuWise Loan & EMI Repayment Summary:
Loan Amount: ${formatCurrency(loanAmount, currency)}
Interest Rate: ${annualInterestRate}%
Term: ${termYears} ${termType}
Monthly Payment (EMI): ${formatCurrency(results.totalMonthlyPayment, currency)}
Total Interest: ${formatCurrency(results.totalInterest, currency)}
Total Amount Payable: ${formatCurrency(results.totalPaid, currency)}`;

  return (
    <ToolLayout
      tool={tool}
      onReset={handleReset}
      onNavigate={onNavigate}
      summaryTextForCopy={summaryCopyText}
    >
      {{
        inputs: (
          <div className="space-y-4">
            <Select
              id="currency-select"
              label="Calculation Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: 'KES', label: 'KES — Kenyan Shilling' },
                { value: 'USD', label: 'USD — US Dollar ($)' },
                { value: 'EUR', label: 'EUR — Euro (€)' },
                { value: 'GBP', label: 'GBP — British Pound (£)' },
                { value: 'ZAR', label: 'ZAR — South African Rand (R)' },
                { value: 'UGX', label: 'UGX — Ugandan Shilling' },
                { value: 'TZS', label: 'TZS — Tanzanian Shilling' },
              ]}
            />

            <Input
              id="loan-principal"
              label="Loan Principal Amount"
              type="number"
              min={1000}
              step={10000}
              value={loanAmount || ''}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              prefix={currency}
              hint="Total borrowed amount"
            />

            <Input
              id="annual-interest"
              label="Annual Interest Rate (%)"
              type="number"
              min={0.1}
              max={60}
              step={0.25}
              value={annualInterestRate || ''}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value) || 0)}
              suffix="%"
              hint="Commercial banks typically 13% - 18% in Kenya"
            />

            <div className="grid grid-cols-2 gap-3 items-end">
              <Input
                id="loan-term"
                label="Loan Term"
                type="number"
                min={1}
                max={360}
                value={termYears || ''}
                onChange={(e) => setTermYears(Number(e.target.value) || 1)}
                suffix={termType}
              />
              <SegmentedControl
                value={termType}
                onChange={(v) => setTermType(v as 'years' | 'months')}
                options={[
                  { value: 'years', label: 'Years' },
                  { value: 'months', label: 'Months' },
                ]}
              />
            </div>

            <Input
              id="extra-payment"
              label="Optional Extra Monthly Payment"
              type="number"
              min={0}
              step={1000}
              value={extraPayment || ''}
              onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
              prefix={currency}
              hint="Reduces interest and shortens term"
            />
          </div>
        ),
        results: (
          <div className="space-y-6">
            {/* Primary KPI Result */}
            <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
              <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                Monthly Repayment (EMI)
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                {formatCurrency(results.totalMonthlyPayment, currency)}
              </div>
              <div className="mt-2 text-xs text-emerald-200 flex items-center gap-2">
                <span>Payoff time: {results.yearsToPayoff} years ({results.monthsToPayoff} months)</span>
                {extraPayment > 0 && <span className="text-lime-400">· Accelerated</span>}
              </div>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Total Principal
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(loanAmount, currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Total Interest
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.totalInterest, currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Total Amount Paid
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.totalPaid, currency)}
                </span>
              </div>
            </div>

            {/* Ratio visual summary bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span>Principal: {formatCurrency(loanAmount, currency)}</span>
                <span>Interest: {formatCurrency(results.totalInterest, currency)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#0b2d21] h-full"
                  style={{
                    width: `${Math.min(100, (loanAmount / (results.totalPaid || 1)) * 100)}%`,
                  }}
                  title="Principal"
                />
                <div
                  className="bg-lime-500 h-full"
                  style={{
                    width: `${Math.min(100, (results.totalInterest / (results.totalPaid || 1)) * 100)}%`,
                  }}
                  title="Interest"
                />
              </div>
            </div>
          </div>
        ),
        breakdown: (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Amortization Schedule
              </h3>
              <SegmentedControl
                value={amortizationView}
                onChange={(v) => setAmortizationView(v as 'yearly' | 'monthly')}
                options={[
                  { value: 'yearly', label: 'Yearly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
                className="max-w-[180px]"
              />
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3">{amortizationView === 'yearly' ? 'Year' : 'Month'}</th>
                    <th className="py-2 px-3 text-right">Principal Paid</th>
                    <th className="py-2 px-3 text-right">Interest Paid</th>
                    <th className="py-2 px-3 text-right">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-numbers">
                  {amortizationView === 'yearly'
                    ? results.yearlySchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-100/50">
                          <td className="py-2 px-3 font-sans font-medium text-slate-900">
                            Year {row.year}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-800">
                            {formatCurrency(row.principalPaid, currency)}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-600">
                            {formatCurrency(row.interestPaid, currency)}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-slate-900">
                            {formatCurrency(row.endingBalance, currency)}
                          </td>
                        </tr>
                      ))
                    : results.monthlySchedule.slice(0, 48).map((row) => (
                        <tr key={row.month} className="hover:bg-slate-100/50">
                          <td className="py-2 px-3 font-sans font-medium text-slate-900">
                            Month {row.month}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-800">
                            {formatCurrency(row.principalPayment, currency)}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-600">
                            {formatCurrency(row.interestPayment, currency)}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-slate-900">
                            {formatCurrency(row.endingBalance, currency)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            {amortizationView === 'monthly' && results.monthlySchedule.length > 48 && (
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Showing first 48 months of schedule. Use yearly view for complete lifespan.
              </p>
            )}
          </div>
        ),
      }}
    </ToolLayout>
  );
};
