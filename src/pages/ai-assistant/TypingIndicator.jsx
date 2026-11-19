import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 my-4 animate-in fade-in duration-200">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 h-5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" />
          </div>
          <span className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1 ml-1.5">
            <Sparkles className="w-3 h-3 text-[var(--primary)]" />
            AI Study Buddy is thinking...
          </span>
        </div>
      </div>
    </div>
  );
}
