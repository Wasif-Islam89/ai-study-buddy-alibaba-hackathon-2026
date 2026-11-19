import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon = null,
  headerClassName = '',
  bodyClassName = '',
  className = '',
  hoverable = false,
  padding = 'normal',
  as: Component = 'div',
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    tight: 'p-4',
    normal: 'p-5 sm:p-6',
    spacious: 'p-6 sm:p-8',
  };

  const hasHeader = title || subtitle || action || Icon;

  return (
    <Component
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] transition-all duration-200 ${
        hoverable
          ? 'hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-teal)]/40 hover:-translate-y-0.5 cursor-pointer'
          : 'shadow-[var(--shadow-card)]'
      } ${className}`}
      {...props}
    >
      {hasHeader && (
        <div
          className={`flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] ${
            padding === 'none' ? 'p-5' : paddingClasses[padding]
          } pb-4 ${headerClassName}`}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-teal-bg)] text-[var(--color-teal)] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-navy)] dark:text-[var(--color-text-main)]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div
        className={`${padding === 'none' ? '' : paddingClasses[padding]} ${
          hasHeader ? 'pt-5' : ''
        } ${bodyClassName}`}
      >
        {children}
      </div>
    </Component>
  );
}

