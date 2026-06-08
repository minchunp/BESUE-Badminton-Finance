import { Router } from "express";
import { getStatistics, getOverview, getRevenueTrend, getCostBreakdown, getSessionsTable, } from "../controllers/stats.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(protect);
// Legacy endpoint
router.get("/", getStatistics);
// New stats endpoints (all support ?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.get("/overview", getOverview);
router.get("/revenue-trend", getRevenueTrend);
router.get("/cost-breakdown", getCostBreakdown);
router.get("/sessions-table", getSessionsTable);
export default router;
//# sourceMappingURL=stats.route.js.map