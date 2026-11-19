import React from 'react';
import { Bookmark, Plus, Trash2 } from 'lucide-react';

export default function NotesBlock({
  section,
  index,
  isEditing = false,
  onHeadingChange,
  onPointChange,
  onAddPoint,
  onDeletePoint,
}) {
  return (
    <div className="mb-6 last:mb-0">
      {/* Title */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 text-[var(--primary)] font-display font-bold text-base sm:text-lg">
          <Bookmark className="w-5 h-5 shrink-0 fill-current" />
          {isEditing ? (
            <input
              type="text"
              value={section.heading}
              onChange={(e) => onHeadingChange(index, e.target.value)}
              className="px-2 py-1 text-sm font-bold rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] w-full"
            />
          ) : (
            <span>{section.heading}</span>
          )}
        </div>
      </div>

      {/* Body with vertical left accent bar */}
      <div className="pl-4 sm:pl-6 border-l-2 border-[var(--primary)]/30 space-y-2.5">
        <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
          {(section.points || []).map((point, pIdx) => (
            <li key={pIdx} className="flex items-start justify-between gap-2.5 group">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => onPointChange(index, pIdx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => onDeletePoint(index, pIdx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer"
                    title="Delete point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2" />
                  <span className="flex-1 text-[var(--color-text-main)]/90">{point}</span>
                </div>
              )}
            </li>
          ))}
        </ul>

        {isEditing && (
          <button
            type="button"
            onClick={() => onAddPoint(index)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline mt-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Point</span>
          </button>
        )}
      </div>
    </div>
  );
}

