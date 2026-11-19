import React from 'react';
import { Sparkles, Check, Loader2, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { ANALYSIS_STEPS } from '../../../utils/materialUtils';

export default function AnalysisPipeline({
  stepStates,
  aiSubtitle,
  isComplete,
  onNavigateNext,
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 sm:p-6 shadow-[var(--shadow-card)] flex flex-col justify-between h-full transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 text-[var(--primary)] mb-1">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-display font-bold text-lg text-[var(--color-text-main)]">
            AI Document Analysis
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-6">
          {aiSubtitle}
        </p>

        {/* 5-Step Pipeline */}
        <div className="space-y-5 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[var(--color-border)] -z-0" />

          {ANALYSIS_STEPS.map((step) => {
            const state = stepStates[step.key] || 'pending'; // 'pending' | 'active' | 'done'

            return (
              <div key={step.key} className="relative z-10 flex items-start gap-3.5">
                {/* Marker */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all ${
                    state === 'done'
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/10'
                      : state === 'active'
                      ? 'bg-[var(--primary)] text-white ring-4 ring-[var(--primary-light)]'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] border border-[var(--color-border)]'
                  }`}
                >
                  {state === 'done' ? (
                    <Check className="w-4 h-4" />
                  ) : state === 'active' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    step.key
                  )}
                </div>

                {/* Body */}
                <div className={`flex-1 min-w-0 ${state === 'pending' ? 'opacity-50' : ''}`}>
                  <h4
                    className={`font-display font-semibold text-sm ${
                      state === 'active'
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--color-text-main)]'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {state === 'done'
                      ? step.doneText
                      : state === 'active'
                      ? step.activeText
                      : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="pt-6 border-t border-[var(--color-border-subtle)] mt-6">
        <Button
          variant="primary"
          size="lg"
          disabled={!isComplete}
          onClick={onNavigateNext}
          rightIcon={ArrowRight}
          className="w-full"
        >
          View Document Structure
        </Button>
      </div>
    </div>
  );
}

