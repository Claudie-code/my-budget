import { Router, Request, Response } from "express";
import dayjs from "dayjs";
import { authMiddleware } from "../middlewares/auth";
import { getDashboardData } from "../services/dashboard.service";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const monthQuery = (req.query.month as string) || dayjs().format("YYYY-MM");

    const startDate = dayjs(monthQuery + "-01")
      .startOf("month")
      .toDate();
    const endDate = dayjs(monthQuery + "-01")
      .endOf("month")
      .toDate();

    const dashboard = await getDashboardData({
      userId,
      startDate,
      endDate,
    });

    res.json({
      user: { id: userId },
      month: monthQuery,
      ...dashboard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
