/**
 * quizService.js
 * Manages Quiz Generator state, LocalStorage persistence, answer validation, and question generation.
 * Preserves LocalStorage key: sb_quizzes
 */

export const STORAGE_KEY_QUIZZES = 'sb_quizzes';

// Utility: Normalize answer text for reliable comparison
export function normalizeAnswerText(text) {
  if (text == null) return '';
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/^([a-d])[).:\s]+/i, '') // strip leading "A) " or "A. " prefixes if option has it
    .replace(/\s+/g, ' ');
}

/**
 * Validates a user's answer against a question's correct answer.
 * Handles:
 * - Direct text match (case-insensitive, whitespace-normalized)
 * - Letter-to-text match (e.g. user selected 'B' and correct answer is options[1], or vice-versa)
 * - Index-to-text match (e.g. user selected index 1 and correct answer is options[1], or vice-versa)
 * - Stripping "A) " prefixes
 * - True / False normalization ('true', 't', 'false', 'f')
 * - Unanswered detection (null, undefined, empty string)
 *
 * @param {Object} question - The question object { options, correctAnswer, type, etc. }
 * @param {any} userAnswer - The user's submitted answer
 * @returns {Object} { isAnswered: boolean, isCorrect: boolean, resolvedCorrectAnswer: string }
 */
export function validateAnswer(question, userAnswer) {
  if (!question) {
    return { isAnswered: false, isCorrect: false, resolvedCorrectAnswer: '' };
  }

  const rawCorrect = question.correctAnswer;
  const resolvedCorrect = rawCorrect != null ? String(rawCorrect).trim() : '';

  // 1. Check if answered
  if (userAnswer == null || String(userAnswer).trim() === '') {
    return {
      isAnswered: false,
      isCorrect: false,
      resolvedCorrectAnswer: resolvedCorrect,
    };
  }

  const normUser = normalizeAnswerText(userAnswer);
  const normCorrect = normalizeAnswerText(rawCorrect);

  // 2. Direct string equality match
  if (normUser === normCorrect && normUser.length > 0) {
    return {
      isAnswered: true,
      isCorrect: true,
      resolvedCorrectAnswer: resolvedCorrect,
    };
  }

  // 3. True / False normalization
  const tfTrue = ['true', 't', 'yes', '1'];
  const tfFalse = ['false', 'f', 'no', '0'];
  if (tfTrue.includes(normUser) && tfTrue.includes(normCorrect)) {
    return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: 'True' };
  }
  if (tfFalse.includes(normUser) && tfFalse.includes(normCorrect)) {
    return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: 'False' };
  }

  // 4. Options resolution (MCQ / array options)
  const options = Array.isArray(question.options) ? question.options : [];
  if (options.length > 0) {
    let correctIdx = -1;

    // Is rawCorrect directly an option text?
    correctIdx = options.findIndex((opt) => normalizeAnswerText(opt) === normCorrect);

    // If not found, is rawCorrect a letter ('A', 'B', 'C', 'D')?
    if (correctIdx === -1 && /^[a-d]$/i.test(String(rawCorrect).trim())) {
      correctIdx = String(rawCorrect).trim().toUpperCase().charCodeAt(0) - 65;
    }

    // If not found, is rawCorrect an index ('0', '1', '2', '3')?
    if (correctIdx === -1 && /^\d+$/.test(String(rawCorrect).trim())) {
      const idxNum = parseInt(String(rawCorrect).trim(), 10);
      if (idxNum >= 0 && idxNum < options.length) {
        correctIdx = idxNum;
      }
    }

    // Determine the resolved correct option string
    const correctOptionText =
      correctIdx >= 0 && correctIdx < options.length ? options[correctIdx] : resolvedCorrect;

    if (correctIdx >= 0) {
      // Check user answer by text against options[correctIdx]
      if (normUser === normalizeAnswerText(options[correctIdx])) {
        return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: correctOptionText };
      }

      // Check if user answer is the letter matching correctIdx
      const correctLetter = String.fromCharCode(65 + correctIdx).toLowerCase();
      if (normUser === correctLetter) {
        return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: correctOptionText };
      }

      // Check if user answer is the index number matching correctIdx
      if (normUser === String(correctIdx)) {
        return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: correctOptionText };
      }
    }
  }

  // 5. Short answer / QA keyword similarity check (for backward compatibility with archived QA questions)
  if (question.type === 'qa') {
    const cleanU = normUser.replace(/[^\w\s]/g, '');
    const cleanC = normCorrect.replace(/[^\w\s]/g, '');
    if (cleanU === cleanC && cleanU.length > 0) {
      return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: resolvedCorrect };
    }
    const wordsC = cleanC.split(/\s+/).filter((w) => w.length > 3);
    const wordsU = new Set(cleanU.split(/\s+/).filter((w) => w.length > 3));
    if (wordsC.length > 0) {
      let matches = 0;
      wordsC.forEach((w) => {
        if (wordsU.has(w)) matches++;
      });
      if (matches / wordsC.length >= 0.5) {
        return { isAnswered: true, isCorrect: true, resolvedCorrectAnswer: resolvedCorrect };
      }
    }
  }

  return {
    isAnswered: true,
    isCorrect: false,
    resolvedCorrectAnswer: resolvedCorrect,
  };
}

