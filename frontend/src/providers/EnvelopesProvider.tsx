import type { Envelope } from '@/types/dashboard';
import { createContext, useContext } from 'react';

const EnvelopesContext = createContext<Envelope[]>([]);

export const useEnvelopes = () => useContext(EnvelopesContext);

export function EnvelopesProvider({
  envelopes,
  children,
}: {
  envelopes: Envelope[];
  children: React.ReactNode;
}) {
  return <EnvelopesContext.Provider value={envelopes}>{children}</EnvelopesContext.Provider>;
}
