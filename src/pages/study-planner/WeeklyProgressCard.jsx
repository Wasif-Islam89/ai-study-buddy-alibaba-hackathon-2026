import React from 'react';
import { plannerService } from '../../services/plannerService';

export default function WeeklyProgressCard({ plannerData }) {
  const goalMinutes = (plannerData.weeklyGoalHours || 18) * 60;
  const doneMinutes = plannerService.completedMinutesForWeek(
    plannerData,
    plannerData.weekOffset || 0
  );
  const percentage = goalMinutes > 0 ? Math.min(100, Math.round((doneMinutes / goalMinutes) * 100)) : 0;
  const doneHours = (doneMinutes / 60).toFixed(1);

  // Circular SVG progress ring calculation (circumference = 2 * PI * 56 ~= 351.8)
  const radius = 56;
  const circumference = 351.8;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs text-center space-y-4">
      <h3 className="text-sm font-bold text-[var(--color-text-main)] text-left">
        Weekly Progress
      </h3>

      <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-[var(--color-surface-secondary)] fill-none"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-[var(--primary)] fill-none transition-all duration-700"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-[var(--color-text-main)]">
            {percentage}%
          </span>
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Goal
          </span>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)]">
        <strong className="text-[var(--color-text-main)] font-bold">{doneHours}</strong> /{' '}
        {plannerData.weeklyGoalHours || 18} hours completed
      </p>
    </div>
  );
}

