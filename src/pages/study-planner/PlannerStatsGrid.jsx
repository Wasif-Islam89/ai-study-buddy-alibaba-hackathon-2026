import React from 'react';
import { Flame, Brain } from 'lucide-react';
import { plannerService } from '../../services/plannerService';

export default function PlannerStatsGrid({ plannerData }) {
  const streak = plannerService.computeStreak(plannerData);
  const focusScore = plannerData.focusScoreBase || 92;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Streak */}
      <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs space-y-1">
        <span className="text-xs font-semibold text-[var(--color-text-muted)] block">
          Study Streak
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <span className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
            {streak} Days
          </span>
        </div>
      </div>

      {/* Focus Score */}
      <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs space-y-1">
        <span className="text-xs font-semibold text-[var(--color-text-muted)] block">
          Focus Score
        </span>
        <div className="flex items-center gap-1.5">
          <Brain className="w-5 h-5 text-[var(--primary)]" />
          <span className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
            {focusScore}
            <span className="text-xs font-medium text-[var(--color-text-subtle)]">/100</span>
          </span>
        </div>
      </div>
    </div>
  );
}

