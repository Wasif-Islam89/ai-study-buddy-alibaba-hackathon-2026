import React, { useState } from 'react';
import { Sparkles, HelpCircle, Layers, CheckCircle2, Sliders, Check } from 'lucide-react';

const SUGGESTED_TOPICS = [
  { subject: 'Computer Science', topic: 'Programming Basics' },
  { subject: 'Biology', topic: 'Cellular Respiration' },
  { subject: 'Physics', topic: "Newton's Laws of Motion" },
  { subject: 'Mathematics', topic: 'Differential Calculus' },
];

const DIFFICULTY_LEVELS = [
  { id: 'Easy', label: 'Easy' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Hard', label: 'Hard' },
];

const FORMATS = [
  { id: 'mcq', label: 'Multiple Choice', badge: 'MCQ' },
  { id: 'tf', label: 'True / False', badge: 'T / F' },
  { id: 'mixed', label: 'Mixed Format', badge: 'Blend' },
];

const COUNT_PRESETS = [5, 10, 15, 20];

export default function QuizGeneratorForm({ onGenerate, isGenerating }) {
  const [subject, setSubject] = useState('Computer Science');
  const [topic, setTopic] = useState('Programming Basics');
  const [difficulty, setDifficulty] = useState('Medium');
  const [format, setFormat] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [customCount, setCustomCount] = useState('');
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    const count = isCustomCount ? parseInt(customCount, 10) || 10 : questionCount;

    onGenerate({
      subject: subject.trim(),
      topic: topic.trim(),
      difficulty,
      format,
      count,
      language,
    });
  };

  const handleApplySuggestion = (s) => {
    setSubject(s.subject);
    setTopic(s.topic);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 text-left"
    >
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          <span>Configure Practice Quiz</span>
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Generate targeted questions with instant feedback and step-by-step solutions.
        </p>
      </div>

      {/* Group 1: Subject & Topic */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, Physics, Biology"
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs sm:text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1">
              Topic or Specific Unit
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Data Structures, Thermodynamics, Mitosis"
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs sm:text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Popular Topic Suggestions */}
        <div>
          <span className="text-[11px] font-medium text-[var(--color-text-subtle)] block mb-1.5">
            Suggested Topics:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TOPICS.map((item, idx) => {
              const isCurrent =
                subject.trim().toLowerCase() === item.subject.toLowerCase() &&
                topic.trim().toLowerCase() === item.topic.toLowerCase();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySuggestion(item)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-semibold'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <span className="font-medium">{item.subject}:</span> {item.topic}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Group 2: Difficulty & Format Segmented Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--color-border-subtle)]">
        {/* Difficulty */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
            {DIFFICULTY_LEVELS.map((lvl) => {
              const isSelected = difficulty === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Format */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
            Question Format
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
            {FORMATS.map((f) => {
              const isSelected = format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center truncate ${
                    isSelected
                      ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Group 3: Quiz Length */}
      <div className="pt-3 border-t border-[var(--color-border-subtle)]">
        <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-1.5">
          Quiz Length (Number of Questions)
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {COUNT_PRESETS.map((cnt) => {
            const isSelected = !isCustomCount && questionCount === cnt;
            return (
              <button
                key={cnt}
                type="button"
                onClick={() => {
                  setIsCustomCount(false);
                  setQuestionCount(cnt);
                }}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-2xs'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:border-[var(--color-border-subtle)]'
                }`}
              >
                {cnt} Questions
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsCustomCount(true)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isCustomCount
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-2xs'
                : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:border-[var(--color-border-subtle)]'
            }`}
          >
            Custom
          </button>

          {isCustomCount && (
            <input
              type="number"
              min="1"
              max="50"
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
              placeholder="Count (1-50)"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
            />
          )}
        </div>
      </div>

      {/* Generate Action */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isGenerating || !subject.trim() || !topic.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs sm:text-sm shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Questions...' : 'Generate Practice Quiz'}</span>
        </button>
      </div>
    </form>
  );
}
