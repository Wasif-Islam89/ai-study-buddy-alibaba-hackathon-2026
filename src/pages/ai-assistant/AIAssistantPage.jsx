import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatSidebar from './ChatSidebar';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { aiAssistantService } from '../../services/aiAssistantService';
import {
  Bot,
  Menu,
  Sparkles,
  Plus,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Lightbulb,
  FileText,
  Paperclip,
} from 'lucide-react';

const SUGGESTED_CARDS = [
  {
    id: 'explain',
    title: 'Explain a Difficult Topic',
    subtitle: 'Break down complex concepts into simple analogies and real-world examples.',
    icon: Lightbulb,
    prompt: 'Can you explain recursion and base cases in simple terms with an analogy?',
    action: 'explain',
  },
  {
    id: 'summarize',
    title: 'Summarize My Study Material',
    subtitle: 'Get concise structured summaries with key takeaways and definitions.',
    icon: BookOpen,
    prompt: 'Please provide a clear summary with key takeaways from my latest study materials.',
    action: 'summarize',
  },
  {
    id: 'quiz',
    title: 'Generate Practice Questions',
    subtitle: 'Test your understanding with instant concept-check quizzes and answers.',
    icon: HelpCircle,
    prompt: 'Quiz me on cellular respiration and ATP production with a multiple-choice question.',
    action: 'quiz',
  },
  {
    id: 'exam',
    title: 'Help Me Prepare for an Exam',
    subtitle: 'Review critical formulas, exam traps, and high-yield study checklists.',
    icon: GraduationCap,
    prompt: 'Give me a high-yield exam preparation checklist and formulas for calculus derivatives.',
    action: 'revision',
  },
];

