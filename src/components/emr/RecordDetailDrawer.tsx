import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import type { TimelineRecord, RecordType } from '@/types/emr';
import {
  FileText,
  Pill,
  FlaskConical,
  Activity,
  Stethoscope,
  Image,
  UserCheck,
  ClipboardList,
} from 'lucide-react';

interface RecordDetailDrawerProps {
  record: TimelineRecord | null;
  open: boolean;
  onClose: () => void;
}

const typeConfig: Record<RecordType, { icon: React.ElementType; label: string; color: string }> = {
  'vitals': { icon: Activity, label: 'Vital Signs', color: 'text-status-info' },
  'soap-note': { icon: ClipboardList, label: 'SOAP Note', color: 'text-primary' },
  'diagnosis': { icon: Stethoscope, label: 'Diagnosis', color: 'text-purple-600' },
  'prescription': { icon: Pill, label: 'Prescription', color: 'text-green-600' },
  'order': { icon: FlaskConical, label: 'Lab Order', color: 'text-amber-600' },
  'result': { icon: FlaskConical, label: 'Lab Result', color: 'text-blue-600' },
  'procedure': { icon: Stethoscope, label: 'Procedure', color: 'text-red-600' },
  'imaging': { icon: Image, label: 'Imaging', color: 'text-cyan-600' },
  'referral': { icon: UserCheck, label: 'Referral', color: 'text-indigo-600' },
  'note': { icon: FileText, label: 'Clinical Note', color: 'text-muted-foreground' },
};

export function RecordDetailDrawer({ record, open, onClose }: RecordDetailDrawerProps) {
  const isMobile = useIsMobile();

  if (!record) return null;

  const config = typeConfig[record.type];
  const Icon = config.icon;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side={isMobile ? 'bottom' : 'right'} 
        className={cn(
          'p-0 flex flex-col',
          isMobile ? 'h-[90vh] rounded-t-2xl' : 'w-[500px] sm:max-w-[500px]'
        )}
      >
        <SheetHeader className="px-4 md:px-6 py-3 md:py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center',
                'bg-primary/10'
              )}>
                <Icon className={cn('h-4 w-4 md:h-5 md:w-5', config.color)} />
              </div>
              <div>
                <SheetTitle className="text-left text-sm md:text-base">{record.title}</SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-2xs">
                    {config.label}
                  </Badge>
                  {record.status && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-2xs',
                        record.status === 'critical' && 'status-critical',
                        record.status === 'warning' && 'status-warning',
                        record.status === 'success' && 'status-success',
                        record.status === 'info' && 'status-info',
                        record.status === 'pending' && 'status-pending',
                        record.status === 'pending' && 'status-pending'
                      )}
                    >
                      {record.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 pb-6 border-b">
            <div>
              <div className="text-clinical-label">Date & Time</div>
              <div className="text-sm font-medium">
                {format(new Date(record.createdAt), 'MMMM d, yyyy')}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(record.createdAt), 'HH:mm')}
              </div>
            </div>
            <div>
              <div className="text-clinical-label">Author</div>
              <div className="text-sm font-medium">{record.createdBy}</div>
            </div>
            <div>
              <div className="text-clinical-label">Facility</div>
              <div className="text-sm">{record.facility}</div>
            </div>
            <div>
              <div className="text-clinical-label">Encounter</div>
              <div className="text-sm font-mono text-xs">{record.encounterId}</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="text-clinical-label mb-2">Content</div>
            <div className="bg-muted/30 rounded-lg p-3 md:p-4 text-sm whitespace-pre-line leading-relaxed">
              {record.content}
            </div>
          </div>

          {/* Actions based on type */}
          {record.type === 'prescription' && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-clinical-label mb-2">Quick Actions</div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">Print Prescription</Button>
                <Button variant="outline" size="sm">Discontinue</Button>
                <Button variant="outline" size="sm">Renew</Button>
                <Button variant="outline" size="sm">Cancel</Button>
              </div>
            </div>
          )}

          {record.type === 'order' && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-clinical-label mb-2">Quick Actions</div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">Cancel Order</Button>
                <Button variant="outline" size="sm">Mark Urgent</Button>
                <Button variant="outline" size="sm">View Results</Button>
              </div>
            </div>
          )}

          {record.type === 'result' && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-clinical-label mb-2">Quick Actions</div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">View Full Report</Button>
                <Button variant="outline" size="sm">Add to Summary</Button>
                <Button variant="outline" size="sm">Print</Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-t bg-muted/30 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="outline" size="sm">Add Note</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
