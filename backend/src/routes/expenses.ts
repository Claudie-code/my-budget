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

  const envelope = await prisma.envelope.findFirst({
    where: {
      id: envelopeId,
      userId: req.userId,
    },
  });

  if (!envelope) {
    return res.status(404).json({ error: "Envelope not found" });
  }

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
    const result = await prisma.expense.updateMany({
      where: {
        id: Number(req.params.id),
        envelope: {
          userId: req.userId,
        },
      },
      data: {
        description,
        amount,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ description, amount });
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
      const result = await prisma.expense.deleteMany({
        where: {
          id: Number(id),
          envelope: {
            userId: req.userId,
          },
        },
      });

      if (result.count === 0) {
        return res.status(404).json({ error: "Expense not found" });
      }

      res.status(204).send();
    } catch {
      res.status(404).json({ error: "Expense not found" });
    }
  },
);

export default router;
