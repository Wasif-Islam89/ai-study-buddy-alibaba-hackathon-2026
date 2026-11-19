import React, { useState } from 'react';
import { BookOpen, Clock, FileText, Trash2, Copy, Check, ArrowRight, ListOrdered } from 'lucide-react';

export default function SummaryCard({
  summary,
  onOpen,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = `${summary.title}\n\nOverview:\n${summary.overview}\n\nKey Takeaway:\n${summary.takeaway}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSubjectColorClass = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('phys')) return 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20';
    if (s.includes('bio')) return 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success)]/20';
    if (s.includes('psych')) return 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/30';
    if (s.includes('hist')) return 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)] border-[var(--color-amber)]/20';
    if (s.includes('comp') || s.includes('cs') || s.includes('code')) return 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/30';
    return 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20';
  };

  const keyPointsCount = Array.isArray(summary.keyPoints) ? summary.keyPoints.length : 0;

  return (
    <div
      onClick={() => onOpen(summary.id)}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getSubjectColorClass(
                summary.subject
              )}`}
            >
              {summary.subject || 'General'}
            </span>
            {summary.difficulty && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)]">
                {summary.difficulty}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{summary.readingTime || '2 mins'}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 mb-2">
          {summary.title}
        </h4>

        {/* Overview Snippet */}
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed mb-4">
          {summary.overview || summary.takeaway || 'No description preview available.'}
        </p>
      </div>

      {/* Card Footer */}
      <div>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-subtle)]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-[var(--color-text-muted)]">
              <FileText className="w-3.5 h-3.5" />
              <span>{summary.summaryType || 'Detailed'}</span>
            </span>
            {keyPointsCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] text-[var(--color-text-subtle)]">
                • {keyPointsCount} key points
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              title="Copy summary preview"
              className="p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete summary "${summary.title}"?`)) {
                  onDelete(summary.id);
                }
              }}
              title="Delete summary"
              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[var(--color-text-muted)] hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="w-6 h-6 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center ml-1 group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

