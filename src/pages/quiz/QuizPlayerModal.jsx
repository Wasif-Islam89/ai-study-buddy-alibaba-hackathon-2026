import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { gradeQuiz, validateAnswer } from '../../services/quizService';

export default function QuizPlayerModal({
  quiz,
  isOpen,
  onClose,
  onSubmitQuiz,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [instantFeedback, setInstantFeedback] = useState(true);

  // Initialize or reset answers on quiz open
  useEffect(() => {
    if (!quiz || !isOpen) return;

    setCurrentIndex(0);
    setFlagged({});
    setSecondsElapsed(0);

    // Only preload answers if this is an unfinished attempt, never on fresh retakes
    const initialAnswers = {};
    if (Array.isArray(quiz.questions) && !quiz.completedAt && !quiz.score) {
      quiz.questions.forEach((q, idx) => {
        if (q.userAnswer != null && q.userAnswer !== '') {
          initialAnswers[idx] = q.userAnswer;
        }
      });
    }
    setAnswers(initialAnswers);
  }, [quiz?.id, quiz?.completedAt, isOpen]);

  // Timer interval
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return null;
  }

  const currentQ = quiz.questions[currentIndex] || quiz.questions[0];
  const totalQuestions = quiz.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (ans) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: ans,
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleFinish = () => {
    const answeredCount = Object.keys(answers).filter(
      (k) => answers[k] != null && String(answers[k]).trim() !== ''
    ).length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit your quiz?`
      );
      if (!confirmSubmit) return;
    }

    // Grade quiz using the centralized validation utility
    const grading = gradeQuiz(quiz.questions, answers);

    const completedQuiz = {
      ...quiz,
      questions: grading.gradedQuestions,
      completedAt: new Date().toISOString(),
      timeSpent: secondsElapsed,
      score: {
        correct: grading.correct,
        incorrect: grading.incorrect,
        unanswered: grading.unanswered,
        total: grading.total,
        percentage: grading.percentage,
      },
    };

    onSubmitQuiz(completedQuiz);
  };

  const isCurrentFlagged = !!flagged[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const hasSelectedCurrent = selectedAnswer != null && String(selectedAnswer).trim() !== '';

  // Current Question Validation in Instant Feedback Mode
  const currentValidation = hasSelectedCurrent ? validateAnswer(currentQ, selectedAnswer) : null;
  const isCurrentCorrect = currentValidation?.isCorrect;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-left">
        {/* Top Progress Bar */}
        <div className="w-full h-1.5 bg-[var(--color-surface-secondary)]">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border-subtle)]">
          <div className="min-w-0 pr-3">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] truncate max-w-sm sm:max-w-md">
              {quiz.topic}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              {quiz.subject} • {quiz.difficulty} Level
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Instant Feedback Toggle */}
            <button
              type="button"
              onClick={() => setInstantFeedback(!instantFeedback)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                instantFeedback
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
              }`}
              title="Toggle instant answer checking"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{instantFeedback ? 'Instant Check ON' : 'Instant Check OFF'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-xs font-bold text-[var(--color-text-main)]">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Question Stats Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--primary-light)] text-[var(--primary)]">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] uppercase">
                {currentQ.type === 'tf' ? 'True / False' : currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isCurrentFlagged
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                    : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] border border-transparent'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-current' : ''}`} />
                <span>{isCurrentFlagged ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border-subtle)]">
            <h4 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] leading-relaxed">
              {currentQ.question}
            </h4>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options && currentQ.options.length > 0 ? (
              currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswer === opt;
                const letter = String.fromCharCode(65 + optIdx);

                // Option Validation Styling
                let optStyle =
                  'border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-secondary)]';
                let badgeStyle =
                  'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border-[var(--color-border)]';
                let indicatorIcon = null;

                if (instantFeedback && hasSelectedCurrent) {
                  // In Instant Feedback Mode, clearly mark Correct vs Incorrect
                  const isThisOptCorrect = validateAnswer(currentQ, opt).isCorrect;

                  if (isSelected) {
                    if (isCurrentCorrect) {
                      optStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold shadow-xs';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                      indicatorIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />;
                    } else {
                      optStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-semibold shadow-xs';
                      badgeStyle = 'bg-rose-600 text-white border-rose-600';
                      indicatorIcon = <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />;
                    }
                  } else if (isThisOptCorrect) {
                    // Show correct answer when user made wrong choice
                    optStyle =
                      'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium';
                    badgeStyle = 'bg-emerald-600/80 text-white border-emerald-600';
                    indicatorIcon = (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                        ✓ Correct Answer
                      </span>
                    );
                  }
                } else if (isSelected) {
                  // Standard Exam Mode (Selected State)
                  optStyle =
                    'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-semibold shadow-xs';
                  badgeStyle = 'bg-[var(--primary)] text-white border-[var(--primary)]';
                  indicatorIcon = (
                    <div className="w-4 h-4 rounded-full border border-[var(--primary)] bg-[var(--primary)] flex items-center justify-center shrink-0 ml-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  );
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectAnswer(opt)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${badgeStyle}`}
                      >
                        {currentQ.type === 'tf' ? (opt === 'True' ? 'T' : 'F') : letter}
                      </span>
                      <span className="leading-snug break-words">{opt}</span>
                    </div>

                    {indicatorIcon}
                  </button>
                );
              })
            ) : (
              // Short Answer text input
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] mb-2">
                  Your Answer:
                </label>
                <textarea
                  rows={4}
                  value={selectedAnswer || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="Type your explanation or answer here..."
                  className="w-full p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-sm text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                />
              </div>
            )}
          </div>

          {/* Instant Explanation Box when answered in Instant Feedback Mode */}
          {instantFeedback && hasSelectedCurrent && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
                isCurrentCorrect
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-[var(--color-text-main)]'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-[var(--color-text-main)]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1.5">
                {isCurrentCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 dark:text-emerald-300">Great Job! That's Correct.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-rose-700 dark:text-rose-300">
                      Incorrect Choice. Correct: {currentValidation?.resolvedCorrectAnswer || currentQ.correctAnswer}
                    </span>
                  </>
                )}
              </div>
              {currentQ.explanation && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </p>
              )}
            </div>
          )}

          {/* Question Jump Grid Navigator */}
          <div className="pt-4 border-t border-[var(--color-border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--color-text-subtle)]">
                Question Navigator:
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                {Object.keys(answers).filter((k) => answers[k] != null && String(answers[k]).trim() !== '').length} / {totalQuestions} Answered
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quiz.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const userAns = answers[idx];
                const isAnswered = userAns != null && String(userAns).trim() !== '';
                const isFlag = !!flagged[idx];

                let pillClass =
                  'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]';

                if (instantFeedback && isAnswered) {
                  // Real-time verification: GREEN for actual correct, RED for actual incorrect!
                  const val = validateAnswer(q, userAns);
                  if (val.isCorrect) {
                    pillClass = 'border-emerald-500 bg-emerald-500 text-white font-bold shadow-2xs';
                  } else {
                    pillClass = 'border-rose-500 bg-rose-500 text-white font-bold shadow-2xs';
                  }
                } else if (isAnswered) {
                  // Exam Mode: Deep Navy for answered, NEVER DECEPTIVE GREEN!
                  pillClass =
                    'border-[var(--color-navy)] bg-[var(--color-navy-light)] text-[var(--color-navy)] font-bold';
                } else if (isFlag) {
                  pillClass = 'border-amber-500 bg-amber-500/20 text-amber-700 font-bold';
                }

                if (isCurrent) {
                  pillClass += ' ring-2 ring-[var(--color-teal)] ring-offset-1 font-extrabold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs border flex items-center justify-center transition-all cursor-pointer ${pillClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Clear Navigator Legend */}
            <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-subtle)] pt-1 flex-wrap">
              {instantFeedback ? (
                <>
                  <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Correct
                  </span>
                  <span className="flex items-center gap-1 font-medium text-rose-700 dark:text-rose-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Incorrect
                  </span>
                  <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)]" /> Unanswered
                  </span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Flagged
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1 font-medium text-[var(--color-navy)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-navy)]" /> Answered
                  </span>
                  <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)]" /> Unanswered
                  </span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Flagged
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/50">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