/**
 * Calculates complete quiz score safely and accurately.
 */
export function gradeQuiz(questions, answersMap = {}) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      total: 0,
      percentage: 0,
      gradedQuestions: [],
    };
  }

  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  const gradedQuestions = questions.map((q, idx) => {
    const userAns = answersMap[idx] !== undefined ? answersMap[idx] : (q.userAnswer ?? null);
    const result = validateAnswer(q, userAns);

    if (!result.isAnswered) {
      unanswered++;
    } else if (result.isCorrect) {
      correct++;
    } else {
      incorrect++;
    }

    return {
      ...q,
      userAnswer: userAns,
      isCorrect: result.isCorrect,
      isAnswered: result.isAnswered,
      resolvedCorrectAnswer: result.resolvedCorrectAnswer || q.correctAnswer,
    };
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    correct,
    incorrect,
    unanswered,
    total,
    percentage,
    gradedQuestions,
  };
}

/**
 * Creates a clean quiz object for a retake attempt without carrying over past answers.
 */
export function createFreshQuizAttempt(quiz) {
  if (!quiz) return null;
  return {
    ...quiz,
    completedAt: null,
    score: null,
    timeSpent: 0,
    questions: Array.isArray(quiz.questions)
      ? quiz.questions.map((q) => ({
          ...q,
          userAnswer: null,
          isCorrect: undefined,
          isAnswered: undefined,
        }))
      : [],
  };
}

