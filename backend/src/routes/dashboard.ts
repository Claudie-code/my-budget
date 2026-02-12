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
 * - Incomes for the specified month
 * - Envelopes with their expenses for the specified month
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const { year, month, startDate, endDate } = getMonthDateRange(
      req.query.month as string,
    );

    const incomes = await prisma.income.findMany({
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
      include: {
        expenses: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const dashboardData = computeDashboardData(incomes, envelopes);

    res.json({
      user: { id: userId },
      month: `${year}-${String(month).padStart(2, "0")}`,
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
