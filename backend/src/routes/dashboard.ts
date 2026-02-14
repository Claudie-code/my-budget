import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { authMiddleware } from "../middlewares/auth";
import { computeDashboardData } from "services/dashboard.service";
import { getMonthDateRange } from "@utils/date";

const router = Router();

/**
 * GET /dashboard?month=YYYY-MM
 * Return the dashboard data for the authenticated user, including:
 * - User info (id)
 * - Transactions for the specified month
 * - Envelopes with their transactions and budget movements
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const { year, month, startDate, endDate } = getMonthDateRange(
      req.query.month as string,
    );

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const envelopes = await prisma.envelope.findMany({
      where: { userId },
      include: { budgetMovements: true },
    });

    const dashboardData = computeDashboardData(transactions, envelopes);

    res.json({
      user: { id: userId },
      month: `${year}-${String(month).padStart(2, "0")}`,
      transactions,
      ...dashboardData,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "Invalid month value") {
      return res.status(400).json({ error: "Invalid month format" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
