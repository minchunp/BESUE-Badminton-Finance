import mongoose, { type Document } from "mongoose";
export interface INote extends Document {
    title: string;
    content: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<INote, {}, {}, {}, mongoose.Document<unknown, {}, INote, {}, mongoose.DefaultSchemaOptions> & INote & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INote>;
export default _default;
//# sourceMappingURL=note.d.ts.map