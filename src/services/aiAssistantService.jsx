/**
 * aiAssistantService.js
 * Storage and simulated AI service for Study Buddy AI Assistant.
 * Preserves LocalStorage keys: sb_ai_chats_v1, sb_ai_active_chat_v1
 */

const STORAGE_KEY = 'sb_ai_chats_v1';
const ACTIVE_CHAT_KEY = 'sb_ai_active_chat_v1';
const MOCK_LATENCY_MS = 600;

function uid(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function nowIso() {
  return new Date().toISOString();
}

function seedData() {
  const recursionChatId = uid('chat');
  const calcChatId = uid('chat');
  const essayChatId = uid('chat');

  return {
    chats: [
      {
        id: recursionChatId,
        title: 'Recursion explained',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        context: null,
        messages: [
          {
            id: uid('msg'),
            role: 'user',
            text: 'Can you explain recursion in simple words?',
            timestamp: nowIso(),
            action: null,
            feedback: null,
          },
          {
            id: uid('msg'),
            role: 'ai',
            content: {
              paragraphs: [
                'Recursion is a programming technique where a function calls itself to solve a smaller sub-problem of the same type.',
                'Think of Russian nesting dolls (Matryoshka). To find the tiny piece of candy at the very center, you open a doll, find another doll inside, and repeat the exact same procedure until you hit the smallest doll.',
              ],
              list: [
                '<strong>Base Case:</strong> The stopping condition that prevents infinite looping (e.g., reaching the smallest doll with no inner doll).',
                '<strong>Recursive Step:</strong> The function reduces the problem and invokes itself with a smaller input (e.g., opening the next inner doll).',
              ],
            },
            timestamp: nowIso(),
            feedback: null,
          },
        ],
      },
      {
        id: calcChatId,
        title: 'Calculus revision',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        context: null,
        messages: [
          {
            id: uid('msg'),
            role: 'user',
            text: 'Can you help me revise derivatives before my test?',
            timestamp: nowIso(),
            action: null,
            feedback: null,
          },
          {
            id: uid('msg'),
            role: 'ai',
            content: {
              paragraphs: [
                "Sure — a derivative measures the instantaneous rate of change of a function with respect to one of its variables. Geometrically, it represents the slope of the tangent line at any given point.",
                "The core rules you need to have down cold are the Power Rule, Product Rule, Quotient Rule, and Chain Rule.",
              ],
              list: [
                '<strong>Power Rule:</strong> d/dx [x^n] = n * x^(n - 1)',
                '<strong>Product Rule:</strong> d/dx [u * v] = u\'v + uv\'',
                '<strong>Chain Rule:</strong> d/dx [f(g(x))] = f\'(g(x)) * g\'(x)',
              ],
            },
            timestamp: nowIso(),
            feedback: null,
          },
        ],
      },
      {
        id: essayChatId,
        title: 'History Essay Outline',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        context: null,
        messages: [
          {
            id: uid('msg'),
            role: 'user',
            text: 'Help me outline an essay on the causes of World War I.',
            timestamp: nowIso(),
            action: null,
            feedback: null,
          },
          {
            id: uid('msg'),
            role: 'ai',
            content: {
              paragraphs: [
                'A classic framework for analyzing the causes of WWI is the M-A-I-N acronym: Militarism, Alliances, Imperialism, and Nationalism, sparked by the assassination in Sarajevo.',
              ],
              list: [
                '<strong>Introduction:</strong> Thesis on how interconnected treaty systems transformed a regional Balkan crisis into global conflict.',
                '<strong>Body 1:</strong> Militarism & the Anglo-German naval arms race.',
                '<strong>Body 2:</strong> Complex alliances (Triple Entente vs. Central Powers).',
                '<strong>Body 3:</strong> Imperial tensions in Africa and Slavic nationalism.',
                '<strong>Conclusion:</strong> Synthesis of systemic pressure vs. immediate trigger.',
              ],
            },
            timestamp: nowIso(),
            feedback: null,
          },
        ],
      },
    ],
  };
}

export const aiAssistantService = {
  // --- Chat Store Methods ---
  getAllChats() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = seedData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        if (!localStorage.getItem(ACTIVE_CHAT_KEY) && seeded.chats.length > 0) {
          localStorage.setItem(ACTIVE_CHAT_KEY, seeded.chats[0].id);
        }
        return seeded.chats;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed?.chats) ? parsed.chats : [];
    } catch (e) {
      console.error('Failed to load AI chats from localStorage:', e);
      return [];
    }
  },

  getActiveChatId() {
    try {
      const activeId = localStorage.getItem(ACTIVE_CHAT_KEY);
      if (activeId) return activeId;
      const chats = this.getAllChats();
      if (chats.length > 0) {
        localStorage.setItem(ACTIVE_CHAT_KEY, chats[0].id);
        return chats[0].id;
      }
      return null;
    } catch {
      return null;
    }
  },

  setActiveChatId(id) {
    try {
      if (id) {
        localStorage.setItem(ACTIVE_CHAT_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_KEY);
      }
    } catch (e) {
      console.error('Failed to set active chat id:', e);
    }
  },

  getChatById(id) {
    const chats = this.getAllChats();
    return chats.find((c) => c.id === id) || null;
  },

  createChat(title = 'New Discussion', initialMessage = null, context = null) {
    const chats = this.getAllChats();
    const newChat = {
      id: uid('chat'),
      title: title.slice(0, 50),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      context: context || null,
      messages: [],
    };

    if (initialMessage) {
      newChat.messages.push({
        id: uid('msg'),
        role: 'user',
        text: initialMessage,
        timestamp: nowIso(),
        action: null,
        feedback: null,
      });
    }

    chats.unshift(newChat);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats }));
      localStorage.setItem(ACTIVE_CHAT_KEY, newChat.id);
    } catch (e) {
      console.error('Failed to save new chat:', e);
    }
    return newChat;
  },

  addMessage(chatId, message) {
    const chats = this.getAllChats();
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return null;

    const fullMessage = {
      id: message.id || uid('msg'),
      role: message.role || 'user',
      text: message.text || '',
      content: message.content || null,
      contextName: message.contextName || null,
      timestamp: message.timestamp || nowIso(),
      action: message.action || null,
      feedback: message.feedback || null,
    };

    if (!Array.isArray(chat.messages)) {
      chat.messages = [];
    }

    chat.messages.push(fullMessage);
    chat.updatedAt = nowIso();

    // Auto-update title if it's currently generic and user is asking something
    if (chat.title === 'New Discussion' && message.role === 'user' && message.text) {
      chat.title = message.text.slice(0, 32).trim() + (message.text.length > 32 ? '...' : '');
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats }));
    } catch (e) {
      console.error('Failed to append message to chat:', e);
    }

    return fullMessage;
  },

  updateMessageFeedback(chatId, messageId, feedback) {
    const chats = this.getAllChats();
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return false;

    const msg = chat.messages.find((m) => m.id === messageId);
    if (!msg) return false;

    // Toggle feedback if clicking the same button
    msg.feedback = msg.feedback === feedback ? null : feedback;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats }));
      return true;
    } catch (e) {
      console.error('Failed to update message feedback:', e);
      return false;
    }
  },

  deleteChat(chatId) {
    let chats = this.getAllChats();
    chats = chats.filter((c) => c.id !== chatId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats }));
      const activeId = localStorage.getItem(ACTIVE_CHAT_KEY);
      if (activeId === chatId) {
        const nextActive = chats.length > 0 ? chats[0].id : null;
        if (nextActive) {
          localStorage.setItem(ACTIVE_CHAT_KEY, nextActive);
        } else {
          localStorage.removeItem(ACTIVE_CHAT_KEY);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to delete chat:', e);
      return false;
    }
  },

  renameChat(chatId, newTitle) {
    const chats = this.getAllChats();
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return false;

    chat.title = newTitle.trim() || 'Untitled Chat';
    chat.updatedAt = nowIso();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats }));
      return true;
    } catch (e) {
      console.error('Failed to rename chat:', e);
      return false;
    }
  },

  // --- Simulated AI Generation Engine ---
  generateReply({ prompt = '', action = null, context = null }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: buildMockReply(prompt, action, context),
        });
      }, MOCK_LATENCY_MS);
    });
  },
};

