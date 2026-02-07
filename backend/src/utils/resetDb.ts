import { prisma } from "../../src/libs/prisma";

export async function resetDb() {
  await prisma.expense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.envelope.deleteMany();
  await prisma.user.deleteMany();
}
