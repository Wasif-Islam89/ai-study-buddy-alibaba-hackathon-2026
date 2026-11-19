import React from 'react';
import { History, CheckCircle2, HelpCircle, Layers, Sparkles, FileText, Bot } from 'lucide-react';

export default function RecentActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-display font-bold text-base text-[var(--color-text-main)]">
            Recent Learning Activity
          </h3>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          No learning activities logged yet. Activities will automatically appear here as you study.
        </p>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'session':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-[var(--color-teal)]" />;
      case 'flashcard':
        return <Layers className="w-4 h-4 text-amber-500" />;
      case 'summary':
        return <Sparkles className="w-4 h-4 text-teal-500" />;
      case 'material':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <Bot className="w-4 h-4 text-[var(--primary)]" />;
    }
  };

  const formatActivityDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) return timestamp;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-display font-bold text-base text-[var(--color-text-main)]">
            Recent Learning Activity
          </h3>
        </div>
        <span className="text-xs text-[var(--color-text-muted)] font-medium">
          Last {activities.length} events
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5">
                {getActivityIcon(item.type)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[var(--color-text-main)] truncate">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  <span className="truncate">{item.meta}</span>
                  {item.subject && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-[var(--primary)] truncate">{item.subject}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[10px] text-[var(--color-text-subtle)] font-medium whitespace-nowrap shrink-0 mt-0.5">
              {formatActivityDate(item.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

