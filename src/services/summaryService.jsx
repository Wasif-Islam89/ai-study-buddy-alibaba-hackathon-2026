/**
 * summaryService.js
 * LocalStorage data layer and simulated intelligence generator for AI Summaries.
 * Preserves key: study_buddy_summaries
 */

const STORAGE_KEY_SUMMARIES = 'study_buddy_summaries';

const DEFAULT_SUMMARIES = [
  {
    id: 'sum_newton_laws',
    title: "Newton's Laws of Motion",
    subject: 'Physics',
    source: 'Topic Input',
    summaryType: 'Detailed Breakdown',
    length: 'Medium',
    difficulty: 'Student',
    language: 'English',
    createdAt: 'Oct 24, 2024',
    readingTime: '2 mins',
    wordCount: 340,
    overview: "Sir Isaac Newton's three laws of motion describe the fundamental relationship between a physical object and the forces acting upon it. Formulated in 1687, these principles laid the foundation for classical mechanics and remain essential for understanding how and why objects move in our physical universe.",
    keyPoints: [
      {
        title: "Law of Inertia (First Law)",
        desc: "An object at rest stays at rest, and an object in motion continues in motion with the same velocity and in a straight path unless compelled to change its state by an external unbalanced force."
      },
      {
        title: "Fundamental Law of Dynamics (Second Law, F = ma)",
        desc: "The acceleration of a body is directly proportional to the net force applied and inversely proportional to its mass. Mathematically expressed as Force = mass × acceleration (F = ma)."
      },
      {
        title: "Action and Reaction (Third Law)",
        desc: "For every action force in nature, there is an equal magnitude and opposite direction reaction force. Forces always occur in matched interaction pairs."
      }
    ],
    takeaway: "1st Law = Inertia (resistance to change); 2nd Law = F = ma (force causes acceleration); 3rd Law = Equal and opposite paired forces.",
    notes: "Focus on vector resolution for problems involving inclined planes and friction."
  },
  {
    id: 'sum_quantum_mechanics',
    title: 'Quantum Mechanics Basics',
    subject: 'Physics',
    source: 'Topic Input',
    summaryType: 'Quick Overview',
    length: 'Short',
    difficulty: 'Advanced',
    language: 'English',
    createdAt: 'Oct 22, 2024',
    readingTime: '3 mins',
    wordCount: 420,
    overview: "Quantum mechanics is the foundational framework in physics describing physical properties of nature at the atomic and subatomic scales. Unlike deterministic classical mechanics, quantum systems are governed by probability waves and discrete energy packets called quanta.",
    keyPoints: [
      {
        title: "Wave-Particle Duality",
        desc: "Light and subatomic particles demonstrate characteristics of both localized particles and continuous waves depending on the experimental setup (e.g., Young's double-slit experiment)."
      },
      {
        title: "Heisenberg's Uncertainty Principle",
        desc: "It is physically impossible to simultaneously measure both the position and momentum of a subatomic particle with arbitrary precision (Δx · Δp ≥ ℏ/2)."
      },
      {
        title: "Superposition & Wavefunction Collapse",
        desc: "Quantum states exist as linear combinations of multiple possible eigenstates until an observation or interaction forces the wavefunction to collapse into a single state."
      }
    ],
    takeaway: "At atomic scales, matter behaves probabilistically rather than deterministically, existing in superposition until measured.",
    notes: "Review Schrödinger equation derivation and Planck's constant values."
  },
  {
    id: 'sum_intro_psychology',
    title: 'Introduction to Psychology',
    subject: 'Psychology',
    source: 'Lecture Notes',
    summaryType: 'Detailed Breakdown',
    length: 'Detailed',
    difficulty: 'Student',
    language: 'English',
    createdAt: 'Oct 20, 2024',
    readingTime: '4 mins',
    wordCount: 510,
    overview: "Psychology is the rigorous scientific discipline exploring mental operations, emotions, perception, and human behavior. It examines how biological predispositions, individual cognitive appraisals, and sociocultural contexts dynamically shape human actions.",
    keyPoints: [
      {
        title: "Biological Foundations of Mind",
        desc: "The architecture of neurons, neurotransmitters (dopamine, serotonin), and brain regions (prefrontal cortex, amygdala) govern cognition and emotional regulation."
      },
      {
        title: "Behavioral & Learning Theories",
        desc: "Classical conditioning (Pavlovian stimulus association) and operant conditioning (Skinnerian reinforcement and punishment schedules) drive learned responses."
      },
      {
        title: "Cognitive Architecture",
        desc: "Information processing model: sensory memory, working memory with limited capacity (7±2 items), and long-term encoding and retrieval schemas."
      }
    ],
    takeaway: "Human psychological experience is an ongoing interplay between biological neurochemistry, cognitive schemas, and environmental conditioning.",
    notes: "Review difference between positive punishment and negative reinforcement."
  },
  {
    id: 'sum_cellular_respiration',
    title: 'Cellular Respiration & Photosynthesis',
    subject: 'Biology',
    source: 'Topic Input',
    summaryType: 'Exam Revision Notes',
    length: 'Medium',
    difficulty: 'Student',
    language: 'English',
    createdAt: 'Oct 18, 2024',
    readingTime: '3 mins',
    wordCount: 380,
    overview: "Cellular respiration and photosynthesis represent the complementary bioenergetic cycles sustaining life on Earth. Photosynthesis captures radiant solar energy into chemical bonds, while cellular respiration extracts that chemical energy into adenosine triphosphate (ATP).",
    keyPoints: [
      {
        title: "Photosynthesis: Light Reactions & Calvin Cycle",
        desc: "Chloroplast thylakoids utilize photons to split water, yielding O2, ATP, and NADPH. The stroma then fixes atmospheric CO2 into G3P sugars."
      },
      {
        title: "Glycolysis & Krebs Cycle",
        desc: "Cytoplasmic breakdown of glucose into pyruvate generates 2 ATP and NADH. The mitochondrial matrix Krebs cycle processes Acetyl-CoA to release CO2 and high-energy electron carriers."
      },
      {
        title: "Oxidative Phosphorylation",
        desc: "Inner mitochondrial membrane electron transport chain establishes a proton gradient driving ATP synthase to produce ~30-32 ATP per glucose."
      }
    ],
    takeaway: "Photosynthesis converts solar light into glucose; Respiration breaks down glucose to release cellular ATP currency.",
    notes: "Remember that plant cells perform both photosynthesis and cellular respiration."
  }
];

