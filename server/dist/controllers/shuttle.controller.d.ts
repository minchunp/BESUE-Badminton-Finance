import type { Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
export declare const getShuttles: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getShuttleById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createShuttle: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateShuttle: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteShuttle: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=shuttle.controller.d.ts.map