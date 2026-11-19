import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  FileText,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  Calendar,
  Timer,
  ArrowUpRight,
} from 'lucide-react';

export default function ToolAnalyticsGrid({ toolAnalytics }) {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'practice' | 'content' | 'planning'

  if (!toolAnalytics) return null;

  const tools = [
    {
      id: 'quizzes',
      name: 'Quiz Generator',
      category: 'practice',
      icon: HelpCircle,
      color: 'text-[var(--color-teal)]',
      bgLight: 'bg-[var(--color-teal-bg)]',
      path: '/quizzes',
      description: 'Active recall and knowledge testing',
      stat1: { label: 'Created', value: toolAnalytics.quizzes.totalCreated },
      stat2: { label: 'Attempts', value: toolAnalytics.quizzes.totalAttempts },
      stat3: {
        label: 'Avg Score',
        value: toolAnalytics.quizzes.totalAttempts > 0 ? `${toolAnalytics.quizzes.avgScore}%` : '—',
      },
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      category: 'practice',
      icon: Layers,
      color: 'text-amber-500',
      bgLight: 'bg-amber-500/10',
      path: '/flashcards',
      description: 'Spaced repetition concept review',
      stat1: { label: 'Decks', value: toolAnalytics.flashcards.totalDecks },
      stat2: { label: 'Cards', value: toolAnalytics.flashcards.totalCards },
      stat3: { label: 'Mastered', value: toolAnalytics.flashcards.mastered },
    },
    {
      id: 'planner',
      name: 'Study Planner',
      category: 'planning',
      icon: Calendar,
      color: 'text-[var(--primary)]',
      bgLight: 'bg-[var(--primary-light)]',
      path: '/study-planner',
      description: 'Weekly timetable and session scheduling',
      stat1: { label: 'Weekly Planned', value: toolAnalytics.planner.plannedSessionsPerWeek },
      stat2: { label: 'Completed', value: toolAnalytics.planner.completedSessions },
      stat3: { label: 'Logged Time', value: `${toolAnalytics.planner.completedHours}h` },
    },
    {
      id: 'exams',
      name: 'Exam Prep',
      category: 'planning',
      icon: Timer,
      color: 'text-rose-500',
      bgLight: 'bg-rose-500/10',
      path: '/exams',
      description: 'Milestone tracking and countdown targets',
      stat1: { label: 'Upcoming', value: toolAnalytics.exams.upcomingCount },
      stat2: {
        label: 'Days to Next',
        value: toolAnalytics.exams.nextExamDays !== null ? `${toolAnalytics.exams.nextExamDays}d` : '—',
      },
      stat3: {
        label: 'Target',
        value: toolAnalytics.exams.nextExamSubject || 'None',
      },
    },
    {
      id: 'summaries',
      name: 'AI Summaries',
      category: 'content',
      icon: Sparkles,
      color: 'text-emerald-500',
      bgLight: 'bg-emerald-500/10',
      path: '/summaries',
      description: 'Concise chapter takeaways and review sheets',
      stat1: { label: 'Total', value: toolAnalytics.summaries.totalCount },
      stat2: { label: 'In Window', value: toolAnalytics.summaries.inRangeCount },
      stat3: { label: 'Status', value: toolAnalytics.summaries.totalCount > 0 ? 'Active' : 'Empty' },
    },
    {
      id: 'materials',
      name: 'My Materials',
      category: 'content',
      icon: FileText,
      color: 'text-blue-500',
      bgLight: 'bg-blue-500/10',
      path: '/materials',
      description: 'Document extraction and structured topics',
      stat1: { label: 'Uploaded', value: toolAnalytics.materials.hasUploaded ? 1 : 0 },
      stat2: { label: 'Topics', value: toolAnalytics.materials.topicsCount },
      stat3: { label: 'Status', value: toolAnalytics.materials.hasUploaded ? 'Processed' : 'None' },
    },
    {
      id: 'notes',
      name: 'Study Notes',
      category: 'content',
      icon: BookOpen,
      color: 'text-teal-500',
      bgLight: 'bg-teal-500/10',
      path: '/notes',
      description: 'Structured outlines and bullet points',
      stat1: { label: 'Sections', value: toolAnalytics.notes.sectionsCount },
      stat2: { label: 'Points', value: toolAnalytics.notes.pointsCount },
      stat3: { label: 'Status', value: toolAnalytics.notes.sectionsCount > 0 ? 'Saved' : '0' },
    },
    {
      id: 'assistant',
      name: 'AI Assistant',
      category: 'practice',
      icon: Bot,
      color: 'text-[var(--primary)]',
      bgLight: 'bg-[var(--primary-light)]',
      path: '/ai-assistant',
      description: 'Interactive conversational tutoring',
      stat1: { label: 'Chats', value: toolAnalytics.aiAssistant.chatsCount },
      stat2: { label: 'Messages', value: toolAnalytics.aiAssistant.messagesCount },
      stat3: { label: 'Status', value: toolAnalytics.aiAssistant.chatsCount > 0 ? 'Active' : '0' },
    },
  ];

  const filteredTools =
    filterCategory === 'all'
      ? tools
      : tools.filter((t) => t.category === filterCategory);

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 text-left">
      {/* Header & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            <span>Educational Tool Analytics</span>
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Performance metrics across all learning and planning modules
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs font-semibold self-start sm:self-auto">
          {[
            { id: 'all', label: 'All (8)' },
            { id: 'practice', label: 'Practice & Recall' },
            { id: 'planning', label: 'Planning & Prep' },
            { id: 'content', label: 'Notes & Materials' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredTools.map((t) => {
          const IconComp = t.icon;

          return (
            <div
              key={t.id}
              onClick={() => navigate(t.path)}
              className="group relative p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)]/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${t.bgLight} ${t.color} flex items-center justify-center shrink-0`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[var(--color-text-main)] group-hover:text-[var(--primary)] transition-colors truncate">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-subtle)] truncate">
                      {t.description}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-[var(--color-text-subtle)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary-light)] transition-colors shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* 3 Metrics */}
              <div className="grid grid-cols-3 gap-1 pt-2.5 border-t border-[var(--color-border-subtle)] text-center">
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-medium">
                    {t.stat1.label}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-main)]">
                    {t.stat1.value}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-medium">
                    {t.stat2.label}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-main)]">
                    {t.stat2.value}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-text-muted)] block font-medium">
                    {t.stat3.label}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-main)] truncate">
                    {t.stat3.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
