import { Router } from "express";
import { createSession, getSessions } from "../controllers/session.controller.js";

const router = Router();

router.get("/", getSessions);
router.post("/", createSession);

export default router;
