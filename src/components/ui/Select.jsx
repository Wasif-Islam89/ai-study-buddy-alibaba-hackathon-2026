import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    className = '',
    id,
    disabled = false,
    required = false,
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-[var(--color-text-main)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none rounded-xl border bg-[var(--color-surface-card)] text-[var(--color-text-main)] text-sm px-3.5 py-2.5 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent disabled:opacity-50 disabled:bg-[var(--color-surface-secondary)] disabled:cursor-not-allowed ${
            error
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-text-subtle)]'
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-[var(--color-text-subtle)]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Select;

