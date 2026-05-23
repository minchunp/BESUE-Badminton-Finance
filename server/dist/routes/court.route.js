import { Router } from "express";
import { getCourts, getCourtById, createCourt, updateCourt, deleteCourt, } from "../controllers/court.controller.js";
const router = Router();
router.get("/", getCourts);
router.get("/:id", getCourtById);
router.post("/", createCourt);
router.put("/:id", updateCourt);
router.delete("/:id", deleteCourt);
export default router;
//# sourceMappingURL=court.route.js.map