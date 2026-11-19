/**
 * flashcardService.js
 * Manages Flashcard decks, cards, LocalStorage persistence, and study history.
 * Preserves LocalStorage keys: study_buddy_flashcard_decks, study_buddy_flashcard_history
 */

export const STORAGE_KEY_DECKS = 'study_buddy_flashcard_decks';
export const STORAGE_KEY_HISTORY = 'study_buddy_flashcard_history';

export const DEFAULT_DECKS = [
  {
    id: 'deck_c_programming',
    title: 'C Programming Mastery',
    subject: 'Computer Science',
    topic: 'C Programming Functions & Pointers',
    difficulty: 'Medium',
    language: 'English',
    lastReviewed: 'Today',
    cards: [
      {
        id: 'card_c_1',
        tag: 'Core Concept',
        question: 'What is a function in C?',
        answer: 'A function is a reusable block of code designed to perform a specific task, promoting modularity and maintainability.',
        code: 'int add(int a, int b) {\n    return a + b;\n}',
        status: 'known',
        bookmarked: true
      },
      {
        id: 'card_c_2',
        tag: 'Memory & Pointers',
        question: 'What is a pointer and how do you declare one?',
        answer: 'A pointer is a variable that stores the memory address of another variable. It is declared using the asterisk (*) symbol.',
        code: 'int num = 42;\nint *ptr = &num; // ptr stores address of num',
        status: 'known',
        bookmarked: false
      },
      {
        id: 'card_c_3',
        tag: 'Dynamic Memory',
        question: 'What is the purpose of malloc() and free()?',
        answer: 'malloc() dynamically allocates a specified number of bytes on the heap, while free() deallocates that memory to avoid memory leaks.',
        code: 'int *arr = (int*) malloc(5 * sizeof(int));\n// use arr...\nfree(arr);',
        status: 'practice',
        bookmarked: false
      },
      {
        id: 'card_c_4',
        tag: 'Data Structures',
        question: 'What is a struct in C?',
        answer: 'A struct is a composite data type that allows grouping variables of different data types under a single name.',
        code: 'struct Student {\n    char name[50];\n    int rollNo;\n    float gpa;\n};',
        status: 'known',
        bookmarked: false
      },
      {
        id: 'card_c_5',
        tag: 'Core Concept',
        question: 'What is the difference between pass-by-value and pass-by-reference in C?',
        answer: 'C is strictly pass-by-value. Pass-by-reference is simulated by passing the address of a variable via a pointer.',
        code: 'void increment(int *val) {\n    (*val)++;\n}',
        status: 'known',
        bookmarked: false
      },
      {
        id: 'card_c_6',
        tag: 'Recursion',
        question: 'What are the two essential components of a recursive function?',
        answer: '1. Base Case: The condition that terminates recursion.\n2. Recursive Step: The function calling itself with a modified argument moving toward the base case.',
        code: 'int factorial(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive\n}',
        status: 'known',
        bookmarked: false
      }
    ]
  },
  {
    id: 'deck_calculus',
    title: 'Mathematics & Calculus',
    subject: 'Mathematics',
    topic: 'Differential & Integral Calculus',
    difficulty: 'Hard',
    language: 'English',
    lastReviewed: 'Yesterday',
    cards: [
      {
        id: 'card_m_1',
        tag: 'Derivatives',
        question: 'What is the Power Rule in differentiation?',
        answer: 'The derivative of x^n with respect to x is n * x^(n-1).',
        code: '// d/dx (x^n) = n * x^(n-1)\n// Example: d/dx (x^3) = 3x^2',
        status: 'known',
        bookmarked: false
      },
      {
        id: 'card_m_2',
        tag: 'Derivatives',
        question: 'What is the Chain Rule?',
        answer: 'The derivative of a composite function f(g(x)) is f\'(g(x)) * g\'(x).',
        code: '// d/dx [f(g(x))] = f\'(g(x)) * g\'(x)',
        status: 'known',
        bookmarked: false
      }
    ]
  },
  {
    id: 'deck_dsa',
    title: 'Python & Data Structures',
    subject: 'Computer Science',
    topic: 'Trees, Graphs, and Hash Tables',
    difficulty: 'Medium',
    language: 'English',
    lastReviewed: '3 days ago',
    cards: [
      {
        id: 'card_dsa_1',
        tag: 'Complexity',
        question: 'What is the average time complexity for lookup in a Hash Table?',
        answer: 'The average time complexity is O(1) constant time, while the worst-case time complexity is O(n) due to hash collisions.',
        code: 'lookup_table = {"id": 101, "role": "admin"}\nval = lookup_table.get("id") # O(1)',
        status: 'known',
        bookmarked: false
      }
    ]
  }
];

