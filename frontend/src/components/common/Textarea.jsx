import React from 'react';

export const Textarea = ({
  label,
  id,
  rows = 4,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  maxLength,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-xs text-slate-400">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={`block w-full rounded-xl border ${
          error
            ? 'border-rose-400 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500/20'
        } p-3.5 text-sm transition focus:outline-none focus:ring-4 disabled:bg-slate-100 disabled:text-slate-400 resize-y ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
};
