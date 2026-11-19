import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2
        className={`${sizeMap[size] || sizeMap.md} animate-spin text-[var(--primary)]`}
      />
      {text && (
        <p className="text-sm font-medium text-[var(--color-text-muted)] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-base)]/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

