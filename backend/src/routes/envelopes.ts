import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const envelopes = await prisma.envelope.findMany({
    where: { userId: req.userId },
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

export default router;
