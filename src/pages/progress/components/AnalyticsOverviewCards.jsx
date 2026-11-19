import React from 'react';
import {
  Clock,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Award,
  Flame,
} from 'lucide-react';

export default function AnalyticsOverviewCards({ overview }) {
  if (!overview) return null;

  const cards = [
    {
      title: 'Total Study Time',
      value: `${overview.totalHours} hrs`,
      description: `${overview.totalMinutes} minutes logged`,
      icon: Clock,
      color: 'text-[var(--color-navy)]',
      bgLight: 'bg-[var(--color-navy-light)]',
    },
    {
      title: 'Completed Sessions',
      value: overview.completedSessions,
      description: 'Scheduled timetable sessions finished',
      icon: CheckCircle2,
      color: 'text-[var(--color-status-success)]',
      bgLight: 'bg-[var(--color-status-success-bg)]',
    },
    {
      title: 'Quiz Performance',
      value: overview.quizAttempts > 0 ? `${overview.avgQuizScore}%` : '0%',
      description: `${overview.quizAttempts} ${overview.quizAttempts === 1 ? 'quiz attempted' : 'quizzes attempted'}`,
      icon: HelpCircle,
      color: 'text-[var(--color-teal)]',
      bgLight: 'bg-[var(--color-teal-bg)]',
    },
    {
      title: 'Study Consistency',
      value: `${overview.studyConsistencyPercent}%`,
      description: 'Active days in selected period',
      icon: TrendingUp,
      color: 'text-[var(--color-teal)]',
      bgLight: 'bg-[var(--color-teal-bg)]',
    },
    {
      title: 'Learning Activities',
      value: overview.totalCompletedActivities,
      description: 'Sessions, quizzes & tool milestones',
      icon: Award,
      color: 'text-[var(--color-amber)]',
      bgLight: 'bg-[var(--color-amber-bg)]',
    },
    {
      title: 'Current Streak',
      value: `${overview.currentStreak} Days`,
      description: overview.currentStreak > 0 ? 'Consistent habit building' : 'Start your rhythm today',
      icon: Flame,
      color: 'text-[var(--color-amber)]',
      bgLight: 'bg-[var(--color-amber-bg)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c, idx) => {
        const IconComponent = c.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-card)] hover:border-[var(--primary)]/30 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] line-clamp-1">
                {c.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${c.bgLight} ${c.color} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
                {c.value}
              </p>
              <p className="text-[11px] text-[var(--color-text-subtle)] mt-0.5 line-clamp-1">
                {c.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