// Utility: Fisher-Yates array shuffle
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const QUESTION_BANK = {
  'computer science': [
    {
      q: 'What is the primary function of an Operating System kernel?',
      statement: 'The primary function of an Operating System kernel is managing hardware resources and process scheduling.',
      o: [
        'Managing hardware resources and process scheduling',
        'Providing GUI themes and icons',
        'Compiling source code into binary executables',
        'Creating database backups on cloud servers',
      ],
      a: 'Managing hardware resources and process scheduling',
      exp: 'The kernel is the core component of an OS managing CPU, memory, and device interactions.',
    },
    {
      q: 'Which protocol is responsible for mapping IP addresses to MAC hardware addresses?',
      statement: 'ARP (Address Resolution Protocol) maps network-layer IP addresses to physical MAC addresses.',
      o: ['ARP', 'DNS', 'DHCP', 'BGP'],
      a: 'ARP',
      exp: 'ARP (Address Resolution Protocol) resolves network-layer IPv4 addresses into link-layer physical MAC addresses.',
    },
    {
      q: 'What is the main benefit of using a Hash Map?',
      statement: 'A Hash Map provides O(1) average time complexity for lookups and insertions.',
      o: [
        'O(1) average time complexity for lookups and insertions',
        'Guaranteed sorted order for all keys',
        'Minimal memory overhead with zero pointers',
        'Elimination of all hash collisions completely',
      ],
      a: 'O(1) average time complexity for lookups and insertions',
      exp: 'Hash maps compute an index using a hashing function, giving instantaneous average O(1) access.',
    },
    {
      q: 'What is the purpose of the virtual DOM in modern web frameworks like React?',
      statement: 'The virtual DOM minimizes expensive real DOM repaints and reflows via reconciliation.',
      o: [
        'To minimize expensive real DOM repaints and reflows via reconciliation',
        'To bypass browser security sandboxes',
        'To store client-side relational SQL tables in browser cookies',
        'To compile JavaScript directly into hardware microcode',
      ],
      a: 'To minimize expensive real DOM repaints and reflows via reconciliation',
      exp: 'Virtual DOM is a lightweight in-memory representation used to calculate optimal diffs before touching the real browser DOM.',
    },
    {
      q: 'What is a closure in JavaScript?',
      statement: 'A closure is a function bundled together with references to its surrounding lexical environment.',
      o: [
        'A function bundled together with references to its surrounding lexical environment',
        'A syntax error thrown when parsing invalid JSON',
        'A method to forcibly terminate asynchronous promises',
        'A CSS property for closing modal dialogs',
      ],
      a: 'A function bundled together with references to its surrounding lexical environment',
      exp: "Closures give an inner function access to an outer function's scope even after the outer function has executed.",
    },
    {
      q: 'Which SQL statement is used to remove a table structure and its data completely?',
      statement: 'The DROP TABLE statement permanently removes both a table structure and its data.',
      o: ['DROP TABLE', 'DELETE TABLE', 'TRUNCATE', 'REMOVE TABLE'],
      a: 'DROP TABLE',
      exp: 'DROP TABLE permanently removes the table schema and data, unlike DELETE or TRUNCATE which only remove rows.',
    },
    {
      q: 'What is an idempotent REST HTTP method?',
      statement: 'The GET method in REST is idempotent because repeated calls do not change server state.',
      o: ['GET', 'POST', 'PATCH', 'CONNECT'],
      a: 'GET',
      exp: 'Idempotent methods (like GET, PUT, DELETE) produce the same server state regardless of how many times they are called.',
    },
  ],
  biology: [
    {
      q: 'Which organelle is known as the powerhouse of the cell?',
      statement: 'Mitochondria are the primary organelles responsible for cellular ATP synthesis.',
      o: ['Mitochondria', 'Ribosome', 'Endoplasmic reticulum', 'Lysosome'],
      a: 'Mitochondria',
      exp: 'Mitochondria produce the majority of cellular adenosine triphosphate (ATP) through oxidative phosphorylation.',
    },
    {
      q: 'What are the building blocks of proteins?',
      statement: 'Amino acids are the fundamental building blocks of proteins.',
      o: ['Amino acids', 'Nucleotides', 'Fatty acids', 'Monosaccharides'],
      a: 'Amino acids',
      exp: 'Proteins are polypeptide polymers made up of 20 different standard amino acids linked by peptide bonds.',
    },
    {
      q: 'Which base pairs with Adenine in DNA?',
      statement: 'Adenine pairs specifically with Thymine in DNA double helices.',
      o: ['Thymine', 'Cytosine', 'Guanine', 'Uracil'],
      a: 'Thymine',
      exp: 'In DNA double helix, Adenine pairs specifically with Thymine via two hydrogen bonds.',
    },
    {
      q: 'What is the primary site of photosynthesis in eukaryotic plant cells?',
      statement: 'Chloroplasts are the primary site of photosynthesis in plant cells.',
      o: ['Chloroplasts', 'Vacuoles', 'Centrosomes', 'Cell wall'],
      a: 'Chloroplasts',
      exp: 'Chloroplasts contain chlorophyll thylakoid membranes that capture light energy to synthesize carbohydrates.',
    },
    {
      q: 'What process produces gametes with half the chromosome count?',
      statement: 'Meiosis is the cellular division process that produces haploid gametes.',
      o: ['Meiosis', 'Mitosis', 'Binary fission', 'Budding'],
      a: 'Meiosis',
      exp: 'Meiosis consists of two successive cell divisions yielding haploid cells (n) from diploid cells (2n).',
    },
  ],
  physics: [
    {
      q: "What is Newton's Second Law of Motion?",
      statement: "Newton's Second Law of Motion states that Net Force equals Mass times Acceleration (F = ma).",
      o: [
        'Force = Mass × Acceleration (F = ma)',
        'For every action, there is an equal and opposite reaction',
        'Energy cannot be created or destroyed',
        'An object at rest stays at rest unless acted on',
      ],
      a: 'Force = Mass × Acceleration (F = ma)',
      exp: 'The acceleration of an object is directly proportional to net force and inversely proportional to mass.',
    },
    {
      q: 'What is the speed of light in vacuum approximately?',
      statement: 'The speed of light in a vacuum is approximately 3 × 10^8 m/s.',
      o: ['3 × 10^8 m/s', '3 × 10^6 m/s', '343 m/s', '1.5 × 10^8 m/s'],
      a: '3 × 10^8 m/s',
      exp: 'The universal physical constant c is approximately 299,792,458 meters per second.',
    },
    {
      q: 'Which thermodynamic law establishes that entropy of an isolated system never decreases over time?',
      statement: 'The Second Law of Thermodynamics dictates that total entropy of an isolated system never decreases.',
      o: ['Second Law', 'Zeroth Law', 'First Law', 'Third Law'],
      a: 'Second Law',
      exp: 'The Second Law of Thermodynamics dictates that natural spontaneous processes increase total entropy.',
    },
  ],
  mathematics: [
    {
      q: 'What is the derivative of sin(x) with respect to x?',
      statement: 'The derivative of sin(x) with respect to x is cos(x).',
      o: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
      a: 'cos(x)',
      exp: 'By calculus differentiation rules, d/dx [sin(x)] = cos(x).',
    },
    {
      q: 'What is the value of the mathematical constant e rounded to two decimals?',
      statement: "Euler's number e rounded to two decimal places is 2.72.",
      o: ['2.72', '3.14', '1.62', '1.41'],
      a: '2.72',
      exp: "Euler's number e is approximately 2.71828...",
    },
    {
      q: 'What does the determinant of a 2x2 matrix [[a, b], [c, d]] equal?',
      statement: 'The determinant of a 2x2 matrix [[a, b], [c, d]] is calculated as ad - bc.',
      o: ['ad - bc', 'ab - cd', 'ad + bc', 'a + d - b - c'],
      a: 'ad - bc',
      exp: 'The determinant of a 2x2 matrix is computed by ad - bc.',
    },
  ],
};

