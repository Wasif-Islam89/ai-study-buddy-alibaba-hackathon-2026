import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  plannerService,
  DAY_NAMES,
  DAY_NAMES_FULL,
  formatWeekRangeLabel,
  formatTime12,
  dateForDayInWeek,
  toISO,
  todayISO,
} from '../../services/plannerService';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Scale,
  GraduationCap,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react';

const CAL_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function PlanOptimizationPage() {
  const [plannerData, setPlannerData] = useState(() => plannerService.loadData());
  const [recommendations, setRecommendations] = useState(null);
  const [isPreviewApplied, setIsPreviewApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = plannerService.loadData();
    setPlannerData(data);
    const recs = plannerService.computeRecommendations(data);
    setRecommendations(recs);
  }, []);

  const handlePrevWeek = () => {
    const updated = {
      ...plannerData,
      weekOffset: (plannerData.weekOffset || 0) - 1,
    };
    plannerService.saveData(updated);
    setPlannerData(updated);
    setRecommendations(plannerService.computeRecommendations(updated));
  };

  const handleNextWeek = () => {
    const updated = {
      ...plannerData,
      weekOffset: (plannerData.weekOffset || 0) + 1,
    };
    plannerService.saveData(updated);
    setPlannerData(updated);
    setRecommendations(plannerService.computeRecommendations(updated));
  };

  const handleApplyOptimization = () => {
    const { data } = plannerService.applyOptimization(plannerData, recommendations);
    navigate('/study-planner');
  };

  const handleKeepCurrentPlan = () => {
    plannerService.keepCurrentPlan(plannerData);
    navigate('/study-planner');
  };

  if (!recommendations) return null;

  const { load, exam, weak } = recommendations;

  // Compute preview sessions if toggled
  let displaySessions = plannerData.sessions;
  if (isPreviewApplied) {
    const cloned = JSON.parse(JSON.stringify(plannerData));
    const result = plannerService.applyOptimization(cloned, recommendations);
    displaySessions = result.data.sessions;
  }

  const getSubjectColorStyles = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('comp') || s.includes('prog') || s.includes('c ')) {
      return 'bg-[var(--color-navy-light)] border-[var(--color-navy)]/20 text-[var(--color-navy)]';
    }
    if (s.includes('math') || s.includes('calc')) {
      return 'bg-[var(--color-teal-bg)] border-[var(--color-teal)]/20 text-[var(--color-teal)]';
    }
    if (s.includes('phys')) {
      return 'bg-[var(--color-amber-bg)] border-[var(--color-amber)]/20 text-[var(--color-amber)]';
    }
    if (s.includes('bio')) {
      return 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success)]/20 text-[var(--color-status-success)]';
    }
    return 'bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-[var(--color-text-main)]';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] flex items-center gap-2.5">
              <span>AI Plan Optimization</span>
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Review and preview intelligent adjustments to balance workload, prep for exams, and reinforce weak topics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)]">
              <button
                type="button"
                onClick={handlePrevWeek}
                className="p-1 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[var(--color-text-main)] px-2 whitespace-nowrap">
                {formatWeekRangeLabel(plannerData.weekOffset || 0)}
              </span>
              <button
                type="button"
                onClick={handleNextWeek}
                className="p-1 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Interactive Calendar Canvas (Left) + AI Recommendations Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= Left: Calendar Canvas ================= */}
          <div className="lg:col-span-7 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-main)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  <span>Timetable Canvas</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {isPreviewApplied
                    ? 'Showing proposed optimized schedule'
                    : 'Showing current schedule before optimization'}
                </p>
              </div>

              {/* Preview Toggle Button */}
              <button
                type="button"
                onClick={() => setIsPreviewApplied(!isPreviewApplied)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isPreviewApplied
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isPreviewApplied ? 'Previewing Changes' : 'Preview Optimized'}</span>
              </button>
            </div>

            {/* 7-Day Day View Table */}
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-7 gap-2.5 min-w-[540px]">
                {DAY_NAMES.map((name, dayIdx) => {
                  const date = dateForDayInWeek(plannerData.weekOffset, dayIdx);
                  const isToday = toISO(date) === todayISO();
                  const daySessions = displaySessions
                    .filter((s) => s.day === dayIdx)
                    .sort((a, b) => a.time.localeCompare(b.time));

                  return (
                    <div
                      key={dayIdx}
                      className="flex flex-col min-h-[360px] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/30 p-2 space-y-2"
                    >
                      {/* Day Header */}
                      <div
                        className={`text-center py-1.5 rounded-lg text-xs ${
                          isToday
                            ? 'bg-[var(--primary)] text-white font-bold'
                            : 'bg-[var(--color-surface-card)] text-[var(--color-text-main)] font-semibold'
                        }`}
                      >
                        <span className="block text-[10px] uppercase opacity-80">{name}</span>
                        <span className="text-sm font-extrabold">{date.getDate()}</span>
                      </div>

                      {/* Sessions */}
                      <div className="flex-1 space-y-1.5">
                        {daySessions.length === 0 ? (
                          <div className="h-20 flex items-center justify-center text-[10px] text-[var(--color-text-subtle)]">
                            Free
                          </div>
                        ) : (
                          daySessions.map((s) => (
                            <div
                              key={s.id}
                              className={`p-2 rounded-lg border text-[11px] leading-tight space-y-0.5 shadow-xs ${getSubjectColorStyles(
                                s.subject
                              )}`}
                            >
                              <strong className="block truncate font-bold">{s.title || s.subject}</strong>
                              <span className="block text-[10px] opacity-80">
                                {formatTime12(s.time)} ({s.duration}m)
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= Right: AI Optimization Recommendations Panel ================= */}
          <div className="lg:col-span-5 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-main)]">
                  Proposed Recommendations
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Algorithmic schedule optimization based on learning science
                </p>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="space-y-4">
              {/* Rec 1: Load Balancing */}
              <div
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  load.balanced
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <Scale className="w-4 h-4" />
                    <span>1. Load Balancing</span>
                  </div>
                  {load.balanced && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                      Balanced
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-main)] leading-relaxed">
                  {load.balanced ? (
                    'Your weekly study load is well distributed across days with no single day being overloaded.'
                  ) : (
                    <>
                      Your {DAY_NAMES_FULL[load.maxDay]} is overloaded with{' '}
                      <strong>{(load.maxVal / 60).toFixed(1)} hours</strong>. We suggest moving{' '}
                      <strong className="text-[var(--primary)]">
                        {load.candidate?.subject}
                      </strong>{' '}
                      to {DAY_NAMES_FULL[load.minDay]}.
                    </>
                  )}
                </p>

                {!load.balanced && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] pt-1">
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>
                      Shifts {(load.candidate?.duration / 60).toFixed(1).replace(/\.0$/, '')} hr to{' '}
                      {DAY_NAMES_FULL[load.minDay]} at {formatTime12(load.targetTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* Rec 2: Exam Preparation */}
              <div className="p-4 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-light)]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--primary)]">
                    <GraduationCap className="w-4 h-4" />
                    <span>2. Exam Preparation</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)] text-white">
                    In {exam.daysUntil} Days
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-main)] leading-relaxed">
                  Your <strong className="text-[var(--primary)]">{plannerData.examSubject}</strong>{' '}
                  exam is approaching in <strong>{exam.daysUntil} days</strong>. AI recommends adding{' '}
                  <strong>{exam.slots.length} spaced revision sessions</strong> across your lightest days.
                </p>

                {exam.slots.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exam.slots.map((slot, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--color-surface-card)] border border-[var(--primary)]/20 text-[var(--color-text-main)] shadow-xs"
                      >
                        {DAY_NAMES[slot.day]} {formatTime12(slot.time).replace(':00', '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rec 3: Weak Topic Integration */}
              <div
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  weak.resolved
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-[var(--color-amber)]/30 bg-[var(--color-amber-bg)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
                    weak.resolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-[var(--color-amber-text)]'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>3. Weak Topic Reinforcement</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      weak.resolved
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[var(--color-amber)] text-white'
                    }`}
                  >
                    {weak.resolved ? 'Resolved' : 'Recommended'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-main)] leading-relaxed">
                  {weak.resolved ? (
                    <>
                      <strong className="text-[var(--primary)]">"{plannerData.weakTopic}"</strong> is
                      already scheduled for dedicated practice on your timetable.
                    </>
                  ) : (
                    <>
                      <strong className="text-[var(--primary)]">"{plannerData.weakTopic}"</strong> was
                      flagged as needing review from your quizzes. We recommend adding a dedicated
                      60-minute session on {DAY_NAMES_FULL[weak.day]} at {formatTime12(weak.time)}.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-[var(--color-border-subtle)]">
              <button
                type="button"
                onClick={handleApplyOptimization}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply AI Optimization</span>
              </button>

              <button
                type="button"
                onClick={handleKeepCurrentPlan}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span>Keep My Current Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

