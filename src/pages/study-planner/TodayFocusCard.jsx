import React from 'react';
import { Plus, Check, Trash2, CheckCircle2 } from 'lucide-react';
import { todayISO } from '../../services/plannerService';

export default function TodayFocusCard({
  plannerData,
  onOpenTaskModal,
  onToggleTask,
  onDeleteTask,
}) {
  const currentToday = todayISO();
  const tasks = (plannerData.focusTasks || []).filter((t) => t.dateISO === currentToday);

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--color-text-main)]">
          Today's Focus
        </h3>

        <button
          type="button"
          onClick={onOpenTaskModal}
          className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-[var(--primary)] transition-colors cursor-pointer"
          title="Add focus task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-[var(--color-border-subtle)] text-center text-xs text-[var(--color-text-muted)]">
            No focus tasks for today. Click + to add one.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all text-xs ${
                task.done
                  ? 'border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 opacity-70'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${
                    task.done
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)]'
                  }`}
                >
                  {task.done && <Check className="w-3 h-3" />}
                </button>

                <div className="min-w-0">
                  <p
                    className={`font-semibold leading-snug break-words ${
                      task.done
                        ? 'line-through text-[var(--color-text-muted)]'
                        : 'text-[var(--color-text-main)]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
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
    </div>
  );
}

