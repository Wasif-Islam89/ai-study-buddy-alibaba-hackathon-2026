import React from 'react';
import { Sparkles, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIRecommendations({ onOpenPracticeQuiz }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] flex flex-col justify-between transition-all h-full">
      {/* Top subtle glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[var(--primary)]/10 blur-2xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Sparkles className="w-4 h-4" />
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
              AI Recommendations
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            Adaptive
          </span>
        </div>

        {/* Actionable Recommendation Cards */}
        <div className="space-y-3">
          {/* Card 1: Weak Area Summary */}
          <div
            onClick={() => navigate('/summaries')}
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Focus Area
              </span>
              <BookOpen className="w-3.5 h-3.5 text-[var(--color-text-subtle)] group-hover:text-amber-500 transition-colors" />
            </div>

            <h3 className="font-display font-bold text-xs sm:text-sm text-[var(--color-text-main)] mt-1.5">
              Review Mitochondria & Respiration
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              Biology • 15 min structured summary read
            </p>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] group-hover:underline mt-2">
              <span>Read Summary</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Card 2: Adaptive Quiz */}
          <div
            onClick={onOpenPracticeQuiz}
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary-light)]/10 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary)]">
                Daily Drill
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-[var(--color-text-subtle)] group-hover:text-[var(--primary)] transition-colors" />
            </div>

            <h3 className="font-display font-bold text-xs sm:text-sm text-[var(--color-text-main)] mt-1.5">
              Practice: Calculus Derivatives
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              Mathematics • 3 Questions with instant scoring
            </p>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] group-hover:underline mt-2">
              <span>Start Quiz Drill</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
