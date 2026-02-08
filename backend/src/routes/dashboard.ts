import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * GET /dashboard?month=YYYY-MM
 * Return the dashboard data for the authenticated user, including:
 * - User info (id)
 * - Incomes for the specified month
 * - Active envelopes with their expenses for the specified month
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const monthQuery = req.query.month as string; // "2026-02"
    const [year, month] = monthQuery
      ? monthQuery.split("-").map(Number)
      : [new Date().getFullYear(), new Date().getMonth() + 1];

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const incomes = await prisma.income.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
      },
    });

    const envelopes = await prisma.envelope.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        budget: true,
        expenses: {
          where: { date: { gte: startDate, lte: endDate } },
          select: {
            id: true,
            description: true,
            amount: true,
            date: true,
          },
        },
      },
    });

    res.json({
      user: { id: userId },
      incomes,
      envelopes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
