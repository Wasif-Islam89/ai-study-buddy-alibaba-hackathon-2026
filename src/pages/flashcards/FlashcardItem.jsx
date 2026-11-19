import React from 'react';
import { Bookmark, RotateCw, CheckCircle2, AlertCircle, HelpCircle, Check } from 'lucide-react';

export default function FlashcardItem({
  card,
  isFlipped,
  onFlip,
  onToggleBookmark,
  onMarkStatus,
}) {
  if (!card) return null;

  return (
    <div
      className="w-full max-w-xl mx-auto h-[380px] sm:h-[400px] cursor-pointer select-none [perspective:1000px]"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
      aria-label="Flashcard. Click or press space to flip."
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ================= Front Side (Question) ================= */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow text-left"
        >
          {/* Top: Tag & Bookmark */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary-light)] text-[var(--primary)] uppercase tracking-wider">
              {card.tag || 'Concept'}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                card.bookmarked
                  ? 'border-amber-400 bg-amber-50 text-amber-500 dark:bg-amber-950/40'
                  : 'border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-amber-500 hover:border-amber-400/50'
              }`}
              title={card.bookmarked ? 'Remove bookmark' : 'Bookmark card'}
              aria-label="Bookmark card"
            >
              <Bookmark className={`w-4 h-4 ${card.bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Center: Question */}
          <div className="my-auto text-center space-y-3 px-2 sm:px-4">
            <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest block">
              Question
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[var(--color-text-main)] leading-relaxed">
              {card.question}
            </h3>
          </div>

          {/* Bottom: Flip hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-subtle)] font-medium pt-2 border-t border-[var(--color-border-subtle)]/50">
            <RotateCw className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Click or press space to reveal answer</span>
          </div>
        </div>

        {/* ================= Back Side (Answer) ================= */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow text-left"
        >
          {/* Top: Tag & Bookmark */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 uppercase tracking-wider">
              Answer & Solution
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                card.bookmarked
                  ? 'border-amber-400 bg-amber-50 text-amber-500 dark:bg-amber-950/40'
                  : 'border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-amber-500 hover:border-amber-400/50'
              }`}
              title={card.bookmarked ? 'Remove bookmark' : 'Bookmark card'}
              aria-label="Bookmark card"
            >
              <Bookmark className={`w-4 h-4 ${card.bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Center: Answer & Code Snippet */}
          <div className="my-auto overflow-y-auto max-h-[210px] space-y-3 px-1 scrollbar-none text-left">
            <p className="text-sm sm:text-base font-medium text-[var(--color-text-main)] leading-relaxed whitespace-pre-line">
              {card.answer}
            </p>

            {card.code && (
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
                <pre>{card.code}</pre>
              </div>
            )}
          </div>

          {/* Bottom: Mastery Rating Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarkStatus('practice');
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Need Practice</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarkStatus('known');
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mastered</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
