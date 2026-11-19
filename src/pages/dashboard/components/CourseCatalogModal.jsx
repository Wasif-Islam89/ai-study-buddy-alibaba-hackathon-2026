import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Terminal, Calculator, Atom, Dna } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_COURSES = [
  {
    id: 'cs',
    name: 'Computer Science',
    desc: 'C Programming, Data Structures, Algorithms, Memory Management',
    progress: 68,
    totalTopics: 10,
    completedTopics: 7,
    icon: Terminal,
    color: 'bg-[var(--primary)] text-white',
  },
  {
    id: 'math',
    name: 'Mathematics',
    desc: 'Calculus, Linear Algebra, Probability, Differential Equations',
    progress: 45,
    totalTopics: 16,
    completedTopics: 7,
    icon: Calculator,
    color: 'bg-[var(--primary)] text-white',
  },
  {
    id: 'physics',
    name: 'Physics',
    desc: 'Classical Mechanics, Electromagnetism, Thermodynamics, Optics',
    progress: 30,
    totalTopics: 14,
    completedTopics: 4,
    icon: Atom,
    color: 'bg-amber-600 text-white',
  },
  {
    id: 'biology',
    name: 'Biology',
    desc: 'Cellular Biology, Genetics, Human Physiology, Ecology',
    progress: 82,
    totalTopics: 14,
    completedTopics: 11,
    icon: Dna,
    color: 'bg-emerald-600 text-white',
  },
];

export default function CourseCatalogModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Active Enrolled Curriculum"
      subtitle="View all course topics, assignments, and semester progress."
      size="lg"
    >
      <div className="space-y-4">
        {ALL_COURSES.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.id}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${course.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm text-[var(--color-text-main)]">
                    {course.name}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                    {course.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-[var(--color-text-subtle)]">
                    <span>{course.completedTopics} of {course.totalTopics} Topics Mastered</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[var(--color-text-main)] block">
                    {course.progress}%
                  </span>
                  <div className="w-24 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    navigate('/materials');
                  }}
                >
                  Materials
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

