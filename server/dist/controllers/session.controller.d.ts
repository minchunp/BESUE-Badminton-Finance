import type { Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
export declare const createSession: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateSessionPlayers: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const completeSession: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSessionById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getAllSessions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=session.controller.d.ts.map