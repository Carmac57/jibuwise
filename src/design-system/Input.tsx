import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  id: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  hint?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  prefix,
  suffix,
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

      <div className="relative flex items-center rounded-xl bg-white border border-slate-200 transition-all focus-within:border-[#0b2d21] focus-within:ring-2 focus-within:ring-lime-500/30">
        {prefix && (
          <div className="pl-3.5 pr-2 py-2.5 text-xs font-semibold text-slate-500 select-none border-r border-slate-100 flex items-center">
            {prefix}
          </div>
        )}
        <input
          id={id}
          className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm text-slate-900 bg-transparent rounded-xl focus:outline-none placeholder:text-slate-400 font-mono-numbers ${className}`}
          {...props}
        />
        {suffix && (
          <div className="pr-3.5 pl-2 py-2.5 text-xs font-medium text-slate-500 select-none flex items-center">
            {suffix}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
