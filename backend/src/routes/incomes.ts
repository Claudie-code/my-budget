import { Router, Response, Request } from "express";
import { authMiddleware } from "../middlewares/auth";
import { prisma } from "../libs/prisma";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const incomes = await prisma.income.findMany({
    where: { userId: req.user!.userId },
  });
  res.json(incomes);
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { description, amount } = req.body as {
    description: string;
    amount: number;
  };

  const income = await prisma.income.create({
    data: {
      description,
      amount,
      userId: req.user!.userId,
    },
  });

  res.status(201).json(income);
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, amount } = req.body as {
    description: string;
    amount: number;
  };

  try {
    const updated = await prisma.income.updateMany({
      where: {
        id: Number(id),
        userId: req.user!.userId,
      },
      data: { description, amount },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: "Income not found" });
    }

    const income = await prisma.income.findUnique({
      where: { id: Number(id) },
    });

    res.json(income);
  } catch (err) {
    res.status(500).json({ error: "Failed to update income" });
  }
});

// DELETE /api/income/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.income.deleteMany({
      where: {
        id: Number(id),
        userId: req.user!.userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete income" });
  }
});

export default router;
