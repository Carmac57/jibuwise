import React, { useState, useMemo } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { getToolBySlug } from '../config/tools';
import { formatCurrency } from '../config/site';
import { Input } from '../design-system/Input';
import { SegmentedControl } from '../design-system/SegmentedControl';

interface StampDutyCalculatorProps {
  onNavigate: (view: string, param?: string) => void;
}

export const StampDutyCalculator: React.FC<StampDutyCalculatorProps> = ({ onNavigate }) => {
  const tool = getToolBySlug('stamp-duty')!;

  const [propertyPrice, setPropertyPrice] = useState<number>(4500000);
  const [propertyZone, setPropertyZone] = useState<'urban' | 'rural'>('urban');
  const [includeLegalFees, setIncludeLegalFees] = useState<'yes' | 'no'>('yes');
  const [includeValuation, setIncludeValuation] = useState<'yes' | 'no'>('yes');

  const handleReset = () => {
    setPropertyPrice(4500000);
    setPropertyZone('urban');
    setIncludeLegalFees('yes');
    setIncludeValuation('yes');
  };

  const results = useMemo(() => {
    const price = Math.max(0, propertyPrice || 0);

    // 1. Stamp Duty Rate: Urban/Municipality = 4%, Rural/Agricultural = 2%
    const stampDutyRate = propertyZone === 'urban' ? 0.04 : 0.02;
    const stampDutyAmount = price * stampDutyRate;

    // 2. Legal Fees (Conveyance under Advocates Remuneration Order estimate)
    let legalFees = 0;
    if (includeLegalFees === 'yes' && price > 0) {
      if (price <= 5000000) {
        legalFees = Math.max(40000, price * 0.02);
      } else if (price <= 20000000) {
        legalFees = 100000 + (price - 5000000) * 0.015;
      } else {
        legalFees = 325000 + (price - 20000000) * 0.01;
      }
    }
    // Legal fees VAT (16%)
    const legalVat = legalFees * 0.16;

    // 3. Government Valuation inspection fees
    const valuationFee = includeValuation === 'yes' && price > 0 ? Math.min(50000, Math.max(15000, price * 0.002)) : 0;

    // 4. Registry & Ardhisasa title charges
    const titleRegistration = price > 0 ? 3000 : 0;
    const searchFees = price > 0 ? 1000 : 0;
    const miscDisbursements = price > 0 ? 10000 : 0;

    const totalClosingCosts =
      stampDutyAmount + legalFees + legalVat + valuationFee + titleRegistration + searchFees + miscDisbursements;

    const totalAcquisitionCost = price + totalClosingCosts;
    const closingCostPercentage = price > 0 ? (totalClosingCosts / price) * 100 : 0;

    return {
      price,
      stampDutyRate: stampDutyRate * 100,
      stampDutyAmount,
      legalFees,
      legalVat,
      valuationFee,
      titleRegistration,
      searchFees,
      miscDisbursements,
      totalClosingCosts,
      totalAcquisitionCost,
      closingCostPercentage,
    };
  }, [propertyPrice, propertyZone, includeLegalFees, includeValuation]);

  const summaryCopyText = `JibuWise Kenya Property Closing Cost Summary:
Property Price: ${formatCurrency(results.price)}
Zoning: ${propertyZone === 'urban' ? 'Urban / Municipality (4%)' : 'Rural / Agricultural (2%)'}
Stamp Duty: ${formatCurrency(results.stampDutyAmount)}
Legal Fees + VAT: ${formatCurrency(results.legalFees + results.legalVat)}
Valuation & Registration: ${formatCurrency(results.valuationFee + results.titleRegistration + results.searchFees)}
Total Transfer Closing Cost: ${formatCurrency(results.totalClosingCosts)}
Total Capital Required: ${formatCurrency(results.totalAcquisitionCost)}`;

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
              id="property-price"
              label="Agreed Purchase Price"
              type="number"
              min={100000}
              step={100000}
              value={propertyPrice || ''}
              onChange={(e) => setPropertyPrice(Math.max(0, Number(e.target.value) || 0))}
              prefix="KES"
              hint="Contractual buying price or valuation figure"
            />

            <SegmentedControl
              label="Property Zoning / Location"
              value={propertyZone}
              onChange={(v) => setPropertyZone(v as 'urban' | 'rural')}
              options={[
                { value: 'urban', label: 'Urban / Municipality (4%)' },
                { value: 'rural', label: 'Rural / Agricultural (2%)' },
              ]}
            />

            <SegmentedControl
              label="Include Legal Conveyance Fees?"
              value={includeLegalFees}
              onChange={(v) => setIncludeLegalFees(v as 'yes' | 'no')}
              options={[
                { value: 'yes', label: 'Yes (Lawyer estimate)' },
                { value: 'no', label: 'Stamp Duty Only' },
              ]}
            />

            <SegmentedControl
              label="Include Valuation Inspection?"
              value={includeValuation}
              onChange={(v) => setIncludeValuation(v as 'yes' | 'no')}
              options={[
                { value: 'yes', label: 'Yes (Standard ~0.2%)' },
                { value: 'no', label: 'Exclude' },
              ]}
            />
          </div>
        ),
        results: (
          <div className="space-y-6">
            {/* Primary KPI Result */}
            <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
              <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                Estimated Total Closing Costs
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                {formatCurrency(results.totalClosingCosts)}
              </div>
              <div className="mt-2 text-xs text-emerald-200">
                {results.closingCostPercentage.toFixed(1)}% of property price · Total outlay:{' '}
                {formatCurrency(results.totalAcquisitionCost)}
              </div>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Government Stamp Duty
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.stampDutyAmount)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {results.stampDutyRate}% statutory
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Legal Conveyance + VAT
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.legalFees + results.legalVat)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Advocate scale
                </span>
              </div>
            </div>
          </div>
        ),
        breakdown: (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Itemized Conveyance & Transfer Schedule
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 pr-4">Item</th>
                    <th className="py-2.5 px-3">Statutory Basis</th>
                    <th className="py-2.5 pl-4 text-right">Estimated Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-numbers">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Government Stamp Duty</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">
                      {propertyZone === 'urban' ? '4% (Urban / Municipality)' : '2% (Rural / Ag)'}
                    </td>
                    <td className="py-2.5 pl-4 text-right font-medium text-slate-900">
                      {formatCurrency(results.stampDutyAmount)}
                    </td>
                  </tr>
                  {includeLegalFees === 'yes' && (
                    <>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">Legal Conveyance Fee</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Advocates Remuneration Order</td>
                        <td className="py-2.5 pl-4 text-right text-slate-900">
                          {formatCurrency(results.legalFees)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">VAT on Legal Fee</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">16% Standard VAT</td>
                        <td className="py-2.5 pl-4 text-right text-slate-900">
                          {formatCurrency(results.legalVat)}
                        </td>
                      </tr>
                    </>
                  )}
                  {includeValuation === 'yes' && (
                    <tr>
                      <td className="py-2.5 pr-4 font-sans text-slate-700">Government Valuation Fee</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500">Ministry of Lands Valuer</td>
                      <td className="py-2.5 pl-4 text-right text-slate-900">
                        {formatCurrency(results.valuationFee)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Title Search & Ardhisasa Filing</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">Official registry search</td>
                    <td className="py-2.5 pl-4 text-right text-slate-900">
                      {formatCurrency(results.searchFees)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Title Registration & Issue</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">Lands Office transfer booking</td>
                    <td className="py-2.5 pl-4 text-right text-slate-900">
                      {formatCurrency(results.titleRegistration)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Registry Disbursements & Stamp</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">Incidental expenses</td>
                    <td className="py-2.5 pl-4 text-right text-slate-900">
                      {formatCurrency(results.miscDisbursements)}
                    </td>
                  </tr>
                  <tr className="bg-slate-100/70 font-semibold border-t border-slate-300">
                    <td className="py-3 pr-4 font-sans text-[#0b2d21]">Total Closing Outlay</td>
                    <td className="py-3 px-3 font-sans text-slate-500">Payable during completion</td>
                    <td className="py-3 pl-4 text-right text-[#0b2d21] font-bold">
                      {formatCurrency(results.totalClosingCosts)}
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
