import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is nothing to display here yet.',
  action = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-card)] ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-semibold text-lg text-[var(--color-text-main)] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

