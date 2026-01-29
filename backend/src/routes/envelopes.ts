import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const envelopes = await prisma.envelope.findMany({
    where: { userId: req.userId },
    include: {
      expenses: true,
    },
  });

  res.json(envelopes);
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, budget } = req.body as {
    name: string;
    budget: number;
  };

  const envelope = await prisma.envelope.create({
    data: {
      name,
      budget,
      userId: req.userId!,
    },
  });

  res.status(201).json(envelope);
});

// Update envelope
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, budget } = req.body as { name?: string; budget?: number };

  try {
    const updated = await prisma.envelope.updateMany({
      where: {
        id: Number(id),
        userId: req.userId!,
      },
      data: { name, budget },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: "Envelope not found" });
    }

    const envelope = await prisma.envelope.findUnique({
      where: { id: Number(id) },
    });

    res.json(envelope);
  } catch (err) {
    res.status(404).json({ error: "Envelope not found" });
  }
});

// Delete envelope
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
      const deleted = await prisma.envelope.deleteMany({
        where: {
          id: Number(id),
          userId: req.userId!,
        },
      });

      if (deleted.count === 0) {
        return res.status(404).json({ error: "Envelope not found" });
      }

      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: "Envelope not found" });
    }
  },
);

export default router;
