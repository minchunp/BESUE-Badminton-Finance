import mongoose, { Schema } from "mongoose";
const ShuttleSchema = new Schema({
    name: { type: String, required: true },
    pricePerTube: { type: Number, required: true },
    pricePerPiece: { type: Number },
    quantityPerTube: { type: Number, required: true, default: 12 },
}, { timestamps: true });
ShuttleSchema.pre("save", async function () {
    if (this.pricePerTube && this.quantityPerTube) {
        this.pricePerPiece = Math.round(this.pricePerTube / this.quantityPerTube);
    }
});
export default mongoose.model("Shuttle", ShuttleSchema);
//# sourceMappingURL=shuttle.js.map