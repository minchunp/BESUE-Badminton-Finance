import mongoose, { Schema } from "mongoose";
const SessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
            isPresent: { type: Boolean, default: false },
            isPaid: { type: Boolean, default: false },
            paymentMethod: { type: String, enum: ["cash", "transfer"] },
            individualMatches: { type: [Number], default: [] },
            individualPayments: {
                type: [
                    {
                        isPaid: { type: Boolean, default: false },
                        paymentMethod: { type: String, enum: ["cash", "transfer"] },
                        customFee: { type: Number },
                        note: { type: String, default: "" },
                        isPresent: { type: Boolean, default: false },
                    },
                ],
                default: [],
            },
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
}, { timestamps: true });
export default mongoose.model("Session", SessionSchema);
//# sourceMappingURL=session.js.map