import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectTransfer } from './SelectTransfer';

export function CoverForm({ defaultAmount }: { defaultAmount: string }) {
  const [amount, setAmount] = useState(defaultAmount);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-8 px-3 bg-gray-100 rounded-md cursor-pointer">Cover</button>
      </PopoverTrigger>

      <PopoverContent className="w-72 space-y-4">
        <div>
          <p className="text-sm font-medium">Cover overspending</p>
          <p className="text-xs text-muted-foreground">Move money to another envelope</p>
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="amount">Amount to transfer</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* <SelectTransfer envelopes={envelopes} /> */}

          <Button className="w-full">Confirm transfer</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