export default function AIAssistantPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeContext, setActiveContext] = useState(null);

  const messagesEndRef = useRef(null);

  // Load chats on mount
  useEffect(() => {
    const loadedChats = aiAssistantService.getAllChats();
    setChats(loadedChats);

    const activeId = aiAssistantService.getActiveChatId();
    if (activeId) {
      setActiveChatId(activeId);
      const currentChat = loadedChats.find((c) => c.id === activeId);
      if (currentChat?.context) {
        setActiveContext(currentChat.context);
      }
    }
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Auto-scroll to bottom of messages
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeChatId]);

  useEffect(() => {
    if (activeChat?.messages?.length || isGenerating) {
      scrollToBottom(true);
    }
  }, [activeChat?.messages?.length, isGenerating]);

  // Handle Select Chat
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    aiAssistantService.setActiveChatId(chatId);
    const selected = chats.find((c) => c.id === chatId);
    setActiveContext(selected?.context || null);
  };

  // Handle New Chat
  const handleNewChat = () => {
    const newChat = aiAssistantService.createChat('New Discussion');
    setChats(aiAssistantService.getAllChats());
    setActiveChatId(newChat.id);
    setActiveContext(null);
  };

  // Handle Delete Chat
  const handleDeleteChat = (chatId) => {
    aiAssistantService.deleteChat(chatId);
    const updatedChats = aiAssistantService.getAllChats();
    setChats(updatedChats);
    setActiveChatId(aiAssistantService.getActiveChatId());
  };

  // Handle Rename Chat
  const handleRenameChat = (chatId, newTitle) => {
    aiAssistantService.renameChat(chatId, newTitle);
    setChats([...aiAssistantService.getAllChats()]);
  };

  // Send Message
  const handleSendMessage = async ({ text, action }) => {
    let currentId = activeChatId;
    let currentChat = activeChat;

    // Create a new chat if none exists
    if (!currentId || !currentChat) {
      const created = aiAssistantService.createChat('New Discussion', null, activeContext);
      currentId = created.id;
      setActiveChatId(currentId);
      currentChat = created;
    }

    // 1. Add User message
    const userMsg = {
      role: 'user',
      text,
      action: action || null,
      timestamp: new Date().toISOString(),
    };
    aiAssistantService.addMessage(currentId, userMsg);
    setChats([...aiAssistantService.getAllChats()]);

    // 2. Set generating indicator
    setIsGenerating(true);

    try {
      // 3. Request simulated AI reply
      const reply = await aiAssistantService.generateReply({
        prompt: text,
        action,
        context: activeContext,
      });

      // 4. Append AI reply
      const aiMsg = {
        role: 'ai',
        content: reply.content,
        contextName: activeContext ? activeContext.name : null,
        timestamp: new Date().toISOString(),
      };
      aiAssistantService.addMessage(currentId, aiMsg);
      setChats([...aiAssistantService.getAllChats()]);
    } catch (err) {
      console.error('Error generating reply:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Feedback on message
  const handleFeedback = (messageId, feedbackType) => {
    if (!activeChatId) return;
    aiAssistantService.updateMessageFeedback(activeChatId, messageId, feedbackType);
    setChats([...aiAssistantService.getAllChats()]);
  };

  // Regenerate Response
  const handleRegenerate = async (messageId) => {
    if (!activeChat || isGenerating) return;

    // Find the prior user message
    const msgIndex = activeChat.messages.findIndex((m) => m.id === messageId);
    let promptText = 'Explain this topic in detail';
    let action = null;

    if (msgIndex > 0) {
      const prevMsg = activeChat.messages[msgIndex - 1];
      if (prevMsg && prevMsg.role === 'user') {
        promptText = prevMsg.text;
        action = prevMsg.action;
      }
    }

    setIsGenerating(true);
    try {
      const reply = await aiAssistantService.generateReply({
        prompt: promptText,
        action,
        context: activeContext,
      });

      // Update message in place
      const updatedMessages = activeChat.messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              content: reply.content,
              feedback: null,
              timestamp: new Date().toISOString(),
            }
          : m
      );

      activeChat.messages = updatedMessages;
      localStorage.setItem('sb_ai_chats_v1', JSON.stringify({ chats }));
      setChats([...chats]);
    } catch (e) {
      console.error('Failed to regenerate:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Attach context modal / prompt
  const handleAttachContext = () => {
    const materialName = window.prompt(
      'Enter material or document name to attach as context:',
      'Physics_Lecture_Notes_Ch4.pdf'
    );
    if (materialName && materialName.trim()) {
      const ctx = { name: materialName.trim() };
      setActiveContext(ctx);
      if (activeChat) {
        activeChat.context = ctx;
        localStorage.setItem('sb_ai_chats_v1', JSON.stringify({ chats }));
        setChats([...chats]);
      }
    }
  };

  const handleClearContext = () => {
    setActiveContext(null);
    if (activeChat) {
      activeChat.context = null;
      localStorage.setItem('sb_ai_chats_v1', JSON.stringify({ chats }));
      setChats([...chats]);
    }
  };

  const handleCardClick = (card) => {
    handleSendMessage({
      text: card.prompt,
      action: card.action,
    });
  };

  return (
    <DashboardLayout
      pageTitle="AI Study Assistant"
      pageSubtitle="Ask questions, clarify concepts, and get instant guidance"
      showFooter={false}
    >
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Main Content Area with 2-Column Chat Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation Sidebar */}
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            isOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Chat Workspace */}
          <div className="flex-1 flex flex-col bg-[var(--color-bg)] h-full overflow-hidden min-w-0">
            {/* Top Workspace Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-card)] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                  title="Open conversations"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--color-surface-card)]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] truncate">
                      {activeChat?.title || 'AI Study Assistant'}
                    </h1>
                    {activeContext && (
                      <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-medium truncate max-w-[180px]">
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate">{activeContext.name}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] truncate hidden sm:block">
                    Your personal AI tutor for 24/7 concept clarity, quizzes & exam revision
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAttachContext}
                  title="Attach reference document"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] transition-colors cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{activeContext ? 'Change Material' : 'Attach Context'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNewChat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              <div className="max-w-4xl mx-auto w-full">
                {!activeChat || activeChat.messages?.length === 0 ? (
                  /* Welcome / Empty State */
                  <div className="py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
                    <div className="text-center max-w-xl mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]/20 flex items-center justify-center mx-auto shadow-xs">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-main)]">
                        Your AI Study Assistant
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                        Ask questions, understand difficult concepts, and make your study sessions more productive.
                      </p>
                    </div>

                    {/* Suggested Prompt Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {SUGGESTED_CARDS.map((card) => {
                        const Icon = card.icon;
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            className="group p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)] hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <h3 className="text-sm font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)] transition-colors">
                                  {card.title}
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                                  {card.subtitle}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-[var(--primary)] font-semibold">
                              <span>Try prompt</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Messages Stream */
                  <div className="space-y-4">
                    {activeChat.messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        onFeedback={handleFeedback}
                        onRegenerate={handleRegenerate}
                      />
                    ))}
                    {isGenerating && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Fixed/Sticky Bottom Composer */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-card)] shrink-0">
              <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-3 sm:py-4">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isGenerating={isGenerating}
                  activeContext={activeContext}
                  onClearContext={handleClearContext}
                  onAttachContext={handleAttachContext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
