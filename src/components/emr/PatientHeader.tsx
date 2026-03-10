import { cn } from '@/lib/utils';
import { format, differenceInYears } from 'date-fns';
import { 
  AlertTriangle, 
  ChevronDown, 
  Maximize2, 
  Minimize2, 
  Plus,
  Droplets,
  User,
  Building2,
  Bed,
  Users,
  Clock as ClockIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Patient, Encounter, EncounterStatus } from '@/types/emr';

interface PatientHeaderProps {
  patient: Patient;
  encounter: Encounter;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
  onAddRecord: (type: string) => void;
  onOpenPatientList?: () => void;
}

function getStatusLabel(status: EncounterStatus) {
  switch (status) {
    case 'admitted': return 'Admitted';
    case 'for-discharge': return 'For Discharge';
    case 'discharged': return 'Discharged';
  }
}

function getStatusClass(status: EncounterStatus) {
  switch (status) {
    case 'admitted': return 'encounter-admitted';
    case 'for-discharge': return 'encounter-for-discharge';
    case 'discharged': return 'encounter-discharged';
  }
}

const recordTypes = [
  { id: 'vitals', label: 'Vital Signs', icon: '🩺' },
  { id: 'soap-note', label: 'SOAP Note', icon: '📝' },
  { id: 'note', label: 'Progress Note', icon: '📄' },
  { id: 'diagnosis', label: 'Diagnosis', icon: '🔬' },
  { id: 'prescription', label: 'Prescription', icon: '💊' },
  { id: 'order', label: 'Lab Order', icon: '🧪' },
  { id: 'imaging', label: 'Imaging Order', icon: '🩻' },
  { id: 'procedure', label: 'Procedure Note', icon: '⚕️' },
  { id: 'referral', label: 'Referral', icon: '👨‍⚕️' },
];

export function PatientHeader({ 
  patient, 
  encounter, 
  isFullWidth, 
  onToggleFullWidth,
  onAddRecord,
  onOpenPatientList,
}: PatientHeaderProps) {
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));
  const hasAllergies = patient.allergies.length > 0;
  const hasCriticalAlerts = patient.alerts.some(a => a.type === 'critical');
  const isMobile = useIsMobile();

  return (
    <div className="bg-card border-b sticky top-0 z-20">
      {/* Critical Alerts Banner */}
      {(hasAllergies || hasCriticalAlerts) && (
        <div className="bg-status-critical-bg border-b border-status-critical/20 px-3 md:px-4 py-1.5 flex items-center gap-2 md:gap-4">
          <AlertTriangle className="h-4 w-4 text-status-critical flex-shrink-0" />
          <div className="flex items-center gap-2 md:gap-3 flex-wrap text-xs md:text-sm overflow-x-auto">
            {patient.allergies.map((allergy) => (
              <Badge key={allergy.id} variant="outline" className="status-critical text-2xs md:text-xs font-medium whitespace-nowrap">
                ⚠️ {allergy.allergen} ({allergy.severity})
              </Badge>
            ))}
            {patient.alerts.filter(a => a.type === 'critical').map((alert) => (
              <Badge key={alert.id} variant="outline" className="status-critical text-2xs md:text-xs font-medium whitespace-nowrap">
                🚨 {alert.message}
              </Badge>
            ))}
             {patient.alerts.filter(a => a.type === 'critical').map((alert) => (
              <Badge key={alert.id} variant="outline" className="status-critical text-2xs md:text-xs font-medium whitespace-nowrap">
                🚨 {alert.message}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="px-3 md:px-4 py-2 md:py-3 flex items-center justify-between gap-2 md:gap-4">
        {/* Patient Identity */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          {/* Mobile: patient list toggle */}
          {isMobile && onOpenPatientList && (
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={onOpenPatientList}>
              <Users className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm md:text-lg font-bold truncate">
                  {patient.lastName}, {patient.firstName} {!isMobile && patient.middleName?.[0] + '.'}
                </h1>
                <Badge className={cn('text-2xs md:text-xs', getStatusClass(encounter.status))}>
                  {getStatusLabel(encounter.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                <span>{age}y {patient.gender === 'male' ? 'M' : 'F'}</span>
                {!isMobile && <span>DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}</span>}
                <span>MRN: {patient.mrn}</span>
                {!isMobile && patient.bloodType && (
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" />
                    {patient.bloodType}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions - always visible */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Encounter info - hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-4 text-sm mr-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{encounter.department}</span>
              </div>
              {encounter.room && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Room {encounter.room}{encounter.bed}</span>
                </div>
              )}
              <div className="text-muted-foreground">
                Attending: <span className="text-foreground font-medium">{encounter.attendingPhysician}</span>
              </div>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={isMobile ? 'icon' : 'sm'} className={cn(isMobile ? 'h-9 w-9' : 'gap-1.5')}>
                <Plus className="h-4 w-4" />
                {!isMobile && <>Add Record<ChevronDown className="h-3 w-3 opacity-60" /></>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Quick Add</DropdownMenuLabel>
              {recordTypes.map((type) => (
                <DropdownMenuItem 
                  key={type.id} 
                  onClick={() => onAddRecord(type.id)}
                  className="gap-2"
                >
                  <span>{type.icon}</span>
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {!isMobile && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={onToggleFullWidth}
            >
              {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Chief Complaint - condensed on mobile */}
      <div className="px-3 md:px-4 py-1.5 md:py-2 bg-muted/50 border-t text-xs md:text-sm flex items-center gap-2">
        <span className="text-muted-foreground whitespace-nowrap">CC:</span>
        <span className="font-medium truncate">{encounter.chiefComplaint}</span>
        {!isMobile && (
          <span className="text-muted-foreground ml-auto whitespace-nowrap">
            Admitted: {format(new Date(encounter.admissionDate), 'MMM d, yyyy HH:mm')}
          </span>
        )}
        {isMobile && encounter.room && (
          <span className="text-muted-foreground ml-auto whitespace-nowrap text-2xs">
            Rm {encounter.room}{encounter.bed}
          </span>
        )}
      </div>
    </div>
  );
}
