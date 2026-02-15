export interface TransactionInput {
  description: string;
  amount: number;
  envelopeId?: number | null;
  date: string | Date;
}

export function validateTransactionData(tx: TransactionInput) {
  const errors: Record<string, string> = {};

  if (!tx.description || tx.description.trim() === "") {
    errors.description = "Description is required";
  }

  if (typeof tx.amount !== "number" || tx.amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (tx.envelopeId && tx.amount <= 0) {
    errors.envelopeId =
      "Expense transactions must have an amount greater than 0";
  }

  if (!tx.envelopeId && tx.amount <= 0) {
    errors.amount = "Income transactions must have an amount greater than 0";
  }

  const dateObj = new Date(tx.date);
  if (isNaN(dateObj.getTime())) {
    errors.date = "Invalid date";
  }

  return errors;
}
