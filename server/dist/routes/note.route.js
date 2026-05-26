import { Router } from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/note.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
// Protect all notes routes - require user authentication
router.use(protect);
// Route: /api/notes
router
    .route("/")
    .get(getNotes)
    .post(createNote);
// Route: /api/notes/:id
router
    .route("/:id")
    .put(updateNote)
    .delete(deleteNote);
export default router;
//# sourceMappingURL=note.route.js.map