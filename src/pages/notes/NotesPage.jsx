import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/layout/PageContainer';
import FlowSteps from '../materials/components/FlowSteps';
import NotesBlock from './components/NotesBlock';
import EmptyState from '../../components/common/EmptyState';
import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import {
  loadLastUpload,
  getAllMaterials,
  setActiveMaterial,
  updateMaterialNotes,
} from '../../utils/materialUtils';
import {
  BookOpen,
  FolderX,
  ArrowLeft,
  Check,
  Edit3,
  UploadCloud,
  FileText,
  FolderOpen,
  HelpCircle,
  Layers,
  Bot,
  Plus,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';

export default function NotesPage() {
  const navigate = useNavigate();

  // Load materials library and active upload
  const [materials, setMaterials] = useState(() => getAllMaterials());
  const [uploadData, setUploadData] = useState(() => loadLastUpload());

  const [notesSections, setNotesSections] = useState(() => {
    const data = loadLastUpload();
    return data ? (data.structure || []) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  // When active upload changes, update notesSections
  useEffect(() => {
    if (uploadData && uploadData.structure) {
      setNotesSections(uploadData.structure);
    }
  }, [uploadData?.id, uploadData?.fileName]);

  const handleSwitchMaterial = (e) => {
    const materialId = e.target.value;
    const selected = setActiveMaterial(materialId);
    if (selected) {
      setUploadData(selected);
      setNotesSections(selected.structure || []);
      setSearchQuery('');
      setIsEditing(false);
      setSaveStatus('idle');
    }
  };

  const handleHeadingChange = (idx, newHeading) => {
    setNotesSections((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], heading: newHeading };
      return updated;
    });
  };

  const handlePointChange = (sectionIdx, pointIdx, newPoint) => {
    setNotesSections((prev) => {
      const updated = [...prev];
      const points = [...updated[sectionIdx].points];
      points[pointIdx] = newPoint;
      updated[sectionIdx] = { ...updated[sectionIdx], points };
      return updated;
    });
  };

  const handleAddPoint = (sectionIdx) => {
    setNotesSections((prev) => {
      const updated = [...prev];
      const points = [...(updated[sectionIdx].points || []), 'New study point'];
      updated[sectionIdx] = { ...updated[sectionIdx], points };
      return updated;
    });
  };

  const handleDeletePoint = (sectionIdx, pointIdx) => {
    setNotesSections((prev) => {
      const updated = [...prev];
      const points = updated[sectionIdx].points.filter((_, i) => i !== pointIdx);
      updated[sectionIdx] = { ...updated[sectionIdx], points };
      return updated;
    });
  };

  const handleAddSection = () => {
    const newSecNum = notesSections.length + 1;
    const newSection = {
      heading: `${newSecNum}. New Topic Section`,
      points: ['Core concept explanation', 'Key application or formula'],
    };
    setNotesSections((prev) => [...prev, newSection]);
    setIsEditing(true);
  };

  const handleFinishAndSave = () => {
    if (saveStatus !== 'idle') return;
    setSaveStatus('saving');

    if (uploadData && uploadData.id) {
      updateMaterialNotes(uploadData.id, notesSections);
    }

    setTimeout(() => {
      setSaveStatus('saved');
      setMaterials(getAllMaterials());
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 500);
  };

  // Filter sections by search query
  const filteredSections = notesSections.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchHeading = sec.heading.toLowerCase().includes(q);
    const matchPoints = (sec.points || []).some((p) => p.toLowerCase().includes(q));
    return matchHeading || matchPoints;
  });

  return (
    <DashboardLayout
      pageTitle="Study Notes"
      pageSubtitle="Structured study notes generated from your uploaded course materials."
    >
      <PageContainer maxWidth="5xl">
        {/* Flow Progress (Step 3 Active) */}
        <FlowSteps currentStep={3} />

        {!uploadData ? (
          <EmptyState
            icon={FolderX}
            title="No notes to show yet"
            description="Upload and analyze a file first — your structured study notes will be generated from it."
            action={
              <Button
                variant="primary"
                onClick={() => navigate('/materials')}
                leftIcon={UploadCloud}
              >
                Go to Upload Material
              </Button>
            }
          />
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Source Material Connection Banner */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                {/* Source Material Badge & Breadcrumb */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--color-text-subtle)] flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Source Material:</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--primary-light)] text-[var(--primary)]">
                    {uploadData.subject || 'General Studies'}
                  </span>

                  <span className="text-xs font-bold text-[var(--color-text-main)] truncate max-w-xs">
                    {uploadData.fileName}
                  </span>

                  <span className="text-xs text-[var(--color-text-subtle)] hidden md:inline">
                    ({uploadData.fileSizeLabel || '2.0 MB'})
                  </span>
                </div>

                {/* Back to materials link */}
                <button
                  type="button"
                  onClick={() => navigate('/materials')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Course Materials</span>
                </button>
              </div>

              {/* Material Switcher Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="material-select" className="text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">
                    Switch Material Notes:
                  </label>
                  <select
                    id="material-select"
                    value={uploadData.id || ''}
                    onChange={handleSwitchMaterial}
                    className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs font-bold text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)] cursor-pointer max-w-xs truncate"
                  >
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fileName} ({m.subject || 'General'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span>{notesSections.length} Sections</span>
                  <span>•</span>
                  <span>
                    {notesSections.reduce((acc, s) => acc + (s.points?.length || 0), 0)} Study Points
                  </span>
                </div>
              </div>
            </div>

            {/* Main Notes Editor / Reader Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] shrink-0 shadow-xs">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--color-text-main)]">
                      {uploadData.fileName}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
                      {(uploadData.topics || []).slice(0, 3).join(' • ') || 'Generated from your document'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    leftIcon={Edit3}
                  >
                    {isEditing ? 'Done Editing' : 'Edit Notes'}
                  </Button>

                  {isEditing && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAddSection}
                      leftIcon={Plus}
                    >
                      Add Section
                    </Button>
                  )}

                  <Button
                    variant="primary"
                    size="sm"
                    disabled={saveStatus !== 'idle'}
                    onClick={handleFinishAndSave}
                    leftIcon={saveStatus === 'saved' ? Check : undefined}
                  >
                    {saveStatus === 'saving'
                      ? 'Saving...'
                      : saveStatus === 'saved'
                      ? 'Saved!'
                      : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Search filter input */}
              <div className="max-w-md">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search in study notes..."
                  shortcut=""
                  size="sm"
                />
              </div>

              {/* Notes Sections Blocks */}
              <div className="pt-4 divide-y divide-[var(--color-border-subtle)]">
                {filteredSections.length > 0 ? (
                  filteredSections.map((sec, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0">
                      <NotesBlock
                        section={sec}
                        index={idx}
                        isEditing={isEditing}
                        onHeadingChange={handleHeadingChange}
                        onPointChange={handlePointChange}
                        onAddPoint={handleAddPoint}
                        onDeletePoint={handleDeletePoint}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)] py-6 text-center">
                    No notes match your search term.
                  </p>
                )}
              </div>
            </div>

            {/* Study Loop: Connected Tools from this Material's Notes */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] space-y-3">
              <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                Study Actions from this Document
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/quiz-generator')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--color-teal)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-teal-bg)] text-[var(--color-teal)] flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-teal)] truncate">
                      Practice Quiz
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      Test concepts
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/flashcards')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--color-teal)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-navy-light)] text-[var(--color-navy)] flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-teal)] truncate">
                      Flashcards
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      Active recall
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/assistant')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)] truncate">
                      Ask AI Tutor
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      Clarify details
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/structure')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)] hover:bg-[var(--color-surface-card)] text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-[var(--primary)] truncate">
                      View Outline
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                      Document tree
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/materials')}
                leftIcon={ArrowLeft}
                className="w-full sm:w-auto"
              >
                Back to My Materials
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
