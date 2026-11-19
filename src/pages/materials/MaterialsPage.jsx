import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/layout/PageContainer';
import FlowSteps from './components/FlowSteps';
import DropzoneArea from './components/DropzoneArea';
import UploadCard from './components/UploadCard';
import AnalysisPipeline from './components/AnalysisPipeline';
import Button from '../../components/ui/Button';
import {
  validateUploadFile,
  formatFileSize,
  getFileExtension,
  generateDocumentStructure,
  saveLastUpload,
  loadLastUpload,
  getAllMaterials,
  saveMaterial,
  deleteMaterial,
  setActiveMaterial,
  detectSubjectFromFileName,
  ANALYSIS_STEPS,
} from '../../utils/materialUtils';
import {
  FileText,
  Eye,
  BookOpen,
  Trash2,
  FolderOpen,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

export default function MaterialsPage() {
  const navigate = useNavigate();

  const [currentFile, setCurrentFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('0 MB/s');
  const [stepStates, setStepStates] = useState({ 1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' });
  const [aiSubtitle, setAiSubtitle] = useState('Waiting for a file');
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  // Materials Library & Active Upload
  const [materials, setMaterials] = useState(() => getAllMaterials());
  const [savedUpload, setSavedUpload] = useState(() => loadLastUpload());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const handleFileSelected = (file) => {
    setErrorMessage('');
    clearAllTimers();

    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setCurrentFile(file);
    setUploadProgress(0);
    setUploadSpeed('3.8 MB/s');
    setAiSubtitle('Uploading document...');
    setIsAnalysisComplete(false);

    // Initial state: Step 1 active
    setStepStates({ 1: 'active', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' });

    // Step 1: Upload simulation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadSpeed('Complete');
        startAnalysis(file);
      } else {
        setUploadProgress(progress);
        setUploadSpeed(`${(Math.random() * 2 + 3).toFixed(1)} MB/s`);
      }
    }, 150);
  };

  const startAnalysis = (file) => {
    setAiSubtitle('Processing your document');
    setStepStates((prev) => ({ ...prev, 1: 'done' }));

    let accumulatedDelay = 0;

    ANALYSIS_STEPS.slice(1).forEach((step) => {
      const activateTimer = setTimeout(() => {
        setStepStates((prev) => ({ ...prev, [step.key]: 'active' }));
      }, accumulatedDelay);
      timersRef.current.push(activateTimer);

      accumulatedDelay += step.duration;

      const completeTimer = setTimeout(() => {
        setStepStates((prev) => ({ ...prev, [step.key]: 'done' }));

        if (step.key === 5) {
          onAnalysisFinished(file);
        }
      }, accumulatedDelay);
      timersRef.current.push(completeTimer);
    });
  };

  const onAnalysisFinished = (file) => {
    setAiSubtitle('Analysis complete — study notes generated!');
    setIsAnalysisComplete(true);

    const ext = getFileExtension(file.name);
    const generated = generateDocumentStructure(file.name, ext);
    const detectedSubject = detectSubjectFromFileName(file.name);

    const uploadRecord = {
      id: 'mat_' + Date.now(),
      fileName: file.name,
      subject: detectedSubject,
      fileSize: file.size,
      fileSizeLabel: formatFileSize(file.size),
      fileExt: ext,
      uploadedAt: new Date().toISOString(),
      topics: generated.topics,
      structure: generated.structure,
    };

    saveMaterial(uploadRecord);
    setSavedUpload(uploadRecord);
    setMaterials(getAllMaterials());
  };

  const handleCancel = () => {
    clearAllTimers();
    setCurrentFile(null);
    setUploadProgress(0);
    setErrorMessage('');
    setIsAnalysisComplete(false);
    setAiSubtitle('Waiting for a file');
    setStepStates({ 1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' });
  };

  const handleSelectMaterialForNotes = (material) => {
    setActiveMaterial(material.id);
    navigate('/notes');
  };

  const handleSelectMaterialForStructure = (material) => {
    setActiveMaterial(material.id);
    navigate('/structure');
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm('Delete this course material and its generated notes?')) {
      const updated = deleteMaterial(id);
      setMaterials(updated);
      setSavedUpload(loadLastUpload());
    }
  };

  // Derive unique subjects for filters
  const subjects = useMemo(() => {
    const set = new Set();
    materials.forEach((m) => {
      if (m.subject) set.add(m.subject);
    });
    return ['All', ...Array.from(set)];
  }, [materials]);

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSubj = selectedSubject === 'All' || m.subject === selectedSubject;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        m.fileName.toLowerCase().includes(q) ||
        (m.subject || '').toLowerCase().includes(q) ||
        (m.topics || []).some((t) => t.toLowerCase().includes(q));
      return matchesSubj && matchesQuery;
    });
  }, [materials, selectedSubject, searchQuery]);

  // Overall library stats
  const totalNotesPoints = useMemo(() => {
    return materials.reduce((acc, m) => {
      const pts = (m.structure || []).reduce((pAcc, sec) => pAcc + (sec.points?.length || 0), 0);
      return acc + pts;
    }, 0);
  }, [materials]);

  const getSubjectColorClass = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('phys')) return 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20';
    if (s.includes('bio')) return 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] border-[var(--color-status-success)]/20';
    if (s.includes('psych')) return 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/30';
    if (s.includes('hist')) return 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)] border-[var(--color-amber)]/20';
    if (s.includes('comp') || s.includes('cs') || s.includes('code')) return 'bg-[var(--color-teal-bg)] text-[var(--color-teal)] border-[var(--color-teal)]/30';
    return 'bg-[var(--color-navy-light)] text-[var(--color-navy)] border-[var(--color-navy)]/20';
  };

  return (
    <DashboardLayout
      pageTitle="My Materials"
      pageSubtitle="Upload and organize course documents with connected study notes."
    >
      <PageContainer maxWidth="7xl">
        {/* Flow Progress (Step 1 Active) */}
        <FlowSteps currentStep={1} />

        {/* Bento Grid: Left Column Dropzone/Upload, Right Column AI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Left Column (Spans 7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {!currentFile ? (
              <DropzoneArea
                onFileSelected={handleFileSelected}
                errorMessage={errorMessage}
              />
            ) : (
              <UploadCard
                file={currentFile}
                uploadProgress={uploadProgress}
                uploadSpeed={uploadSpeed}
                onCancel={handleCancel}
              />
            )}
          </div>

          {/* Right Column (Spans 5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col">
            <AnalysisPipeline
              stepStates={stepStates}
              aiSubtitle={aiSubtitle}
              isComplete={isAnalysisComplete}
              onNavigateNext={() => navigate('/notes')}
            />
          </div>
        </div>

        {/* Course Materials & Linked Study Notes Library */}
        <div className="space-y-6 pt-4 border-t border-[var(--color-border)]">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-[var(--primary)]" />
                <span>My Course Materials & Linked Notes</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                Every uploaded document automatically produces structured study notes and revision guides.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] font-semibold shadow-2xs">
                {materials.length} Documents
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs">
                {materials.length} Notes Ready
              </span>
              <span className="px-3 py-1.5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary-light)] text-[var(--primary)] font-semibold shadow-2xs">
                {totalNotesPoints} Study Points
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              <span className="text-xs text-[var(--color-text-subtle)] font-medium mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" />
                Filter:
              </span>
              {subjects.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    selectedSubject === subj
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-subtle)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials or topics..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Grid of Course Materials */}
          {filteredMaterials.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-card)] text-center space-y-2">
              <FileText className="w-8 h-8 mx-auto text-[var(--color-text-subtle)]" />
              <h4 className="text-sm font-bold text-[var(--color-text-main)]">
                No course materials found
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                {searchQuery || selectedSubject !== 'All'
                  ? 'Try clearing your search query or subject filter.'
                  : 'Upload your first study document above to generate structured study notes.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMaterials.map((mat) => {
                const isActive = savedUpload?.id === mat.id || savedUpload?.fileName === mat.fileName;
                const sectionsCount = mat.structure?.length || 0;
                const pointsCount = (mat.structure || []).reduce((acc, sec) => acc + (sec.points?.length || 0), 0);

                return (
                  <div
                    key={mat.id}
                    className={`flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-[var(--color-surface-card)] ${
                      isActive
                        ? 'border-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20'
                        : 'border-[var(--color-border)] hover:border-[var(--primary)]/50 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getSubjectColorClass(
                            mat.subject
                          )}`}
                        >
                          {mat.subject || 'General'}
                        </span>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          )}
                          <span className="text-[11px] text-[var(--color-text-subtle)] uppercase font-semibold">
                            {mat.fileExt || 'PDF'}
                          </span>
                        </div>
                      </div>

                      {/* File Name */}
                      <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] line-clamp-1 mb-1" title={mat.fileName}>
                        {mat.fileName}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-[var(--color-text-subtle)] mb-4">
                        {mat.fileSizeLabel || '2.0 MB'} • Uploaded {new Date(mat.uploadedAt || Date.now()).toLocaleDateString()}
                      </p>

                      {/* Linked Study Notes Callout Box */}
                      <div className="p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] mb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                            <span>Linked Study Notes</span>
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ {sectionsCount} Sections
                          </span>
                        </div>

                        {/* First 2 Section Snippets */}
                        <div className="space-y-1 text-[11px] text-[var(--color-text-muted)]">
                          {(mat.structure || []).slice(0, 2).map((sec, sIdx) => (
                            <div key={sIdx} className="truncate flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                              <span className="truncate">{sec.heading}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[11px] text-[var(--color-text-subtle)] pt-1.5 border-t border-[var(--color-border-subtle)]">
                          Includes {pointsCount} high-yield study points
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectMaterialForNotes(mat)}
                          className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Open Study Notes</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectMaterialForStructure(mat)}
                          title="View Document Structure & Outline"
                          className="p-2 shrink-0 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate('/quiz-generator')}
                          title="Practice Quiz on this Material"
                          className="p-2 shrink-0 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(mat.id)}
                          title="Delete Material"
                          className="p-2 shrink-0 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}

