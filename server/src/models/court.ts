import mongoose, { Schema, type Document } from "mongoose";

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

const TimeSlotSchema = new Schema<ITimeSlot>(
   {
      startHour: { type: String, required: true },
      endHour: { type: String, required: true },
      pricePerHour: { type: Number, required: true },
   },
   { _id: false },
);

const CourtSchema = new Schema<ICourt>(
   {
      name: { type: String, required: true },
      address: { type: String },
      timeSlots: { type: [TimeSlotSchema], default: [] },
      description: { type: String },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
   },
   { timestamps: true },
);

export default mongoose.model<ICourt>("Court", CourtSchema);
