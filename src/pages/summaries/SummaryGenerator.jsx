import React, { useState, useRef } from 'react';
import {
  Sparkles,
  FileText,
  UploadCloud,
  FolderOpen,
  AlignLeft,
  CheckCircle2,
  Lightbulb,
  X,
} from 'lucide-react';
import { loadLastUpload, getAllMaterials } from '../../utils/materialUtils';

const SOURCE_TABS = [
  { id: 'topic', label: 'Topic Input', icon: AlignLeft },
  { id: 'paste', label: 'Paste Text', icon: FileText },
  { id: 'file', label: 'Upload File', icon: UploadCloud },
  { id: 'materials', label: 'My Materials', icon: FolderOpen },
];

const SUMMARY_TYPES = [
  'Detailed Breakdown',
  'Quick Overview',
  'Exam Revision Notes',
];

const LENGTH_OPTIONS = ['Short', 'Medium', 'Detailed'];
const DIFFICULTY_OPTIONS = ['High School', 'Student', 'Advanced'];

const TOPIC_SUGGESTIONS = [
  { topic: "Newton's Laws of Motion", subject: 'Physics' },
  { topic: 'Cellular Respiration & ATP', subject: 'Biology' },
  { topic: 'Cognitive Biases & Decision Making', subject: 'Psychology' },
  { topic: 'World War II Turning Points', subject: 'History' },
  { topic: 'Big-O Notation & Complexity', subject: 'Computer Science' },
];

export default function SummaryGenerator({ onGenerate, isGenerating }) {
  const [activeTab, setActiveTab] = useState('topic');
  const [topic, setTopic] = useState("Newton's Laws of Motion");
  const [subject, setSubject] = useState('Physics');

  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');

  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef(null);

  // Lazy initialize material context from LocalStorage
  const [materials] = useState(() => {
    const list = getAllMaterials();
    return list.length > 0 ? list : (loadLastUpload() ? [loadLastUpload()] : []);
  });
  const [selectedMaterialId, setSelectedMaterialId] = useState(() => {
    const list = getAllMaterials();
    return list.length > 0 ? list[0].id : (loadLastUpload()?.id || '');
  });

  const [summaryType, setSummaryType] = useState('Detailed Breakdown');
  const [length, setLength] = useState('Medium');
  const [difficulty, setDifficulty] = useState('Student');
  // Always default to English
  const language = 'English';

  const handleSelectSuggestion = (sug) => {
    setTopic(sug.topic);
    setSubject(sug.subject);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const cleanedName = file.name.replace(/\.[^/.]+$/, '');
    setTopic(cleanedName);

    // If it's a text file, read content
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPasteContent(event.target.result || '');
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateClick = (e) => {
    e.preventDefault();

    let finalTitle = topic.trim();
    let finalSubject = subject.trim();
    let rawContent = '';
    let sourceLabel = 'Topic Input';

    if (activeTab === 'paste') {
      finalTitle = pasteTitle.trim() || 'Pasted Study Notes';
      rawContent = pasteContent;
      sourceLabel = 'Pasted Text';
    } else if (activeTab === 'materials') {
      const mat = materials.find((m) => m.id === selectedMaterialId);
      finalTitle = mat ? (mat.fileName || mat.name || '').replace(/\.[^/.]+$/, '') : 'Course Material';
      finalSubject = mat?.subject || 'My Materials';
      rawContent = (mat?.structure || []).map((s) => s.heading + '\n' + (s.points || []).join('\n')).join('\n\n') || mat?.extractedText || mat?.fileName || '';
      sourceLabel = 'Course Material';
    } else if (activeTab === 'file') {
      finalTitle = uploadedFileName ? uploadedFileName.replace(/\.[^/.]+$/, '') : (topic.trim() || 'Uploaded Lecture Document');
      rawContent = pasteContent;
      sourceLabel = 'Uploaded File';
    }

    if (!finalTitle) {
      finalTitle = 'Untitled Summary Topic';
    }

    onGenerate({
      title: finalTitle,
      subject: finalSubject || 'General',
      source: sourceLabel,
      summaryType,
      length,
      difficulty,
      language,
      rawContent,
    });
  };

  const wordCount = pasteContent.trim() ? pasteContent.trim().split(/\s+/).length : 0;

  return (
    <div id="summary-generator-section" className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            <span>Generate New Summary</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            Select your input source, adjust summary depth, and synthesize structured study notes.
          </p>
        </div>
      </div>

      {/* Source Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] overflow-x-auto scrollbar-none">
        {SOURCE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Source Input Panels */}
      <div className="space-y-4">
        {activeTab === 'topic' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                  Topic or Subject Concept
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Cellular Mitosis, Cold War Causes, Quantum Superposition"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                  Subject / Category
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Physics, Biology"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>

            {/* Quick Topic Suggestions */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Popular Study Topics (1-Click Fill):</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {TOPIC_SUGGESTIONS.map((sug, idx) => {
                  const isSelected = topic === sug.topic;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(sug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-[var(--primary)]/40'
                      }`}
                    >
                      {sug.topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                  Document / Note Title
                </label>
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="e.g., Chapter 4: Photosynthesis & Energy Conversion"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Biology"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[var(--color-text-main)]">
                  Paste Raw Text or Lecture Excerpts
                </label>
                <span className="text-[11px] text-[var(--color-text-subtle)]">
                  {wordCount} words
                </span>
              </div>
              <textarea
                rows={4}
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="Paste your raw lecture notes, article excerpts, or study material here..."
                className="w-full p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 resize-y"
              />
            </div>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-3 animate-in fade-in">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--primary)] bg-[var(--color-surface-secondary)] text-center space-y-2 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-8 h-8 mx-auto text-[var(--primary)]" />
              {uploadedFileName ? (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>File Selected: {uploadedFileName}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Click to replace with another file
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-sm font-bold text-[var(--color-text-main)]">
                    Click to select lecture notes, PDF, or Word document
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Supports TXT, MD, PDF, DOCX up to 25MB
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                  Summary Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Summary Title"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., General Studies"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-3 animate-in fade-in">
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
              Select Saved Material from Library
            </label>
            {materials.length === 0 ? (
              <div className="p-5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center space-y-2">
                <FolderOpen className="w-6 h-6 mx-auto text-[var(--color-text-subtle)]" />
                <p>No uploaded materials in library yet.</p>
                <p className="text-[11px] text-[var(--color-text-subtle)]">
                  Use the Topic Input or Paste Text tabs above to generate summaries immediately.
                </p>
              </div>
            ) : (
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-sm text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fileName || m.name} ({m.subject || 'General'})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Options Bento Row - Clean 3-Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
        {/* Summary Depth */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
            Summary Type
          </label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
          >
            {SUMMARY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
            Target Length
          </label>
          <div className="flex rounded-xl p-0.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setLength(opt)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  length === opt
                    ? 'bg-[var(--color-surface-card)] text-[var(--primary)] font-bold shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5">
            Academic Level
          </label>
          <div className="flex rounded-xl p-0.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDifficulty(opt)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  difficulty === opt
                    ? 'bg-[var(--color-surface-card)] text-[var(--primary)] font-bold shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                }`}
              >
                {opt.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Action Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-[var(--color-text-muted)]">
          Synthesizes core concepts, memory anchors, and study notes in seconds.
        </span>
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing...' : 'Generate Summary'}</span>
        </button>
      </div>
    </div>
  );
}
