import { prisma } from "../libs/prisma";

type DashboardParams = {
  userId: number;
  startDate: Date;
  endDate: Date;
};

export async function getDashboardData({
  userId,
  startDate,
  endDate,
}: DashboardParams) {
  const incomes = await prisma.transaction.findMany({
    where: {
      userId,
      envelopeId: null,
      amount: { gt: 0 },
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: "desc" },
  });

  const totalIncomeResult = await prisma.transaction.aggregate({
    where: {
      userId,
      envelopeId: null,
      amount: { gt: 0 },
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const totalIncome = totalIncomeResult._sum.amount ?? 0;

  const envelopes = await prisma.envelope.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          envelopeId: { not: null },
          date: { gte: startDate, lte: endDate },
        },
      },
      budgetMovements: true,
    },
  });

  const computedEnvelopes = envelopes.map((env) => {
    const spent = env.transactions.reduce((sum, t) => sum + t.amount, 0);

    const allocated = env.budgetMovements.reduce((sum, b) => sum + b.amount, 0);

    const available = env.budget + allocated - spent;

    return {
      id: env.id,
      name: env.name,
      budget: env.budget,
      spent,
      available,
      isOverspent: available < 0,
      isActive: env.isActive,
      transactions: env.transactions,
    };
  });

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
    incomes,
    envelopes: computedEnvelopes,
    totalIncome,
    totalBudgeted,
    totalSpent,
    totalAvailable,
    readyToAssign,
  };
}
