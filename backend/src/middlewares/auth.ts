import Logger from "@libs/logger";
import { verifyToken } from "@utils/jwt";
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    req.user = verifyToken(token); // Set userId from token payload
    next();
  } catch (error) {
    Logger.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
}
