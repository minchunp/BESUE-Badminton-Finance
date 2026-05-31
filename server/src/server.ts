import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import courtRoutes from "./routes/court.route.js";
import shuttleRoutes from "./routes/shuttle.route.js";
import sessionRoutes from "./routes/session.route.js";
import statsRoutes from "./routes/stats.route.js";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";

// Load environment variables FIRST — trước tất cả mọi thứ
dotenv.config();

// ================================================================
// Startup Environment Validation
// Crash sớm với thông báo rõ ràng nếu thiếu biến bắt buộc
// ================================================================
const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"] as const;

for (const key of REQUIRED_ENV_VARS) {
   if (!process.env[key]) {
      console.error(`\n❌ [ENV ERROR] Biến môi trường bắt buộc "${key}" chưa được khai báo.`);
      console.error(`   → Sao chép server/.env.example thành server/.env và điền đầy đủ.\n`);
      process.exit(1);
   }
}

// ================================================================
// Typed Config Object — dùng chung toàn server thay vì gọi process.env mỗi chỗ
// ================================================================
export const config = {
   port: Number(process.env.PORT) || 5001,
   nodeEnv: process.env.NODE_ENV ?? "development",
   mongoUri: process.env.MONGODB_URI!,
   jwtSecret: process.env.JWT_SECRET!,
   jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "30d",
   clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
} as const;

// ================================================================
// Express App Setup
// ================================================================
const app: Application = express();

// CORS — chỉ cho phép origin từ biến môi trường
app.use(
   cors({
      origin: config.clientOrigin,
      credentials: true,
   }),
);

app.use(express.json());

// ================================================================
// MongoDB Connection
// ================================================================
mongoose
   .connect(config.mongoUri)
   .then(() => console.log("✅ MongoDB connection established successfully!"))
   .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("❌ MongoDB connection error:", msg);
      process.exit(1); // Crash sớm — không chạy server khi DB không kết nối được
   });

// ================================================================
// API Routes
// ================================================================
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/shuttles", shuttleRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/stats", statsRoutes);

// Health-check endpoint
app.get("/", (_req: Request, res: Response) => {
   res.json({
      status: "ok",
      message: "BESUE Badminton Finance API is running",
      env: config.nodeEnv,
   });
});

// ================================================================
// Start Server
// ================================================================
if (!process.env.VERCEL) {
   app.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port} [${config.nodeEnv}]`);
   });
}

export default app;
