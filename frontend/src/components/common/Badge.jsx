import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-semibold gap-2',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    dark: 'bg-slate-900 text-white border border-slate-800',

    // Specific domain badges
    'od-available': 'bg-emerald-500/10 text-emerald-700 border border-emerald-300 font-semibold',
    'od-pending': 'bg-amber-500/10 text-amber-700 border border-amber-300 font-semibold animate-pulse',
    'od-approved': 'bg-emerald-500/15 text-emerald-800 border border-emerald-400 font-semibold',
    'od-rejected': 'bg-rose-500/10 text-rose-700 border border-rose-300 font-semibold',
    'registered': 'bg-brand-500/10 text-brand-700 border border-brand-300 font-semibold',
    'attended': 'bg-emerald-500/15 text-emerald-800 border border-emerald-300 font-semibold',
    'internal': 'bg-blue-50 text-blue-700 border border-blue-200',
    'external': 'bg-purple-50 text-purple-700 border border-purple-200'
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    cyan: 'bg-cyan-500',
    dark: 'bg-white',
    'od-available': 'bg-emerald-500',
    'od-pending': 'bg-amber-500',
    'od-approved': 'bg-emerald-500',
    'od-rejected': 'bg-rose-500',
    'registered': 'bg-brand-500',
    'attended': 'bg-emerald-500',
    'internal': 'bg-blue-500',
    'external': 'bg-purple-500'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-all ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
