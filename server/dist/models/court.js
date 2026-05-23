import mongoose, { Schema } from "mongoose";
const TimeSlotSchema = new Schema({
    startHour: { type: String, required: true },
    endHour: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
}, { _id: false });
const CourtSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String },
    timeSlots: { type: [TimeSlotSchema], default: [] },
    description: { type: String },
}, { timestamps: true });
export default mongoose.model("Court", CourtSchema);
//# sourceMappingURL=court.js.map