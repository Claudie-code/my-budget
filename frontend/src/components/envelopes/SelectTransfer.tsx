import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEnvelopes } from '@/providers/EnvelopesProvider';

interface SelectTransferProps {
  value: number | null;
  onChange: (id: number) => void;
  excludeId?: number;
}

export function SelectTransfer({ value, onChange, excludeId }: SelectTransferProps) {
  const envelopes = useEnvelopes();
  const filteredEnvelopes = envelopes.filter((env) => env.id !== excludeId);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Move money to</label>

      <Select value={value?.toString() ?? ''} onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select envelope" />
        </SelectTrigger>

        <SelectContent>
          {filteredEnvelopes.map(
            (env) =>
              !env.isOverspent && (
                <SelectItem key={env.id} value={env.id.toString()}>
                  <div>
                    <span className="mr-2">{env.name}</span>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {env.available.toFixed(2)} $
                    </span>
                  </div>
                </SelectItem>
              ),
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
