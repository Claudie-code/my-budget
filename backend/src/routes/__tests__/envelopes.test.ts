import request from "supertest";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { app } from "../../server";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

describe("Envelopes API", () => {
  let userId: number;
  let token: string;
  let envelopeId: number;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "envelopeuser@example.com",
        password: "hashedpassword",
      },
    });
    userId = user.id;

    token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
  });

  afterAll(async () => {
    await prisma.expense.deleteMany({ where: { envelope: { userId } } });
    await prisma.envelope.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
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

  describe("DELETE /api/envelopes/:id", () => {
    it("should delete the envelope", async () => {
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
