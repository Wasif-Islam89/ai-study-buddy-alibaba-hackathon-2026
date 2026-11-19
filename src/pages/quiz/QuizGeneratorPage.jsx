import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import QuizGeneratorForm from './QuizGeneratorForm';
import QuizRecentSidebar from './QuizRecentSidebar';
import QuizPlayerModal from './QuizPlayerModal';
import QuizResultsModal from './QuizResultsModal';
import AllQuizzesModal from './AllQuizzesModal';
import QuizLoaderOverlay from './QuizLoaderOverlay';
import { quizService, createFreshQuizAttempt } from '../../services/quizService';
import { HelpCircle, History, CheckCircle2 } from 'lucide-react';

export default function QuizGeneratorPage() {
  // Lazy initialize quiz list and stats from LocalStorage (sb_quizzes)
  const [quizzes, setQuizzes] = useState(() => quizService.getAllQuizzes());
  const [stats, setStats] = useState(() => quizService.getQuizStats());

  // Modal States
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlayerQuiz, setActivePlayerQuiz] = useState(null);
  const [activeResultsQuiz, setActiveResultsQuiz] = useState(null);
  const [isAllQuizzesOpen, setIsAllQuizzesOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadQuizzes = () => {
    const list = quizService.getAllQuizzes();
    setQuizzes(list);
    setStats(quizService.getQuizStats());
  };

  // Generate Quiz Handler
  const handleGenerateQuiz = (config) => {
    setIsGenerating(true);

    setTimeout(() => {
      const newQuiz = quizService.generateQuizData(config);
      quizService.saveQuiz(newQuiz);

      reloadQuizzes();
      setIsGenerating(false);
      showToast(`Quiz "${newQuiz.topic}" ready!`);

      // Launch fresh quiz attempt
      setActivePlayerQuiz(createFreshQuizAttempt(newQuiz));
    }, 1600);
  };

  // Start / Retake Quiz as a fresh attempt
  const handleStartQuiz = (quizId) => {
    const quiz = quizService.getQuizById(quizId);
    if (!quiz) return;
    setActivePlayerQuiz(createFreshQuizAttempt(quiz));
  };

  // Review Quiz Results
  const handleReviewQuiz = (quizId) => {
    const quiz = quizService.getQuizById(quizId);
    if (!quiz) return;
    setActiveResultsQuiz(quiz);
  };

  // Delete Quiz
  const handleDeleteQuiz = (quizId) => {
    const target = quizService.getQuizById(quizId);
    quizService.deleteQuiz(quizId);
    reloadQuizzes();
    showToast(`Quiz "${target?.topic || 'Selected'}" deleted.`);
  };

  // Clear All Quizzes
  const handleClearAllQuizzes = () => {
    quizService.clearAllQuizzes();
    reloadQuizzes();
    setIsAllQuizzesOpen(false);
    showToast('Quiz archive cleared.');
  };

  // On Quiz Completion from Player
  const handleQuizSubmitted = (completedQuiz) => {
    quizService.saveQuiz(completedQuiz);
    reloadQuizzes();

    setActivePlayerQuiz(null);
    setActiveResultsQuiz(completedQuiz);
    showToast(`Quiz submitted! Score: ${completedQuiz.score?.percentage}%`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200 text-left">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)]/50">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
              Quiz Generator
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
              Create personalized practice quizzes and test your understanding.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAllQuizzesOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] shadow-xs transition-colors cursor-pointer w-fit self-start sm:self-auto"
            title="Browse all saved quizzes"
          >
            <History className="w-4 h-4 text-[var(--primary)]" />
            <span>Quiz Archive ({quizzes.length})</span>
          </button>
        </div>

        {/* 2. Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: Quiz Creation Workspace */}
          <div className="lg:col-span-2">
            <QuizGeneratorForm
              onGenerate={handleGenerateQuiz}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Quiz Statistics & Recent Quizzes */}
          <div className="lg:col-span-1">
            <QuizRecentSidebar
              quizzes={quizzes}
              stats={stats}
              onStartQuiz={handleStartQuiz}
              onReviewQuiz={handleReviewQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              onViewAll={() => setIsAllQuizzesOpen(true)}
            />
          </div>
        </div>

        {/* Modals & Overlays */}
        <QuizLoaderOverlay isOpen={isGenerating} />

        <QuizPlayerModal
          quiz={activePlayerQuiz}
          isOpen={!!activePlayerQuiz}
          onClose={() => setActivePlayerQuiz(null)}
          onSubmitQuiz={handleQuizSubmitted}
        />

        <QuizResultsModal
          quiz={activeResultsQuiz}
          isOpen={!!activeResultsQuiz}
          onClose={() => setActiveResultsQuiz(null)}
          onRetake={() => {
            const quizToRetake = createFreshQuizAttempt(activeResultsQuiz);
            setActiveResultsQuiz(null);
            setActivePlayerQuiz(quizToRetake);
          }}
        />

        <AllQuizzesModal
          quizzes={quizzes}
          isOpen={isAllQuizzesOpen}
          onClose={() => setIsAllQuizzesOpen(false)}
          onStartQuiz={handleStartQuiz}
          onReviewQuiz={handleReviewQuiz}
          onDeleteQuiz={handleDeleteQuiz}
          onClearAll={handleClearAllQuizzes}
        />
      </div>
    </DashboardLayout>
  );
}
