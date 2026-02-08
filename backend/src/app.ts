import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth";
import envelopeRoutes from "./routes/envelopes";
import expenseRoutes from "./routes/expenses";
import incomeRoutes from "./routes/incomes";
import userRoutes from "./routes/user";
import dashboardRoutes from "./routes/dashboard";

export const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/envelopes", envelopeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
