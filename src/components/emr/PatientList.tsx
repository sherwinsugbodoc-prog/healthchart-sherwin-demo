import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Search, Filter, ChevronLeft, Circle, AlertTriangle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PatientListItem, EncounterStatus } from '@/types/emr';

interface PatientListProps {
  patients: PatientListItem[];
  selectedPatientId?: string;
  onSelectPatient: (id: string) => void;
  onCollapse: () => void;
}

function getEncounterStatusBadge(status: EncounterStatus) {
  switch (status) {
    case 'admitted':
      return <Badge className="encounter-admitted text-xs">Admitted</Badge>;
    case 'for-discharge':
      return <Badge className="encounter-for-discharge text-xs">For D/C</Badge>;
    case 'discharged':
      return <Badge className="encounter-discharged text-xs">Discharged</Badge>;
  }
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function PatientList({ patients, selectedPatientId, onSelectPatient, onCollapse }: PatientListProps) {
  return (
    <div className="h-full flex flex-col bg-card border-r border-panel-border">
      {/* Header */}
      <div className="panel-header">
        <span className="font-semibold">My Patients</span>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">{patients.length}</Badge>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCollapse}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8 h-8 text-sm"
          />
        </div>
        <div className="flex gap-1 mt-2">
          <Button variant="outline" size="sm" className="h-7 text-xs flex-1">
            <Filter className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs">Admitted</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs">D/C</Button>
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {patients.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectPatient(item.patient.id)}
            className={cn(
              'w-full text-left p-3 border-b border-border/50 hover:bg-accent/50 transition-colors',
              selectedPatientId === item.patient.id && 'bg-accent'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                item.encounter.status === 'admitted' ? 'bg-primary/10 text-primary' :
                item.encounter.status === 'for-discharge' ? 'bg-status-warning-bg text-status-warning' :
                'bg-muted text-muted-foreground'
              )}>
                {getInitials(item.patient.firstName, item.patient.lastName)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {item.patient.lastName}, {item.patient.firstName}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.hasUnreadNotes && <Circle className="h-2 w-2 fill-primary text-primary" />}
                    {item.hasPendingOrders && <Clock className="h-3 w-3 text-status-warning" />}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {item.encounter.room && `Room ${item.encounter.room}${item.encounter.bed ? item.encounter.bed : ''}`}
                  {item.encounter.room && ' • '}
                  {item.encounter.department}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  {getEncounterStatusBadge(item.encounter.status)}
                  <span className="text-2xs text-muted-foreground">
                    {format(new Date(item.lastUpdated), 'HH:mm')}
                  </span>
                </div>
                {item.patient.allergies.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 text-status-critical">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-2xs font-medium">
                      {item.patient.allergies.length} Allergy Alert{item.patient.allergies.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
