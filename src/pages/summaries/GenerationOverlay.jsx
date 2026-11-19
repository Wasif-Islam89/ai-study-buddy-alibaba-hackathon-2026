import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, X } from 'lucide-react';

const STEPS = [
  'Analyzing source text and structure...',
  'Extracting core concepts and key terminology...',
  'Synthesizing high-yield study breakdown...',
];

export default function GenerationOverlay({ isOpen, onCancel }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const timer1 = setTimeout(() => setCurrentStepIndex(1), 600);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Generating Summary
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Our AI model is processing your study input
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            title="Cancel generation"
            className="p-1 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="space-y-3.5">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                    : 'border-[var(--color-border-subtle)] text-[var(--color-text-subtle)] opacity-60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 shrink-0 animate-spin text-[var(--primary)]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-current shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium">{step}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-muted)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

