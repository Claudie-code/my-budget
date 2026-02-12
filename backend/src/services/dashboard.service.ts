import type { Envelope, Expense, Income } from "generated/prisma/client";

export function computeEnvelope(envelope: Envelope & { expenses: Expense[] }) {
  const spent = envelope.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const available = envelope.budget - spent;

  return {
    ...envelope,
    spent,
    available,
    isOverspent: available < 0,
  };
}

export function computeDashboardData(
  incomes: Income[],
  envelopes: (Envelope & { expenses: Expense[] })[],
) {
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  const computedEnvelopes = envelopes.map(computeEnvelope);

  const totalBudgeted = computedEnvelopes.reduce(
    (sum, env) => sum + env.budget,
    0,
  );

  const totalSpent = computedEnvelopes.reduce((sum, env) => sum + env.spent, 0);

  const totalAvailable = computedEnvelopes.reduce(
    (sum, env) => sum + env.available,
    0,
  );

  const readyToAssign = totalIncome - totalBudgeted;

  return {
    totalIncome,
    totalBudgeted,
    totalSpent,
    totalAvailable,
    readyToAssign,
    envelopes: computedEnvelopes,
  };
}
