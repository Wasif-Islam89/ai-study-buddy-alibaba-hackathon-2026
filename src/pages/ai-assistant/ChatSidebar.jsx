import React, { useState, useMemo } from 'react';
import { Plus, MessageSquare, Trash2, Search, X, Edit2, Check, Clock } from 'lucide-react';

export default function ChatSidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  isOpen = false,
  onCloseMobile,
}) {
  const [search, setSearch] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Filter chats by search
  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    return chats.filter((c) =>
      (c.title || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [chats, search]);

  // Group chats by date
  const groupedChats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups = {
      today: [],
      lastWeek: [],
      older: [],
    };

    filteredChats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt || chat.createdAt || Date.now());
      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title || 'Untitled Chat');
  };

  const handleSaveRename = (e, chatId) => {
    e.stopPropagation();
    if (editTitle.trim() && onRenameChat) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const renderChatGroup = (title, chatList) => {
    if (!chatList || chatList.length === 0) return null;

    return (
      <div className="space-y-1 mb-4">
        <div className="px-3 py-1 text-[11px] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
          {title}
        </div>
        {chatList.map((chat) => {
          const isActive = chat.id === activeChatId;
          const isEditing = editingChatId === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => {
                if (!isEditing) {
                  onSelectChat(chat.id);
                  onCloseMobile?.();
                }
              }}
              className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[var(--color-navy)] text-white font-semibold shadow-xs border-l-4 border-[var(--color-teal)] pl-2'
                  : 'border-transparent text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <MessageSquare
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[var(--color-teal)]' : 'text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-main)]'
                  }`}
                />

                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(e, chat.id);
                        if (e.key === 'Escape') handleCancelRename(e);
                      }}
                      className="w-full px-2 py-0.5 rounded text-xs bg-[var(--color-surface-card)] border border-[var(--primary)] text-[var(--color-text-main)] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleSaveRename(e, chat.id)}
                      className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelRename}
                      className="p-1 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="truncate">{chat.title || 'Untitled Discussion'}</span>
                )}
              </div>

              {/* Action buttons on hover */}
              {!isEditing && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 shrink-0">
                  {onRenameChat && (
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, chat)}
                      title="Rename conversation"
                      className="p-1 rounded-md text-[var(--color-text-subtle)] hover:text-[var(--primary)] hover:bg-[var(--color-surface-card)] transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete conversation "${chat.title || 'Untitled'}"?`)) {
                        onDeleteChat(chat.id);
                      }
                    }}
                    title="Delete conversation"
                    className="p-1 rounded-md text-[var(--color-text-subtle)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const content = (
    <div className="flex flex-col h-full bg-[var(--color-surface-card)] border-r border-[var(--color-border)] select-none">
      {/* Top Header / New Chat */}
      <div className="p-3.5 border-b border-[var(--color-border-subtle)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[var(--color-text-main)]">Conversations</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] font-medium">
              {chats.length}
            </span>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            onNewChat();
            onCloseMobile?.();
          }}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-text-subtle)]" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Thread List with Date Grouping */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--color-text-muted)] space-y-2">
            <Clock className="w-6 h-6 mx-auto text-[var(--color-text-subtle)]" />
            <p>No conversations found</p>
          </div>
        ) : (
          <>
            {renderChatGroup('Today', groupedChats.today)}
            {renderChatGroup('Previous 7 Days', groupedChats.lastWeek)}
            {renderChatGroup('Older', groupedChats.older)}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-72 h-full shrink-0">
        {content}
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-surface-card)] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
}
