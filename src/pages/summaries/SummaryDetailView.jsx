import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Trash2,
  Bot,
  Layers,
  Info,
  List,
  Lightbulb,
  Edit3,
  Save,
  Clock,
  FileText,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { summaryService } from '../../services/summaryService';

export default function SummaryDetailView({
  summary,
  onBack,
  onRegenerate,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);
  const [studyNotes, setStudyNotes] = useState(summary.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const navigate = useNavigate();

  const handleCopyFull = () => {
    let text = `${summary.title} (${summary.subject || 'General'})\n`;
    text += `Difficulty: ${summary.difficulty || 'Student'} | Est. Reading Time: ${summary.readingTime}\n\n`;
    text += `OVERVIEW:\n${summary.overview}\n\n`;
    text += `KEY POINTS:\n`;
    if (Array.isArray(summary.keyPoints)) {
      summary.keyPoints.forEach((kp, idx) => {
        text += `${idx + 1}. ${kp.title}: ${kp.desc}\n`;
      });
    }
    text += `\nCORE TAKEAWAY:\n${summary.takeaway}\n`;
    if (studyNotes) {
      text += `\nMY STUDY NOTES:\n${studyNotes}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = () => {
    summaryService.updateStudyNotes(summary.id, studyNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleAskAi = () => {
    navigate('/assistant');
  };

  const handleExportFlashcards = () => {
    navigate('/flashcards');
  };

  const handleQuiz = () => {
    navigate('/quiz-generator');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-subtle)]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>AI Summaries</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-muted)]">{summary.subject || 'General'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--color-text-main)] font-semibold truncate max-w-[200px]">
            {summary.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyFull}
            title="Copy entire summary"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] shadow-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            title="Print or export as PDF"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleAskAi}
            title="Ask AI Assistant about this summary"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>

          <button
            type="button"
            onClick={handleExportFlashcards}
            title="Review or create flashcards"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Flashcards</span>
          </button>

          <button
            type="button"
            onClick={() => onRegenerate(summary)}
            title="Regenerate this summary"
            className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete summary "${summary.title}"?`)) {
                onDelete(summary.id);
              }
            }}
            title="Delete this summary"
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Paper */}
      <article className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Document Header */}
        <div className="space-y-4 pb-6 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full font-bold bg-[var(--primary-light)] text-[var(--primary)]">
              {summary.subject || 'General'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] font-medium">
              Source: {summary.source || 'Topic Input'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] font-medium">
              {summary.difficulty || 'Student'} Level
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] font-medium">
              {summary.summaryType || 'Detailed Breakdown'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] leading-tight">
            {summary.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-[var(--color-text-subtle)] flex-wrap">
            <span>{summary.createdAt || 'Generated just now'}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Est. reading time: {summary.readingTime || '2 mins'}</span>
            </span>
            <span>•</span>
            <span>~{summary.wordCount || 350} words</span>
          </div>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Overview & Context</span>
          </div>
          <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)]/50 border-l-4 border-l-[var(--primary)] text-sm sm:text-base text-[var(--color-text-main)] leading-relaxed">
            {summary.overview}
          </div>
        </section>

        {/* Section 2: Key Points */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
            <List className="w-4 h-4" />
            <span>Key Concepts & Principles</span>
          </div>

          <div className="space-y-3">
            {Array.isArray(summary.keyPoints) &&
              summary.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[var(--color-text-main)]">
                      {point.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Section 3: Core Takeaway */}
        <section>
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-5 h-5" />
              <span>Core Takeaway & Memory Anchor</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {summary.takeaway}
            </p>
          </div>
        </section>

        {/* Section 4: Personal Study Notes */}
        <section className="space-y-3 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-main)]">
              <Edit3 className="w-4 h-4 text-[var(--primary)]" />
              <span>Personal Study Notes & Questions</span>
            </div>

            <button
              type="button"
              onClick={handleSaveNotes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{notesSaved ? 'Saved!' : 'Save Notes'}</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={studyNotes}
            onChange={(e) => setStudyNotes(e.target.value)}
            placeholder="Jot down questions for your professor, exam reminders, or personal insights here..."
            className="w-full p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition-colors resize-y leading-relaxed"
          />
        </section>

        {/* Section 5: Next Study Actions (Study Loop Integration) */}
        <section className="pt-6 border-t border-[var(--color-border-subtle)] space-y-3">
          <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Next Study Steps
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleQuiz}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)]">
                  Practice Quiz
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Test your understanding
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportFlashcards}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)]">
                  Review Flashcards
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Memorize key terms
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleAskAi}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)]">
                  Ask AI Tutor
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Clarify deep questions
                </div>
              </div>
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}

