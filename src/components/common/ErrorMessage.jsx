import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  message = 'An unexpected error occurred.',
  title = 'Error',
  onRetry = null,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50/70 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <p className="text-sm leading-relaxed">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

