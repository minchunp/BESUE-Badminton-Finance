import type { Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
export declare const getCourts: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCourtById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createCourt: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateCourt: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteCourt: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=court.controller.d.ts.map