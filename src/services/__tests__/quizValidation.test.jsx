// quizValidation.test.jsx
// Tests the 12 required test cases for quiz answer validation, grading, option shuffling, and retake behavior.

import {
  validateAnswer,
  gradeQuiz,
  createFreshQuizAttempt,
  normalizeAnswerText,
  DEFAULT_SAMPLE_QUIZZES,
  quizService,
} from '../quizService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- Running 12 Quiz Validation & Functional Test Cases ---');

// Test Case 1: Select the actual correct answer → marked Correct
const q1 = {
  id: 'q1',
  type: 'mcq',
  question: 'What is the capital of France?',
  options: ['London', 'Berlin', 'Paris', 'Rome'],
  correctAnswer: 'Paris',
};
const res1 = validateAnswer(q1, 'Paris');
assert(res1.isAnswered && res1.isCorrect, '1. Select actual correct answer → marked Correct');

// Test Case 2: Select a wrong answer → marked Incorrect
const res2 = validateAnswer(q1, 'London');
assert(res2.isAnswered && !res2.isCorrect, '2. Select wrong answer → marked Incorrect');

// Test Case 3: Leave question unanswered → Unanswered
const res3 = validateAnswer(q1, null);
const res3b = validateAnswer(q1, '');
assert(!res3.isAnswered && !res3.isCorrect && !res3b.isAnswered, '3. Leave question unanswered → Unanswered');

// Test Case 4: Change answer before submission → latest answer is evaluated
let userAnswersMap = { 0: 'London' };
// User changes answer to 'Paris' before submission
userAnswersMap[0] = 'Paris';
const res4 = gradeQuiz([q1], userAnswersMap);
assert(res4.correct === 1 && res4.percentage === 100, '4. Change answer before submission → latest answer evaluated');

// Test Case 5: Shuffle options → correct answer remains correct
const shuffledOptions = ['Paris', 'Rome', 'London', 'Berlin'];
const q5 = { ...q1, options: shuffledOptions };
const res5 = validateAnswer(q5, 'Paris');
assert(res5.isCorrect, '5. Shuffle options → correct answer remains correct');

// Test Case 6: Submit quiz → score is accurate
const questions6 = [
  { id: '1', options: ['A', 'B'], correctAnswer: 'A' },
  { id: '2', options: ['A', 'B'], correctAnswer: 'B' },
  { id: '3', options: ['A', 'B'], correctAnswer: 'A' },
  { id: '4', options: ['A', 'B'], correctAnswer: 'B' },
];
// Answers: 3 correct, 1 wrong
const answers6 = { 0: 'A', 1: 'B', 2: 'A', 3: 'A' };
const res6 = gradeQuiz(questions6, answers6);
assert(
  res6.correct === 3 && res6.incorrect === 1 && res6.total === 4 && res6.percentage === 75,
  '6. Submit quiz → score is accurate (3/4 = 75%)'
);

// Test Case 7: Retake quiz → previous answers are reset
const completedQuiz = {
  id: 'completed-1',
  score: { correct: 8, total: 10, percentage: 80 },
  completedAt: new Date().toISOString(),
  timeSpent: 120,
  questions: [
    { id: 'q1', userAnswer: 'Old Answer', isCorrect: true },
    { id: 'q2', userAnswer: 'Another Answer', isCorrect: false },
  ],
};
const freshAttempt = createFreshQuizAttempt(completedQuiz);
const allAnswersNull = freshAttempt.questions.every((q) => q.userAnswer === null);
assert(
  freshAttempt.score === null && freshAttempt.completedAt === null && allAnswersNull,
  '7. Retake quiz → previous answers and score are reset'
);

// Test Case 8: Submit twice → score does not double
const gradeAttempt1 = gradeQuiz(questions6, answers6);
const gradeAttempt2 = gradeQuiz(questions6, answers6);
assert(
  gradeAttempt1.correct === gradeAttempt2.correct && gradeAttempt1.percentage === gradeAttempt2.percentage,
  '8. Submit twice → score does not double or alter'
);

// Test Case 9: True/False questions → correct validation
const qTf1 = { id: 'tf1', type: 'tf', options: ['True', 'False'], correctAnswer: 'True' };
const qTf2 = { id: 'tf2', type: 'tf', options: ['True', 'False'], correctAnswer: 'False' };
const resTf1 = validateAnswer(qTf1, 'True');
const resTf2 = validateAnswer(qTf2, 'false'); // case insensitive
const resTf3 = validateAnswer(qTf2, 'True'); // wrong answer
assert(resTf1.isCorrect && resTf2.isCorrect && !resTf3.isCorrect, '9. True/False questions → correct validation');

// Test Case 10: Mixed-format questions → each question is validated using its own correct answer
const mixedQuestions = [
  { id: 'm1', type: 'mcq', options: ['Red', 'Blue', 'Green'], correctAnswer: 'Blue' },
  { id: 'm2', type: 'tf', options: ['True', 'False'], correctAnswer: 'True' },
  { id: 'm3', type: 'mcq', options: ['10', '20', '30'], correctAnswer: '20' },
];
const mixedAnswers = { 0: 'Blue', 1: 'True', 2: '10' }; // 2 correct, 1 incorrect
const resMixed = gradeQuiz(mixedQuestions, mixedAnswers);
assert(
  resMixed.correct === 2 && resMixed.incorrect === 1 && resMixed.total === 3,
  '10. Mixed-format questions → each question validated correctly'
);

// Test Case 11: Quiz with different question counts → percentage calculation is correct
const questions5 = Array.from({ length: 5 }, (_, i) => ({ id: `q${i}`, correctAnswer: 'A' }));
const resScore5 = gradeQuiz(questions5, { 0: 'A', 1: 'A', 2: 'A', 3: 'B', 4: 'B' }); // 3/5 = 60%
assert(resScore5.percentage === 60, '11a. 5 questions (3/5) → 60%');

const questions20 = Array.from({ length: 20 }, (_, i) => ({ id: `q${i}`, correctAnswer: 'A' }));
const answers17 = {};
for (let i = 0; i < 17; i++) answers17[i] = 'A'; // 17/20 = 85%
const resScore20 = gradeQuiz(questions20, answers17);
assert(resScore20.percentage === 85, '11b. 20 questions (17/20) → 85%');

// Test Case 12: Existing archived quizzes → remain readable and accessible
assert(
  DEFAULT_SAMPLE_QUIZZES.length > 0 &&
  DEFAULT_SAMPLE_QUIZZES[0].questions.length === 10 &&
  DEFAULT_SAMPLE_QUIZZES[0].score.total === 10,
  '12. Existing archived quizzes → remain readable and accessible'
);

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
