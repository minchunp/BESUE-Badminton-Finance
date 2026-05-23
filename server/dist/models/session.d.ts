import mongoose, { type Document } from "mongoose";
export interface IPlayer {
    name: string;
    gender: "male" | "female";
    quantity: number;
    isPresent: boolean;
    paymentMethod: "cash" | "transfer";
    matchCount: number;
}
export interface ISession extends Document {
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
    summary: {
        totalRevenue: number;
        totalCast: number;
        totalTransfer: number;
        courtCost: number;
        shuttleCost: number;
        profit: number;
    };
    feeSettings: {
        male: number;
        female: number;
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