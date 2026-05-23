import mongoose, { Schema, type Document } from "mongoose";

export interface IShuttle extends Document {
   name: string;
   pricePerTube: number;
   pricePerPiece: number;
   quantityPerTube: number;
}

const ShuttleSchema = new Schema<IShuttle>(
   {
      name: { type: String, required: true },
      pricePerTube: { type: Number, required: true },
      pricePerPiece: { type: Number },
      quantityPerTube: { type: Number, required: true, default: 12 },
   },
   { timestamps: true }
);

ShuttleSchema.pre<IShuttle>("save", async function () {
   if (this.pricePerTube && this.quantityPerTube) {
      this.pricePerPiece = Math.round(this.pricePerTube / this.quantityPerTube);
   }
});

export default mongoose.model<IShuttle>("Shuttle", ShuttleSchema);
