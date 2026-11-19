import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FlowSteps({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: 'Upload Material', path: '/materials' },
    { number: 2, label: 'Document Structure', path: '/structure' },
    { number: 3, label: 'Complete Notes', path: '/notes' },
  ];

  return (
    <div className="flex items-center justify-between overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4 sm:p-5 shadow-[var(--shadow-card)] mb-6 sm:mb-8 transition-colors">
      {steps.map((step, idx) => {
        const isDone = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isPending = currentStep < step.number;

        return (
          <React.Fragment key={step.number}>
            {/* Step Item */}
            <Link
              to={isDone ? step.path : '#'}
              className={`flex items-center gap-2.5 sm:gap-3 shrink-0 select-none ${
                isDone ? 'cursor-pointer hover:opacity-80' : isPending ? 'pointer-events-none' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-[var(--primary)] text-white ring-4 ring-[var(--primary-light)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : step.number}
              </div>

              <span
                className={`text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap ${
                  isActive
                    ? 'text-[var(--primary)]'
                    : isDone
                    ? 'text-[var(--color-text-main)]'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </Link>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 min-w-[20px] sm:min-w-[40px] h-0.5 mx-2 sm:mx-4 transition-colors ${
                  currentStep > step.number
                    ? 'bg-emerald-600'
                    : 'bg-[var(--color-border)]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

