import request from "supertest";
import { prisma } from "../../libs/prisma";
import { app } from "../../app";
import { generateToken } from "@utils/jwt";
import { resetDb } from "@utils/resetDb";

describe("Envelopes API", () => {
  let userId: number;
  let token: string;
  let envelopeId: number;

  beforeAll(async () => {
    await resetDb();
    const user = await prisma.user.create({
      data: {
        email: "envelopeuser@example.com",
        password: "hashedpassword",
      },
    });

    userId = user.id;

    token = generateToken({ userId });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/envelopes", () => {
    it("should return empty array initially", async () => {
      const res = await request(app)
        .get("/api/envelopes")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("POST /api/envelopes", () => {
    it("should create a new envelope", async () => {
      const res = await request(app)
        .post("/api/envelopes")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test Envelope", budget: 200 });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("name", "Test Envelope");
      expect(res.body).toHaveProperty("budget", 200);
      expect(res.body).toHaveProperty("userId", userId);

      envelopeId = res.body.id;
    });
  });

  describe("GET after POST", () => {
    it("should return the created envelope", async () => {
      const res = await request(app)
        .get("/api/envelopes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty("id", envelopeId);
      expect(res.body[0]).toHaveProperty("name", "Test Envelope");
      expect(res.body[0]).toHaveProperty("budget", 200);
    });
  });

  describe("PUT /api/envelopes/:id", () => {
    it("should update the envelope", async () => {
      const res = await request(app)
        .put(`/api/envelopes/${envelopeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Envelope", budget: 500 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "Updated Envelope");
      expect(res.body).toHaveProperty("budget", 500);
    });
  });

  describe("DEACTIVE (no hard delete) if expense added", () => {
    it("should soft deactivate the envelope when an expense is added", async () => {
      // Add an expense to the envelope
      await prisma.expense.create({
        data: {
          envelopeId,
          description: "Test Expense",
          amount: 100,
          date: new Date(),
        },
      });
      // Attempt to delete the envelope (should soft deactivate)
      await request(app)
        .delete(`/api/envelopes/${envelopeId}`)
        .set("Authorization", `Bearer ${token}`);

      // Fetch the envelope to check if it's deactivated
      const resAfterExpense = await request(app)
        .get(`/api/envelopes`)
        .set("Authorization", `Bearer ${token}`);

      expect(resAfterExpense.status).toBe(200);
      expect(resAfterExpense.body[0]).toHaveProperty("isActive", false);
    });
  });

  describe("ACTIVE /api/envelopes/:id/activate", () => {
    it("should reactivate a soft-deactivated envelope", async () => {
      const res = await request(app)
        .patch(`/api/envelopes/${envelopeId}/activate`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/envelopes/:id", () => {
    it("should delete the envelope", async () => {
      // First delete the expense to allow hard deletion
      await prisma.expense.deleteMany({ where: { envelopeId } });

      const res = await request(app)
        .delete(`/api/envelopes/${envelopeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("should return empty array after deletion", async () => {
      const res = await request(app)
        .get("/api/envelopes")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("Auth checks", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/api/envelopes");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/api/envelopes")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });
});
