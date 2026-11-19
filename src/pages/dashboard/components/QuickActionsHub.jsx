import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, BookOpen, HelpCircle, Layers, Calendar, ArrowUpRight } from 'lucide-react';

export default function QuickActionsHub({ onOpenPracticeQuiz }) {
  const navigate = useNavigate();

  // 5 distinct, useful student actions (Zero duplication with Welcome Hero)
  const ACTIONS = [
    {
      id: 'materials',
      title: 'Upload Study Material',
      desc: 'Add textbook chapters, lecture notes, or PDFs',
      icon: FolderOpen,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      action: () => navigate('/materials'),
    },
    {
      id: 'notes',
      title: 'Study Notes',
      desc: 'Review, edit, and organize generated lecture notes',
      icon: BookOpen,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: () => navigate('/notes'),
    },
    {
      id: 'quiz',
      title: 'Generate Quiz',
      desc: 'Practice adaptive questions with instant score feedback',
      icon: HelpCircle,
      color: 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/20',
      action: onOpenPracticeQuiz || (() => navigate('/quiz-generator')),
    },
    {
      id: 'flashcards',
      title: 'Review Flashcards',
      desc: 'Master key terms with spaced repetition recall',
      icon: Layers,
      color: 'bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary)]/20',
      action: () => navigate('/flashcards'),
    },
    {
      id: 'planner',
      title: 'Open Study Planner',
      desc: 'View weekly timetable, study sessions, and deadlines',
      icon: Calendar,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      action: () => navigate('/study-planner'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
          Quick Access Hub
        </h2>
        <span className="text-xs text-[var(--color-text-muted)]">
          Direct access to core learning tools
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className="flex flex-col justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-card-hover)] transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl border ${item.color} transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-[var(--color-text-main)] group-hover:text-[var(--primary)] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
