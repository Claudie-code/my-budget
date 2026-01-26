import request from "supertest";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { app } from "../../server";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

describe("GET /api/user/me", () => {
  let userId: number;
  let token: string;

  // Create user
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        password: "hashedpassword",
      },
    });
    userId = user.id;

    // Generate token
    token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

    // Create envelope and expense
    await prisma.envelope.create({
      data: {
        name: "Test Envelope",
        budget: 100,
        userId,
        expenses: {
          create: [{ description: "Test Expense", amount: 20 }],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.expense.deleteMany();
    await prisma.envelope.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return the current user with envelopes and expenses", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
    expect(res.body.envelopes).toHaveLength(1);
    expect(res.body.envelopes[0]).toHaveProperty("expenses");
    expect(res.body.envelopes[0].expenses[0]).toHaveProperty(
      "description",
      "Test Expense",
    );
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/user/me");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });

  it("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid token");
  });
});
