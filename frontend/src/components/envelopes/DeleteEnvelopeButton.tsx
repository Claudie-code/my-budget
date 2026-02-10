import { Button } from '@/components/ui/button';
import { useDeleteEnvelope } from '@/hooks/use-envelopes';
import { Trash2 } from 'lucide-react';

interface Props {
  envelopeId: number;
  onCloseEnvelope: () => void;
}

export function DeleteEnvelopeButton({ envelopeId, onCloseEnvelope }: Props) {
  const { mutate, isPending } = useDeleteEnvelope();

  const handleSubmit = () => {
    mutate(envelopeId, {
      onSuccess: () => {
        onCloseEnvelope();
      },
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleSubmit}
      disabled={isPending}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
