import { Router } from "express";
import { createSession, updateSessionPlayers, completeSession } from "../controllers/session.controller.js";

const router = Router();

router.post("/", createSession);
router.put("/:id/players", updateSessionPlayers);
router.put("/:id/complete", completeSession);

export default router;
