import Logger from "@lib/logger";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "";

export interface UserPayload {
  userId: number;
  //   role: string;
}

// Generate a JWT for a user
export const generateToken = (userPayload: UserPayload) => {
  if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1h" });
};

// Verify a JWT
export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as UserPayload;
  } catch (error) {
    Logger.error(error);
    throw new Error("Invalid token");
  }
};
