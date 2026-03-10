import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

import { NavRail } from './NavRail';
import { PatientList } from './PatientList';
import { PatientHeader } from './PatientHeader';
import { ChartWorkspace } from './ChartWorkspace';
import { RecordDetailDrawer } from './RecordDetailDrawer';

import { 
  mockPatient, 
  mockEncounter, 
  mockVitals, 
  mockTimeline, 
  mockImaging, 
  mockReferrals, 
  mockBilling, 
  mockPatientList,
  mockAISummary 
} from '@/data/mockData';
import type { TimelineRecord } from '@/types/emr';

export function EMRLayout() {
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [patientListVisible, setPatientListVisible] = useState(true);
  const [fullWidthMode, setFullWidthMode] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(mockPatient.id);
  const [activeNavItem, setActiveNavItem] = useState('patients');
  const [selectedRecord, setSelectedRecord] = useState<TimelineRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobilePatientListOpen, setMobilePatientListOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleRecordClick = (record: TimelineRecord) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleAddRecord = (type: string) => {
    console.log('Add record:', type);
  };

  const toggleFullWidth = () => {
    if (!fullWidthMode) {
      setPatientListVisible(false);
    }
    setFullWidthMode(!fullWidthMode);
  };

  const chartContent = (
    <div className="h-full flex flex-col overflow-hidden">
      <PatientHeader
        patient={mockPatient}
        encounter={mockEncounter}
        isFullWidth={fullWidthMode}
        onToggleFullWidth={toggleFullWidth}
        onAddRecord={handleAddRecord}
        onOpenPatientList={() => setMobilePatientListOpen(true)}
      />
      <ChartWorkspace
        patient={mockPatient}
        encounter={mockEncounter}
        vitals={mockVitals}
        timeline={mockTimeline}
        imaging={mockImaging}
        referrals={mockReferrals}
        billing={mockBilling}
        aiSummary={mockAISummary}
        onRecordClick={handleRecordClick}
      />
    </div>
  );

  // Mobile layout: single pane + bottom nav + sheets
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Main chart area - leaves room for bottom nav */}
        <div className="flex-1 overflow-hidden pb-14">
          {chartContent}
        </div>

        {/* Bottom Nav */}
        <NavRail
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed(!navCollapsed)}
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
        />

        {/* Patient List as bottom sheet */}
        <Sheet open={mobilePatientListOpen} onOpenChange={setMobilePatientListOpen}>
          <SheetContent side="left" className="w-[85vw] max-w-[360px] p-0">
            <PatientList
              patients={mockPatientList}
              selectedPatientId={selectedPatientId}
              onSelectPatient={(id) => { setSelectedPatientId(id); setMobilePatientListOpen(false); }}
              onCollapse={() => setMobilePatientListOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Record Detail Drawer */}
        <RecordDetailDrawer
          record={selectedRecord}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    );
  }

  // Desktop / Tablet layout
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Nav Rail */}
      <NavRail
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed(!navCollapsed)}
        activeItem={activeNavItem}
        onItemClick={setActiveNavItem}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {patientListVisible ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Patient List Panel */}
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              maxSize={30}
              className="min-w-[250px]"
            >
              <PatientList
                patients={mockPatientList}
                selectedPatientId={selectedPatientId}
                onSelectPatient={setSelectedPatientId}
                onCollapse={() => setPatientListVisible(false)}
              />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-panel-border" />

            {/* Chart Workspace Panel */}
            <ResizablePanel defaultSize={80}>
              {chartContent}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Collapsed Patient List Toggle */}
            <div className="absolute left-[calc(theme(spacing.14)+1px)] top-1/2 -translate-y-1/2 z-30">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-l-none bg-card shadow-md border-l-0"
                onClick={() => setPatientListVisible(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {chartContent}
          </div>
        )}
      </div>

      {/* Record Detail Drawer */}
      <RecordDetailDrawer
        record={selectedRecord}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
