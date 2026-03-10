import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { UserCheck, Calendar, Paperclip, ArrowRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Referral } from '@/types/emr';

interface ReferralsCardProps {
  referrals: Referral[];
  onReferralClick: (referral: Referral) => void;
}

const statusConfig: Record<Referral['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-warning' },
  scheduled: { label: 'Scheduled', className: 'status-info' },
  completed: { label: 'Completed', className: 'status-success' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
};

const priorityConfig: Record<Referral['priority'], { label: string; className: string }> = {
  routine: { label: 'Routine', className: 'bg-muted text-muted-foreground' },
  urgent: { label: 'Urgent', className: 'status-warning' },
  stat: { label: 'STAT', className: 'status-critical' },
};

export function ReferralsCard({ referrals, onReferralClick }: ReferralsCardProps) {
  return (
    <div className="bg-card rounded-lg border">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Referrals</h3>
          <Badge variant="secondary" className="text-2xs">{referrals.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          View All
        </Button>
      </div>

      <div className="divide-y">
        {referrals.map((referral) => {
          const status = statusConfig[referral.status];
          const priority = priorityConfig[referral.priority];

          return (
            <div
              key={referral.id}
              className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onReferralClick(referral)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{referral.specialty}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{referral.referredTo}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn('text-2xs', status.className)}>
                      {status.label}
                    </Badge>
                    {referral.priority !== 'routine' && (
                      <Badge variant="outline" className={cn('text-2xs', priority.className)}>
                        {priority.label}
                      </Badge>
                    )}
                    {referral.attachments && referral.attachments.length > 0 && (
                      <Badge variant="outline" className="text-2xs">
                        <Paperclip className="h-2.5 w-2.5 mr-1" />
                        {referral.attachments.length}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right text-2xs text-muted-foreground">
                  <div>
                    {format(new Date(referral.createdAt), 'MMM d')}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground line-clamp-1">
                {referral.reason}
              </div>

              {referral.status === 'scheduled' && referral.scheduledDate && (
                <div className="mt-2 flex items-center gap-1 text-xs text-status-info">
                  <Calendar className="h-3 w-3" />
                  Scheduled: {format(new Date(referral.scheduledDate), 'MMM d, yyyy HH:mm')}
                </div>
              )}

              {referral.status === 'pending' && referral.priority === 'stat' && (
                <div className="mt-2 flex items-center gap-1 text-xs text-status-critical">
                  <AlertCircle className="h-3 w-3" />
                  Urgent attention required
                </div>
              )}
            </div>
          );
        })}

        {referrals.length === 0 && (
          <div className="p-6 text-center text-muted-foreground text-sm">
            No referrals
          </div>
        )}
      </div>
    </div>
  );
}
