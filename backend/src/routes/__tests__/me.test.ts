import request from "supertest";
import { prisma } from "../../libs/prisma";
import { app } from "../../app";
import { generateToken } from "@utils/jwt";
import { resetDb } from "@utils/resetDb";

describe("GET /api/user/me", () => {
  let userId: number;
  let token: string;

  // Create user
  beforeAll(async () => {
    await resetDb(); // Clear database before tests
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        password: "hashedpassword",
      },
    });
    userId = user.id;

    // Generate token
    token = generateToken({ userId });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return the current user with envelopes and expenses", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
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
