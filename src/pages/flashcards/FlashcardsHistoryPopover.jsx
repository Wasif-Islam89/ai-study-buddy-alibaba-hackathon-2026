import React from 'react';
import { History, X, Trash2, Award } from 'lucide-react';

export default function FlashcardsHistoryPopover({
  history = [],
  isOpen,
  onClose,
  onClear,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--color-text-main)]">
              Study History
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">
              No study history recorded yet. Complete a flashcard session to log activity!
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <strong className="block font-bold text-[var(--color-text-main)] truncate">
                    {item.deckTitle}
                  </strong>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {item.timestamp}
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--primary-light)] text-[var(--primary)] shrink-0">
                  {item.score || 'Reviewed'}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/50">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-1.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

