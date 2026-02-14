import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// GET /transactions
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  res.json(transactions);
});

// POST /transactions
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { description, amount, envelopeId, type } = req.body as {
    description: string;
    amount: number;
    envelopeId: number;
    type: "INCOME" | "EXPENSE";
  };

  const envelope = await prisma.envelope.findUnique({
    where: { id: envelopeId },
  });
  if (!envelope || envelope.userId !== req.user!.userId)
    return res.status(404).json({ error: "Envelope not found" });

  const transaction = await prisma.transaction.create({
    data: {
      description,
      amount,
      envelopeId,
      type,
      userId: req.user!.userId,
    },
  });

  res.status(201).json(transaction);
});

// PUT /transactions/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { description, amount } = req.body as {
    description: string;
    amount: number;
  };
  const id = Number(req.params.id);

  const updated = await prisma.transaction.updateMany({
    where: { id, userId: req.user!.userId },
    data: { description, amount },
  });

  if (updated.count === 0)
    return res.status(404).json({ error: "Transaction not found" });

  const transaction = await prisma.transaction.findUnique({ where: { id } });
  res.json(transaction);
});

// DELETE /transactions/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const deleted = await prisma.transaction.deleteMany({
    where: { id, userId: req.user!.userId },
  });

  if (deleted.count === 0)
    return res.status(404).json({ error: "Transaction not found" });

  res.status(204).send();
});

export default router;
