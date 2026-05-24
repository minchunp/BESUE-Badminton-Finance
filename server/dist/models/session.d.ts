import mongoose, { type Document } from "mongoose";
export interface IPlayer {
    _id?: string;
    name: string;
    maleCount: number;
    femaleCount: number;
    isCheckedIn: boolean;
    isPaid: boolean;
    paymentMethod?: "cash" | "transfer";
}
export interface ISession extends Document {
    status: "draft" | "active" | "completed";
    date: Date;
    court: {
        courtId: mongoose.Types.ObjectId;
        name: string;
        pricePerHour: number;
        numberOfCourts: number;
        hours: number;
    };
    shuttle: {
        shuttleId: mongoose.Types.ObjectId;
        name: string;
        pricePerPiece: number;
        usedQuantity: number;
    };
    players: IPlayer[];
    feeSettings: {
        male: number;
        female: number;
    };
    notes?: string;
    currentStep?: number;
    summary: {
        totalRevenue: number;
        totalCash: number;
        totalTransfer: number;
        courtCost: number;
        shuttleCost: number;
        profit: number;
    };
}
declare const _default: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, mongoose.DefaultSchemaOptions> & ISession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISession>;
export default _default;
//# sourceMappingURL=session.d.ts.map