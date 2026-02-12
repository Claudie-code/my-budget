export interface Income {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export interface Envelope {
  id: number;
  name: string;
  budget: number;
  expenses: Expense[];
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
  incomes: Income[];
  envelopes: Envelope[];
}
