import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageContainer from '../../components/layout/PageContainer';
import FlowSteps from '../materials/components/FlowSteps';
import StructureSummaryCard from './components/StructureSummaryCard';
import OutlineList from './components/OutlineList';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/ui/Button';
import {
  loadLastUpload,
  getAllMaterials,
  setActiveMaterial,
} from '../../utils/materialUtils';
import { FolderX, ArrowLeft, ArrowRight, UploadCloud, FolderOpen, BookOpen } from 'lucide-react';

export default function StructurePage() {
  const navigate = useNavigate();
  const [materials] = useState(() => getAllMaterials());
  const [uploadData, setUploadData] = useState(() => loadLastUpload());

  const handleSwitchMaterial = (e) => {
    const selected = setActiveMaterial(e.target.value);
    if (selected) {
      setUploadData(selected);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Document Structure"
      pageSubtitle="Key topics and outline extracted by the AI from your file."
    >
      <PageContainer maxWidth="5xl">
        {/* Flow Progress (Step 2 Active) */}
        <FlowSteps currentStep={2} />

        {!uploadData ? (
          <EmptyState
            icon={FolderX}
            title="No document analyzed yet"
            description="Upload a study document first — the AI will extract its topics, key concepts, and structure here."
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
            {/* Material Switcher Strip */}
            <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <label htmlFor="structure-mat-select" className="text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">
                  Document:
                </label>
                <select
                  id="structure-mat-select"
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

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/notes')}
                leftIcon={BookOpen}
              >
                Go to Study Notes
              </Button>
            </div>

            {/* File Summary Card with Topic Tags */}
            <StructureSummaryCard uploadData={uploadData} />

            {/* Detailed Outline Sections */}
            <OutlineList structure={uploadData.structure} />

            {/* Actions Navigation Row */}
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
                onClick={() => navigate('/notes')}
                rightIcon={ArrowRight}
                className="w-full sm:w-auto"
              >
                View Study Notes
              </Button>
            </div>
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
