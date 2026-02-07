import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";
import { generateToken } from "@utils/jwt";

const router = Router();

// REGISTER
router.post("/register", async (req, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ userId: user.id });

  res.status(201).json({ token });
});

// LOGIN
router.post("/login", async (req, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken({ userId: user.id });

  res.json({ token });
});

export default router;
