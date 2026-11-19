import React from 'react';
import { Play, Bot, Flame, Clock, Target, Calendar } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function WelcomeHero({
  profileName = 'Student',
  studyTime = '2h 35m',
  goalHours = '4h',
  streak = 7,
  completionPercent = 72,
  onStartTimer,
  onOpenAssistant,
}) {
  // Correct greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Safe user name fallback
  const cleanName = profileName && profileName.trim().length > 0 ? profileName : 'Student';

  // Visually secondary date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-8 shadow-[var(--shadow-card)] transition-all">
      {/* Subtle brand glow accent */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Primary Greeting Hierarchy */}
        <div className="space-y-1.5 min-w-0">
          {/* Secondary Date Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-subtle)] mb-1">
            <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{todayFormatted}</span>
          </div>

          {/* Primary Dashboard Heading */}
          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[var(--color-text-main)] tracking-tight">
            {getGreeting()}, <span className="text-[var(--primary)]">{cleanName}</span> 👋
          </h1>

          {/* Contextual Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-[var(--color-text-muted)] max-w-xl leading-relaxed mt-1">
            Here's your study overview for today. Let's make it productive.
          </p>
        </div>

        {/* Right: Distinct Welcome Hero Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Primary Action: Start Focus Session */}
          <Button
            variant="primary"
            size="md"
            onClick={onStartTimer}
            leftIcon={Play}
            className="shadow-sm shadow-[var(--primary)]/30 font-semibold text-xs sm:text-sm"
          >
            Start Focus Session
          </Button>

          {/* Secondary Action: Ask AI */}
          <Button
            variant="outline"
            size="md"
            onClick={onOpenAssistant}
            leftIcon={Bot}
            className="text-xs sm:text-sm font-semibold"
          >
            Ask AI
          </Button>
        </div>
      </div>

      {/* Embedded High-Level Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
        {/* Metric 1: Today's Focus */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
            <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Today's Focus</span>
          </div>
          <p className="font-display font-bold text-lg sm:text-xl text-[var(--color-text-main)] mt-1">
            {studyTime}
          </p>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            Daily Target: {goalHours}
          </span>
        </div>

        {/* Metric 2: Study Streak */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>Study Streak</span>
          </div>
          <p className="font-display font-bold text-lg sm:text-xl text-[var(--color-text-main)] mt-1">
            {streak} Days
          </p>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            Consistent learning
          </span>
        </div>

        {/* Metric 3: Weekly Target */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
            <Target className="w-3.5 h-3.5" />
            <span>Weekly Target</span>
          </div>
          <p className="font-display font-bold text-lg sm:text-xl text-[var(--color-text-main)] mt-1">
            {completionPercent}%
          </p>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            On track to complete
          </span>
        </div>

        {/* Metric 4: Next Exam Alert */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-amber)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Exam</span>
          </div>
          <p className="font-display font-bold text-lg sm:text-xl text-[var(--color-text-main)] mt-1 truncate">
            Calculus
          </p>
          <span className="text-[11px] text-[var(--color-text-subtle)] truncate block">
            Finals in 8 days
          </span>
        </div>
      </div>
    </div>
  );
}
