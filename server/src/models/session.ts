import mongoose, { Schema, type Document } from "mongoose";

export interface IPlayer {
   _id?: string;
   name: string;
   maleCount: number;
   femaleCount: number;
   isCheckedIn: boolean;
   isPaid: boolean;
   paymentMethod?: "cash" | "transfer";
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
}

const SessionSchema: Schema = new Schema(
   {
      status: { type: String, enum: ["draft", "active", "completed"], default: "draft" },
      date: { type: Date, required: true },
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
            name: { type: String, required: true },
            maleCount: { type: Number, default: 0 },
            femaleCount: { type: Number, default: 0 },
            isCheckedIn: { type: Boolean, default: false },
            isPaid: { type: Boolean, default: false },
            paymentMethod: { type: String, enum: ["cash", "transfer"] },
         },
      ],
      feeSettings: {
         male: { type: Number, default: 65000 },
         female: { type: Number, default: 55000 },
      },
      notes: { type: String },
      summary: {
         totalRevenue: { type: Number, default: 0 },
         totalCash: { type: Number, default: 0 },
         totalTransfer: { type: Number, default: 0 },
         courtCost: { type: Number, default: 0 },
         shuttleCost: { type: Number, default: 0 },
         profit: { type: Number, default: 0 },
      },
      currentStep: { type: Number, default: 1, enum: [1, 2, 3, 4, 5] },
   },
   { timestamps: true },
);

export default mongoose.model<ISession>("Session", SessionSchema);
