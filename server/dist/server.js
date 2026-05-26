import express, {} from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courtRoutes from "./routes/court.route.js";
import shuttleRoutes from "./routes/shuttle.route.js";
import sessionRoutes from "./routes/session.route.js";
import statsRoutes from "./routes/stats.route.js";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const dbUri = process.env.MONGODB_URI || "";
mongoose
    .connect(dbUri)
    .then(() => console.log("The MongoDB connection has been successfully established!"))
    .catch((err) => console.error("MongoDB connection error: ", err));
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/shuttles", shuttleRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/stats", statsRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to the BESUE Badminton Finance API!");
});
app.listen(PORT, () => {
    console.log(`🚀 The server is currently running at: http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map