import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  id,
  options,
  hint,
  error,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 tracking-tight">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>

      <div className="relative rounded-xl bg-white border border-slate-200 transition-all focus-within:border-[#0b2d21] focus-within:ring-2 focus-within:ring-lime-500/30">
        <select
          id={id}
          className={`w-full min-h-[44px] pl-3.5 pr-10 py-2.5 text-sm text-slate-900 bg-transparent rounded-xl focus:outline-none appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
