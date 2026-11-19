import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-hover)] shadow-xs hover:shadow-sm font-semibold',
    secondary:
      'bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:bg-[var(--color-border)]',
    outline:
      'border border-[var(--color-border)] bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] hover:border-[var(--color-teal)]',
    ghost:
      'bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]',
    navy:
      'bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-dark)] shadow-xs font-semibold',
    danger:
      'bg-[var(--color-error)] text-white hover:opacity-90 shadow-xs font-semibold',
    success:
      'bg-[var(--color-status-success)] text-white hover:opacity-90 shadow-xs font-semibold',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  );
}

