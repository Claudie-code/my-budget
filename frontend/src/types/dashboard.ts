export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  userId: number;
  envelopeId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Envelope {
  id: number;
  name: string;
  budget: number;
  transactions: Transaction[];
  isActive: boolean;
  spent: number;
  available: number;
  isOverspent: boolean;
}

export interface DashboardData {
  user: {
    id: number;
  };
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  totalAvailable: number;
  readyToAssign: number;
  incomes: Transaction[];
  envelopes: Envelope[];
}
