import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all expenses for user's envelopes
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const expenses = await prisma.expense.findMany({
    where: {
      envelope: {
        userId: req.userId,
      },
    },
  });
  res.json(expenses);
});

// Create a new expense
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { description, amount, envelopeId } = req.body as {
    description: string;
    amount: number;
    envelopeId: number;
  };

  const expense = await prisma.expense.create({
    data: {
      description,
      amount,
      envelopeId,
    },
  });

  res.status(201).json(expense);
});

// Update an expense
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { description, amount } = req.body as {
    description?: string;
    amount?: number;
  };

  try {
    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: { description, amount },
    });
    res.json(expense);
  } catch {
    res.status(404).json({ error: "Expense not found" });
  }
});

// Delete an expense
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.expense.delete({
        where: { id: Number(id) },
      });
      res.status(204).send();
    } catch {
      res.status(404).json({ error: "Expense not found" });
    }
  },
);

export default router;
