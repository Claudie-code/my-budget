import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Envelope {
  id: number;
  name: string;
  available: number;
}

interface SelectTransferProps {
  envelopes: Envelope[];
  value: number | null;
  onChange: (id: number) => void;
  excludeId?: number;
}

export function SelectTransfer({ envelopes, value, onChange, excludeId }: SelectTransferProps) {
  const filteredEnvelopes = envelopes.filter((env) => env.id !== excludeId);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">Move money to</label>

      <Select value={value?.toString() ?? ''} onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger>
          <SelectValue placeholder="Select envelope" />
        </SelectTrigger>

        <SelectContent>
          {filteredEnvelopes.map((env) => (
            <SelectItem key={env.id} value={env.id.toString()}>
              <div className="flex justify-between w-full">
                <span>{env.name}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {env.available.toFixed(2)} $
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
