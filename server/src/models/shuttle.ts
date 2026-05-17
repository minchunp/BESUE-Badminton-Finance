import mongoose, { Schema, type CallbackWithoutResultAndOptionalError, type Document } from "mongoose";

export interface IShuttle extends Document {
   name: string;
   pricePerTube: number;
   pricePerPiece: number;
}

const ShuttleSchema: Schema = new Schema(
   {
      name: { type: String, required: true },
      pricePerTube: { type: Number, required: true },
      pricePerPiece: { type: Number },
   },
   { timestamps: true },
);

ShuttleSchema.pre<IShuttle>("save", async function () {
   if (this.pricePerTube) {
      this.pricePerPiece = Math.round(this.pricePerTube / 12);
   }
});

export default mongoose.model<IShuttle>("Shuttle", ShuttleSchema);
