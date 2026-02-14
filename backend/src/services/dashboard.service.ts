import type {
  Envelope,
  BudgetMovement,
  Transaction,
} from "generated/prisma/client";

type EnvelopeWithMovements = Envelope & { budgetMovements: BudgetMovement[] };

export function computeEnvelope(
  envelope: EnvelopeWithMovements,
  transactions: Transaction[],
) {
  const envelopeTransactions = transactions.filter(
    (t) => t.envelopeId === envelope.id,
  );

  const spent = envelopeTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeFromMovements = envelopeTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetMovementSum = envelope.budgetMovements.reduce(
    (sum, m) => sum + m.amount,
    0,
  );

  const totalBudget = envelope.budget + budgetMovementSum + incomeFromMovements;

  const available = totalBudget - spent;

  return {
    ...envelope,
    spent,
    totalBudget,
    available,
    isOverspent: available < 0,
  };
}

export function computeDashboardData(
  transactions: Transaction[],
  envelopes: EnvelopeWithMovements[],
) {
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const computedEnvelopes = envelopes.map((env) =>
    computeEnvelope(env, transactions),
  );

  const totalBudgeted = computedEnvelopes.reduce(
    (sum, env) => sum + env.totalBudget,
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
