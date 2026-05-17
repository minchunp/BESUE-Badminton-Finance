import { Router } from "express";
import { createCourt, getCourts } from "../controllers/court.controller.js";

const router = Router();

router.get("/", getCourts);
router.post("/", createCourt);

export default router;
