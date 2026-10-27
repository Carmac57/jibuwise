import React, { useState, useMemo } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { getToolBySlug } from '../config/tools';
import { formatCurrency, formatNumber } from '../config/site';
import { Input } from '../design-system/Input';
import { SegmentedControl } from '../design-system/SegmentedControl';
import { calculateKenyaPaye, NSSF_SCHEDULES, NssfSchedule } from '../utils/payeCalculator';
import { ExternalLink, Info, CheckCircle2 } from 'lucide-react';

interface KenyaPayeCalculatorProps {
  onNavigate: (view: string, param?: string) => void;
}

export const KenyaPayeCalculator: React.FC<KenyaPayeCalculatorProps> = ({ onNavigate }) => {
  const tool = getToolBySlug('kenya-paye')!;

  const [grossSalary, setGrossSalary] = useState<number>(85000);
  const [benefits, setBenefits] = useState<number>(0);
  const [voluntaryPension, setVoluntaryPension] = useState<number>(0);
  const [qualifyingInsurance, setQualifyingInsurance] = useState<number>(0);
  const [nssfSchedule, setNssfSchedule] = useState<NssfSchedule>('year4');
  const [insuranceScheme, setInsuranceScheme] = useState<'shif' | 'nhif'>('shif');
  const [housingLevyEnabled, setHousingLevyEnabled] = useState<'yes' | 'no'>('yes');
  const [hasDisabilityExemption, setHasDisabilityExemption] = useState<'no' | 'yes'>('no');
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  const handleReset = () => {
    setGrossSalary(85000);
    setBenefits(0);
    setVoluntaryPension(0);
    setQualifyingInsurance(0);
    setNssfSchedule('year4');
    setInsuranceScheme('shif');
    setHousingLevyEnabled('yes');
    setHasDisabilityExemption('no');
  };

  const calculations = useMemo(() => {
    return calculateKenyaPaye({
      basicSalary: grossSalary,
      benefits,
      voluntaryPension,
      qualifyingInsurancePremium: qualifyingInsurance,
      nssfSchedule,
      insuranceScheme,
      housingLevyEnabled: housingLevyEnabled === 'yes',
      hasDisabilityExemption: hasDisabilityExemption === 'yes',
    });
  }, [grossSalary, benefits, voluntaryPension, qualifyingInsurance, nssfSchedule, insuranceScheme, housingLevyEnabled, hasDisabilityExemption]);

  const multiplier = viewMode === 'annual' ? 12 : 1;
  const activeNssfConfig = NSSF_SCHEDULES[nssfSchedule];

  const summaryCopyText = `JibuWise Kenya PAYE Summary:
Gross Monthly Pay: ${formatCurrency(calculations.gross)}
NSSF Schedule: ${activeNssfConfig.name} (${activeNssfConfig.effectivePeriod})
Net Take-Home Pay: ${formatCurrency(calculations.netPay)} (${formatNumber(calculations.takeHomePercent, 1)}%)
PAYE Tax: ${formatCurrency(calculations.payeTax)}
NSSF (Tier I & II): ${formatCurrency(calculations.totalNssf)}
SHIF Health: ${formatCurrency(calculations.healthInsurance)}
Housing Levy (1.5%): ${formatCurrency(calculations.housingLevy)}
Total Allowable Deductions: ${formatCurrency(calculations.totalAllowableDeductions)}
Taxable Income: ${formatCurrency(calculations.taxablePay)}
Total Reliefs: ${formatCurrency(calculations.totalRelief)}
Total Deductions: ${formatCurrency(calculations.totalDeductions)}`;

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
            <Input
              id="gross-salary"
              label="Basic Monthly Salary"
              type="number"
              min={0}
              step={1000}
              value={grossSalary || ''}
              onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value) || 0))}
              prefix="KES"
              hint="Standard monthly contractual salary"
            />

            <Input
              id="benefits"
              label="Allowances & Cash Benefits"
              type="number"
              min={0}
              step={500}
              value={benefits || ''}
              onChange={(e) => setBenefits(Math.max(0, Number(e.target.value) || 0))}
              prefix="KES"
              hint="House, commuter, or bonus allowances"
            />

            <Input
              id="pension"
              label="Voluntary Pension Contribution"
              type="number"
              min={0}
              step={500}
              value={voluntaryPension || ''}
              onChange={(e) => setVoluntaryPension(Math.max(0, Number(e.target.value) || 0))}
              prefix="KES"
              hint="Allowable deduction up to KES 30,000/month under Tax Laws Amendment Act"
            />

            <Input
              id="qualifying-insurance"
              label="Private Insurance Premiums (Life/Medical/Education)"
              type="number"
              min={0}
              step={500}
              value={qualifyingInsurance || ''}
              onChange={(e) => setQualifyingInsurance(Math.max(0, Number(e.target.value) || 0))}
              prefix="KES"
              hint="Section 31: 15% relief up to KES 5,000/mo for qualifying private policies. (SHIF is deducted pre-tax under Sec 15)"
            />

            {/* NSSF Contribution Schedule Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="block text-xs font-semibold text-slate-700 tracking-tight">
                  NSSF Contribution Schedule
                </span>
                <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>Year 4 Current Default</span>
                </span>
              </div>

              <SegmentedControl
                value={nssfSchedule}
                onChange={(v) => setNssfSchedule(v as NssfSchedule)}
                options={[
                  { value: 'year4', label: 'Year 4 (2026)', badge: 'Max 6,480' },
                  { value: 'year3', label: 'Year 3 (2025)', badge: 'Hist.' },
                  { value: 'year2', label: 'Year 2 (2024)', badge: 'Hist.' },
                ]}
              />

              {/* Official Source & Schedule Explanation Callout */}
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    {activeNssfConfig.name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeNssfConfig.status === 'current' ? 'Active Standard' : 'Historical Period'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {activeNssfConfig.id === 'year4' ? (
                    <>
                      <strong>Lower limit:</strong> KES 9,000 (Tier I: 6% = max KES 540). <strong>Upper limit:</strong> KES 108,000 (Tier II: 6% = max KES 5,940). Total employee deduction capped at <strong>KES 6,480/month</strong>.
                    </>
                  ) : activeNssfConfig.id === 'year3' ? (
                    <>
                      <strong>Lower limit:</strong> KES 8,000 (Tier I: max KES 480). <strong>Upper limit:</strong> KES 72,000 (Tier II: max KES 3,840). Total capped at <strong>KES 4,320/month</strong>.
                    </>
                  ) : (
                    <>
                      <strong>Lower limit:</strong> KES 7,000 (Tier I: max KES 420). <strong>Upper limit:</strong> KES 36,000 (Tier II: max KES 1,740). Total capped at <strong>KES 2,160/month</strong>.
                    </>
                  )}
                </p>

                <div className="pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{activeNssfConfig.effectivePeriod}</span>
                  <a
                    href={activeNssfConfig.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0b2d21] font-semibold hover:text-lime-700 hover:underline"
                  >
                    <span>NSSF Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <SegmentedControl
              label="Health Insurance Scheme"
              value={insuranceScheme}
              onChange={(v) => setInsuranceScheme(v as 'shif' | 'nhif')}
              options={[
                { value: 'shif', label: 'SHIF (2.75%)', badge: 'Pre-Tax Deductible' },
                { value: 'nhif', label: 'Legacy NHIF' },
              ]}
            />

            <SegmentedControl
              label="Affordable Housing Levy (1.5%)"
              value={housingLevyEnabled}
              onChange={(v) => setHousingLevyEnabled(v as 'yes' | 'no')}
              options={[
                { value: 'yes', label: 'Include (Pre-Tax Deductible)' },
                { value: 'no', label: 'Exempt' },
              ]}
            />

            <SegmentedControl
              label="Disability Tax Exemption"
              value={hasDisabilityExemption}
              onChange={(v) => setHasDisabilityExemption(v as 'no' | 'yes')}
              options={[
                { value: 'no', label: 'Standard' },
                { value: 'yes', label: 'Certified (KES 150k exempt)' },
              ]}
            />
          </div>
        ),
        results: (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <SegmentedControl
                value={viewMode}
                onChange={(v) => setViewMode(v as 'monthly' | 'annual')}
                options={[
                  { value: 'monthly', label: 'Monthly Breakdown' },
                  { value: 'annual', label: 'Annualized (x12)' },
                ]}
              />
            </div>

            {/* Primary KPI Result */}
            <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
              <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                Net Take-Home Pay ({viewMode === 'monthly' ? 'Monthly' : 'Annual'})
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                {formatCurrency(calculations.netPay * multiplier)}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-emerald-200">
                <span>{formatNumber(calculations.takeHomePercent, 1)}% of gross salary</span>
                <span aria-hidden="true">·</span>
                <span>Total deductions: {formatCurrency(calculations.totalDeductions * multiplier)}</span>
              </div>
            </div>

            {/* Quick KPI stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Gross Pay
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(calculations.gross * multiplier)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Net PAYE Tax
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(calculations.payeTax * multiplier)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Effective Tax Rate
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatNumber(calculations.effectiveTaxRate, 1)}%
                </span>
              </div>
            </div>

            {/* Statutory Source Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Info className="w-4 h-4 text-[#0b2d21]" />
                  <span>Statutory Deductions & Reliefs Audit Summary</span>
                </div>
                <a
                  href="https://www.zd.kra.go.ke/individual/filing-paying/types-of-taxes/paye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#0b2d21] font-semibold hover:underline"
                >
                  <span>KRA PAYE Guidance</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div>• <strong>NSSF Contributions:</strong> {formatCurrency(calculations.totalNssf * multiplier)} ({activeNssfConfig.name}) — allowable deduction reducing taxable employment income.</div>
                <div>• <strong>SHIF Health Contributions:</strong> {formatCurrency(calculations.healthInsurance * multiplier)} (2.75% of Gross) — allowable deduction in determining taxable income per official KRA PAYE guidance. (Does not claim Section 31 relief to prevent double deduction).</div>
                <div>• <strong>Affordable Housing Levy:</strong> {formatCurrency(calculations.housingLevy * multiplier)} (1.5% of Gross) — allowable deduction under Section 15(2). (Replaced Section 30A relief).</div>
                <div>• <strong>Personal Relief:</strong> Statutory KES 2,400/month (KES 28,800/yr) subtracted directly from gross tax liability.</div>
                {calculations.insuranceRelief > 0 && (
                  <div>• <strong>Private Insurance Relief:</strong> {formatCurrency(calculations.insuranceRelief * multiplier)} (15% under Section 31 for qualifying private policies).</div>
                )}
              </div>
            </div>
          </div>
        ),
        breakdown: (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Itemized Statutory Payslip Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 pr-4">Description</th>
                    <th className="py-2.5 px-3">Statutory Basis</th>
                    <th className="py-2.5 pl-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-numbers">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans font-medium text-slate-900">Gross Monthly Earnings</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">Basic + Allowances</td>
                    <td className="py-2.5 pl-4 text-right font-semibold text-slate-900">
                      {formatCurrency(calculations.gross * multiplier)}
                    </td>
                  </tr>

                  {/* Allowable Pre-Tax Deductions Section */}
                  <tr className="bg-slate-50/80 font-semibold">
                    <td colSpan={3} className="py-2 pr-4 font-sans text-slate-600 text-[11px] uppercase tracking-wider">
                      Allowable Pre-Tax Deductions (Section 15, Income Tax Act)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700 pl-4">NSSF Tier I</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">
                      6% on first KES {activeNssfConfig.lowerLimit.toLocaleString()} (Max {formatCurrency(activeNssfConfig.maxTier1)})
                    </td>
                    <td className="py-2.5 pl-4 text-right text-red-700">
                      -{formatCurrency(calculations.nssfTier1 * multiplier)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700 pl-4">NSSF Tier II</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">
                      6% up to KES {activeNssfConfig.upperLimit.toLocaleString()} (Max {formatCurrency(activeNssfConfig.maxTier2)})
                    </td>
                    <td className="py-2.5 pl-4 text-right text-red-700">
                      -{formatCurrency(calculations.nssfTier2 * multiplier)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700 pl-4">
                      {insuranceScheme === 'shif' ? 'SHIF Health Contribution' : 'NHIF Contribution'}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">
                      {insuranceScheme === 'shif' ? '2.75% of Gross (Allowable pre-tax deduction per KRA)' : 'NHIF Scale'}
                    </td>
                    <td className="py-2.5 pl-4 text-right text-red-700">
                      -{formatCurrency(calculations.healthInsurance * multiplier)}
                    </td>
                  </tr>
                  {housingLevyEnabled === 'yes' && (
                    <tr>
                      <td className="py-2.5 pr-4 font-sans text-slate-700 pl-4">Affordable Housing Levy (AHL)</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500">1.5% of Gross (Allowable pre-tax deduction under Sec 15)</td>
                      <td className="py-2.5 pl-4 text-right text-red-700">
                        -{formatCurrency(calculations.housingLevy * multiplier)}
                      </td>
                    </tr>
                  )}
                  {calculations.allowablePension > 0 && (
                    <tr>
                      <td className="py-2.5 pr-4 font-sans text-slate-700 pl-4">Allowable Voluntary Pension</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500">Exempt up to KES 30,000/mo (Tax Laws Amendment Act)</td>
                      <td className="py-2.5 pl-4 text-right text-red-700">
                        -{formatCurrency(calculations.allowablePension * multiplier)}
                      </td>
                    </tr>
                  )}

                  {/* Taxable Income Row */}
                  <tr className="bg-emerald-50/50 font-semibold border-t border-slate-300">
                    <td className="py-2.5 pr-4 font-sans text-emerald-950 font-bold">Taxable Employment Income for PAYE</td>
                    <td className="py-2.5 px-3 font-sans text-emerald-800">Gross minus Allowable Deductions</td>
                    <td className="py-2.5 pl-4 text-right text-emerald-950 font-bold">
                      {formatCurrency(calculations.taxablePay * multiplier)}
                    </td>
                  </tr>

                  {/* Tax Computation */}
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Gross KRA Tax (Before Reliefs)</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">Progressive 10% - 35% Bands</td>
                    <td className="py-2.5 pl-4 text-right text-slate-700">
                      {formatCurrency(calculations.grossTax * multiplier)}
                    </td>
                  </tr>

                  {/* Reliefs Section */}
                  <tr className="bg-slate-50/80 font-semibold">
                    <td colSpan={3} className="py-2 pr-4 font-sans text-slate-600 text-[11px] uppercase tracking-wider">
                      Statutory Tax Reliefs (Subtracted from Gross Tax)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-emerald-800 pl-4">Less: Personal Relief</td>
                    <td className="py-2.5 px-3 font-sans text-emerald-700">Statutory KES 2,400/month</td>
                    <td className="py-2.5 pl-4 text-right text-emerald-700">
                      +{formatCurrency(calculations.personalRelief * multiplier)}
                    </td>
                  </tr>
                  {calculations.insuranceRelief > 0 && (
                    <tr>
                      <td className="py-2.5 pr-4 font-sans text-emerald-800 pl-4">Less: Qualifying Insurance Relief</td>
                      <td className="py-2.5 px-3 font-sans text-emerald-700">15% of qualifying private policies (Sec 31, max KES 5,000/mo)</td>
                      <td className="py-2.5 pl-4 text-right text-emerald-700">
                        +{formatCurrency(calculations.insuranceRelief * multiplier)}
                      </td>
                    </tr>
                  )}

                  {/* Net PAYE Tax */}
                  <tr className="border-t border-slate-200">
                    <td className="py-2.5 pr-4 font-sans font-medium text-slate-900">Net KRA PAYE Deducted</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">Gross Tax minus Total Reliefs</td>
                    <td className="py-2.5 pl-4 text-right text-red-700 font-semibold">
                      -{formatCurrency(calculations.payeTax * multiplier)}
                    </td>
                  </tr>

                  {/* Net Take-Home */}
                  <tr className="border-t-2 border-slate-300 bg-slate-100/70 font-semibold">
                    <td className="py-3 pr-4 font-sans text-[#0b2d21] text-sm">Net Monthly Salary Payable</td>
                    <td className="py-3 px-3 font-sans text-slate-600 text-xs">Direct Take-Home Pay (Gross minus All Deductions)</td>
                    <td className="py-3 pl-4 text-right text-[#0b2d21] text-sm font-bold">
                      {formatCurrency(calculations.netPay * multiplier)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      }}
    </ToolLayout>
  );
};
