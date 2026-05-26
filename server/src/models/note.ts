import mongoose, { Schema, type Document } from "mongoose";

export interface INote extends Document {
   title: string;
   content: string;
   userId: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         default: "Ghi chú mới",
      },
      content: {
         type: String,
         default: "",
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   {
      timestamps: true,
   },
);

export default mongoose.model<INote>("Note", NoteSchema);
