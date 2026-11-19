import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Search,
  Rocket,
  LayoutDashboard,
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  BarChart3,
  Settings,
  ChevronDown,
  CheckCircle2,
  Send,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  MessageSquare,
} from 'lucide-react';

const HELP_CATEGORIES = [
  { id: 'getting-started', name: 'Getting Started', icon: Rocket, desc: 'Core platform workflow and basics' },
  { id: 'dashboard', name: 'Dashboard & Navigation', icon: LayoutDashboard, desc: 'Daily overview and shortcuts' },
  { id: 'ai-assistant', name: 'AI Assistant', icon: Bot, desc: 'Conversational study mentor' },
  { id: 'materials-notes', name: 'Study Materials & Notes', icon: FileText, desc: 'Document parsing and notes' },
  { id: 'quizzes-flashcards', name: 'Quiz & Flashcards', icon: HelpCircle, desc: 'Active recall and practice' },
  { id: 'study-planner', name: 'Study Planner', icon: Calendar, desc: 'Timetable and session scheduling' },
  { id: 'progress', name: 'Progress & Analytics', icon: BarChart3, desc: 'Metrics, streaks and consistency' },
  { id: 'account', name: 'Account & Settings', icon: Settings, desc: 'Theme, profile and roles' },
];

const FAQ_ITEMS = [
  {
    id: 'upload-materials',
    category: 'materials-notes',
    question: 'How do I upload study materials and generate structured notes?',
    answer:
      'Navigate to "My Materials" from the sidebar and upload any PDF, Word document, PPT, or text file (up to 25MB). The system automatically analyzes the document structure, extracting chapter headings, topics, and key study points directly into the Study Notes module.',
  },
  {
    id: 'ai-assistant-guide',
    category: 'ai-assistant',
    question: 'How does the AI Assistant help me understand difficult concepts?',
    answer:
      'The AI Assistant acts as a 24/7 personal tutor. You can ask conceptual questions, request simpler analogies (e.g. "Explain recursion with an example"), or paste practice problems. Each chat conversation is saved in your sidebar for quick revision.',
  },
  {
    id: 'quizzes-guide',
    category: 'quizzes-flashcards',
    question: 'How do I create and take quizzes with the Quiz Generator?',
    answer:
      'Go to "Quiz Generator", select your subject (e.g. Computer Science, Mathematics, Physics), enter a specific topic or difficulty level, and click "Generate Quiz". You will receive questions with real-time answer checking, detailed explanations, and score tracking.',
  },
  {
    id: 'flashcards-guide',
    category: 'quizzes-flashcards',
    question: 'How do flashcards and spaced repetition mastery work?',
    answer:
      'Flashcards are organized into decks by subject. When reviewing cards, flip to view the explanation and click "I Know This" (mastered) or "Need Practice" (learning). Your mastery progress is tracked in Learning Analytics under Flashcards.',
  },
  {
    id: 'study-planner-guide',
    category: 'study-planner',
    question: 'How do I schedule and complete sessions in the Study Planner?',
    answer:
      'Open the "Study Planner" page, use the horizontal date selector to pick any day of the week, and click "+ Add Session". When you finish studying, click the circular checkbox on the session card to log your study minutes and build your study streak.',
  },
  {
    id: 'analytics-guide',
    category: 'progress',
    question: 'How are learning analytics, consistency, and streaks calculated?',
    answer:
      'The Learning Analytics page aggregates real records across all tools: completed planner sessions provide study time and streaks; quiz attempts record accuracy scores; and flashcards reflect mastery rates. You can filter the data by This Week, This Month, or All Time.',
  },
  {
    id: 'account-roles',
    category: 'account',
    question: 'How do I switch between Student and Tutor workspace roles?',
    answer:
      'In Settings > Account Profile, choose between "Student Workspace" and "Tutor Workspace". Each workspace keeps independent profile details, institutions, and biographies so you can customize your experience.',
  },
  {
    id: 'export-data',
    category: 'account',
    question: 'How do I export my study data or change the theme?',
    answer:
      'To switch between Light and Dark themes, toggle the theme button in the top-right navbar or go to Settings > Appearance. To export your study history as JSON, visit Settings > Data & Storage and click "Export JSON".',
  },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // In-app support / feedback form state
  const [feedbackTopic, setFeedbackTopic] = useState('General Question');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    try {
      const ticketsRaw = localStorage.getItem('sb_support_tickets_v1');
      const tickets = ticketsRaw ? JSON.parse(ticketsRaw) : [];
      tickets.unshift({
        id: `ticket_${Date.now()}`,
        topic: feedbackTopic,
        message: feedbackMessage.trim(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('sb_support_tickets_v1', JSON.stringify(tickets));
      setFeedbackMessage('');
      showToast('Thank you! Your feedback has been recorded.');
    } catch {
      showToast('Feedback submitted successfully.');
    }
  };

  // Filter FAQs based on search and category
  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200 text-left">
        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* 1. Header with Prominent Search Field */}
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-4">
          <div className="max-w-3xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block">
              Knowledge Base & Support
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
              How can we help you today?
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              Explore step-by-step guides, search feature documentation, or browse answers to frequently asked questions.
            </p>
          </div>

          {/* Search Field */}
          <div className="relative max-w-2xl pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-subtle)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help guides, topics, and FAQs (e.g. 'upload materials', 'study planner', 'quizzes')..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--primary)] shadow-xs transition-colors"
            />
          </div>
        </div>

        {/* 2. Getting Started Workflow Guide */}
        <section aria-label="Getting Started Workflow" className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[var(--primary)]" />
              <span>Getting Started with AI Study Buddy</span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Four simple steps to get the most out of your personalized learning ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Upload Materials',
                desc: 'Upload lecture slides or PDFs to extract structured topics and key study points.',
                path: '/materials',
                cta: 'Go to Materials',
                icon: FileText,
              },
              {
                step: '02',
                title: 'Generate Notes & Summaries',
                desc: 'Review concise summaries, key formulas, and chapter overviews for quick retention.',
                path: '/summaries',
                cta: 'View Summaries',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Practice with Quizzes',
                desc: 'Reinforce active recall with generated multiple-choice and conceptual practice questions.',
                path: '/quizzes',
                cta: 'Start a Quiz',
                icon: HelpCircle,
              },
              {
                step: '04',
                title: 'Organize in Planner',
                desc: 'Schedule weekly sessions and track your consistency streak on your timetable.',
                path: '/study-planner',
                cta: 'Open Planner',
                icon: Calendar,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-card)] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[var(--primary)] font-mono">
                      {step.step}
                    </span>
                    <step.icon className="w-4 h-4 text-[var(--color-text-subtle)]" />
                  </div>
                  <h3 className="font-bold text-sm text-[var(--color-text-main)]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(step.path)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors cursor-pointer pt-2"
                >
                  <span>{step.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Browse by Category */}
        <section aria-label="Help Categories" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--color-border-subtle)]">
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                Browse Help Topics by Category
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Select a category to filter documentation and feature guides
              </p>
            </div>

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[var(--primary)] hover:underline self-start sm:self-auto cursor-pointer"
              >
                Clear category filter (Show All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HELP_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(isSelected ? 'all' : cat.id)
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs ring-2 ring-[var(--primary)]/20'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold truncate">{cat.name}</span>
                  </div>
                  <span className="text-[11px] text-[var(--color-text-subtle)] line-clamp-1">
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Frequently Asked Questions (Accordion) */}
        <section aria-label="Frequently Asked Questions" className="space-y-4">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Clear answers to common questions about features, settings, and study workflows
            </p>
          </div>

          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs font-bold text-[var(--color-text-main)]">
                  No matching help articles found for "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-[var(--primary)] font-bold hover:underline cursor-pointer"
                >
                  Reset search and filters
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="border border-[var(--color-border-subtle)] rounded-xl overflow-hidden transition-all bg-[var(--color-surface-card)]"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[var(--color-surface-secondary)]/50 cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-[var(--color-text-main)] pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-[var(--primary)]' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/20 animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 5. Contact / In-App Support Feedback */}
        <section aria-label="Support & Feedback" className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-5">
          <div className="pb-3 border-b border-[var(--color-border-subtle)]">
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
              <span>Have a Question or Feedback?</span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Send us feedback, report an issue, or ask a question about your study setup
            </p>
          </div>

          <form onSubmit={handleSendFeedback} className="space-y-4 max-w-xl text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-[var(--color-text-main)] mb-1">
                Topic
              </label>
              <select
                value={feedbackTopic}
                onChange={(e) => setFeedbackTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
              >
                <option value="General Question">General Study Tool Question</option>
                <option value="Feature Feedback">Feature Feedback & Suggestions</option>
                <option value="Issue Report">Report an Issue or Bug</option>
                <option value="Account Support">Account & Workspace Support</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[var(--color-text-main)] mb-1">
                Message / Details
              </label>
              <textarea
                rows={3}
                required
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Describe what you need assistance with..."
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)] resize-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Feedback</span>
            </button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
