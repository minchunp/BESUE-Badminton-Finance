import { Router } from "express";
import {
   getStatistics,
   getOverview,
   getRevenueTrend,
   getCostBreakdown,
   getSessionsTable,
} from "../controllers/stats.controller.js";

const router = Router();

// Legacy endpoint
router.get("/", getStatistics);

// New stats endpoints (all support ?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.get("/overview", getOverview);
router.get("/revenue-trend", getRevenueTrend);
router.get("/cost-breakdown", getCostBreakdown);
router.get("/sessions-table", getSessionsTable);

export default router;