function extractTopic(prompt, context) {
  if (context && context.name) {
    return context.name.replace(/\.[^/.]+$/, '');
  }
  const clean = prompt.replace(/^(can you|please|help me|explain|summarize|what is|how does)\s+/i, '').trim();
  return clean || 'this topic';
}

function buildMockReply(prompt, action, context) {
  const topic = extractTopic(prompt, context);
  const contextNote = context && context.name
    ? [`Referencing your attached material "${context.name}".`]
    : [];

  const lower = prompt.toLowerCase();

  if (action === 'explain' || lower.includes('explain') || lower.includes('how does')) {
    return {
      paragraphs: [
        ...contextNote,
        `Here is a clear, step-by-step breakdown of "${topic}":`,
        `When studying this, it helps to break it into two fundamental components: the underlying intuition and the technical mechanics.`,
      ],
      list: [
        `<strong>Core Concept:</strong> The fundamental rule governing ${topic} is all about state and transformation.`,
        `<strong>Why it matters:</strong> Mastering this allows you to solve more complex problems with predictable outcomes.`,
        `<strong>Common Pitfall:</strong> Avoid confusing the theoretical boundary conditions with the general operational loop.`,
      ],
    };
  }

  if (action === 'summarize' || lower.includes('summarize') || lower.includes('summary')) {
    return {
      paragraphs: [
        ...contextNote,
        `Here is an executive summary of "${topic}":`,
      ],
      list: [
        `<strong>Key Takeaway 1:</strong> The primary definition and core objective.`,
        `<strong>Key Takeaway 2:</strong> Essential dependencies, constraints, and formulas.`,
        `<strong>Key Takeaway 3:</strong> Practical real-world applications and exam-relevant questions.`,
      ],
    };
  }

  if (action === 'quiz' || lower.includes('quiz') || lower.includes('test me')) {
    return {
      paragraphs: [
        ...contextNote,
        `Here is a quick concept-check question on "${topic}":`,
      ],
      quiz: {
        question: `Which of the following statements most accurately describes ${topic}?`,
        options: [
          `A) It operates primarily as an iterative transformation without base terminating states.`,
          `B) It relies on structured decomposition where each step handles a simpler sub-case.`,
          `C) It is strictly an asymptotic approximation with no exact analytical solution.`,
          `D) None of the above.`,
        ],
        answer: 'B',
      },
    };
  }

  if (action === 'flashcards' || action === 'cards' || lower.includes('flashcard')) {
    return {
      paragraphs: [
        ...contextNote,
        `Here are high-yield study flashcards for "${topic}":`,
      ],
      list: [
        `<strong>Card 1 — Front:</strong> What is the core definition of ${topic}?<br/><strong>Back:</strong> A fundamental mechanism characterized by systematic decomposition and predictable state change.`,
        `<strong>Card 2 — Front:</strong> What is the primary governing rule or boundary condition?<br/><strong>Back:</strong> Boundary conditions must be explicitly verified to prevent unbounded execution or state corruption.`,
        `<strong>Card 3 — Front:</strong> How is this typically applied in exams or problem sets?<br/><strong>Back:</strong> By deriving transitions step-by-step and verifying constraints against sample inputs.`,
      ],
    };
  }

  if (action === 'revision' || action === 'exam' || lower.includes('exam') || lower.includes('revision') || lower.includes('prepare')) {
    return {
      paragraphs: [
        ...contextNote,
        `High-Yield Exam Preparation Blueprint for "${topic}":`,
        `Focus on these high-probability areas for top exam scores:`,
      ],
      list: [
        `<strong>Must-Know Formulas & Definitions:</strong> Memorize fundamental notation, equations, and exact boundary criteria.`,
        `<strong>Common Exam Traps:</strong> Watch out for off-by-one errors, neglected edge cases, and sign mismatches.`,
        `<strong>Speed Strategy:</strong> Write out known variables and target output in the margin before computing.`,
        `<strong>Sanity Check:</strong> Plug the simplest test case back into your final equation before moving to the next question.`,
      ],
    };
  }

  if (action === 'solve' || lower.includes('step-by-step') || lower.includes('solve')) {
    return {
      paragraphs: [
        ...contextNote,
        `Let's solve "${topic}" step-by-step:`,
      ],
      list: [
        `<strong>Step 1: Identify Knowns and Unknowns:</strong> Write down given variables and expected output.`,
        `<strong>Step 2: Choose Governing Principle:</strong> Select the matching formula or algorithmic pattern.`,
        `<strong>Step 3: Execute Step-by-Step Derivation:</strong> Substitute values and simplify methodically.`,
        `<strong>Step 4: Verify Consistency:</strong> Check units, edge conditions, and bounds.`,
      ],
    };
  }

  // Default general intelligence response
  return {
    paragraphs: [
      ...contextNote,
      `Great question regarding "${topic}". Here is what you need to keep in mind:`,
      `In modern curricula, understanding this concept deeply requires connecting the theoretical explanation with practical hands-on examples.`,
    ],
    list: [
      `<strong>Primary definition:</strong> A foundational building block in this subject area.`,
      `<strong>Exam tip:</strong> Professors frequently test edge cases and transitions rather than just direct memorization.`,
      `<strong>Next step:</strong> Try solving a practice problem or let me quiz you on the key terms!`,
    ],
  };
}

