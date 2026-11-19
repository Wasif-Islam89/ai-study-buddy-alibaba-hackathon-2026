import React, { useState } from 'react';
import {
  Clock,
  Check,
  Plus,
  Trash2,
  Edit2,
  CalendarCheck,
  ListTodo,
  Calendar,
} from 'lucide-react';
import {
  todayISO,
  mondayIndexFromJsDay,
  formatTime12,
  plannerService,
  DAY_NAMES_FULL,
} from '../../services/plannerService';

export default function TodayStudyPlanCard({
  plannerData,
  onToggleComplete,
  onAddSessionForToday,
  onEditSession,
  onDeleteSession,
  onOpenTaskModal,
  onToggleTask,
  onDeleteTask,
}) {
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'tasks'

  const todayDate = new Date();
  const currentTodayISO = todayISO();
  const todayDayIdx = mondayIndexFromJsDay(todayDate.getDay());
  const todayName = DAY_NAMES_FULL[todayDayIdx];

  // Today's actual scheduled sessions
  const todaySessions = plannerService.sessionsForDay(plannerData, todayDayIdx);

  // Today's focus tasks
  const todayTasks = (plannerData.focusTasks || []).filter(
    (t) => t.dateISO === currentTodayISO
  );

  const getSubjectColorStyles = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('comp') || s.includes('prog') || s.includes('c ')) {
      return {
        badge: 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20',
        bar: 'bg-[var(--color-navy)]',
      };
    }
    if (s.includes('math') || s.includes('calc')) {
      return {
        badge: 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/20',
        bar: 'bg-[var(--color-teal)]',
      };
    }
    if (s.includes('phys')) {
      return {
        badge: 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)] border-[var(--color-amber)]/20',
        bar: 'bg-[var(--color-amber)]',
      };
    }
    if (s.includes('bio')) {
      return {
        badge: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success)]/20',
        bar: 'bg-[var(--color-status-success)]',
      };
    }
    return {
      badge: 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/20',
      bar: 'bg-[var(--color-teal)]',
    };
  };

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                Today's Study Plan
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {todayName}, {todayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Quick Add */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sessions'
                  ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sessions ({todaySessions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tasks'
                  ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Tasks ({todayTasks.length})</span>
            </button>
          </div>

          {activeTab === 'sessions' ? (
            <button
              type="button"
              onClick={() => onAddSessionForToday?.(todayDayIdx)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenTaskModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'sessions' ? (
        <div className="space-y-2.5">
          {todaySessions.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-[var(--color-border)] text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-main)]">
                  No study sessions scheduled for today
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Plan ahead by adding your first study interval for today.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAddSessionForToday?.(todayDayIdx)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule a Session for Today</span>
              </button>
            </div>
          ) : (
            todaySessions.map((session) => {
              const isDone = plannerService.isCompleted(
                plannerData,
                currentTodayISO,
                session.id
              );
              const colors = getSubjectColorStyles(session.subject);

              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? 'border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 opacity-75'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)]/40 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Completion Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(currentTodayISO, session.id)}
                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)]'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Session Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-xs sm:text-sm text-[var(--color-text-main)] truncate ${
                            isDone ? 'line-through text-[var(--color-text-muted)]' : ''
                          }`}
                        >
                          {session.title || session.subject}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors.badge}`}
                        >
                          {session.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[var(--primary)]" />
                          <span>{formatTime12(session.time)}</span>
                        </span>
                        <span>•</span>
                        <span>{session.duration} minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditSession(session)}
                      title="Edit session"
                      className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSession(session.id)}
                      title="Delete session"
                      className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Tasks List */
        <div className="space-y-2.5">
          {todayTasks.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-[var(--color-border)] text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] flex items-center justify-center mx-auto">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-main)]">
                  No focus tasks created for today
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Break down your study session into small, actionable milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenTaskModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary-hover)] transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Focus Task</span>
              </button>
            </div>
          ) : (
            todayTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all text-xs ${
                  task.done
                    ? 'border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 opacity-70'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      task.done
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold leading-snug break-words ${
                        task.done
                          ? 'line-through text-[var(--color-text-muted)]'
                          : 'text-[var(--color-text-main)]'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-[var(--primary)]">
                        {task.subject}
                      </span>
                      {task.dueLabel && (
                        <span className="text-[10px] text-[var(--color-text-subtle)]">
                          • {task.dueLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[var(--color-text-subtle)] hover:text-rose-500 transition-opacity cursor-pointer shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

