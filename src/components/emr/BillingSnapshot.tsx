import { cn } from '@/lib/utils';
import { CreditCard, ArrowRight, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BillingSummary } from '@/types/emr';

interface BillingSnapshotProps {
  billing: BillingSummary;
  onViewStatement: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function BillingSnapshot({ billing, onViewStatement }: BillingSnapshotProps) {
  const coveragePercent = Math.round((billing.insuranceCovered / billing.totalCharges) * 100);

  return (
    <div className="bg-card rounded-lg border">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Billing & Coverage</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs gap-1"
          onClick={onViewStatement}
        >
          View SOA
          <ArrowRight className="h-3 w-3" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs gap-1"
          onClick={onViewStatement}
        >
          Cancel
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-4">
        {/* Insurance Info */}
        {billing.insuranceProvider && (
          <div className="flex items-center justify-between mb-3 pb-3 border-b">
            <div>
              <div className="text-clinical-label">Insurance</div>
              <div className="text-sm font-medium">{billing.insuranceProvider}</div>
              <div className="text-2xs text-muted-foreground">
                Policy: {billing.policyNumber}
              </div>
            </div>
            <div className="text-right">
              <div className="text-clinical-label">Coverage</div>
              <div className="text-lg font-bold text-status-success">{coveragePercent}%</div>
            </div>
          </div>
        )}

        {/* Amount Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Charges</span>
            <span className="font-medium">{formatCurrency(billing.totalCharges)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-status-success">
            <span className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Insurance Covered
            </span>
            <span>-{formatCurrency(billing.insuranceCovered)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Patient Responsibility</span>
            <span className="font-medium">{formatCurrency(billing.patientResponsibility)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-status-success">
            <span className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Payments
            </span>
            <span>-{formatCurrency(billing.payments)}</span>
          </div>
          
          <div className="pt-2 mt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Balance Due</span>
              <span className={cn(
                'text-lg font-bold',
                billing.balance > 0 ? 'text-status-warning' : 'text-status-success'
              )}>
                {formatCurrency(billing.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
