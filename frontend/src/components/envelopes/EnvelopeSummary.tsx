import type { Envelope } from '@/types/dashboard';
import { BudgetRow } from './BudgetRow';
import { RemainingRow } from './RemainingRow';

interface EnvelopeSummaryProps {
  selectedEnvelope: Envelope;
  totalSpent: number;
  remaining: number;
}

export function EnvelopeSummary({ selectedEnvelope, totalSpent, remaining }: EnvelopeSummaryProps) {
  const isOverspent = selectedEnvelope.isOverspent;

  return (
    <div className="mt-6 space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
      <BudgetRow label="Budget" value={selectedEnvelope.budget.toFixed(2) + ' $'} />
      <BudgetRow label="Total spent" value={totalSpent.toFixed(2) + ' $'} isNegative />
      <div className="border-t" />
      <RemainingRow
        remaining={remaining}
        isOverspent={isOverspent}
        selectedEnvelopeId={selectedEnvelope.id}
      />
    </div>
  );
}
