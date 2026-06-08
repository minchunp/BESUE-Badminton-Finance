import { Router } from "express";
import { getShuttles, getShuttleById, createShuttle, updateShuttle, deleteShuttle, } from "../controllers/shuttle.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(protect);
router.get("/", getShuttles);
router.get("/:id", getShuttleById);
router.post("/", createShuttle);
router.put("/:id", updateShuttle);
router.delete("/:id", deleteShuttle);
export default router;
//# sourceMappingURL=shuttle.route.js.map