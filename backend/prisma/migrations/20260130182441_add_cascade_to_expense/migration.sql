-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_envelopeId_fkey";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_envelopeId_fkey" FOREIGN KEY ("envelopeId") REFERENCES "Envelope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
