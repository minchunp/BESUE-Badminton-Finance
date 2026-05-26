import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
// Route: /api/auth/register
router.post("/register", register);
// Route: /api/auth/login
router.post("/login", login);
// Route: /api/auth/me (Protected route)
router.get("/me", protect, getMe);
export default router;
//# sourceMappingURL=auth.route.js.map