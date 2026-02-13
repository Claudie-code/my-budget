import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectTransfer } from './SelectTransfer';
import { useTransferEnvelope } from '@/hooks/use-envelopes';
import { coverFormSchema } from '@/schemas/envelopes.schema';

interface CoverFormProps {
  defaultAmount: number;
  selectedEnvelopeId: number;
}

export function CoverForm({ defaultAmount, selectedEnvelopeId }: CoverFormProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [targetEnvelopeId, setTargetEnvelopeId] = useState<number | null>(null);

  const { mutate, isPending } = useTransferEnvelope();

  const handleAmountChange = (value: string) => {
    const num = Number(value);
    if (num > defaultAmount) setAmount(defaultAmount);
    else setAmount(num);
  };

  const handleSubmit = () => {
    const parsed = coverFormSchema.safeParse({
      amount,
      targetId: targetEnvelopeId,
    });

    if (!parsed.success) return;

    mutate({
      fromId: targetEnvelopeId!,
      toId: selectedEnvelopeId,
      amount,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-8 px-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition">
          Cover
        </button>
      </PopoverTrigger>

      <PopoverContent side="left" className="w-72 space-y-4">
        <div>
          <p className="font-medium">Cover overspending</p>
          <p className="text-sm text-muted-foreground">Move money to this envelope</p>
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="amount">Amount to transfer</Label>
            <Input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            {amount > defaultAmount && (
              <p className="text-red-500 text-xs">
                Cannot exceed overspent amount ({defaultAmount})
              </p>
            )}
          </div>

          <SelectTransfer
            value={targetEnvelopeId}
            onChange={setTargetEnvelopeId}
            excludeId={selectedEnvelopeId}
          />

          <Button
            className="w-full mt-3"
            onClick={handleSubmit}
            disabled={!targetEnvelopeId || amount <= 0 || amount > defaultAmount || isPending}
          >
            {isPending ? 'Transferring...' : 'Confirm transfer'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
