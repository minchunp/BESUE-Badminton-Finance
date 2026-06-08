import Court from "../models/court.js";
// ================================================================
// Helper: extract error message safely (no `any`)
// ================================================================
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
// GET /api/courts (Lấy danh sách sân)
export const getCourts = async (req, res) => {
    try {
        const courts = await Court.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Retrieved the court list successfully!",
            data: courts,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving the court list: " + getErrorMessage(error),
        });
    }
};
// GET /api/courts/:id (Lấy chi tiết sân)
export const getCourtById = async (req, res) => {
    try {
        const { id } = req.params;
        const court = await Court.findById(id);
        if (!court) {
            res.status(404).json({
                success: false,
                message: "Court not found!",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Retrieved court details successfully!",
            data: court,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving court details: " + getErrorMessage(error),
        });
    }
};
// POST /api/courts (Tạo sân mới)
export const createCourt = async (req, res) => {
    try {
        const { name, address, timeSlots, description } = req.body;
        if (!name) {
            res.status(400).json({
                success: false,
                message: "Court name is required!",
            });
            return;
        }
        const newCourt = new Court({
            name,
            address,
            timeSlots: timeSlots ?? [],
            description,
        });
        await newCourt.save();
        res.status(201).json({
            success: true,
            message: "The court was set up successfully!",
            data: newCourt,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while creating court: " + getErrorMessage(error),
        });
    }
};
// PUT /api/courts/:id (Cập nhật sân)
export const updateCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, timeSlots, description } = req.body;
        const updatedCourt = await Court.findByIdAndUpdate(id, { name, address, timeSlots, description }, { new: true, runValidators: true });
        if (!updatedCourt) {
            res.status(404).json({
                success: false,
                message: "Court not found for update!",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "The court was updated successfully!",
            data: updatedCourt,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while updating court: " + getErrorMessage(error),
        });
    }
};
// DELETE /api/courts/:id (Xóa sân)
export const deleteCourt = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourt = await Court.findByIdAndDelete(id);
        if (!deletedCourt) {
            res.status(404).json({
                success: false,
                message: "Court not found for deletion!",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "The court was deleted successfully!",
            data: deletedCourt,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while deleting court: " + getErrorMessage(error),
        });
    }
};
//# sourceMappingURL=court.controller.js.map