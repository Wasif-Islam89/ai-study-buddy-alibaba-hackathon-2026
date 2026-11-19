import React from 'react';

export default function PageContainer({
  children,
  title,
  subtitle,
  action,
  maxWidth = '7xl',
  className = '',
}) {
  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const hasHeader = title || subtitle || action;

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${
        maxWidthClasses[maxWidth] || maxWidthClasses['7xl']
      } ${className}`}
    >
      {hasHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-[var(--color-border-subtle)]">
          <div>
            {title && (
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-text-main)] tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-[var(--color-text-muted)] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

