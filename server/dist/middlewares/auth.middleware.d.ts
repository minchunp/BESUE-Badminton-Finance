import { type Request, type Response, type NextFunction } from "express";
import { type IUser } from "../models/user.js";
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export declare const protect: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map