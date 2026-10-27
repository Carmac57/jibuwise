import React, { useState, useMemo } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { getToolBySlug } from '../config/tools';
import { formatCurrency } from '../config/site';
import { Input } from '../design-system/Input';
import { SegmentedControl } from '../design-system/SegmentedControl';
import { AlertCircle } from 'lucide-react';

interface MpesaFeesCalculatorProps {
  onNavigate: (view: string, param?: string) => void;
}

// Safaricom published tariff bands
interface TariffBand {
  min: number;
  max: number;
  sendRegistered: number;
  sendUnregistered: number; // 0 indicates not permitted / N/A
  withdrawAgent: number;
  withdrawAtm?: number;
}

const MPESA_TARIFFS: TariffBand[] = [
  { min: 1, max: 100, sendRegistered: 0, sendUnregistered: 0, withdrawAgent: 0 },
  { min: 101, max: 500, sendRegistered: 7, sendUnregistered: 49, withdrawAgent: 29 },
  { min: 501, max: 1000, sendRegistered: 13, sendUnregistered: 49, withdrawAgent: 29 },
  { min: 1001, max: 1500, sendRegistered: 23, sendUnregistered: 61, withdrawAgent: 29 },
  { min: 1501, max: 2500, sendRegistered: 33, sendUnregistered: 83, withdrawAgent: 29 },
  { min: 2501, max: 3500, sendRegistered: 53, sendUnregistered: 118, withdrawAgent: 52 },
  { min: 3501, max: 5000, sendRegistered: 57, sendUnregistered: 147, withdrawAgent: 69 },
  { min: 5001, max: 7500, sendRegistered: 78, sendUnregistered: 180, withdrawAgent: 87 },
  { min: 7501, max: 10000, sendRegistered: 90, sendUnregistered: 212, withdrawAgent: 115 },
  { min: 10001, max: 15000, sendRegistered: 100, sendUnregistered: 277, withdrawAgent: 167 },
  { min: 15001, max: 20000, sendRegistered: 105, sendUnregistered: 298, withdrawAgent: 185 },
  { min: 20001, max: 35000, sendRegistered: 108, sendUnregistered: 309, withdrawAgent: 197 },
  { min: 35001, max: 50000, sendRegistered: 108, sendUnregistered: 0, withdrawAgent: 278 },
  { min: 50001, max: 250000, sendRegistered: 108, sendUnregistered: 0, withdrawAgent: 309 },
];

function getTariffForAmount(amount: number): TariffBand | undefined {
  if (amount < 1) return undefined;
  return MPESA_TARIFFS.find((b) => amount >= b.min && amount <= b.max);
}

