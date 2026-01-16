import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth";
import envelopeRoutes from "./routes/envelopes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/envelopes", envelopeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
