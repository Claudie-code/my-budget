/*
  Warnings:

  - You are about to drop the column `budget` on the `Envelope` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Envelope` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Envelope` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Envelope" DROP COLUMN "budget",
DROP COLUMN "isActive";

-- CreateTable
CREATE TABLE "EnvelopeMonth" (
    "id" SERIAL NOT NULL,
    "envelopeId" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "budgeted" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "available" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvelopeMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetMonth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "income" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assigned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "toAssign" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetMonth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnvelopeMonth_envelopeId_month_idx" ON "EnvelopeMonth"("envelopeId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "EnvelopeMonth_envelopeId_month_key" ON "EnvelopeMonth"("envelopeId", "month");

-- CreateIndex
CREATE INDEX "BudgetMonth_userId_month_idx" ON "BudgetMonth"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetMonth_userId_month_key" ON "BudgetMonth"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Envelope_userId_name_key" ON "Envelope"("userId", "name");

-- AddForeignKey
ALTER TABLE "EnvelopeMonth" ADD CONSTRAINT "EnvelopeMonth_envelopeId_fkey" FOREIGN KEY ("envelopeId") REFERENCES "Envelope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetMonth" ADD CONSTRAINT "BudgetMonth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
