import React, { useState } from 'react';
import { BarChart3, Clock, HelpCircle } from 'lucide-react';

export default function LearningActivityChart({ chartData, range }) {
  const [metric, setMetric] = useState('studyTime'); // 'studyTime' | 'quizzes'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!chartData || chartData.length === 0) return null;

  // Compute maximum values for scaling
  const maxStudyMins = Math.max(60, ...chartData.map((d) => d.studyMinutes || 0));
  const maxQuizzes = Math.max(3, ...chartData.map((d) => d.quizzesTaken || 0));
  const maxValue = metric === 'studyTime' ? maxStudyMins : maxQuizzes;

  // Chart dimensions in SVG viewBox
  const chartHeight = 160;
  const barWidthPercent = chartData.length <= 7 ? 6.5 : chartData.length <= 14 ? 4 : 2;

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4">
      {/* Header with Metric Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
            <span>Learning Activity Over Time</span>
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {range === 'week'
              ? 'Daily study distribution for the last 7 days'
              : range === 'month'
              ? 'Daily study rhythm for the last 30 days'
              : 'Study velocity trend across recorded history'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('studyTime')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'studyTime'
                ? 'bg-[var(--color-surface-card)] text-[var(--color-navy)] shadow-xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Study Time</span>
          </button>
          <button
            type="button"
            onClick={() => setMetric('quizzes')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'quizzes'
                ? 'bg-[var(--color-surface-card)] text-[var(--color-teal)] shadow-xs font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quizzes</span>
          </button>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="relative pt-4">
        {/* Tooltip Popup */}
        {hoveredIndex !== null && chartData[hoveredIndex] && (
          <div className="absolute top-0 right-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg animate-in fade-in duration-150 flex items-center gap-2">
            <span className="text-slate-300">{chartData[hoveredIndex].fullDateLabel}:</span>
            <span className="text-emerald-400 font-bold">
              {metric === 'studyTime'
                ? `${chartData[hoveredIndex].studyMinutes} mins (${chartData[hoveredIndex].studyHours} hrs)`
                : `${chartData[hoveredIndex].quizzesTaken} ${
                    chartData[hoveredIndex].quizzesTaken === 1 ? 'quiz' : 'quizzes'
                  }`}
            </span>
          </div>
        )}

        {/* SVG Visualization */}
        <div className="w-full h-48 sm:h-56">
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            {/* Horizontal Grid lines */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeDasharray="2,2" className="text-[var(--color-border-subtle)]" strokeWidth="0.5" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeDasharray="2,2" className="text-[var(--color-border-subtle)]" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeDasharray="2,2" className="text-[var(--color-border-subtle)]" strokeWidth="0.5" />

            {/* Bars */}
            {chartData.map((d, idx) => {
              const val = metric === 'studyTime' ? d.studyMinutes : d.quizzesTaken;
              const heightPercent = maxValue > 0 ? (val / maxValue) * 35 : 0;
              const barHeight = Math.max(val > 0 ? 1.5 : 0.5, heightPercent);
              const xPos = (idx / chartData.length) * 100 + (100 / chartData.length) / 2 - barWidthPercent / 2;
              const yPos = 42 - barHeight;
              const isHovered = hoveredIndex === idx;

              return (
                <rect
                  key={idx}
                  x={xPos}
                  y={yPos}
                  width={barWidthPercent}
                  height={barHeight}
                  rx="1"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`transition-all duration-200 cursor-pointer ${
                    val === 0
                      ? 'fill-[var(--color-surface-secondary)]'
                      : metric === 'studyTime'
                      ? isHovered
                        ? 'fill-[var(--color-navy-dark)]'
                        : 'fill-[var(--color-navy)]'
                      : isHovered
                      ? 'fill-[var(--color-teal-hover)]'
                      : 'fill-[var(--color-teal)]'
                  }`}
                />
              );
            })}
          </svg>
        </div>

        {/* X-Axis Date Labels */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium pt-2 border-t border-[var(--color-border)]">
          {chartData.length <= 14
            ? chartData.map((d, idx) => (
                <span
                  key={idx}
                  className={`text-center ${hoveredIndex === idx ? 'text-[var(--primary)] font-bold' : ''}`}
                >
                  {d.label}
                </span>
              ))
            : [0, Math.floor(chartData.length / 4), Math.floor(chartData.length / 2), Math.floor((3 * chartData.length) / 4), chartData.length - 1].map((idx) => (
                <span key={idx} className="text-center">
                  {chartData[idx]?.fullDateLabel}
                </span>
              ))}
        </div>
      </div>
    </div>
  );
}

