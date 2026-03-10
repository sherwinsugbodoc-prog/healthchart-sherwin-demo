import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  FileText,
  Pill,
  FlaskConical,
  Activity,
  Stethoscope,
  Image,
  UserCheck,
  ClipboardList,
  Filter,
  ChevronDown,
  Calendar,
  Building2,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { TimelineRecord, RecordType, ClinicalStatus } from '@/types/emr';

interface ClinicalTimelineProps {
  records: TimelineRecord[];
  onRecordClick: (record: TimelineRecord) => void;
}

const typeConfig: Record<RecordType, { icon: React.ElementType; label: string; color: string }> = {
  'vitals': { icon: Activity, label: 'Vitals', color: 'text-status-info' },
  'soap-note': { icon: ClipboardList, label: 'SOAP Note', color: 'text-primary' },
  'diagnosis': { icon: Stethoscope, label: 'Diagnosis', color: 'text-purple-600' },
  'prescription': { icon: Pill, label: 'Rx', color: 'text-green-600' },
  'order': { icon: FlaskConical, label: 'Order', color: 'text-amber-600' },
  'result': { icon: FlaskConical, label: 'Result', color: 'text-blue-600' },
  'procedure': { icon: Stethoscope, label: 'Procedure', color: 'text-red-600' },
  'imaging': { icon: Image, label: 'Imaging', color: 'text-cyan-600' },
  'referral': { icon: UserCheck, label: 'Referral', color: 'text-indigo-600' },
  'note': { icon: FileText, label: 'Note', color: 'text-muted-foreground' },
};

const statusStyles: Record<ClinicalStatus, string> = {
  critical: 'status-critical',
  warning: 'status-warning',
  success: 'status-success',
  info: 'status-info',
  pending: 'status-pending',
};

type GroupBy = 'date' | 'encounter' | 'facility';

export function ClinicalTimeline({ records, onRecordClick }: ClinicalTimelineProps) {
  const [filters, setFilters] = useState<RecordType[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('date');

  const filteredRecords = filters.length > 0 
    ? records.filter(r => filters.includes(r.type))
    : records;

  const toggleFilter = (type: RecordType) => {
    setFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Group records
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    let key: string;
    switch (groupBy) {
      case 'date':
        key = format(new Date(record.createdAt), 'MMMM d, yyyy');
        break;
      case 'encounter':
        key = record.encounterId;
        break;
      case 'facility':
        key = record.facility;
        break;
    }
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {} as Record<string, TimelineRecord[]>);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      console.log("Clinical timeline loaded", records);
      <div className="flex items-center justify-between px-3 py-2 border-b bg-card sticky top-0 z-10">
        <h3 className="font-semibold text-sm">Clinical Records Timeline</h3>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Filter className="h-3 w-3" />
                Filter
                {filters.length > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-2xs ml-1">
                    {filters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Record Types</DropdownMenuLabel>
              {(Object.keys(typeConfig) as RecordType[]).map((type) => {
                const config = typeConfig[type];
                return (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={filters.includes(type)}
                    onCheckedChange={() => toggleFilter(type)}
                    className="gap-2"
                  >
                    <config.icon className={cn('h-3.5 w-3.5', config.color)} />
                    {config.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
              {filters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={() => setFilters([])}
                  >
                    Clear all filters
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                {groupBy === 'date' && <Calendar className="h-3 w-3" />}
                {groupBy === 'encounter' && <List className="h-3 w-3" />}
                {groupBy === 'facility' && <Building2 className="h-3 w-3" />}
                Group
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={groupBy === 'date'}
                onCheckedChange={() => setGroupBy('date')}
              >
                <Calendar className="h-3.5 w-3.5 mr-2" />
                By Date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={groupBy === 'encounter'}
                onCheckedChange={() => setGroupBy('encounter')}
              >
                <List className="h-3.5 w-3.5 mr-2" />
                By Encounter
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={groupBy === 'facility'}
                onCheckedChange={() => setGroupBy('facility')}
              >
                <Building2 className="h-3.5 w-3.5 mr-2" />
                By Facility
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-3">
        {Object.entries(groupedRecords).map(([group, groupRecords]) => (
          <div key={group} className="mb-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 sticky top-0 bg-background py-1">
              {group}
            </div>
            <div className="space-y-0">
              {groupRecords.map((record, index) => {
                const config = typeConfig[record.type];
                const Icon = config.icon;
                const isLast = index === groupRecords.length - 1;

                return (
                  <div 
                    key={record.id} 
                    className={cn(
                      'relative pl-6 pb-3 ml-2 cursor-pointer group',
                      !isLast && 'border-l-2 border-timeline-line'
                    )}
                    onClick={() => onRecordClick(record)}
                  >
                    {/* Timeline dot */}
                    <div className={cn(
                      'absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-card',
                      record.status === 'critical' ? 'border-status-critical bg-status-critical' :
                      record.status === 'warning' ? 'border-status-warning bg-status-warning' :
                      'border-timeline-dot'
                    )} />

                    {/* Content */}
                    <div className="clinical-card p-3 group-hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className={cn('h-4 w-4', config.color)} />
                          <span className="font-medium text-sm">{record.title}</span>
                          {record.status && (
                            <Badge variant="outline" className={cn('text-2xs', statusStyles[record.status])}>
                              {record.status}
                            </Badge>
                          )}
                        </div>
                        <span className="text-2xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(record.createdAt), 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
                        {record.content}
                      </p>
                      <div className="text-2xs text-muted-foreground mt-2">
                        {record.createdBy}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No clinical records available</p>
          </div>
        )}
      </div>
    </div>
  );
}
