import type { Request, Response } from "express";
export declare const createSession: (req: Request, res: Response) => Promise<void>;
export declare const updateSessionPlayers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSessionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllSessions: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=session.controller.d.ts.map