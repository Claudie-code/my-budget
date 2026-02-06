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

router.patch("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { description, amount } = req.body as {
    description?: string;
    amount?: number;
  };

  const income = await prisma.income.updateMany({
    where: { id, userId: req.user!.userId },
    data: { description, amount },
  });

  res.json(income);
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await prisma.income.deleteMany({
    where: { id, userId: req.user!.userId },
  });

  res.status(204).send();
});

export default router;
