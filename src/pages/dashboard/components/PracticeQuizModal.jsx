import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    subject: 'Mathematics',
    question: 'What is the derivative of f(x) = x³ + 2x with respect to x?',
    options: [
      { id: 'a', text: '3x² + 2', correct: true },
      { id: 'b', text: 'x² + 2', correct: false },
      { id: 'c', text: '3x³ + 2x', correct: false },
      { id: 'd', text: '2x² + 3', correct: false },
    ],
    explanation: 'By the power rule d/dx(xⁿ) = n·xⁿ⁻¹. Thus d/dx(x³) = 3x² and d/dx(2x) = 2, yielding 3x² + 2.',
  },
  {
    id: 2,
    subject: 'Computer Science',
    question: 'Which operator is used in C to access the value pointed to by a memory pointer?',
    options: [
      { id: 'a', text: '& (Address-of operator)', correct: false },
      { id: 'b', text: '* (Dereference operator)', correct: true },
      { id: 'c', text: '-> (Arrow operator)', correct: false },
      { id: 'd', text: ':: (Scope resolution operator)', correct: false },
    ],
    explanation: 'The unary asterisk (*) dereferences a pointer to read or write the value at the referenced memory address.',
  },
  {
    id: 3,
    subject: 'Biology',
    question: 'Which organelle is responsible for generating the majority of cellular ATP via respiration?',
    options: [
      { id: 'a', text: 'Ribosome', correct: false },
      { id: 'b', text: 'Mitochondrion', correct: true },
      { id: 'c', text: 'Endoplasmic Reticulum', correct: false },
      { id: 'd', text: 'Golgi Apparatus', correct: false },
    ],
    explanation: 'Mitochondria generate ATP during oxidative phosphorylation, earning the title "powerhouse of the cell".',
  },
];

export default function PracticeQuizModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return; // Only allow one selection per question
    setSelectedOption(opt);
    if (opt.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const question = QUIZ_QUESTIONS[currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Practice Quiz"
      subtitle="Test your grasp on active curriculum subjects."
      size="md"
    >
      {!isFinished ? (
        <div className="space-y-5">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)] pb-2 border-b border-[var(--color-border-subtle)]">
            <span className="text-[var(--primary)]">{question.subject}</span>
            <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
          </div>

          {/* Question Text */}
          <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] leading-snug">
            {question.question}
          </h3>

          {/* Options List */}
          <div className="space-y-2.5">
            {question.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              let btnStyle = 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] hover:border-[var(--primary)]/50';

              if (selectedOption !== null) {
                if (opt.correct) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !opt.correct) {
                  btnStyle = 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-200 font-semibold';
                } else {
                  btnStyle = 'opacity-50 border-[var(--color-border)] bg-[var(--color-surface-secondary)]';
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                  {selectedOption !== null && opt.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !opt.correct && (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {selectedOption !== null && (
            <div className="p-3.5 rounded-xl bg-[var(--primary-light)]/20 border border-[var(--primary)]/20 text-xs sm:text-sm text-[var(--color-text-main)] leading-relaxed animate-in fade-in duration-200">
              <strong className="block font-semibold mb-1 text-[var(--primary)]">Explanation:</strong>
              {question.explanation}
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="flex justify-end pt-3 border-t border-[var(--color-border-subtle)]">
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={ArrowRight}
              >
                {currentStep < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Score'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Screen */
        <div className="flex flex-col items-center text-center p-4 space-y-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="font-display font-bold text-xl text-[var(--color-text-main)]">
            Quiz Completed!
          </h3>

          <p className="text-sm text-[var(--color-text-muted)]">
            You scored <strong className="text-[var(--primary)]">{score}</strong> out of {QUIZ_QUESTIONS.length} ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}% accuracy).
          </p>

          <div className="flex items-center gap-3 pt-3">
            <Button variant="outline" size="md" onClick={resetQuiz} leftIcon={RotateCcw}>
              Try Again
            </Button>
            <Button variant="primary" size="md" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

