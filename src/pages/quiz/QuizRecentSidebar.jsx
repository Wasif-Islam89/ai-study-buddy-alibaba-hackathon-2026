import React from 'react';
import { Award, CheckCircle2, Clock, Trash2, ArrowRight, Play, Eye, RotateCcw, Calendar } from 'lucide-react';

export default function QuizRecentSidebar({
  quizzes = [],
  stats,
  onStartQuiz,
  onReviewQuiz,
  onDeleteQuiz,
  onViewAll,
}) {
  const recent = quizzes.slice(0, 5);

  const formatDate = (isoString) => {
    if (!isoString) return null;
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-5 text-left">
      {/* 1. Quiz Statistics Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
            {stats.totalCompleted}
          </p>
          <span className="text-[11px] text-[var(--color-text-subtle)] mt-0.5 block">
            {stats.totalQuizzes} total {stats.totalQuizzes === 1 ? 'quiz' : 'quizzes'}
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] mb-1">
            <Award className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Avg Score</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[var(--primary)]">
            {stats.avgScore}%
          </p>
          <span className="text-[11px] text-[var(--color-text-subtle)] mt-0.5 block">
            Across attempts
          </span>
        </div>
      </div>

      {/* 2. Recent Quizzes Card */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
          <h3 className="text-sm font-bold text-[var(--color-text-main)]">
            Recent Assessments
          </h3>
          {quizzes.length > 0 && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
            >
              Archive ({quizzes.length})
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--color-text-muted)] space-y-1.5">
            <p className="font-semibold text-[var(--color-text-main)]">No recent quizzes yet</p>
            <p className="text-[11px] text-[var(--color-text-subtle)]">
              Use the configuration panel to generate your first quiz.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recent.map((quiz) => {
              const hasScore = quiz.score && quiz.score.percentage != null;
              const formattedDate = formatDate(quiz.completedAt || quiz.createdAt);

              return (
                <div
                  key={quiz.id}
                  className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)] transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-main)] truncate">
                        {quiz.topic}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-muted)] truncate flex items-center gap-1.5 mt-0.5">
                        <span>{quiz.subject}</span>
                        <span>•</span>
                        <span>{quiz.difficulty}</span>
                        <span>•</span>
                        <span>{quiz.questionCount || quiz.questions?.length} Qs</span>
                        {formattedDate && (
                          <>
                            <span>•</span>
                            <span className="text-[10px] text-[var(--color-text-subtle)]">{formattedDate}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {hasScore ? (
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold shrink-0 ${quiz.score.percentage >= 70
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                      >
                        {quiz.score.percentage}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 shrink-0">
                        Ready
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-[var(--color-border-subtle)]/70 text-xs">
                    <button
                      type="button"
                      onClick={() => onStartQuiz(quiz.id)}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      {hasScore ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{hasScore ? 'Retake' : 'Start'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {hasScore && (
                        <button
                          type="button"
                          onClick={() => onReviewQuiz(quiz.id)}
                          title="Review quiz answers"
                          aria-label="Review quiz answers"
                          className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-card)] transition-colors cursor-pointer"
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
                        title="Delete quiz"
                        aria-label="Delete quiz"
                        className="p-1 rounded-md text-[var(--color-text-subtle)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
