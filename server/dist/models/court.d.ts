import mongoose, { type Document } from "mongoose";
export interface ITimeSlot {
    startHour: string;
    endHour: string;
    pricePerHour: number;
}
export interface ICourt extends Document {
    name: string;
    address?: string;
    timeSlots: ITimeSlot[];
    description?: string;
    userId: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<ICourt, {}, {}, {}, mongoose.Document<unknown, {}, ICourt, {}, mongoose.DefaultSchemaOptions> & ICourt & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICourt>;
export default _default;
//# sourceMappingURL=court.d.ts.map