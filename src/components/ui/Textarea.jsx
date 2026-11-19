import React, { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    className = '',
    id,
    disabled = false,
    required = false,
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold text-[var(--color-text-main)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`w-full rounded-xl border bg-[var(--color-surface-card)] text-[var(--color-text-main)] text-sm p-3.5 transition-all duration-200 placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent disabled:opacity-50 disabled:bg-[var(--color-surface-secondary)] disabled:cursor-not-allowed resize-y ${
          error
            ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-text-subtle)]'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs font-medium text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Textarea;

