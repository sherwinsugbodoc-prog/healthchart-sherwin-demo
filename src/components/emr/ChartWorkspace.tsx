import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, AlertTriangle, Sparkles, Clock, Activity, List } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

import { PatientSummaryCard } from './PatientSummaryCard';
import { AISummaryPanel } from './AISummaryPanel';
import { ClinicalTimeline } from './ClinicalTimeline';
import { ImagingStudiesCard } from './ImagingStudiesCard';
import { ReferralsCard } from './ReferralsCard';
import { BillingSnapshot } from './BillingSnapshot';

import type { Patient, Encounter, VitalSigns, TimelineRecord, ImagingStudy, Referral, BillingSummary } from '@/types/emr';

interface ChartWorkspaceProps {
  patient: Patient;
  encounter: Encounter;
  vitals: VitalSigns[];
  timeline: TimelineRecord[];
  imaging: ImagingStudy[];
  referrals: Referral[];
  billing: BillingSummary;
  aiSummary: string;
  onRecordClick: (record: TimelineRecord) => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  variant?: 'default' | 'critical';
  children: React.ReactNode;
}

function CollapsibleSection({ 
  title, 
  icon: Icon, 
  defaultOpen = true, 
  badge,
  variant = 'default',
  children 
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-4">
      <CollapsibleTrigger className={cn(
        'section-trigger',
        variant === 'critical' && 'bg-status-critical-bg hover:bg-status-critical-bg/80'
      )}>
        <div className="flex items-center gap-2">
          <Icon className={cn(
            'h-4 w-4',
            variant === 'critical' ? 'text-status-critical' : 'text-primary'
          )} />
          <span>{title}</span>
          {badge}
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ChartWorkspace({
  patient,
  encounter,
  vitals,
  timeline,
  imaging,
  referrals,
  billing,
  aiSummary,
  onRecordClick,
}: ChartWorkspaceProps) {
  const hasAlerts = patient.allergies.length > 0 || patient.alerts.length > 0;
  const isMobile = useIsMobile();
  const [timelineOpen, setTimelineOpen] = useState(false);

  const overviewContent = (
    <div className="flex-1 overflow-y-auto p-3 md:p-4">
      {/* Critical Information */}
      {hasAlerts && (
        <CollapsibleSection 
          title="Critical Information" 
          icon={AlertTriangle}
          variant="critical"
          badge={
            <Badge variant="destructive" className="text-2xs">
              {patient.allergies.length + patient.alerts.length}
            </Badge>
          }
        >
          <div className="bg-card rounded-lg border border-status-critical/20 p-3 md:p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {patient.allergies.length > 0 && (
                <div>
                  <h4 className="text-clinical-label mb-2">Allergies</h4>
                  <div className="space-y-2">
                    {patient.allergies.map((allergy) => (
                      <div 
                        key={allergy.id} 
                        className="flex items-center justify-between bg-status-critical-bg rounded-md px-3 py-2"
                      >
                        <div>
                          <span className="font-medium text-sm">{allergy.allergen}</span>
                          {allergy.reaction && (
                            <span className="text-xs text-muted-foreground ml-2">
                              → {allergy.reaction}
                            </span>
                          )}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-2xs',
                            allergy.severity === 'severe' && 'status-critical',
                            allergy.severity === 'moderate' && 'status-warning',
                            allergy.severity === 'mild' && 'status-info'
                          )}
                        >
                          {allergy.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {patient.alerts.length > 0 && (
                <div>
                  <h4 className="text-clinical-label mb-2">Active Alerts</h4>
                  <div className="space-y-2">
                    {patient.alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={cn(
                          'rounded-md px-3 py-2 text-sm',
                          alert.type === 'critical' && 'bg-status-critical-bg text-status-critical',
                          alert.type === 'warning' && 'bg-status-warning-bg text-status-warning-foreground',
                          alert.type === 'info' && 'bg-status-info-bg text-status-info'
                        )}
                      >
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* AI Summary */}
      <CollapsibleSection title="AI Summary" icon={Sparkles}>
        <AISummaryPanel summary={aiSummary} lastUpdated="5 min ago" />
      </CollapsibleSection>

      {/* At a Glance */}
      <CollapsibleSection title="At a Glance" icon={Activity}>
        <PatientSummaryCard 
          encounter={encounter}
          latestVitals={vitals[0]}
          previousVitals={vitals[1]}
        />
      </CollapsibleSection>

      {/* Current Encounter Workspace */}
      <CollapsibleSection title="Current Encounter" icon={Clock}>
        <div className="grid gap-4 lg:grid-cols-2">
          <ImagingStudiesCard 
            studies={imaging} 
            onStudyClick={() => {}} 
          />
          <ReferralsCard 
            referrals={referrals} 
            onReferralClick={() => {}} 
          />
        </div>
        <div className="mt-4">
          <BillingSnapshot 
            billing={billing} 
            onViewStatement={() => {}} 
          />
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center bg-card border-b">
          <TabsList className="h-10 bg-transparent rounded-none justify-start px-2 md:px-4 gap-1 flex-1 overflow-x-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
              Notes & Orders
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
              History
            </TabsTrigger>
            {!isMobile && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs md:text-sm">
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* Mobile: timeline toggle button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 gap-1 text-xs flex-shrink-0"
              onClick={() => setTimelineOpen(true)}
            >
              <List className="h-4 w-4" />
              Timeline
            </Button>
          )}
        </div>

        <TabsContent value="overview" className="flex-1 overflow-hidden m-0 data-[state=active]:flex">
          {overviewContent}

          {/* Desktop: Timeline Sidebar */}
          {!isMobile && (
            <div className="w-[360px] xl:w-[400px] border-l bg-background flex flex-col overflow-hidden">
              <ClinicalTimeline records={timeline} onRecordClick={onRecordClick} />
            </div>
          )}

          {/* Mobile: Timeline as bottom sheet */}
          {isMobile && (
            <Sheet open={timelineOpen} onOpenChange={setTimelineOpen}>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
                <div className="h-full flex flex-col">
                  <SheetHeader className="px-4 py-3 border-b">
                    <SheetTitle className="text-left">Clinical Timeline</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-hidden">
                    <ClinicalTimeline records={timeline} onRecordClick={(record) => { setTimelineOpen(false); onRecordClick(record); }} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto p-4 m-0">
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="font-medium mb-2">Notes & Orders</h3>
            <p className="text-sm">Full notes and orders management coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-y-auto p-4 m-0">
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="font-medium mb-2">Patient History</h3>
            <p className="text-sm">Complete longitudinal history view coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="flex-1 overflow-y-auto p-4 m-0">
          <div className="text-center py-12 text-muted-foreground">
            <h3 className="font-medium mb-2">Administrative</h3>
            <p className="text-sm">Administrative functions coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