export const MpesaFeesCalculator: React.FC<MpesaFeesCalculatorProps> = ({ onNavigate }) => {
  const tool = getToolBySlug('mpesa-fees')!;

  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [amount, setAmount] = useState<number>(4500);
  const [recipientType, setRecipientType] = useState<'registered' | 'unregistered'>('registered');

  const handleReset = () => {
    setMode('forward');
    setAmount(4500);
    setRecipientType('registered');
  };

  const results = useMemo(() => {
    const val = Math.min(250000, Math.max(0, amount || 0));
    const isUnregisteredOverLimit = recipientType === 'unregistered' && val > 35000;

    if (mode === 'forward') {
      const band = getTariffForAmount(val);
      let sendFee = 0;
      if (band) {
        if (recipientType === 'registered') {
          sendFee = band.sendRegistered;
        } else {
          sendFee = band.sendUnregistered;
        }
      }

      const agentWithdrawalFee = band ? band.withdrawAgent : 0;
      const totalSenderCost = val + sendFee;
      const totalCostWithWithdrawal = val + sendFee + agentWithdrawalFee;
      const recipientReceives = val;
      const recipientWithdrawsNet = Math.max(0, val - agentWithdrawalFee);

      return {
        inputAmount: val,
        sendFee,
        agentWithdrawalFee,
        totalSenderCost,
        totalCostWithWithdrawal,
        recipientReceives,
        recipientWithdrawsNet,
        recommendedSendForExactCash: val + agentWithdrawalFee,
        isUnregisteredOverLimit,
        isBelowAgentMin: val < 50 && val > 0,
        band,
      };
    } else {
      // Reverse calculation: recipient needs net cash 'val'
      // Find what amount has an agent withdrawal fee such that (Amount - AgentFee) = val
      let targetGross = val;
      const bandDirect = getTariffForAmount(val);
      const feeDirect = bandDirect ? bandDirect.withdrawAgent : 0;
      targetGross = val + feeDirect;

      // Verify band of targetGross
      const bandAdjusted = getTariffForAmount(targetGross);
      const adjustedWithdrawFee = bandAdjusted ? bandAdjusted.withdrawAgent : feeDirect;
      const finalAmountToSend = val + adjustedWithdrawFee;

      const sendBand = getTariffForAmount(finalAmountToSend);
      let sendFee = 0;
      if (sendBand) {
        sendFee = recipientType === 'registered' ? sendBand.sendRegistered : sendBand.sendUnregistered;
      }

      return {
        inputAmount: val,
        sendFee,
        agentWithdrawalFee: adjustedWithdrawFee,
        totalSenderCost: finalAmountToSend + sendFee,
        totalCostWithWithdrawal: finalAmountToSend + sendFee,
        recipientReceives: finalAmountToSend,
        recipientWithdrawsNet: val,
        recommendedSendForExactCash: finalAmountToSend,
        isUnregisteredOverLimit: recipientType === 'unregistered' && finalAmountToSend > 35000,
        isBelowAgentMin: val < 50 && val > 0,
        band: sendBand,
      };
    }
  }, [mode, amount, recipientType]);

  const summaryCopyText = `JibuWise M-Pesa Fee Summary:
Amount: ${formatCurrency(results.inputAmount)}
Mode: ${mode === 'forward' ? 'Standard Send' : 'Reverse (Exact Cash Out)'}
Send Fee: ${results.isUnregisteredOverLimit ? 'N/A (>35k Unregistered Limit)' : formatCurrency(results.sendFee)}
Agent Withdrawal Fee: ${formatCurrency(results.agentWithdrawalFee)}
Total Deducted From Sender: ${formatCurrency(results.totalSenderCost)}
Recipient Net Cash in Hand: ${formatCurrency(results.recipientWithdrawsNet)}`;

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
              label="Calculation Mode"
              value={mode}
              onChange={(v) => setMode(v as 'forward' | 'reverse')}
              options={[
                { value: 'forward', label: 'Standard Send' },
                { value: 'reverse', label: 'Reverse (Exact Cash Out)' },
              ]}
            />

            <Input
              id="mpesa-amount"
              label={
                mode === 'forward'
                  ? 'Amount You Wish to Send'
                  : 'Target Cash Recipient Must Withdraw'
              }
              type="number"
              min={1}
              max={250000}
              step={100}
              value={amount || ''}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              prefix="KES"
              hint="Max limit KES 250,000 per transaction"
            />

            <SegmentedControl
              label="Recipient Account Type"
              value={recipientType}
              onChange={(v) => setRecipientType(v as 'registered' | 'unregistered')}
              options={[
                { value: 'registered', label: 'Registered M-Pesa User' },
                { value: 'unregistered', label: 'Unregistered Number' },
              ]}
            />

            {/* Quick amount shortcuts */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 tracking-tight mb-1.5">
                Quick Preset Amounts
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[500, 1500, 3000, 5000, 10000, 20000, 35000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="min-h-[36px] px-2 py-1 text-xs font-mono-numbers rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors select-none text-center cursor-pointer"
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ),
        results: (
          <div className="space-y-6">
            {/* Warning if unregistered limit exceeded */}
            {results.isUnregisteredOverLimit && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Safaricom Unregistered Transfer Limit Exceeded:</strong>
                  <p className="mt-0.5 text-amber-800">
                    Safaricom permits sending to unregistered users only up to KES 35,000 per transaction. The recipient must register their SIM or you should select "Registered M-Pesa User".
                  </p>
                </div>
              </div>
            )}

            {/* Primary KPI Result */}
            <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
              <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                {mode === 'forward'
                  ? 'Total Sender Cost (Send Fee + Amount)'
                  : 'Recommended Amount to Send'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                {formatCurrency(
                  mode === 'forward'
                    ? results.totalSenderCost
                    : results.recommendedSendForExactCash
                )}
              </div>
              <div className="mt-2 text-xs text-emerald-200">
                {mode === 'forward' ? (
                  <span>
                    Send fee: {results.isUnregisteredOverLimit ? 'Exceeds Limit' : formatCurrency(results.sendFee)} · Recipient receives{' '}
                    {formatCurrency(results.recipientReceives)}
                  </span>
                ) : (
                  <span>
                    Includes {formatCurrency(results.agentWithdrawalFee)} recipient agent withdrawal fee
                  </span>
                )}
              </div>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Send Money Fee
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {results.isUnregisteredOverLimit ? 'N/A' : formatCurrency(results.sendFee)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Agent Withdrawal Fee
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.agentWithdrawalFee)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Recipient Net Cash
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.recipientWithdrawsNet)}
                </span>
              </div>
            </div>

            {/* Reverse Calculator Callout */}
            {mode === 'forward' && results.agentWithdrawalFee > 0 && (
              <div className="p-4 rounded-xl bg-lime-50 border border-lime-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-emerald-950 font-semibold block mb-1">
                  Want the recipient to withdraw exactly {formatCurrency(results.inputAmount)} in cash?
                </strong>
                Send <strong>{formatCurrency(results.recommendedSendForExactCash)}</strong> instead.
                The recipient will pay {formatCurrency(results.agentWithdrawalFee)} at the M-Pesa agent and keep full {formatCurrency(results.inputAmount)}.
              </div>
            )}
          </div>
        ),
        breakdown: (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Current Tariff Band Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 pr-4">Transaction Component</th>
                    <th className="py-2.5 pl-4 text-right">Fee (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-numbers">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">P2P Transfer Fee (Transfer to user)</td>
                    <td className="py-2.5 pl-4 text-right font-medium text-slate-900">
                      {results.isUnregisteredOverLimit ? 'Limit Exceeded' : formatCurrency(results.sendFee)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Withdrawal Fee at M-Pesa Agent</td>
                    <td className="py-2.5 pl-4 text-right font-medium text-slate-900">
                      {formatCurrency(results.agentWithdrawalFee)}
                    </td>
                  </tr>
                  <tr className="bg-slate-100/70 font-semibold">
                    <td className="py-2.5 pr-4 font-sans text-[#0b2d21]">Total Friction Cost (Sender + Agent)</td>
                    <td className="py-2.5 pl-4 text-right text-[#0b2d21] font-bold">
                      {results.isUnregisteredOverLimit
                        ? 'N/A'
                        : formatCurrency(results.sendFee + results.agentWithdrawalFee)}
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
