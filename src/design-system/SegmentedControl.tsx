import React from 'react';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  label?: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name?: string;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  label,
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div className={`w-full ${className}`}>
      {label && <span className="block text-xs font-semibold text-slate-700 tracking-tight mb-1.5">{label}</span>}
      <div
        role="group"
        aria-label={label}
        className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/70 gap-1 w-full"
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isSelected}
              className={`flex-1 min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-all text-center whitespace-nowrap truncate select-none ${
                isSelected
                  ? 'bg-white text-[#0b2d21] font-semibold shadow-xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {opt.label}
              {opt.badge && (
                <span className="ml-1 text-[10px] text-lime-700 font-normal">
                  ({opt.badge})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
