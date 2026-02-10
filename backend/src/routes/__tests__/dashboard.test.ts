import request from "supertest";
import { resetDb } from "@utils/resetDb";
import { generateToken } from "@utils/jwt";
import { prisma } from "@libs/prisma";
import { app } from "app";

describe("Dashboard API", () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    await resetDb();
    const user = await prisma.user.create({
      data: { email: "dashboarduser@example.com", password: "password123" },
    });
    userId = user.id;
    token = generateToken({ userId });

    // Create some incomes for the user
    await prisma.income.createMany({
      data: [
        {
          userId,
          description: "Salary",
          amount: 2000,
          date: new Date("2026-02-01"),
        },
        {
          userId,
          description: "Bonus",
          amount: 500,
          date: new Date("2026-02-15"),
        },
        {
          userId,
          description: "Old Income",
          amount: 100,
          date: new Date("2026-01-20"),
        }, // not in the month filtered
      ],
    });

    // Create envelopes and expenses for the user
    const envelope1 = await prisma.envelope.create({
      data: {
        userId,
        name: "Food",
        budget: 500,
      },
    });

    await prisma.expense.createMany({
      data: [
        {
          envelopeId: envelope1.id,
          description: "Groceries",
          amount: 50,
          date: new Date("2026-02-05"),
        },
        {
          envelopeId: envelope1.id,
          description: "Restaurant",
          amount: 30,
          date: new Date("2026-02-10"),
        },
        {
          envelopeId: envelope1.id,
          description: "Old Expense",
          amount: 20,
          date: new Date("2026-01-25"),
        }, // not in the month filtered
      ],
    });

    const envelope2 = await prisma.envelope.create({
      data: {
        userId,
        name: "Entertainment",
        budget: 200,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/dashboard", () => {
    it("should return dashboard data for the current month", async () => {
      const res = await request(app)
        .get("/api/dashboard?month=2026-02")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("id", userId);

      // Incomes filtered by date
      expect(res.body.incomes).toHaveLength(2);
      expect(res.body.incomes.map((i: any) => i.description)).toEqual(
        expect.arrayContaining(["Salary", "Bonus"]),
      );

      // Envelopes filtered by isActive and userId
      expect(res.body.envelopes).toHaveLength(2);
      expect(res.body.envelopes[0]).toHaveProperty("name", "Food");
      expect(res.body.envelopes[1]).toHaveProperty("name", "Entertainment");

      // Expenses filtered by date
      expect(res.body.envelopes[0].expenses).toHaveLength(2);
      expect(
        res.body.envelopes[0].expenses.map((e: any) => e.description),
      ).toEqual(expect.arrayContaining(["Groceries", "Restaurant"]));
    });

    it("should return empty arrays if no incomes or envelopes in that month", async () => {
      const res = await request(app)
        .get("/api/dashboard?month=2025-12")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.incomes).toHaveLength(0);
      expect(res.body.envelopes).toHaveLength(2); // both envelopes exist but no expenses in the filtered month
      expect(res.body.envelopes[0].expenses).toHaveLength(0);
      expect(res.body.envelopes[1].expenses).toHaveLength(0);
    });
  });

  describe("Auth checks", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/dashboard?month=2026-02");
      expect(res.status).toBe(401);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/dashboard?month=2026-02")
        .set("Authorization", `Bearer wrongtoken`);
      expect(res.status).toBe(401);
    });
  });
});
