import { type Request, type Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map