export const DEFAULT_SAMPLE_QUIZZES = [
  {
    id: 'quiz-sample-1',
    subject: 'Computer Science',
    topic: 'Programming Basics',
    difficulty: 'Medium',
    language: 'en',
    format: 'mixed',
    questionCount: 10,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2 + 180000).toISOString(),
    score: {
      correct: 8,
      incorrect: 2,
      unanswered: 0,
      total: 10,
      percentage: 80,
    },
    timeSpent: 175,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
        options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
        userAnswer: 'O(log n)',
        explanation: 'In a balanced BST, each comparison halves the remaining search space, giving logarithmic time complexity O(log n).',
      },
      {
        id: 'q2',
        type: 'mcq',
        question: 'Which of the following data structures follows the LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Array'],
        correctAnswer: 'Stack',
        userAnswer: 'Stack',
        explanation: 'A Stack operates under Last-In-First-Out (LIFO), meaning the last element pushed is the first one popped.',
      },
      {
        id: 'q3',
        type: 'tf',
        question: 'True or False: HTTP is a stateful protocol by default.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        userAnswer: 'False',
        explanation: 'HTTP is stateless by default; each request is executed independently without retaining session state.',
      },
      {
        id: 'q4',
        type: 'mcq',
        question: 'What does the term "polymorphism" in Object-Oriented Programming refer to?',
        options: [
          'Allowing objects to be treated as instances of their parent class while behaving according to their specific type',
          'Hiding internal implementation details behind private variables',
          'Restricting variable scope strictly to a single function',
          'Compiling human-readable code directly to native machine bytecode',
        ],
        correctAnswer: 'Allowing objects to be treated as instances of their parent class while behaving according to their specific type',
        userAnswer: 'Allowing objects to be treated as instances of their parent class while behaving according to their specific type',
        explanation: 'Polymorphism allows methods to perform different tasks based on the object calling them.',
      },
      {
        id: 'q5',
        type: 'tf',
        question: 'True or False: In JavaScript, the "const" keyword prevents object properties from being modified.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        userAnswer: 'True',
        explanation: '"const" prevents reassignment of the variable identifier itself, but object properties can still be mutated.',
      },
      {
        id: 'q6',
        type: 'mcq',
        question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?',
        options: ['MergeSort', 'QuickSort', 'BubbleSort', 'InsertionSort'],
        correctAnswer: 'MergeSort',
        userAnswer: 'MergeSort',
        explanation: 'MergeSort always divides the array in half and merges sorted sub-arrays, guaranteeing O(n log n) even in the worst case.',
      },
      {
        id: 'q7',
        type: 'mcq',
        question: 'What is the primary purpose of an index in a relational database?',
        options: [
          'To speed up data retrieval operations',
          'To enforce hard disk encryption',
          'To compress database disk space',
          'To backup table schemas automatically',
        ],
        correctAnswer: 'To speed up data retrieval operations',
        userAnswer: 'To speed up data retrieval operations',
        explanation: 'Database indexes are data structures (like B-Trees) created to rapidly locate records without scanning every row.',
      },
      {
        id: 'q8',
        type: 'tf',
        question: 'True or False: A hash table provides average O(1) time complexity for lookup operations.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        userAnswer: 'True',
        explanation: 'Assuming a good hash function with minimal collisions, hash table lookups execute in O(1) average time.',
      },
      {
        id: 'q9',
        type: 'mcq',
        question: 'What is a deadlock in concurrent operating systems?',
        options: [
          'A situation where two or more processes are blocked waiting for resources held by each other',
          'An unexpected memory leak causing kernel panic',
          'A permanent disk sector failure during file writing',
          'An infinite recursive function execution without a base case',
        ],
        correctAnswer: 'A situation where two or more processes are blocked waiting for resources held by each other',
        userAnswer: 'An unexpected memory leak causing kernel panic',
        explanation: 'A deadlock condition occurs under mutual exclusion, hold-and-wait, no preemption, and circular wait.',
      },
      {
        id: 'q10',
        type: 'mcq',
        question: 'Which of the following is NOT an ACID property in relational transactions?',
        options: ['Inheritance', 'Atomicity', 'Consistency', 'Durability'],
        correctAnswer: 'Inheritance',
        userAnswer: 'Inheritance',
        explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. Inheritance is an OOP concept.',
      },
    ],
  },
];

