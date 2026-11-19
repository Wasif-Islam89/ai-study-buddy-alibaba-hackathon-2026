import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Play, Pause, RotateCcw, Award } from 'lucide-react';

export default function PomodoroModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('focus'); // 'focus' (25m) or 'break' (5m)
  const duration = mode === 'focus' ? 25 * 60 : 5 * 60;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    setIsCompleted(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Progress percentage
  const totalSecs = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalSecs - timeLeft) / totalSecs) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Focus Pomodoro Timer"
      subtitle="Maximize retention with structured 25-minute deep study intervals."
      size="sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        {/* Mode Selector Tabs */}
        <div className="flex p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] mb-6">
          <button
            type="button"
            onClick={() => setMode('focus')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            Study Focus (25m)
          </button>
          <button
            type="button"
            onClick={() => setMode('break')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'break'
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            Short Break (5m)
          </button>
        </div>

        {/* Circular Display */}
        <div className="relative flex items-center justify-center w-48 h-48 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className="text-[var(--color-surface-secondary)]"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
              stroke="var(--primary)"
              strokeWidth="6"
              strokeDasharray={276.4}
              strokeDashoffset={276.4 - (progressPercent / 100) * 276.4}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-4xl text-[var(--color-text-main)] tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">
              {isRunning ? 'Deep Focus...' : isCompleted ? 'Session Complete!' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Award Banner on Complete */}
        {isCompleted && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-4 animate-in zoom-in-95">
            <Award className="w-4 h-4" />
            <span>Pomodoro completed! +50 XP awarded to your streak!</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={resetTimer}
            leftIcon={RotateCcw}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={toggleTimer}
            leftIcon={isRunning ? Pause : Play}
            className="w-36"
          >
            {isRunning ? 'Pause' : 'Start Focus'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

