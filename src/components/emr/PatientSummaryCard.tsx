import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Wind, 
  Droplets,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { VitalSigns, Encounter } from '@/types/emr';

interface PatientSummaryCardProps {
  encounter: Encounter;
  latestVitals?: VitalSigns;
  previousVitals?: VitalSigns;
}

function VitalItem({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  status,
  trend
}: { 
  label: string; 
  value?: number | string; 
  unit: string; 
  icon: React.ElementType;
  status?: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}) {
  const statusColors = {
    normal: 'text-status-success',
    warning: 'text-status-warning',
    critical: 'text-status-critical',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className={cn(
        'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0',
        status === 'critical' ? 'bg-status-critical-bg' :
        status === 'warning' ? 'bg-status-warning-bg' :
        'bg-muted'
      )}>
        <Icon className={cn(
          'h-3.5 w-3.5 md:h-4 md:w-4',
          status ? statusColors[status] : 'text-muted-foreground'
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-clinical-label text-[10px] md:text-xs">{label}</div>
        <div className="flex items-center gap-1">
          <span className={cn(
            'text-xs md:text-sm font-semibold',
            status && statusColors[status]
          )}>
            {value ?? '--'}
          </span>
          <span className="text-[10px] md:text-xs text-muted-foreground">{unit}</span>
          {trend && (
            <TrendIcon className={cn(
              'h-3 w-3 ml-0.5',
              trend === 'up' ? 'text-status-critical' :
              trend === 'down' ? 'text-status-success' :
              'text-muted-foreground'
            )} />
          )}
        </div>
      </div>
    </div>
  );
}

export function PatientSummaryCard({ encounter, latestVitals, previousVitals }: PatientSummaryCardProps) {
  const los = differenceInDays(new Date(), new Date(encounter.admissionDate));
  
  const bpTrend = previousVitals && latestVitals ? 
    (latestVitals.bloodPressureSystolic ?? 0) > (previousVitals.bloodPressureSystolic ?? 0) ? 'up' :
    (latestVitals.bloodPressureSystolic ?? 0) < (previousVitals.bloodPressureSystolic ?? 0) ? 'down' : 'stable'
    : undefined;

  const getBPStatus = (systolic?: number) => {
    if (!systolic) return undefined;
    if (systolic >= 160 || systolic <= 90) return 'critical' as const;
    if (systolic >= 140 || systolic <= 100) return 'warning' as const;
    return 'normal' as const;
  };

  const getHRStatus = (hr?: number) => {
    if (!hr) return undefined;
    if (hr >= 120 || hr <= 50) return 'critical' as const;
    if (hr >= 100 || hr <= 60) return 'warning' as const;
    return 'normal' as const;
  };

  const getO2Status = (o2?: number) => {
    if (!o2) return undefined;
    if (o2 < 90) return 'critical' as const;
    if (o2 < 95) return 'warning' as const;
    return 'normal' as const;
  };

  return (
    <div className="bg-card rounded-lg border p-3 md:p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Patient Summary</h3>
        {latestVitals && (
          <span className="text-2xs text-muted-foreground">
            Last vitals: {format(new Date(latestVitals.recordedAt), 'HH:mm')}
          </span>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-1.5 md:gap-2 mb-4">
        <div className="bg-muted/50 rounded-md p-1.5 md:p-2 text-center">
          <div className="text-clinical-label text-[10px] md:text-xs">LOS</div>
          <div className="text-xs md:text-sm font-semibold">{los}d</div>
        </div>
        <div className="bg-muted/50 rounded-md p-1.5 md:p-2 text-center">
          <div className="text-clinical-label text-[10px] md:text-xs">Dx</div>
          <div className="text-xs md:text-sm font-semibold">{encounter.diagnoses.length}</div>
        </div>
        <div className="bg-muted/50 rounded-md p-1.5 md:p-2 text-center">
          <div className="text-clinical-label text-[10px] md:text-xs">Meds</div>
          <div className="text-xs md:text-sm font-semibold">4</div>
        </div>
        <div className="bg-muted/50 rounded-md p-1.5 md:p-2 text-center">
          <div className="text-clinical-label text-[10px] md:text-xs">Pending</div>
          <div className="text-xs md:text-sm font-semibold text-status-warning">3</div>
        </div>
      </div>

      {/* Latest Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
        <VitalItem
          label="Blood Pressure"
          value={latestVitals ? `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` : undefined}
          unit="mmHg"
          icon={Activity}
          status={getBPStatus(latestVitals?.bloodPressureSystolic)}
          trend={bpTrend}
        />
        <VitalItem
          label="Heart Rate"
          value={latestVitals?.heartRate}
          unit="bpm"
          icon={Heart}
          status={getHRStatus(latestVitals?.heartRate)}
        />
        <VitalItem
          label="Temperature"
          value={latestVitals?.temperature}
          unit="°C"
          icon={Thermometer}
        />
        <VitalItem
          label="SpO2"
          value={latestVitals?.oxygenSaturation}
          unit="%"
          icon={Droplets}
          status={getO2Status(latestVitals?.oxygenSaturation)}
        />
        <VitalItem
          label="Resp. Rate"
          value={latestVitals?.respiratoryRate}
          unit="/min"
          icon={Wind}
        />
        <VitalItem
          label="Pain"
          value={latestVitals?.painLevel !== undefined ? `${latestVitals.painLevel}/10` : undefined}
          unit=""
          icon={AlertCircle}
          status={latestVitals?.painLevel ? (latestVitals.painLevel >= 7 ? 'critical' : latestVitals.painLevel >= 4 ? 'warning' : 'normal') : undefined}
        />
      </div>

      {/* Active Diagnoses */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-clinical-label mb-2">Active Diagnoses</h4>
        <div className="space-y-1">
          {encounter.diagnoses.filter(d => d.status === 'active').map((dx) => (
            <div key={dx.id} className="flex items-center gap-2 text-xs md:text-sm">
              <Badge 
                variant="outline" 
                className={cn(
                  'text-2xs',
                  dx.type === 'primary' ? 'border-primary text-primary' : 'border-muted-foreground'
                )}
              >
                {dx.type === 'primary' ? 'Dx1' : 'Dx2'}
              </Badge>
              <span className="text-muted-foreground font-mono text-[10px] md:text-xs">{dx.code}</span>
              <span className="truncate">{dx.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
