import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Printer,
  ChevronDown,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { validateAnswer } from '../../services/quizService';

export default function QuizResultsModal({
  quiz,
  isOpen,
  onClose,
  onRetake,
}) {
  if (!isOpen || !quiz || !quiz.score) return null;

  const { correct, total, percentage } = quiz.score;
  const unanswered = quiz.score.unanswered ?? 0;
  const incorrect = quiz.score.incorrect !== undefined ? quiz.score.incorrect : Math.max(0, total - correct - unanswered);

  let feedbackTitle = 'Keep Practicing!';
  let feedbackDesc = 'Review the detailed explanations below to master the core concepts.';
  let scoreColorClass = 'text-rose-500 stroke-rose-500';

  if (percentage >= 80) {
    feedbackTitle = 'Outstanding Mastery!';
    feedbackDesc = 'You have demonstrated excellent command over this study topic.';
    scoreColorClass = 'text-emerald-500 stroke-emerald-500';
  } else if (percentage >= 60) {
    feedbackTitle = 'Good Effort!';
    feedbackDesc = 'You are on the right track! Review a few weak spots to boost your recall.';
    scoreColorClass = 'text-[var(--primary)] stroke-[var(--primary)]';
  }

  const formatTime = (secs) => {
    if (!secs) return 'N/A';
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  // SVG Gauge computation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleScrollToQuestion = (idx) => {
    const el = document.getElementById(`review-q-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-main)]">
              Quiz Results & Performance Review
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              {quiz.topic} • {quiz.subject}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Hero Performance Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            {/* Circular Gauge */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-[var(--color-border-subtle)] fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className={`fill-none transition-all duration-1000 ${scoreColorClass}`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[var(--color-text-main)]">
                  {percentage}%
                </span>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Score
                </span>
              </div>
            </div>

            {/* Score Title & Feedback */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary-light)] text-[var(--primary)]">
                Completed Session
              </span>
              <h4 className="text-xl font-extrabold text-[var(--color-text-main)]">
                {feedbackTitle}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                {feedbackDesc}
              </p>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 shrink-0 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-[var(--color-border-subtle)] pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
              <div className="flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-xs text-[var(--color-text-muted)]">Correct</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                  {correct} / {total}
                </span>
              </div>
              <div className="flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-xs text-[var(--color-text-muted)]">Incorrect</span>
                <span className="text-sm sm:text-base font-extrabold text-rose-600">
                  {incorrect}
                </span>
              </div>
              {unanswered > 0 && (
                <div className="flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="text-xs text-[var(--color-text-muted)]">Unanswered</span>
                  <span className="text-sm sm:text-base font-extrabold text-amber-600">
                    {unanswered}
                  </span>
                </div>
              )}
              <div className="flex sm:flex-col justify-between items-center sm:items-end col-span-2 sm:col-span-1 pt-1 border-t border-[var(--color-border-subtle)]/60">
                <span className="text-xs text-[var(--color-text-muted)]">Time Spent</span>
                <span className="text-xs sm:text-sm font-bold text-[var(--color-text-main)]">
                  {formatTime(quiz.timeSpent)}
                </span>
              </div>
            </div>
          </div>

          {/* Question Navigator Status Bar (1, 2, 3, 4, 5... with exact Color Legend) */}
          <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-main)]">
                Question Performance Overview:
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Click any number to jump to question
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quiz.questions.map((q, idx) => {
                const validation = validateAnswer(q, q.userAnswer);
                let badgeClass = 'bg-rose-500 text-white border-rose-600'; // Incorrect

                if (!validation.isAnswered) {
                  badgeClass = 'bg-amber-500 text-white border-amber-600'; // Unanswered
                } else if (validation.isCorrect) {
                  badgeClass = 'bg-emerald-500 text-white border-emerald-600'; // Correct
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleScrollToQuestion(idx)}
                    title={`Question ${idx + 1}: ${
                      !validation.isAnswered ? 'Unanswered' : validation.isCorrect ? 'Correct' : 'Incorrect'
                    }`}
                    className={`w-7 h-7 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 ${badgeClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Color Legend */}
            <div className="flex items-center gap-4 text-[11px] pt-1 border-t border-[var(--color-border-subtle)]/70 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green = Correct ({correct})
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Red = Incorrect ({incorrect})
              </span>
              {unanswered > 0 && (
                <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Amber = Unanswered ({unanswered})
                </span>
              )}
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[var(--color-text-main)] flex items-center justify-between">
              <span>Detailed Question Review</span>
              <span className="text-xs font-normal text-[var(--color-text-muted)]">
                {total} Questions
              </span>
            </h4>

            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const userAns = q.userAnswer;
                const validation = validateAnswer(q, userAns);
                const isAnswered = validation.isAnswered;
                const isCorrect = validation.isCorrect;
                const correctDisplay = validation.resolvedCorrectAnswer || q.correctAnswer;

                return (
                  <div
                    key={q.id || idx}
                    id={`review-q-${idx}`}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 shadow-2xs transition-all ${
                      !isAnswered
                        ? 'bg-[var(--color-surface-card)] border-amber-300/60 dark:border-amber-800/60'
                        : isCorrect
                        ? 'bg-[var(--color-surface-card)] border-emerald-300/60 dark:border-emerald-800/60'
                        : 'bg-[var(--color-surface-card)] border-rose-300/60 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 text-white ${
                            !isAnswered
                              ? 'bg-amber-500'
                              : isCorrect
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <p className="text-sm font-bold text-[var(--color-text-main)] leading-snug">
                          {q.question}
                        </p>
                      </div>

                      {/* Status Badge with Text and Icon */}
                      <div className="shrink-0">
                        {!isAnswered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Unanswered</span>
                          </span>
                        ) : isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Answers Comparison Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div
                        className={`p-3 rounded-xl border ${!isAnswered
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                          : isCorrect
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                          }`}
                      >
                        <span className="text-[11px] font-semibold text-[var(--color-text-subtle)] block mb-0.5">
                          Your Answer:
                        </span>
                        <span
                          className={`font-semibold ${!isAnswered
                            ? 'text-amber-700 dark:text-amber-300 italic'
                            : isCorrect
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-rose-700 dark:text-rose-300'
                            }`}
                        >
                          {userAns != null && String(userAns).trim() !== ''
                            ? userAns
                            : '(Not Answered)'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                          Correct Answer:
                        </span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-200">
                          {correctDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-[var(--primary-light)]/30 border border-[var(--primary)]/15 text-xs text-[var(--color-text-main)] space-y-1">
                        <span className="font-bold text-[var(--primary)] block">Explanation:</span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/50">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Results</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
