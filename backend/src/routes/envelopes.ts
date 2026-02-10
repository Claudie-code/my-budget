import { Router, Response, Request } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const envelopes = await prisma.envelope.findMany({
    where: { userId: req.user!.userId },
    include: {
      expenses: true,
    },
  });

  res.json(envelopes);
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { name, budget } = req.body as {
    name: string;
    budget: number;
  };

  const envelope = await prisma.envelope.create({
    data: {
      name,
      budget,
      userId: req.user!.userId,
    },
  });

  res.status(201).json(envelope);
});

// Update envelope
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, budget } = req.body as { name: string; budget: number };

  try {
    const updated = await prisma.envelope.updateMany({
      where: {
        id: Number(id),
        userId: req.user!.userId,
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

// DELETE /envelopes/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const envelope = await prisma.envelope.findUnique({
      where: { id: Number(id) },
      include: { expenses: true },
    });

    if (!envelope || envelope.userId !== userId) {
      return res.status(404).json({ error: "Envelope not found" });
    }

    if (envelope.expenses.length > 0) {
      // Has expenses → soft deactivate
      await prisma.envelope.update({
        where: { id: Number(id) },
        data: { isActive: false },
      });

      return res
        .status(200)
        .json({
          message: "Envelope has expenses and has been deactivated instead",
        });
    }

    // No expenses → hard delete
    await prisma.envelope.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
