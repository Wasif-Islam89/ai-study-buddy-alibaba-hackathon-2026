import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { examService } from '../../services/examService';
import {
  Timer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  X,
  Save,
  Check,
  ArrowRight,
  Clock,
  Trash2,
} from 'lucide-react';

export default function ExamPage() {
  const navigate = useNavigate();
  const [examState, setExamState] = useState(() => examService.loadState());
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [topicFilter, setTopicFilter] = useState('all'); // 'all' | 'pending' | 'mastered'
  const [toastMessage, setToastMessage] = useState(null);

  // New exam form state
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeExam =
    examState.exams.find((e) => e.id === examState.activeExamId) ||
    examState.exams[0] ||
    null;

  // Live Countdown interval
  useEffect(() => {
    if (!activeExam?.date) return;

    const updateTimer = () => {
      setCountdown(examService.computeCountdown(activeExam.date));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeExam?.date]);

  // Synchronize state across storage events (Dashboard, other tabs)
  useEffect(() => {
    const handleStorage = (e) => {
      if (!e || e.key === 'aiStudyBuddy.examCountdown.v1') {
        setExamState(examService.loadState());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSelectActiveExam = (id) => {
    const updated = examService.setActiveExam(id);
    setExamState(updated);
    showToast('Active exam target updated.');
  };

  const handleToggleTopic = (topicId) => {
    if (!activeExam) return;
    const updated = examService.toggleTopicMastered(activeExam.id, topicId);
    setExamState(updated);
  };

  const handleAddAiInsightTopic = () => {
    if (!activeExam || !activeExam.aiInsightTopic) return;

    const updatedExam = {
      ...activeExam,
      topics: [
        ...(activeExam.topics || []),
        {
          id: 'topic_' + Date.now().toString(36),
          name: activeExam.aiInsightTopic,
          accuracy: activeExam.aiInsightAccuracy || 48,
          desc: 'High-yield topic flagged from practice quiz accuracy.',
          mastered: false,
        },
      ],
      aiInsightAdded: true,
    };

    const updatedState = examService.saveExam(updatedExam);
    setExamState(updatedState);
    showToast('Topic added to high-yield revision checklist.');
  };

  const handleDeleteExam = (id, title) => {
    if (examState.exams.length <= 1) {
      alert('You must keep at least one tracked exam.');
      return;
    }
    if (window.confirm(`Remove "${title}" from your tracked exams?`)) {
      const updated = examService.deleteExam(id);
      setExamState(updated);
      showToast('Exam removed.');
    }
  };

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const updated = examService.saveExam({
      subject: newSubject,
      title: newTitle.trim(),
      date: newDate,
      color: 'primary',
      topicsTotal: 15,
      topicsCovered: 5,
      sessionsTotal: 10,
      sessionsCompleted: 4,
      quizzesTaken: 2,
      practice: 50,
      revision: 55,
      topics: [],
    });

    setExamState(updated);
    setNewTitle('');
    setNewDate('');
    setIsAddModalOpen(false);
    showToast('Target exam added to countdown.');
  };

  if (!activeExam) return null;

  // Preparation Metrics
  const topicsCoveredPct = activeExam.topicsTotal
    ? Math.round((activeExam.topicsCovered / activeExam.topicsTotal) * 100)
    : 68;

  const sessionsCompletedPct = activeExam.sessionsTotal
    ? Math.round((activeExam.sessionsCompleted / activeExam.sessionsTotal) * 100)
    : 60;

  const overallReadiness = Math.round(
    (topicsCoveredPct + sessionsCompletedPct + Math.min(100, activeExam.quizzesTaken * 16)) / 3
  );

  const activeTopics = activeExam.topics || [];
  const masteredTopicsCount = activeTopics.filter((t) => t.mastered).length;
  const pendingTopicsCount = activeTopics.length - masteredTopicsCount;

  const filteredTopics = activeTopics.filter((t) => {
    if (topicFilter === 'mastered') return t.mastered;
    if (topicFilter === 'pending') return !t.mastered;
    return true;
  });

  // Subject color styling
  const getSubjectColorStyles = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('comp') || s.includes('prog')) {
      return {
        badge: 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20',
        activeBorder: 'border-[var(--color-navy)]',
      };
    }
    if (s.includes('math') || s.includes('calc')) {
      return {
        badge: 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/20',
        activeBorder: 'border-[var(--color-teal)]',
      };
    }
    if (s.includes('phys')) {
      return {
        badge: 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)] border-[var(--color-amber)]/20',
        activeBorder: 'border-[var(--color-amber)]',
      };
    }
    return {
      badge: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success)]/20',
      activeBorder: 'border-[var(--color-status-success)]',
    };
  };

  const subjectStyles = getSubjectColorStyles(activeExam.subject);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200 text-left">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Page Header (Strictly left-aligned) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)]/50">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
              Exam Preparation & Readiness
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Live countdown clocks, syllabus coverage tracking, and high-yield topic revision for your finals
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Target Exam</span>
          </button>
        </div>

        {/* 2. Enhanced Hero Countdown & Overview Banner */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left: Exam Info & Countdown Clock */}
            <div className="space-y-5 max-w-2xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${subjectStyles.badge}`}>
                  {activeExam.subject}
                </span>

                <span className="text-xs text-[var(--color-text-muted)] font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>
                    Exam Date: {new Date(activeExam.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Target Exam</span>
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-main)] tracking-tight">
                  {activeExam.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                  Synchronized with your dashboard countdown and study planner schedule
                </p>
              </div>

              {/* 4 Countdown Tiles */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-md">
                {[
                  { label: 'Days', val: countdown.days },
                  { label: 'Hours', val: countdown.hours },
                  { label: 'Minutes', val: countdown.minutes },
                  { label: 'Seconds', val: countdown.seconds },
                ].map((tile, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-2xs text-center"
                  >
                    <span className="font-mono font-black text-2xl sm:text-3xl text-[var(--color-text-main)] tracking-tight">
                      {String(tile.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                      {tile.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Readiness Summary Panel */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface-secondary)]/60 border border-[var(--color-border-subtle)] space-y-4 lg:w-80 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Readiness Score
                </span>
                <span className="text-base font-black text-[var(--primary)] font-mono">
                  {overallReadiness}%
                </span>
              </div>

              {/* Overall Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border-subtle)] overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                  style={{ width: `${overallReadiness}%` }}
                />
              </div>

              {/* Mini Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border-subtle)] text-xs">
                <div>
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">Topics Covered</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {activeExam.topicsCovered} / {activeExam.topicsTotal}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">Practice Quizzes</span>
                  <span className="font-bold text-[var(--color-text-main)]">
                    {activeExam.quizzesTaken} Taken
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tracked Exams Switcher Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm sm:text-base text-[var(--color-text-main)]">
              Tracked Upcoming Exams ({examState.exams.length})
            </h3>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              Click an exam card to switch active target
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {examState.exams.map((ex) => {
              const isSelected = ex.id === activeExam.id;
              const cd = examService.computeCountdown(ex.date);
              const cardStyles = getSubjectColorStyles(ex.subject);

              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelectActiveExam(ex.id)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 text-left ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--color-surface-card)] ring-2 ring-[var(--primary)]/30 shadow-xs'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)]/40 hover:bg-[var(--color-surface-secondary)]/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cardStyles.badge}`}>
                      {ex.subject}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[var(--color-text-main)] font-mono">
                        {cd.days}d left
                      </span>
                      {examState.exams.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExam(ex.id, ex.title);
                          }}
                          title="Remove exam"
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[var(--color-text-subtle)] hover:text-rose-500 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-text-main)] truncate">
                      {ex.title}
                    </h4>
                    <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-[var(--color-text-subtle)]" />
                      <span>{new Date(ex.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-[11px] text-[var(--primary)] font-bold pt-1 border-t border-[var(--color-border-subtle)]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Countdown Target</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Main Preparation Grid: High-Yield Topics (Left) + Readiness Breakdown (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): High-Yield Topic Mastery (Preserved & Enhanced) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-5">
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                    <span>High-Yield Topic Mastery</span>
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Flagged revision areas and accuracy tracking for {activeExam.subject}
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs font-semibold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setTopicFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      topicFilter === 'all'
                        ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    All ({activeTopics.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopicFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      topicFilter === 'pending'
                        ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    Pending ({pendingTopicsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopicFilter('mastered')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      topicFilter === 'mastered'
                        ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    Mastered ({masteredTopicsCount})
                  </button>
                </div>
              </div>

              {/* AI Revision Suggestion Banner (If present in exam record) */}
              {activeExam.aiInsightTopic && !activeExam.aiInsightAdded && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)]/20 text-[var(--color-text-main)] text-xs">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">AI High-Yield Recommendation:</span>
                      <span className="text-[var(--color-text-muted)]">
                        <strong>"{activeExam.aiInsightTopic}"</strong> showed lower practice accuracy ({activeExam.aiInsightAccuracy}%). Add it to your revision checklist.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAiInsightTopic}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white font-bold text-xs hover:bg-[var(--primary-hover)] transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Checklist</span>
                  </button>
                </div>
              )}

              {/* Topics List */}
              <div className="space-y-3">
                {filteredTopics.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl space-y-2">
                    <p className="font-semibold text-[var(--color-text-main)]">
                      {topicFilter === 'mastered'
                        ? 'No topics marked as mastered yet. Complete your practice reviews!'
                        : topicFilter === 'pending'
                        ? 'All topics are mastered! Great preparation.'
                        : 'No high-yield focus topics flagged yet. Practice quizzes to populate weakness detection.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/quizzes')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      <span>Take a practice quiz in {activeExam.subject}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  filteredTopics.map((t) => (
                    <div
                      key={t.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 rounded-xl border transition-all ${
                        t.mastered
                          ? 'bg-[var(--color-surface-secondary)]/40 border-[var(--color-border-subtle)] opacity-75'
                          : 'bg-[var(--color-surface-card)] border-[var(--color-border)] hover:border-[var(--primary)]/40 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-bold truncate ${
                              t.mastered
                                ? 'line-through text-[var(--color-text-muted)]'
                                : 'text-[var(--color-text-main)]'
                            }`}
                          >
                            {t.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            {t.accuracy}% Accuracy
                          </span>
                          {t.mastered && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Mastered
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                          {t.desc}
                        </p>
                      </div>

                      {/* Topic Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => navigate('/quizzes')}
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] transition-colors cursor-pointer"
                        >
                          Practice
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleTopic(t.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            t.mastered
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                          }`}
                        >
                          {t.mastered ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Mastered</span>
                            </>
                          ) : (
                            <span>Mark Mastered</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Exam Readiness Breakdown & Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Readiness Breakdown Card */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-5">
              <h3 className="font-display font-bold text-base text-[var(--color-text-main)] flex items-center gap-2">
                <Award className="w-5 h-5 text-[var(--primary)]" />
                <span>Preparation Readiness</span>
              </h3>

              <div className="space-y-4 text-xs">
                {/* 1. Topics Covered */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[var(--color-text-main)]">Syllabus Topics</span>
                    <span className="text-[var(--primary)]">{topicsCoveredPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                      style={{ width: `${topicsCoveredPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">
                    {activeExam.topicsCovered} of {activeExam.topicsTotal} curriculum topics revised
                  </span>
                </div>

                {/* 2. Practice Quizzes */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--color-border-subtle)]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[var(--color-text-main)]">Practice Quizzes</span>
                    <span className="text-[var(--color-teal)]">
                      {activeExam.quizzesTaken} Quizzes
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-teal)] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, activeExam.quizzesTaken * 20)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">
                    Multiple-choice and conceptual practice sets
                  </span>
                </div>

                {/* 3. Revision Sessions */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--color-border-subtle)]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[var(--color-text-main)]">Timetable Sessions</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {activeExam.sessionsCompleted} / {activeExam.sessionsTotal}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${sessionsCompletedPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">
                    {sessionsCompletedPct}% of scheduled revision slots completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Add Target Exam Modal (Clean & Validated) */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <h3 className="text-base font-bold text-[var(--color-text-main)]">
                  Add Target Exam
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExam} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[var(--color-text-main)] mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                    <option value="English Literature">English Literature</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-text-main)] mb-1">
                    Exam Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Calculus & Linear Algebra Final"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-text-main)] mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--color-border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Target Exam</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
