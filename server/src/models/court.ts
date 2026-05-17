import mongoose, { Schema, type Document } from "mongoose";

export interface ICourt extends Document {
   name: string;
   pricePerHour: number;
   description?: string;
}

const CourtSchema: Schema = new Schema(
   {
      name: { type: String, required: true },
      pricePerHour: { type: Number, required: true },
      description: { type: String },
   },
   { timestamps: true },
);

export default mongoose.model<ICourt>("Court", CourtSchema);
