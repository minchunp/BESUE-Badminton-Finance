import mongoose, { type Document } from "mongoose";
export interface IPersonPayment {
    isPaid: boolean;
    paymentMethod?: "cash" | "transfer";
    customFee?: number;
    note?: string;
}
export interface IPlayer {
    _id?: string;
    name: string;
    maleCount: number;
    femaleCount: number;
    isCheckedIn: boolean;
    isPresent: boolean;
    isPaid: boolean;
    paymentMethod?: "cash" | "transfer";
    /** Per-person match count. Length = maleCount + femaleCount */
    individualMatches: number[];
    /** Per-person payment info. Length = maleCount + femaleCount */
    individualPayments: IPersonPayment[];
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
    userId: mongoose.Types.ObjectId;
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