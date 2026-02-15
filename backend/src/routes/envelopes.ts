import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// GET /envelopes
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const envelopes = await prisma.envelope.findMany({
      where: { userId },
      include: {
        transactions: true,
        budgetMovements: true,
      },
    });

    const enriched = envelopes.map((env) => {
      const spent = env.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const allocated = env.budgetMovements.reduce(
        (sum, b) => sum + b.amount,
        0,
      );

      const available = env.budget + allocated - spent;

      return {
        ...env,
        spent,
        available,
        isOverspent: available < 0,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /envelopes
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { name, budget } = req.body as { name: string; budget: number };
  try {
    const envelope = await prisma.envelope.create({
      data: {
        name,
        budget,
        userId: req.user!.userId,
      },
    });

    res.status(201).json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /envelopes/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, budget } = req.body as { name: string; budget: number };
  const userId = req.user!.userId;

  try {
    const updated = await prisma.envelope.updateMany({
      where: { id: Number(id), userId },
      data: { name, budget },
    });

    if (updated.count === 0)
      return res.status(404).json({ error: "Envelope not found" });

    const envelope = await prisma.envelope.findUnique({
      where: { id: Number(id) },
      include: { transactions: true, budgetMovements: true },
    });
    res.json(envelope);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /envelopes/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const envelope = await prisma.envelope.findUnique({
      where: { id: Number(id) },
      include: { transactions: true, budgetMovements: true },
    });

    if (!envelope || envelope.userId !== userId)
      return res.status(404).json({ error: "Envelope not found" });

    if (
      envelope.transactions.length > 0 ||
      envelope.budgetMovements.length > 0
    ) {
      await prisma.envelope.update({
        where: { id: Number(id) },
        data: { isActive: false },
      });
      return res.status(200).json({ action: "DEACTIVATED" });
    }

    await prisma.envelope.delete({ where: { id: Number(id) } });
    return res.status(204).json({ action: "DELETED" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /envelopes/:id/activate
router.patch(
  "/:id/activate",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    try {
      const envelope = await prisma.envelope.findUnique({
        where: { id: Number(id) },
      });
      if (!envelope || envelope.userId !== userId)
        return res.status(404).json({ error: "Envelope not found" });

      const updated = await prisma.envelope.update({
        where: { id: Number(id) },
        data: { isActive: true },
      });
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

export default router;
