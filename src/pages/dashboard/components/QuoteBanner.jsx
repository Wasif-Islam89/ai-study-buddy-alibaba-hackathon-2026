import React, { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const QUOTES = [
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { quote: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Study hard what interests you the most in the most undisciplined way.", author: "Richard Feynman" },
  { quote: "Focus is a muscle. The more you exercise it, the stronger it gets.", author: "Study Buddy Wisdom" },
];

export default function QuoteBanner() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === quoteIndex && QUOTES.length > 1);

    setQuoteIndex(nextIndex);
    setTimeout(() => setIsRotating(false), 400);
  };

  const current = QUOTES[quoteIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface-card)] via-[var(--color-surface-card)] to-[var(--primary-light)]/15 p-4 sm:p-5 shadow-[var(--shadow-sm)] flex items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        {/* Quote Mark Badge */}
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] shrink-0 shadow-xs">
          <Quote className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Quote Content */}
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-[var(--color-text-main)] italic leading-relaxed truncate sm:whitespace-normal">
            "{current.quote}"
          </p>
          <span className="text-[11px] font-semibold text-[var(--color-text-subtle)] mt-0.5 block">
            — {current.author}
          </span>
        </div>
      </div>

      {/* Refresh Action */}
      <button
        type="button"
        onClick={handleRefresh}
        title="Get another quote"
        aria-label="Refresh daily quote"
        className="p-2 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--primary)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer shrink-0"
      >
        <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
