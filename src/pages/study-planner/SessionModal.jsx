import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, BookOpen, Trash2, Check, Sparkles } from 'lucide-react';
import { DAY_NAMES_FULL, KNOWN_SUBJECTS } from '../../services/plannerService';

export default function SessionModal({
  isOpen,
  onClose,
  session,
  defaultDay = 0,
  onSave,
  onDelete,
}) {
  const [subject, setSubject] = useState('Mathematics');
  const [customSubject, setCustomSubject] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [day, setDay] = useState(defaultDay);
  const [time, setTime] = useState('17:00');
  const [duration, setDuration] = useState(60);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (session) {
      const isKnown = KNOWN_SUBJECTS.includes(session.subject);
      setSubject(isKnown ? session.subject : 'Custom...');
      setIsCustom(!isKnown);
      setCustomSubject(!isKnown ? session.subject : '');
      setDay(session.day ?? 0);
      setTime(session.time || '17:00');
      setDuration(session.duration || 60);
      setTitle(session.title || session.subject || '');
    } else {
      setSubject('Mathematics');
      setIsCustom(false);
      setCustomSubject('');
      setDay(defaultDay);
      setTime('17:00');
      setDuration(60);
      setTitle('');
    }
  }, [session, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSubject = isCustom ? customSubject.trim() || 'General' : subject;
    const finalTitle = title.trim() || finalSubject;

    onSave({
      id: session?.id,
      day: Number(day),
      subject: finalSubject,
      title: finalTitle,
      time,
      duration: Number(duration) || 60,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--color-text-main)]">
                {session ? 'Edit Study Session' : 'Schedule Study Session'}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {session ? 'Modify session timings or topic details' : 'Add a dedicated learning interval to your week'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Subject Dropdown */}
          <div>
            <label className="block font-semibold text-[var(--color-text-main)] mb-1.5">
              Subject
            </label>
            <select
              value={isCustom ? 'Custom...' : subject}
              onChange={(e) => {
                if (e.target.value === 'Custom...') {
                  setIsCustom(true);
                } else {
                  setIsCustom(false);
                  setSubject(e.target.value);
                  if (!title) setTitle(e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer font-medium"
            >
              {KNOWN_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="Custom...">Custom Subject...</option>
            </select>

            {isCustom && (
              <input
                type="text"
                required
                placeholder="Enter custom subject name"
                value={customSubject}
                onChange={(e) => {
                  setCustomSubject(e.target.value);
                  if (!title) setTitle(e.target.value);
                }}
                className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
            )}
          </div>

          {/* Session Title / Topic */}
          <div>
            <label className="block font-semibold text-[var(--color-text-main)] mb-1.5">
              Session Title / Focus Topic
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 4 Practice, Vectors, Pointers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Day of Week */}
          <div>
            <label className="block font-semibold text-[var(--color-text-main)] mb-1.5">
              Day of Week
            </label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer font-medium"
            >
              {DAY_NAMES_FULL.map((dName, idx) => (
                <option key={idx} value={idx}>
                  {dName}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time & Duration */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[var(--color-text-main)] mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--color-text-main)] mb-1.5">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)] mt-5">
            {session ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this scheduled session from your timetable?')) {
                    onDelete(session.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Session</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-sm shadow-[var(--primary)]/30 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{session ? 'Save Changes' : 'Schedule Session'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
