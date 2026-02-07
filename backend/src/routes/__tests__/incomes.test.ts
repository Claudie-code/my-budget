import request from "supertest";
import { prisma } from "../../libs/prisma";
import { app } from "../../app";
import { generateToken } from "@utils/jwt";
import { resetDb } from "@utils/resetDb";

describe("Income API", () => {
  let userId: number;
  let token: string;
  let incomeId: number;

  beforeAll(async () => {
    await resetDb(); // Clear database before tests
    const user = await prisma.user.create({
      data: {
        email: "incomeuser@example.com",
        password: "hashedpassword",
      },
    });
    userId = user.id;

    token = generateToken({ userId });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/incomes", () => {
    it("should return empty array initially", async () => {
      const res = await request(app)
        .get("/api/incomes")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /api/incomes", () => {
    it("should create a new income", async () => {
      const res = await request(app)
        .post("/api/incomes")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Salary", amount: 2000 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("description", "Salary");
      expect(res.body).toHaveProperty("amount", 2000);
      expect(res.body).toHaveProperty("userId", userId);

      incomeId = res.body.id;
    });
  });

  describe("GET after POST", () => {
    it("should return the created income", async () => {
      const res = await request(app)
        .get("/api/incomes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("id", incomeId);
      expect(res.body[0]).toHaveProperty("description", "Salary");
      expect(res.body[0]).toHaveProperty("amount", 2000);
    });
  });

  describe("PUT /api/incomes/:id", () => {
    it("should update the income if owned by user", async () => {
      const res = await request(app)
        .put(`/api/incomes/${incomeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Updated Salary", amount: 2500 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("description", "Updated Salary");
      expect(res.body).toHaveProperty("amount", 2500);
    });

    it("should return 404 if income not owned by user", async () => {
      const otherUser = await prisma.user.create({
        data: { email: "other@example.com", password: "pass" },
      });
      const otherIncome = await prisma.income.create({
        data: {
          description: "Other Income",
          amount: 500,
          userId: otherUser.id,
        },
      });

      const res = await request(app)
        .put(`/api/incomes/${otherIncome.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Hack", amount: 0 });

      expect(res.status).toBe(404);

      await prisma.income.delete({ where: { id: otherIncome.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("DELETE /api/incomes/:id", () => {
    it("should delete the income if owned by user", async () => {
      const res = await request(app)
        .delete(`/api/incomes/${incomeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return 404 if income not owned by user", async () => {
      const otherUser = await prisma.user.create({
        data: { email: "other2@example.com", password: "pass" },
      });
      const otherIncome = await prisma.income.create({
        data: {
          description: "Other Income",
          amount: 500,
          userId: otherUser.id,
        },
      });

      const res = await request(app)
        .delete(`/api/incomes/${otherIncome.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);

      await prisma.income.delete({ where: { id: otherIncome.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("Auth checks", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/incomes");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/incomes")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });
});
