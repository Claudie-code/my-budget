import EnvelopeCard from '@/components/envelopes/EnvelopeCard';
import EnvelopeDrawer from '@/components/envelopes/EnvelopeDrawer';
import type { Envelope } from '@/types/dashboard';

interface EnvelopeDetailProps {
  selectedEnvelope: Envelope | null;
  onCloseEnvelope: () => void;
  isMobile: boolean;
}

export const EnvelopeDetail = ({
  selectedEnvelope,
  onCloseEnvelope,
  isMobile,
}: EnvelopeDetailProps) => {
  return isMobile && selectedEnvelope ? (
    <EnvelopeDrawer envelope={selectedEnvelope} onClose={onCloseEnvelope} />
  ) : (
    <section className="flex-1 overflow-y-auto py-4 px-6 bg-gray-50">
      <EnvelopeCard selectedEnvelope={selectedEnvelope} onCloseEnvelope={onCloseEnvelope} />
    </section>
  );
};