export const summaryService = {
  getAllSummaries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SUMMARIES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(DEFAULT_SUMMARIES));
        return DEFAULT_SUMMARIES;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load summaries from storage:', e);
      return [];
    }
  },

  getSummaryById(id) {
    const list = this.getAllSummaries();
    return list.find((s) => s.id === id) || null;
  },

  saveSummary(summary) {
    const list = this.getAllSummaries();
    const existingIndex = list.findIndex((s) => s.id === summary.id);

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...summary };
    } else {
      list.unshift(summary);
    }

    try {
      localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(list));
      return summary;
    } catch (e) {
      console.error('Failed to save summary:', e);
      return null;
    }
  },

  deleteSummary(id) {
    let list = this.getAllSummaries();
    list = list.filter((s) => s.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to delete summary:', e);
      return false;
    }
  },

  updateStudyNotes(id, notes) {
    const list = this.getAllSummaries();
    const target = list.find((s) => s.id === id);
    if (!target) return false;

    target.notes = notes;
    try {
      localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('Failed to update study notes:', e);
      return false;
    }
  },

  generateIntelligentSummary(config) {
    const {
      title,
      subject = 'General',
      source = 'Topic Input',
      summaryType = 'Detailed Breakdown',
      length = 'Medium',
      difficulty = 'Student',
      language = 'English',
      rawContent = '',
    } = config;

    const id = 'sum_' + Date.now();
    const readingTime = length === 'Short' ? '1 min' : length === 'Detailed' ? '4 mins' : '2 mins';
    const wordCount = length === 'Short' ? 220 : length === 'Detailed' ? 490 : 350;

    let overview;
    let keyPoints = [];
    let takeaway;

    if (rawContent && rawContent.length > 30) {
      const sentences = rawContent.split(/[.!?\n]+/).map((s) => s.trim()).filter((s) => s.length > 10);
      overview = sentences.slice(0, 2).join('. ') + '.';
      const pointsCount = length === 'Short' ? 2 : length === 'Detailed' ? 4 : 3;

      for (let i = 0; i < pointsCount; i++) {
        const sentence = sentences[i + 2] || `Key foundational principle ${i + 1} regarding ${title}.`;
        const words = sentence.split(' ');
        const pointTitle = words.slice(0, 3).join(' ') || `Concept Pillar ${i + 1}`;
        keyPoints.push({
          title: pointTitle,
          desc: sentence.endsWith('.') ? sentence : sentence + '.',
        });
      }

      takeaway = sentences[sentences.length - 1] || `Mastering ${title} establishes a strong foundation in ${subject}.`;
    } else {
      overview = `${title} is a core subject in ${subject}. Understanding its foundational concepts, dynamics, and practical implementations is essential for academic mastery and real-world application.`;

      if (summaryType === 'Quick Overview') {
        keyPoints = [
          {
            title: `Primary Definition of ${title}`,
            desc: `The standard academic formulation establishing scope, variables, and baseline rules.`,
          },
          {
            title: 'Critical Relationships',
            desc: `How the elements interact dynamically under varying standard conditions.`,
          },
        ];
        takeaway = `Quick Recall: Focus on definition, central formulas, and primary applications.`;
      } else if (summaryType === 'Exam Revision Notes') {
        keyPoints = [
          {
            title: 'High-Yield Definitions & Terms',
            desc: `Core vocabulary frequently tested in multiple-choice and short-answer exam formats.`,
          },
          {
            title: 'Common Exam Pitfalls & Confusions',
            desc: `Edge cases where students typically lose points due to sign errors or mistaken assumptions.`,
          },
          {
            title: 'Standard Problem-Solving Methodology',
            desc: `Step 1: Identify parameters; Step 2: Select formula; Step 3: Compute and verify bounds.`,
          },
        ];
        takeaway = `Exam Anchor: Memorize the formula boundaries and watch for unit conversions.`;
      } else {
        // Detailed Breakdown
        keyPoints = [
          {
            title: 'Foundational Principles & Theory',
            desc: `Detailed exploration of how ${title} was established and the formal mathematical or theoretical models explaining it.`,
          },
          {
            title: 'Mechanisms & Dynamics',
            desc: `The step-by-step physical or conceptual interactions that take place in real environments.`,
          },
          {
            title: 'Practical Case Studies & Applications',
            desc: `Real-world instances demonstrating the immediate relevance of ${title} in modern scientific or academic contexts.`,
          },
        ];
        takeaway = `Core Takeaway: ${title} connects fundamental theory with structured application in ${subject}.`;
      }
    }

    const newSummary = {
      id,
      title: title || 'Untitled Summary',
      subject: subject || 'General',
      source,
      summaryType,
      length,
      difficulty,
      language,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readingTime,
      wordCount,
      overview,
      keyPoints,
      takeaway,
      notes: '',
    };

    return newSummary;
  },
};

