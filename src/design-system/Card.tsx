import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'accent' | 'forest';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  as: Component = 'div',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200 shadow-xs text-slate-900',
    muted: 'bg-slate-50 border border-slate-200/80 text-slate-900',
    accent: 'bg-[#f7fee7] border border-lime-200 text-slate-900',
    forest: 'bg-[#0b2d21] border border-[#071f16] text-white',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <Component
      className={`rounded-2xl transition-all ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
