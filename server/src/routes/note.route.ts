import { Router } from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/note.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all notes routes - require user authentication
router.use(protect as any);

// Route: /api/notes
router
   .route("/")
   .get(getNotes as any)
   .post(createNote as any);

// Route: /api/notes/:id
router
   .route("/:id")
   .put(updateNote as any)
   .delete(deleteNote as any);

export default router;