export const quizService = {
  getAllQuizzes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUIZZES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(DEFAULT_SAMPLE_QUIZZES));
        return DEFAULT_SAMPLE_QUIZZES;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load quizzes from storage:', e);
      return [];
    }
  },

  getQuizById(id) {
    const list = this.getAllQuizzes();
    return list.find((q) => q.id === id) || null;
  },

  saveQuiz(quiz) {
    const list = this.getAllQuizzes();
    const existingIndex = list.findIndex((q) => q.id === quiz.id);

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...quiz };
    } else {
      list.unshift(quiz);
    }

    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(list));
      return quiz;
    } catch (e) {
      console.error('Failed to save quiz:', e);
      return null;
    }
  },

  deleteQuiz(id) {
    let list = this.getAllQuizzes();
    list = list.filter((q) => q.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to delete quiz:', e);
      return false;
    }
  },

  clearAllQuizzes() {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify([]));
      return true;
    } catch (e) {
      console.error('Failed to clear quizzes:', e);
      return false;
    }
  },

  getQuizStats() {
    const quizzes = this.getAllQuizzes();
    const completed = quizzes.filter((q) => q.score && q.score.total > 0);
    const totalCompleted = completed.length;

    let avgScore = 0;
    if (totalCompleted > 0) {
      const sumPercentage = completed.reduce((acc, q) => acc + (q.score.percentage || 0), 0);
      avgScore = Math.round(sumPercentage / totalCompleted);
    }

    return {
      totalCompleted,
      avgScore,
      totalQuizzes: quizzes.length,
    };
  },

  generateQuizData({
    subject = 'Computer Science',
    topic = 'General Concepts',
    difficulty = 'Medium',
    format = 'mixed',
    count = 10,
    language = 'en',
  }) {
    const questions = [];
    const lowerSub = subject.toLowerCase().trim();
    const lowerTopic = topic.toLowerCase().trim();

    // Look for curated subject questions
    let pool = [];
    for (const key in QUESTION_BANK) {
      if (lowerSub.includes(key) || lowerTopic.includes(key) || key.includes(lowerSub)) {
        pool = pool.concat(QUESTION_BANK[key]);
      }
    }

    // Dynamic templates for custom topics
    const templates = [
      {
        q: (t, s) => `What is the fundamental objective of "${t}" in ${s}?`,
        statement: (t, s) => `The fundamental objective of ${t} in ${s} is to establish structured methodologies and optimize execution.`,
        a: (t) => `To establish standard methodologies, analyze core components, and optimize the execution of ${t}.`,
        distractors: (t) => [
          `To completely avoid all documentation and verification in ${t}.`,
          `To restrict ${t} exclusively to legacy environments without updates.`,
          `To replace all systematic principles with random trial-and-error.`,
        ],
        exp: (t) => `The primary principle of ${t} focuses on sound theoretical models, consistency, and scalable performance.`,
      },
      {
        q: (t) => `Which of the following best describes the key mechanism behind "${t}"?`,
        statement: (t) => `The key mechanism behind ${t} is systematic interaction between foundational components and controlled transformations.`,
        a: (t) => `Systematic interaction between foundational components and controlled transformations in ${t}.`,
        distractors: () => [
          `Uncontrolled variance without any underlying formula or pattern.`,
          `A single-use mechanism that deletes all input parameters permanently.`,
          `Inverting the primary system rules without feedback loops.`,
        ],
        exp: (t) => `Mechanisms in ${t} operate through verified workflows and structured transformations.`,
      },
      {
        q: (t) => `In practical scenarios, what is a major challenge encountered when studying "${t}"?`,
        statement: (t) => `A major challenge in ${t} is balancing efficiency, resource constraints, and edge-case reliability.`,
        a: (t) => `Balancing efficiency, resource constraints, and edge-case reliability in ${t}.`,
        distractors: () => [
          `Finding any theoretical literature or educational definitions.`,
          `The complete absence of physical or digital applications.`,
          `Ensuring zero CPU or energy usage during continuous operation.`,
        ],
        exp: (t) => `Managing constraints, trade-offs, and boundary conditions is central to mastering ${t}.`,
      },
      {
        q: (t) => `Which strategy is considered a best practice when optimizing "${t}"?`,
        statement: (t) => `A recognized best practice for ${t} is continuous profiling, modular decomposition, and iterative validation.`,
        a: (t) => `Continuous profiling, modular decomposition, and iterative validation of ${t}.`,
        distractors: () => [
          `Hardcoding static values and ignoring dynamic environmental factors.`,
          `Skipping error verification and unit checks completely.`,
          `Merging unrelated logic into a single monolithic block without boundaries.`,
        ],
        exp: (t) => `Best practices for ${t} emphasize modularity, observability, and iterative improvement.`,
      },
      {
        q: (t, s) => `How does "${t}" directly relate to advanced concepts in ${s}?`,
        statement: (t, s) => `Mastering ${t} provides the foundational models necessary for scaling advanced systems in ${s}.`,
        a: (t, s) => `It provides the prerequisite foundational models necessary for scaling ${s} systems.`,
        distractors: (t, s) => [
          `It is completely contradictory to all core concepts in ${s}.`,
          `It only applies to obsolete theoretical papers with no practical value.`,
          `It eliminates the need for all mathematical or programmatic reasoning.`,
        ],
        exp: (t, s) => `Mastery of ${t} is an essential stepping stone to mastering high-level concepts across ${s}.`,
      },
    ];

    const requestedCount = Math.max(1, Math.min(50, Number(count) || 10));

    for (let i = 0; i < requestedCount; i++) {
      let qType = format;
      if (format === 'mixed') {
        // In mixed format, alternate 2 MCQs and 1 True/False for clean, objective testing
        qType = i % 3 === 2 ? 'tf' : 'mcq';
      }

      const qId = 'q_' + (i + 1);

      if (pool.length > 0 && i < pool.length) {
        const bankItem = pool[i];

        if (qType === 'tf') {
          const isTrue = i % 2 === 0;
          const statementText = bankItem.statement || `In ${subject}, ${bankItem.a} relates directly to ${bankItem.q.replace(/\?$/, '')}.`;
          const falseStatement = statementText.replace(bankItem.a, 'an arbitrary unverified method');

          questions.push({
            id: qId,
            type: 'tf',
            question: `True or False: ${isTrue ? statementText : falseStatement}`,
            options: ['True', 'False'],
            correctAnswer: isTrue ? 'True' : 'False',
            userAnswer: null,
            explanation: bankItem.exp,
          });
        } else {
          // Shuffle options with Fisher-Yates, ensuring correctAnswer is present
          const rawOpts = bankItem.o && bankItem.o.length >= 2
            ? bankItem.o
            : [bankItem.a, 'Alternative A', 'Alternative B', 'Alternative C'];
          const shuffledOpts = shuffleArray(rawOpts);

          questions.push({
            id: qId,
            type: 'mcq',
            question: bankItem.q,
            options: shuffledOpts,
            correctAnswer: bankItem.a,
            userAnswer: null,
            explanation: bankItem.exp,
          });
        }
      } else {
        // Use algorithmic templates
        const tmpl = templates[i % templates.length];
        const qText = tmpl.q(topic, subject);
        const correctAns = tmpl.a(topic, subject);
        const explanation = tmpl.exp(topic, subject);

        if (qType === 'tf') {
          const isTrue = i % 2 === 0;
          const statement = tmpl.statement ? tmpl.statement(topic, subject) : `Understanding ${topic} is key to ${subject}.`;
          const falseStatement = `In ${subject}, ${topic} requires zero systematic principles or validation.`;

          questions.push({
            id: qId,
            type: 'tf',
            question: `True or False: ${isTrue ? statement : falseStatement}`,
            options: ['True', 'False'],
            correctAnswer: isTrue ? 'True' : 'False',
            userAnswer: null,
            explanation,
          });
        } else {
          const rawDistractors = tmpl.distractors(topic, subject);
          const allOptions = shuffleArray([correctAns, ...rawDistractors]);

          questions.push({
            id: qId,
            type: 'mcq',
            question: qText,
            options: allOptions,
            correctAnswer: correctAns,
            userAnswer: null,
            explanation,
          });
        }
      }
    }

    const newQuiz = {
      id: 'quiz_' + Date.now(),
      subject: subject || 'General',
      topic: topic || 'Study Concepts',
      difficulty: difficulty || 'Medium',
      language: language || 'en',
      format: format || 'mixed',
      questionCount: questions.length,
      createdAt: new Date().toISOString(),
      completedAt: null,
      score: null,
      timeSpent: 0,
      questions,
    };

    return newQuiz;
  },
};
