import React from 'react';

export interface StatDisplayProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  subtext,
  highlight = false,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-lg sm:text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </span>
      <div
        className={`font-bold font-mono-numbers tracking-tight tabular-nums ${sizeStyles[size]} ${
          highlight ? 'text-[#0b2d21]' : 'text-slate-900'
        }`}
      >
        {value}
      </div>
      {subtext && (
        <span className="text-xs text-slate-500 mt-1">
          {subtext}
        </span>
      )}
    </div>
  );
};
