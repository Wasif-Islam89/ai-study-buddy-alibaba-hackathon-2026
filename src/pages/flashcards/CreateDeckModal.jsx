import React, { useState } from 'react';
import { X, Sparkles, Layers, FileText, FolderOpen, AlignLeft, Loader2 } from 'lucide-react';

const SOURCE_TABS = [
  { id: 'topic', label: 'Topic Input', icon: AlignLeft },
  { id: 'materials', label: 'My Materials', icon: FolderOpen },
  { id: 'summary', label: 'Summary Text', icon: FileText },
];

const COUNT_OPTIONS = [5, 10, 15, 20];
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

export default function CreateDeckModal({
  isOpen,
  onClose,
  onGenerate,
}) {
  const [sourceType, setSourceType] = useState('topic');
  const [subject, setSubject] = useState('Computer Science');
  const [topic, setTopic] = useState('Algorithms & Complexity');
  const [rawText, setRawText] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    setIsSynthesizing(true);
    setTimeout(() => {
      onGenerate({
        subject: subject.trim(),
        topic: topic.trim(),
        rawText,
        cardCount,
        difficulty,
        language,
      });
      setIsSynthesizing(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Create AI Flashcard Deck
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Transform study materials into targeted question-and-answer cards
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="p-4 bg-[var(--color-surface-secondary)]/50 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
            {SOURCE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = sourceType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSourceType(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics, Biology, History"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs sm:text-sm text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                Topic or Focus Area
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Sorting Algorithms, DNA Structure"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs sm:text-sm text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {(sourceType === 'materials' || sourceType === 'summary') && (
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                Paste Source Notes or Text
              </label>
              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste chapter notes, summary points, or lecture excerpts here..."
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)] resize-y"
              />
            </div>
          )}

          {/* Cards Count & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border-subtle)]">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-2">
                Card Count
              </label>
              <div className="flex gap-1.5">
                {COUNT_OPTIONS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setCardCount(cnt)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      cardCount === cnt
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-2">
                Difficulty
              </label>
              <div className="flex gap-1.5">
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSynthesizing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Cards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Deck</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

