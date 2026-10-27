import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 active:scale-[0.99]';

  const sizeStyles = {
    sm: 'min-h-[40px] px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'min-h-[44px] px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'min-h-[48px] px-6 py-3 text-base rounded-xl gap-2.5',
  };

  const variantStyles = {
    // Deep forest green primary with crisp white text and emerald hover
    primary: 'bg-[#0b2d21] text-white hover:bg-[#071f16] shadow-sm shadow-[#0b2d21]/15',
    // Fresh lime accent
    accent: 'bg-lime-500 text-slate-950 font-semibold hover:bg-lime-400 shadow-sm shadow-lime-500/20',
    // Clean secondary neutral
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80',
    // Outline button
    outline: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-xs',
    // Subtle ghost
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
