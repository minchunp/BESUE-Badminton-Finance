import mongoose, { Schema, type Document } from "mongoose";

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

const SessionSchema: Schema = new Schema(
   {
      date: { type: Date, default: Date.now },
      court: {
         courtId: { type: Schema.Types.ObjectId, ref: "Court" },
         name: String,
         pricePerHour: Number,
         numberOfCourts: { type: Number, default: 1 },
         hours: { type: Number, default: 2 },
      },
      shuttle: {
         shuttleId: { type: Schema.Types.ObjectId, ref: "Shuttle" },
         name: String,
         pricePerPiece: Number,
         usedQuantity: { type: Number, default: 0 },
      },
      players: [
         {
            name: String,
            gender: { type: String, enum: ["male", "female"] },
            quantity: { type: Number, default: 1 },
            isPresent: { type: Boolean, default: true },
            paymentMethod: { type: String, enum: ["cash", "transfer"], default: "transfer" },
            matchCount: { type: Number, default: 0 },
         },
      ],
      summary: {
         totalRevenue: Number,
         totalCash: Number,
         totalTransfer: Number,
         courtCost: Number,
         shuttleCost: Number,
         profit: Number,
      },
      feeSettings: {
         male: { type: Number, default: 65000 },
         female: { type: Number, default: 55000 },
      },
   },
   { timestamps: true },
);

export default mongoose.model<ISession>("Session", SessionSchema);
