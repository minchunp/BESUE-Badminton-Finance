import { Router } from "express";
import { getShuttles, getShuttleById, createShuttle, updateShuttle, deleteShuttle, } from "../controllers/shuttle.controller.js";
const router = Router();
router.get("/", getShuttles);
router.get("/:id", getShuttleById);
router.post("/", createShuttle);
router.put("/:id", updateShuttle);
router.delete("/:id", deleteShuttle);
export default router;
//# sourceMappingURL=shuttle.route.js.map