export const flashcardService = {
  // --- Decks CRUD ---
  getAllDecks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DECKS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(DEFAULT_DECKS));
        return DEFAULT_DECKS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load flashcard decks:', e);
      return [];
    }
  },

  getDeckById(id) {
    const decks = this.getAllDecks();
    return decks.find((d) => d.id === id) || null;
  },

  saveDeck(deck) {
    const decks = this.getAllDecks();
    const existingIndex = decks.findIndex((d) => d.id === deck.id);

    if (existingIndex >= 0) {
      decks[existingIndex] = { ...decks[existingIndex], ...deck };
    } else {
      decks.unshift(deck);
    }

    try {
      localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
      return deck;
    } catch (e) {
      console.error('Failed to save flashcard deck:', e);
      return null;
    }
  },

  deleteDeck(id) {
    let decks = this.getAllDecks();
    decks = decks.filter((d) => d.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
      return true;
    } catch (e) {
      console.error('Failed to delete flashcard deck:', e);
      return false;
    }
  },

  calculateDeckStats(deck) {
    if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
      return { total: 0, known: 0, practice: 0, unseen: 0, masteryPercent: 0 };
    }
    const total = deck.cards.length;
    let known = 0;
    let practice = 0;
    let unseen = 0;

    deck.cards.forEach((card) => {
      if (card.status === 'known') known++;
      else if (card.status === 'practice') practice++;
      else unseen++;
    });

    const masteryPercent = Math.round((known / total) * 100);
    return { total, known, practice, unseen, masteryPercent };
  },

  updateCardStatus(deckId, cardId, status, bookmarked = undefined) {
    const decks = this.getAllDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck || !Array.isArray(deck.cards)) return false;

    const card = deck.cards.find((c) => c.id === cardId);
    if (!card) return false;

    if (status !== undefined) card.status = status;
    if (bookmarked !== undefined) card.bookmarked = bookmarked;

    deck.lastReviewed = 'Just now';

    try {
      localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
      return true;
    } catch (e) {
      console.error('Failed to update card status:', e);
      return false;
    }
  },

  addCardToDeck(deckId, card) {
    const decks = this.getAllDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) return false;

    if (!Array.isArray(deck.cards)) deck.cards = [];

    const newCard = {
      id: card.id || 'card_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      tag: card.tag || 'Concept',
      question: card.question || '',
      answer: card.answer || '',
      code: card.code || '',
      status: card.status || 'unseen',
      bookmarked: !!card.bookmarked,
    };

    deck.cards.push(newCard);

    try {
      localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
      return newCard;
    } catch (e) {
      console.error('Failed to add card:', e);
      return null;
    }
  },

  updateCardInDeck(deckId, cardId, updatedCard) {
    const decks = this.getAllDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck || !Array.isArray(deck.cards)) return false;

    const cardIndex = deck.cards.findIndex((c) => c.id === cardId);
    if (cardIndex < 0) return false;

    deck.cards[cardIndex] = { ...deck.cards[cardIndex], ...updatedCard };

    try {
      localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
      return true;
    } catch (e) {
      console.error('Failed to update card in deck:', e);
      return false;
    }
  },

  deleteCardFromDeck(deckId, cardId) {
    const decks = this.getAllDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck || !Array.isArray(deck.cards)) return false;

    deck.cards = deck.cards.filter((c) => c.id !== cardId);

    try {
      localStorage.setItem(STORAGE_KEY_DECKS, JSON.stringify(decks));
      return true;
    } catch (e) {
      console.error('Failed to delete card:', e);
      return false;
    }
  },

  // --- Flashcard Generator ---
  createIntelligentDeck(config) {
    const {
      subject = 'Computer Science',
      topic = 'Core Concepts',
      rawText = '',
      cardCount = 10,
      difficulty = 'Medium',
      language = 'English',
    } = config;

    const deckId = 'deck_' + Date.now();
    const cards = [];
    const count = Math.max(1, Math.min(30, Number(cardCount) || 10));

    if (rawText && rawText.length > 20) {
      const sentences = rawText
        .split(/[.!?\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 15);

      for (let i = 0; i < count; i++) {
        const sentence = sentences[i % sentences.length] || `Important concept ${i + 1} regarding ${topic}.`;
        const words = sentence.split(' ');
        const cueWord = words.slice(0, 3).join(' ');

        cards.push({
          id: `card_${deckId}_${i + 1}`,
          tag: 'Key Principle',
          question: `Explain the importance of "${cueWord}" in the context of ${topic}:`,
          answer: sentence.endsWith('.') ? sentence : sentence + '.',
          code: '',
          status: 'unseen',
          bookmarked: false,
        });
      }
    } else {
      // Standard algorithmic flashcard template builder
      const topicsPool = [
        {
          tag: 'Definition',
          q: (t) => `What is the core definition of "${t}"?`,
          a: (t, s) => `${t} represents a central theoretical and practical paradigm within ${s}, establishing structured patterns and reproducible results.`,
          code: '',
        },
        {
          tag: 'Mechanics',
          q: (t) => `How do fundamental mechanisms operate within ${t}?`,
          a: (t) => `In ${t}, mechanisms process inputs through systematic transformations, handling state transitions and maintaining consistency under boundary constraints.`,
          code: '',
        },
        {
          tag: 'Best Practice',
          q: (t) => `What is the recommended best practice when applying ${t}?`,
          a: (t) => `When applying ${t}, ensure modularity, enforce strict input validation, profile critical execution paths, and document edge cases.`,
          code: '',
        },
        {
          tag: 'Common Pitfall',
          q: (t) => `What is a common error or pitfall when studying ${t}?`,
          a: (t) => `When studying ${t}, a common error is failing to establish base terminating conditions and confusing theoretical asymptotic complexity with actual runtime overhead.`,
          code: '',
        },
        {
          tag: 'Key Formula / Rule',
          q: (t) => `What essential rule governs optimal performance in ${t}?`,
          a: (t) => `For ${t}, performance is governed by minimal state mutation, locality of reference, and predictable time complexity.`,
          code: '',
        },
      ];

      for (let i = 0; i < count; i++) {
        const tmpl = topicsPool[i % topicsPool.length];
        cards.push({
          id: `card_${deckId}_${i + 1}`,
          tag: tmpl.tag,
          question: tmpl.q(topic),
          answer: tmpl.a(topic, subject),
          code: tmpl.code,
          status: 'unseen',
          bookmarked: false,
        });
      }
    }

    const newDeck = {
      id: deckId,
      title: `${topic} Mastery`,
      subject: subject || 'General',
      topic: topic || 'Core Topics',
      difficulty: difficulty || 'Medium',
      language: language || 'English',
      lastReviewed: 'Just now',
      cards,
    };

    return newDeck;
  },

  // --- Study History ---
  getStudyHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) {
        const defaultHistory = [
          {
            deckTitle: 'C Programming Mastery',
            timestamp: 'Today at 10:30 AM',
            score: '75% Mastery',
          },
        ];
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(defaultHistory));
        return defaultHistory;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load flashcard history:', e);
      return [];
    }
  },

  logStudyActivity(deckTitle, scoreText) {
    const history = this.getStudyHistory();
    const now = new Date();
    const timeStr =
      now.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' at ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    history.unshift({
      deckTitle,
      timestamp: timeStr,
      score: scoreText,
    });

    if (history.length > 20) {
      history.pop();
    }

    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
      return true;
    } catch (e) {
      console.error('Failed to save study activity:', e);
      return false;
    }
  },

  clearHistory() {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([]));
      return true;
    } catch (e) {
      console.error('Failed to clear study history:', e);
      return false;
    }
  },
};

