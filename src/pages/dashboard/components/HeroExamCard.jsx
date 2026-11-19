import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

export default function HeroExamCard({ onOpenStudyPlan }) {
  const navigate = useNavigate();

  const getExamFromStorage = () => {
    try {
      const raw = localStorage.getItem('aiStudyBuddy.examCountdown.v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.exams && parsed.exams.length > 0) {
          const active = parsed.exams.find((e) => e.id === parsed.activeExamId) || parsed.exams[0];
          return {
            subject: active.subject || 'Computer Science',
            title: active.title || 'Programming Fundamentals Final Exam',
            targetDate: active.date ? new Date(active.date + 'T23:59:59').toISOString() : new Date(Date.now() + 21 * 86400000).toISOString(),
            readiness: active.practice || 65,
          };
        }
      }
    } catch (e) {
      console.warn('Error reading exam storage', e);
    }

    return {
      subject: 'Computer Science',
      title: 'Programming Fundamentals Final Exam',
      targetDate: new Date(Date.now() + 21 * 86400000).toISOString(),
      readiness: 65,
    };
  };

  // Load exam from localStorage or default
  const [exam, setExam] = useState(getExamFromStorage);

  useEffect(() => {
    const handleStorage = (e) => {
      if (!e || e.key === 'aiStudyBuddy.examCountdown.v1') {
        setExam(getExamFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const target = new Date(exam.targetDate).getTime();

    const updateCountdown = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      setTimeLeft({ days, hours, mins, secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [exam.targetDate]);

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] flex flex-col justify-between transition-all">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold w-fit mb-3">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Upcoming Exam</span>
        </div>

        <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">
          {exam.subject}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
          {exam.title}
        </p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 my-5 max-w-sm">
          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            <span className="font-display font-bold text-xl sm:text-2xl text-[var(--primary)]">
              {pad(timeLeft.days)}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
              Days
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            <span className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
              Hours
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            <span className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">
              {pad(timeLeft.mins)}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
              Mins
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            <span className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">
              {pad(timeLeft.secs)}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
              Secs
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions & Readiness Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenStudyPlan || (() => navigate('/planner'))}
            leftIcon={Calendar}
          >
            Study Plan
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/summaries')}
            leftIcon={BookOpen}
          >
            Quick Revision
          </Button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{exam.readiness}% Prepared</span>
          </div>
        </div>
      </div>
    </div>
  );
}

