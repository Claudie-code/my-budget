import request from "supertest";
import { prisma } from "../../libs/prisma";
import { app } from "../../app";
import { generateToken } from "@utils/jwt";
import { resetDb } from "@utils/resetDb";

describe("Expenses API", () => {
  let userId: number;
  let token: string;
  let envelopeId: number;
  let expenseId: number;

  // Create user and envelope before tests
  beforeAll(async () => {
    await resetDb(); // Clear database before tests
    const user = await prisma.user.create({
      data: { email: "expenseuser@example.com", password: "hashedpassword" },
    });
    userId = user.id;

    token = generateToken({ userId });

    const envelope = await prisma.envelope.create({
      data: { name: "Test Envelope", budget: 500, userId },
    });
    envelopeId = envelope.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/expenses", () => {
    it("should return empty array initially", async () => {
      const res = await request(app)
        .get("/api/expenses")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /api/expenses", () => {
    it("should create a new expense", async () => {
      const res = await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Test Expense", amount: 50, envelopeId });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("description", "Test Expense");
      expect(res.body).toHaveProperty("amount", 50);
      expect(res.body).toHaveProperty("envelopeId", envelopeId);

      expenseId = res.body.id; // Save for PUT/DELETE tests
    });
  });

  describe("PUT /api/expenses/:id", () => {
    it("should update the expense", async () => {
      const res = await request(app)
        .put(`/api/expenses/${expenseId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Updated Expense", amount: 75 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("description", "Updated Expense");
      expect(res.body).toHaveProperty("amount", 75);
    });

    it("should return 404 if expense does not exist", async () => {
      const res = await request(app)
        .put(`/api/expenses/999999`)
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Nope", amount: 1 });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Expense not found");
    });
  });

  describe("DELETE /api/expenses/:id", () => {
    it("should delete the expense", async () => {
      const res = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(204);
    });

    it("should return 404 if expense already deleted", async () => {
      const res = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error", "Expense not found");
    });
  });

  describe("Auth checks", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/expenses");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/expenses")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });
});
