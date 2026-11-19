import React from 'react';

export default function OutlineList({ structure = [] }) {
  if (!structure || structure.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-5">
      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--color-text-subtle)]">
        Structured Document Outline
      </h4>

      <div className="space-y-4">
        {structure.map((section, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] space-y-3"
          >
            {/* Heading */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold shrink-0">
                {idx + 1}
              </span>
              <h5 className="font-display font-bold text-sm sm:text-base text-[var(--color-text-main)]">
                {section.heading}
              </h5>
            </div>

            {/* Points List */}
            <ul className="space-y-1.5 pl-9 list-disc text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              {(section.points || []).map((point, pIdx) => (
                <li key={pIdx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

