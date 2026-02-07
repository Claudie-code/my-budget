import type { Envelope } from '@/pages/Dashboard';
import { Drawer, DrawerContent } from '../../components/ui/drawer';
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
