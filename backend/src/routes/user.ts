import { Router, Response, Request } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      envelopes: {
        select: {
          id: true,
          name: true,
          budget: true,
          expenses: {
            select: {
              id: true,
              description: true,
              amount: true,
              date: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

export default router;
