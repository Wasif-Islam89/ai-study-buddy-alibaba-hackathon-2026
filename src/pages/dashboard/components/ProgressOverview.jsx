import React from 'react';
import { Flame, Clock, CheckCircle2 } from 'lucide-react';

export default function ProgressOverview({
  studyTime = '2h 35m',
  goalHours = '4h',
  streak = 7,
  completionPercent = 72,
}) {
  // SVG circular ring calculation (r=45, circumference ~ 282.74)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercent / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] flex flex-col justify-between transition-all h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
            Today's Progress
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Daily focus goal and habit tracking
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active</span>
        </div>
      </div>

      {/* Circular Progress Gauge */}
      <div className="flex items-center justify-center py-2">
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-[var(--color-surface-secondary)]"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--color-teal)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Readout */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-text-main)]">
              {completionPercent}%
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Goal Achieved
            </span>
          </div>
        </div>
      </div>

      {/* Compact Stat Boxes (Non-clickable, read-only summary) */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-border-subtle)] mt-4">
        {/* Study Time Box */}
        <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
            <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Logged Time</span>
          </div>
          <p className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] mt-1">
            {studyTime}
          </p>
          <span className="text-[10px] text-[var(--color-text-subtle)] block mt-0.5">
            Daily Target: {goalHours}
          </span>
        </div>

        {/* Current Streak Box */}
        <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Streak</span>
          </div>
          <p className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] mt-1">
            {streak} Days
          </p>
          <span className="text-[10px] text-[var(--color-text-subtle)] block mt-0.5">
            Keep the rhythm!
          </span>
        </div>
      </div>
    </div>
  );
}
