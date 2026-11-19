import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Analyzing study topic and core parameters...',
  'Synthesizing questions across selected difficulty...',
  'Formulating distractors & validating key explanations...',
  'Finalizing interactive quiz session...',
];

export default function QuizLoaderOverlay({ isOpen }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }
    const t1 = setTimeout(() => setCurrentStep(1), 500);
    const t2 = setTimeout(() => setCurrentStep(2), 1000);
    const t3 = setTimeout(() => setCurrentStep(3), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-main)]">
              AI Quiz Synthesizer
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Formulating your customized test session
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                  isCurrent
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                    : 'border-[var(--color-border-subtle)] text-[var(--color-text-subtle)] opacity-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin text-[var(--primary)]" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-current shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

