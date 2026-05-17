import { Router } from "express";
import { getStatistics } from "../controllers/stats.controller.js";

const router = Router();

router.get("/", getStatistics);

export default router;
