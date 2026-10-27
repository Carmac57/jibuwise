import React, { useState, useMemo } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { getToolBySlug } from '../config/tools';
import { formatCurrency, formatNumber } from '../config/site';
import { Input } from '../design-system/Input';
import { SegmentedControl } from '../design-system/SegmentedControl';

interface VatMarginCalculatorProps {
  onNavigate: (view: string, param?: string) => void;
}

export const VatMarginCalculator: React.FC<VatMarginCalculatorProps> = ({ onNavigate }) => {
  const tool = getToolBySlug('vat-margin')!;

  const [activeTab, setActiveTab] = useState<'vat' | 'margin'>('vat');

  // VAT states
  const [vatAmount, setVatAmount] = useState<number>(10000);
  const [vatRate, setVatRate] = useState<number>(16);
  const [vatDirection, setVatDirection] = useState<'add' | 'remove'>('add');

  // Margin states
  const [costPrice, setCostPrice] = useState<number>(3000);
  const [sellingPrice, setSellingPrice] = useState<number>(4500);

  const handleReset = () => {
    setVatAmount(10000);
    setVatRate(16);
    setVatDirection('add');
    setCostPrice(3000);
    setSellingPrice(4500);
  };

  const vatResults = useMemo(() => {
    const raw = Math.max(0, vatAmount || 0);
    const rate = Math.max(0, vatRate || 0) / 100;

    let netAmount = 0;
    let taxAmount = 0;
    let grossAmount = 0;

    if (vatDirection === 'add') {
      // Adding VAT: raw is exclusive
      netAmount = raw;
      taxAmount = raw * rate;
      grossAmount = raw + taxAmount;
    } else {
      // Removing VAT: raw is inclusive
      grossAmount = raw;
      netAmount = raw / (1 + rate);
      taxAmount = grossAmount - netAmount;
    }

    return {
      netAmount,
      taxAmount,
      grossAmount,
      effectiveRate: vatRate,
    };
  }, [vatAmount, vatRate, vatDirection]);

  const marginResults = useMemo(() => {
    const cost = Math.max(0, costPrice || 0);
    const sell = Math.max(0, sellingPrice || 0);
    const grossProfit = sell - cost;
    const profitMargin = sell > 0 ? (grossProfit / sell) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    return {
      cost,
      sell,
      grossProfit,
      profitMargin,
      markup,
    };
  }, [costPrice, sellingPrice]);

  const summaryCopyText =
    activeTab === 'vat'
      ? `JibuWise VAT Summary:
Input Amount: ${formatCurrency(vatAmount)} (${vatDirection === 'add' ? 'Exclusive' : 'Inclusive'})
VAT Rate: ${vatRate}%
VAT Amount: ${formatCurrency(vatResults.taxAmount)}
Net Amount (Excl. VAT): ${formatCurrency(vatResults.netAmount)}
Gross Amount (Incl. VAT): ${formatCurrency(vatResults.grossAmount)}`
      : `JibuWise Profit Margin Summary:
Cost Price: ${formatCurrency(marginResults.cost)}
Selling Price: ${formatCurrency(marginResults.sell)}
Gross Profit: ${formatCurrency(marginResults.grossProfit)}
Profit Margin: ${formatNumber(marginResults.profitMargin, 1)}%
Markup: ${formatNumber(marginResults.markup, 1)}%`;

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
            <SegmentedControl
              label="Tool Operation"
              value={activeTab}
              onChange={(v) => setActiveTab(v as 'vat' | 'margin')}
              options={[
                { value: 'vat', label: 'VAT Calculator' },
                { value: 'margin', label: 'Margin & Markup' },
              ]}
            />

            {activeTab === 'vat' ? (
              <>
                <SegmentedControl
                  label="Calculation Method"
                  value={vatDirection}
                  onChange={(v) => setVatDirection(v as 'add' | 'remove')}
                  options={[
                    { value: 'add', label: 'Add VAT (Exclusive)' },
                    { value: 'remove', label: 'Extract VAT (Inclusive)' },
                  ]}
                />

                <Input
                  id="vat-amount"
                  label={
                    vatDirection === 'add'
                      ? 'Net Amount (Excluding VAT)'
                      : 'Gross Amount (Including VAT)'
                  }
                  type="number"
                  min={0}
                  step={100}
                  value={vatAmount || ''}
                  onChange={(e) => setVatAmount(Math.max(0, Number(e.target.value) || 0))}
                  prefix="KES"
                  hint="Base transaction price"
                />

                <Input
                  id="vat-rate"
                  label="VAT Rate (%)"
                  type="number"
                  min={0}
                  max={50}
                  step={1}
                  value={vatRate || ''}
                  onChange={(e) => setVatRate(Math.max(0, Number(e.target.value) || 0))}
                  suffix="%"
                  hint="Standard 16% in Kenya (18% Uganda, 15% South Africa)"
                />

                {/* Quick preset rates */}
                <div className="flex gap-2">
                  {[16, 18, 15, 0].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setVatRate(rate)}
                      className={`min-h-[36px] flex-1 text-xs rounded-lg transition-colors cursor-pointer border ${
                        vatRate === rate
                          ? 'bg-[#0b2d21] text-white font-semibold border-[#0b2d21]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      }`}
                    >
                      {rate}% {rate === 16 ? '(Kenya)' : ''}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Input
                  id="cost-price"
                  label="Cost Price (COGS)"
                  type="number"
                  min={0}
                  step={100}
                  value={costPrice || ''}
                  onChange={(e) => setCostPrice(Math.max(0, Number(e.target.value) || 0))}
                  prefix="KES"
                  hint="Total cost to purchase or manufacture"
                />

                <Input
                  id="selling-price"
                  label="Selling Price (Revenue)"
                  type="number"
                  min={0}
                  step={100}
                  value={sellingPrice || ''}
                  onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value) || 0))}
                  prefix="KES"
                  hint="Price charged to the customer"
                />
              </>
            )}
          </div>
        ),
        results: (
          <div className="space-y-6">
            {activeTab === 'vat' ? (
              <>
                {/* Primary KPI Result */}
                <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
                  <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                    {vatDirection === 'add' ? 'Total with VAT Included' : 'Net Price (Before VAT)'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                    {formatCurrency(
                      vatDirection === 'add' ? vatResults.grossAmount : vatResults.netAmount
                    )}
                  </div>
                  <div className="mt-2 text-xs text-emerald-200">
                    VAT tax component: {formatCurrency(vatResults.taxAmount)} @ {vatRate}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                      Net Amount (Excl.)
                    </span>
                    <span className="text-lg font-bold font-mono-numbers text-slate-900">
                      {formatCurrency(vatResults.netAmount)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                      VAT Tax ({vatRate}%)
                    </span>
                    <span className="text-lg font-bold font-mono-numbers text-slate-900">
                      {formatCurrency(vatResults.taxAmount)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Primary KPI Result */}
                <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
                  <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                    Gross Profit
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                    {formatCurrency(marginResults.grossProfit)}
                  </div>
                  <div className="mt-2 text-xs text-emerald-200">
                    Margin: {formatNumber(marginResults.profitMargin, 1)}% · Markup:{' '}
                    {formatNumber(marginResults.markup, 1)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                      Profit Margin %
                    </span>
                    <span className="text-lg font-bold font-mono-numbers text-slate-900">
                      {formatNumber(marginResults.profitMargin, 1)}%
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Profit / Selling Price
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                      Markup %
                    </span>
                    <span className="text-lg font-bold font-mono-numbers text-slate-900">
                      {formatNumber(marginResults.markup, 1)}%
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Profit / Cost Price
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ),
        breakdown: (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Calculation Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 pr-4">Metric</th>
                    <th className="py-2.5 px-3">Formula</th>
                    <th className="py-2.5 pl-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-numbers">
                  {activeTab === 'vat' ? (
                    <>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">Net Amount (Excl. VAT)</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Gross ÷ (1 + r)</td>
                        <td className="py-2.5 pl-4 text-right text-slate-900 font-medium">
                          {formatCurrency(vatResults.netAmount)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">VAT Amount ({vatRate}%)</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Net × {vatRate}%</td>
                        <td className="py-2.5 pl-4 text-right text-slate-900 font-medium">
                          {formatCurrency(vatResults.taxAmount)}
                        </td>
                      </tr>
                      <tr className="bg-slate-100/70 font-semibold">
                        <td className="py-2.5 pr-4 font-sans text-[#0b2d21]">Gross Amount (Incl. VAT)</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Net + VAT</td>
                        <td className="py-2.5 pl-4 text-right text-[#0b2d21] font-bold">
                          {formatCurrency(vatResults.grossAmount)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">Cost of Goods (Cost)</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Base outlay</td>
                        <td className="py-2.5 pl-4 text-right text-slate-900 font-medium">
                          {formatCurrency(marginResults.cost)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">Selling Price (Revenue)</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Customer charge</td>
                        <td className="py-2.5 pl-4 text-right text-slate-900 font-medium">
                          {formatCurrency(marginResults.sell)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-sans text-slate-700">Gross Profit (Amount)</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Revenue - Cost</td>
                        <td className="py-2.5 pl-4 text-right text-emerald-800 font-semibold">
                          {formatCurrency(marginResults.grossProfit)}
                        </td>
                      </tr>
                      <tr className="bg-slate-100/70 font-semibold">
                        <td className="py-2.5 pr-4 font-sans text-[#0b2d21]">Profit Margin vs Markup</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">Margin / Markup</td>
                        <td className="py-2.5 pl-4 text-right text-[#0b2d21] font-bold">
                          {formatNumber(marginResults.profitMargin, 1)}% / {formatNumber(marginResults.markup, 1)}%
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ),
      }}
    </ToolLayout>
  );
};
