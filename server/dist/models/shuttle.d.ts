import mongoose, { type Document } from "mongoose";
export interface IShuttle extends Document {
    name: string;
    pricePerTube: number;
    pricePerPiece: number;
    quantityPerTube: number;
}
declare const _default: mongoose.Model<IShuttle, {}, {}, {}, mongoose.Document<unknown, {}, IShuttle, {}, mongoose.DefaultSchemaOptions> & IShuttle & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IShuttle>;
export default _default;
//# sourceMappingURL=shuttle.d.ts.map