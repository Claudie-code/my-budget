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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/envelopes", envelopeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
