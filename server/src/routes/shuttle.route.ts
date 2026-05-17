import { Router } from "express";
import { createShuttle, getShuttles } from "../controllers/shuttle.controller.js";

const router = Router();

router.get("/", getShuttles);
router.post("/", createShuttle);

export default router;
