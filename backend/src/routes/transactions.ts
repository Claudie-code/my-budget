import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";
import { validateTransactionData } from "services/transactions.service";

const router = Router();

// GET /transactions
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: { envelope: true },
    });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST /transactions
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { description, amount, envelopeId, date } = req.body as {
    description: string;
    amount: number;
    envelopeId?: number;
    date: string | Date;
  };

  const errors = validateTransactionData({
    description,
    amount,
    envelopeId,
    date,
  });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  if (envelopeId) {
    const envelope = await prisma.envelope.findUnique({
      where: { id: envelopeId },
    });

    if (!envelope || envelope.userId !== req.user!.userId) {
      return res.status(404).json({ error: "Envelope not found" });
    }
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        envelopeId: envelopeId ?? null,
        userId: req.user!.userId,
      },
      include: { envelope: true },
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// PUT /transactions/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { description, amount, envelopeId, date } = req.body as {
    description: string;
    amount: number;
    envelopeId?: number;
    date: string | Date;
  };

  const errors = validateTransactionData({
    description,
    amount,
    envelopeId,
    date,
  });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  if (envelopeId) {
    const envelope = await prisma.envelope.findUnique({
      where: { id: envelopeId },
    });

    if (!envelope || envelope.userId !== req.user!.userId) {
      return res.status(404).json({ error: "Envelope not found" });
    }
  }

  try {
    const updated = await prisma.transaction.updateMany({
      where: { id, userId: req.user!.userId },
      data: {
        description,
        amount,
        envelopeId: envelopeId ?? null,
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { envelope: true },
    });

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE /transactions/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.transaction.deleteMany({
      where: { id, userId: req.user!.userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
