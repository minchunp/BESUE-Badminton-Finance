import mongoose, { Schema } from "mongoose";
const NoteSchema = new Schema({
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
}, {
    timestamps: true,
});
export default mongoose.model("Note", NoteSchema);
//# sourceMappingURL=note.js.map