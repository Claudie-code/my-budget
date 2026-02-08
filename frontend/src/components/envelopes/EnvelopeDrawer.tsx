import type { Envelope } from '@/types/dashboard';
import { Drawer, DrawerContent } from '../ui/drawer';
import EnvelopeCard from './EnvelopeCard';

type EnvelopeDrawerProps = {
  envelope: Envelope;
  onClose: () => void;
};

export default function EnvelopeDrawer({ envelope, onClose }: EnvelopeDrawerProps) {
  return (
    <Drawer open={!!envelope} onOpenChange={onClose}>
      <DrawerContent>
        <EnvelopeCard selectedEnvelope={envelope} onCloseEnvelope={onClose} />
      </DrawerContent>
    </Drawer>
  );
}
