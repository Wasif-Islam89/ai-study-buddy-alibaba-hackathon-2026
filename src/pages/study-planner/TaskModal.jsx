import React, { useState } from 'react';
import { X, CheckCircle, Plus } from 'lucide-react';
import { todayISO, KNOWN_SUBJECTS } from '../../services/plannerService';

export default function TaskModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [dueLabel, setDueLabel] = useState('Due Tomorrow');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      subject,
      done: false,
      dateISO: todayISO(),
      dueLabel: dueLabel.trim(),
    });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <h3 className="text-base font-bold text-[var(--color-text-main)]">
            Add Today's Focus Task
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[var(--color-text-main)] mb-1.5">
              Task Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Calculus Chapter 4 Practice Problems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[var(--color-text-main)] mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden"
              >
                {KNOWN_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text-main)] mb-1.5">
                Due Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Due Today, Due Tomorrow"
                value={dueLabel}
                onChange={(e) => setDueLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

