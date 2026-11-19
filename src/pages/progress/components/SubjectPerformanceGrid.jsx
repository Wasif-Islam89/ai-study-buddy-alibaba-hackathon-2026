import React from 'react';
import { BookOpen, CheckCircle2, HelpCircle, Clock, Check, AlertCircle } from 'lucide-react';

export default function SubjectPerformanceGrid({ subjectAnalytics }) {
  if (!subjectAnalytics || subjectAnalytics.length === 0) return null;

  // Subject badge color mapping
  const getSubjectColor = (name) => {
    const s = name.toLowerCase();
    if (s.includes('comp') || s.includes('prog')) return 'text-[var(--color-navy)] bg-[var(--color-navy-light)] border-[var(--color-navy)]/20';
    if (s.includes('math') || s.includes('calc')) return 'text-[var(--color-teal)] bg-[var(--color-teal-bg)] border-[var(--color-teal)]/20';
    if (s.includes('phys')) return 'text-[var(--color-amber)] bg-[var(--color-amber-bg)] border-[var(--color-amber)]/20';
    if (s.includes('bio')) return 'text-[var(--color-status-success)] bg-[var(--color-status-success-bg)] border-[var(--color-status-success)]/20';
    return 'text-[var(--color-teal)] bg-[var(--color-teal-bg)] border-[var(--color-teal)]/20';
  };

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-navy)] dark:text-[var(--color-text-main)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--color-teal)]" />
            <span>Subject-wise Learning Performance</span>
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Cross-tool breakdown across timetable sessions, quiz accuracy, and mastery
          </p>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjectAnalytics.map((sub, idx) => {
          const badgeClass = getSubjectColor(sub.name);

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)]/30 transition-all space-y-3.5"
            >
              {/* Top row: Subject Title & Pill */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm sm:text-base text-[var(--color-text-main)] truncate">
                  {sub.name}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass} shrink-0`}>
                  {sub.studyHours} hrs
                </span>
              </div>

              {/* Stat Chips Row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">
                    Sessions
                  </span>
                  <span className="text-sm font-bold text-[var(--color-text-main)]">
                    {sub.completedSessions}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">
                    Quizzes
                  </span>
                  <span className="text-sm font-bold text-[var(--color-text-main)]">
                    {sub.quizAttempts}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">
                    Avg Score
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      sub.quizAttempts > 0
                        ? sub.avgScore >= 75
                          ? 'text-emerald-500'
                          : sub.avgScore >= 60
                          ? 'text-amber-500'
                          : 'text-rose-500'
                        : 'text-[var(--color-text-subtle)]'
                    }`}
                  >
                    {sub.quizAttempts > 0 ? `${sub.avgScore}%` : '—'}
                  </span>
                </div>
              </div>

              {/* Observed Strengths & Improvement Points */}
              <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-1.5 text-xs">
                {sub.strength && (
                  <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="leading-tight">{sub.strength}</span>
                  </div>
                )}
                {sub.needsWork && (
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="leading-tight">{sub.needsWork}</span>
                  </div>
                )}
                {!sub.strength && !sub.needsWork && (
                  <p className="text-[11px] text-[var(--color-text-subtle)] italic">
                    Ready to track study sessions and quizzes
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

