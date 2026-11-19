import React, { useState } from 'react';
import {
  X,
  Search,
  Trash2,
  Play,
  Eye,
  FolderX,
  Award,
} from 'lucide-react';

export default function AllQuizzesModal({
  quizzes = [],
  isOpen,
  onClose,
  onStartQuiz,
  onReviewQuiz,
  onDeleteQuiz,
  onClearAll,
}) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = quizzes.filter((q) => {
    const s = search.toLowerCase();
    return (
      (q.topic || '').toLowerCase().includes(s) ||
      (q.subject || '').toLowerCase().includes(s) ||
      (q.difficulty || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-main)]">
              All Saved Quizzes
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Manage, retake, or review your complete assessment archive
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--color-text-subtle)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, subject, or difficulty..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs sm:text-sm text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
            />
          </div>
        </div>

        {/* Quiz List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--color-text-muted)] space-y-2">
              <FolderX className="w-8 h-8 mx-auto text-[var(--color-text-subtle)]" />
              <p className="font-semibold text-sm">No quizzes found</p>
              <p className="text-[11px]">Try adjusting your search criteria.</p>
            </div>
          ) : (
            filtered.map((quiz) => {
              const hasScore = quiz.score && quiz.score.percentage != null;

              return (
                <div
                  key={quiz.id}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--color-border-subtle)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-bold text-[var(--color-text-main)] truncate">
                        {quiz.topic}
                      </h5>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]">
                        {quiz.difficulty}
                      </span>
                      {hasScore && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            quiz.score.percentage >= 70
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          {quiz.score.percentage}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {quiz.subject} • {quiz.questionCount || quiz.questions?.length} Questions
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onStartQuiz(quiz.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>{hasScore ? 'Retake' : 'Start'}</span>
                    </button>

                    {hasScore && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onReviewQuiz(quiz.id);
                        }}
                        className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] transition-colors cursor-pointer"
                        title="Review answers"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete quiz "${quiz.topic}"?`)) {
                          onDeleteQuiz(quiz.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/50">
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to clear all quiz history? This cannot be undone.'
                )
              ) {
                onClearAll();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

