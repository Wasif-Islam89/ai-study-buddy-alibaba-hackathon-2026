import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon = null,
    endIcon: EndIcon = null,
    className = '',
    id,
    type = 'text',
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[var(--color-text-main)] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-[var(--color-text-subtle)] pointer-events-none flex items-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`w-full rounded-xl border bg-[var(--color-surface-card)] text-[var(--color-text-main)] text-sm px-3.5 py-2.5 transition-all duration-200 placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent disabled:opacity-50 disabled:bg-[var(--color-surface-secondary)] disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${EndIcon ? 'pr-10' : ''} ${
            error
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-text-subtle)]'
          } ${className}`}
          {...props}
        />

        {EndIcon && (
          <div className="absolute right-3.5 text-[var(--color-text-subtle)] flex items-center">
            {EndIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;

