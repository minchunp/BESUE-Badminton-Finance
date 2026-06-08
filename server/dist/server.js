import express, {} from "express";
import cors from "cors";
import mongoose from "mongoose";
import courtRoutes from "./routes/court.route.js";
import shuttleRoutes from "./routes/shuttle.route.js";
import sessionRoutes from "./routes/session.route.js";
import statsRoutes from "./routes/stats.route.js";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
import { config } from "./configs/env.config.js";
// ================================================================
// Express App Setup
// ================================================================
const app = express();
// CORS — chỉ cho phép origin từ biến môi trường
app.use(cors({
    origin: config.clientOrigin,
    credentials: true,
}));
app.use(express.json());
// ================================================================
// MongoDB Connection
// ================================================================
mongoose
    .connect(config.mongoUri)
    .then(() => console.log("✅ MongoDB connection established successfully!"))
    .catch((err) => {
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
app.get("/", (_req, res) => {
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
//# sourceMappingURL=server.js.map