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
}

export interface DashboardData {
  user: {
    id: number;
  };
  incomes: Income[];
  envelopes: Envelope[];
}
