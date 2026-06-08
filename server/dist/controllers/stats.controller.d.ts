import { type Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
export declare const getOverview: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getRevenueTrend: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCostBreakdown: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSessionsTable: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getStatistics: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=stats.controller.d.ts.map