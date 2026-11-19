import React from 'react';
import { Lightbulb, CheckCircle2, TrendingUp, AlertTriangle, Info } from 'lucide-react';

export default function PerformanceInsightsCard({ insights, hasData }) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-display font-bold text-base text-[var(--color-text-main)]">
            Performance Insights
          </h3>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          No learning patterns recorded yet. As you complete quizzes, mark timetable sessions complete, and review flashcards, rule-based performance observations will appear here.
        </p>
      </div>
    );
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-transparent border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-display font-bold text-base text-[var(--color-text-main)]">
            Performance Insights
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
          Rule-based
        </span>
      </div>

      {/* Insight Bullet Cards */}
      <div className="space-y-3">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xs"
          >
            {getInsightIcon(item.type)}
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text-main)]">
                {item.title}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

