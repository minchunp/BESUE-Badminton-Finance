import { Router } from "express";
import { createSession, updateSessionPlayers, completeSession, getSessionById, getAllSessions } from "../controllers/session.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(protect);
router.post("/", createSession);
router.get("/", getAllSessions);
router.put("/:id/players", updateSessionPlayers);
router.put("/:id/complete", completeSession);
router.get("/:id", getSessionById);
export default router;
//# sourceMappingURL=session.route.js.map