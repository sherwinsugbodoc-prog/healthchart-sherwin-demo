import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Image, Calendar, Clock, FileText, ExternalLink, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ImagingStudy } from '@/types/emr';

interface ImagingStudiesCardProps {
  studies: ImagingStudy[];
  onStudyClick: (study: ImagingStudy) => void;
}

const statusConfig: Record<ImagingStudy['status'], { label: string; className: string }> = {
  ordered: { label: 'Ordered', className: 'status-pending' },
  scheduled: { label: 'Scheduled', className: 'status-info' },
  'in-progress': { label: 'In Progress', className: 'status-warning' },
  completed: { label: 'Completed', className: 'status-success' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
};

export function ImagingStudiesCard({ studies, onStudyClick }: ImagingStudiesCardProps) {
  return (
    <div className="bg-card rounded-lg border">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Imaging Studies</h3>
          <Badge variant="secondary" className="text-2xs">{studies.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          View All
        </Button>
      </div>

      <div className="divide-y">
        {studies.map((study) => {
          const status = statusConfig[study.status];
          return (
            <div
              key={study.id}
              className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onStudyClick(study)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{study.type}</span>
                    <Badge variant="outline" className={cn('text-2xs', status.className)}>
                      {status.label}
                    </Badge>
                    {study.hasDicom && (
                      <Badge variant="outline" className="text-2xs bg-cyan-50 text-cyan-700 border-cyan-200">
                        DICOM
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {study.bodyPart}
                  </div>
                </div>
                <div className="text-right text-2xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(study.orderedAt), 'MMM d')}
                  </div>
                  {study.completedAt && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {format(new Date(study.completedAt), 'HH:mm')}
                    </div>
                  )}
                </div>
              </div>

              {study.findings && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground line-clamp-2">
                  <FileText className="h-3 w-3 inline mr-1" />
                  {study.findings}
                </div>
              )}

              {study.status === 'completed' && study.hasDicom && (
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="h-6 text-xs gap-1">
                    <Eye className="h-3 w-3" />
                    View Images
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Open PACS
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {studies.length === 0 && (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No imaging studies
          </div>
        )}
      </div>
    </div>
  );
}
