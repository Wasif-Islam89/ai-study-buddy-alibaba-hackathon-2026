import React from 'react';
import {
  Layers,
  Clock,
  ArrowRight,
  Edit3,
  Trash2,
  Award,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { flashcardService } from '../../services/flashcardService';

export default function DeckCard({
  deck,
  onStudy,
  onEdit,
  onDelete,
}) {
  const stats = flashcardService.calculateDeckStats(deck);

  const getSubjectBadgeStyle = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('comp') || s.includes('prog') || s.includes('code') || s.includes('data')) {
      return 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20';
    }
    if (s.includes('math') || s.includes('calc') || s.includes('algebra') || s.includes('stat')) {
      return 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/30';
    }
    if (s.includes('bio') || s.includes('chem') || s.includes('med') || s.includes('health')) {
      return 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success)]/20';
    }
    if (s.includes('phys') || s.includes('eng') || s.includes('circuit')) {
      return 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)] border-[var(--color-amber)]/20';
    }
    if (s.includes('hist') || s.includes('lit') || s.includes('lang') || s.includes('art')) {
      return 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20';
    }
    return 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/20';
  };

  return (
    <div
      onClick={() => onStudy(deck.id)}
      className="group relative flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--color-teal)] hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Top Details & Metadata */}
      <div>
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getSubjectBadgeStyle(
              deck.subject
            )}`}
          >
            {deck.subject || 'General'}
          </span>

          {deck.lastReviewed && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-text-subtle)]">
              <Clock className="w-3 h-3 text-[var(--color-text-subtle)]" />
              <span>{deck.lastReviewed}</span>
            </span>
          )}
        </div>

        {/* Title & Topic Description */}
        <h3 className="text-base font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 mb-1">
          {deck.title}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 leading-relaxed mb-4 min-h-[2rem]">
          {deck.topic || 'Core concepts, definitions, and active recall practice.'}
        </p>

        {/* Mastery Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)] font-medium">Mastery Level</span>
            <span className="font-bold text-[var(--primary)]">{stats.masteryPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
              style={{ width: `${stats.masteryPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-subtle)] pt-0.5">
            <span>{stats.known} mastered</span>
            <span>{stats.practice} learning</span>
            <span>{stats.unseen} new</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
        {/* Total Cards Count */}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
          <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>{stats.total} {stats.total === 1 ? 'card' : 'cards'}</span>
        </span>

        {/* Actions Group */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deck);
            }}
            title="Edit deck"
            aria-label="Edit deck"
            className="p-1.5 rounded-xl hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete flashcard deck "${deck.title}"?`)) {
                onDelete(deck.id);
              }
            }}
            title="Delete deck"
            aria-label="Delete deck"
            className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[var(--color-text-muted)] hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onStudy(deck.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-bold transition-all ml-1 cursor-pointer shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Study</span>
          </button>
        </div>
      </div>
    </div>
  );
}
