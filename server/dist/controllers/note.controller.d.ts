import { type Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
export declare const getNotes: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createNote: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateNote: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteNote: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=note.controller.d.ts.map