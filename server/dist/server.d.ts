import { type Application } from "express";
export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly mongoUri: string;
    readonly jwtSecret: string;
    readonly jwtExpiresIn: string;
    readonly clientOrigin: string;
};
declare const app: Application;
export default app;
//# sourceMappingURL=server.d.ts.map