import React from 'react';
import { Terminal, Calculator, Dna, Play } from 'lucide-react';

const DEFAULT_COURSES = [
  {
    id: 'c_programming',
    title: 'C Programming',
    module: 'Module 4: Pointers & Arrays',
    progress: 68,
    pill: 'Mod 4',
    icon: Terminal,
    color: 'bg-[var(--primary)] text-white',
    progressColor: 'bg-[var(--primary)]',
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    module: 'Calculus: Definite Integrals & Area',
    progress: 45,
    pill: 'Ch 6',
    icon: Calculator,
    color: 'bg-[var(--primary)] text-white',
    progressColor: 'bg-[var(--primary)]',
  },
  {
    id: 'biology',
    title: 'Biology',
    module: 'Cell Structure & Organelle Functions',
    progress: 82,
    pill: 'Unit 2',
    icon: Dna,
    color: 'bg-emerald-600 text-white',
    progressColor: 'bg-emerald-600',
  },
];

export default function ContinueLearning({ onOpenAllCourses, onSelectCourse }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
            Continue Learning
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold">
            3 Active
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenAllCourses}
          className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Courses List */}
      <div className="space-y-3.5">
        {DEFAULT_COURSES.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse?.(course)}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              {/* Subject Icon */}
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-xl ${course.color} shrink-0 shadow-xs`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Course Info & Progress Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[var(--color-text-main)] truncate">
                      {course.title}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[var(--color-border)] text-[var(--color-text-muted)] shrink-0">
                      {course.pill}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--color-text-main)] shrink-0">
                    {course.progress}%
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-[var(--color-text-muted)] truncate mb-2">
                  {course.module}
                </p>

                {/* Progress Track */}
                <div className="w-full h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${course.progressColor} transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* Resume Button */}
              <button
                type="button"
                aria-label={`Resume ${course.title}`}
                className="p-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/40 group-hover:bg-[var(--primary-light)]/20 transition-all cursor-pointer shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

