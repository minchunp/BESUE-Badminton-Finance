import Session from "../models/session.js";
import {} from "../middlewares/auth.middleware.js";
// ================================================================
// Helper: extract error message safely (no `any`)
// ================================================================
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
// ================================================================
// Helper: tính toán tài chính buổi host
// Có null-guard đầy đủ để không crash khi data thiếu
// ================================================================
const calculateSessionFinance = (sessionData) => {
    let totalRevenue = 0;
    let totalCash = 0;
    let totalTransfer = 0;
    const feeSettings = sessionData.feeSettings ?? { male: 0, female: 0 };
    for (const player of sessionData.players) {
        const individualPayments = player.individualPayments ?? [];
        if (individualPayments.length > 0) {
            // Per-individual calculation
            individualPayments.forEach((p, personIdx) => {
                if (p.isPaid) {
                    const fee = p.customFee !== undefined ? p.customFee : (personIdx < player.maleCount ? feeSettings.male : feeSettings.female);
                    totalRevenue += fee;
                    if (p.paymentMethod === "cash")
                        totalCash += fee;
                    if (p.paymentMethod === "transfer")
                        totalTransfer += fee;
                }
            });
        }
        else {
            // Fallback legacy calculation
            const playerTotal = player.maleCount * feeSettings.male + player.femaleCount * feeSettings.female;
            if (player.isPaid) {
                totalRevenue += playerTotal;
                if (player.paymentMethod === "cash")
                    totalCash += playerTotal;
                if (player.paymentMethod === "transfer")
                    totalTransfer += playerTotal;
            }
        }
    }
    // Null-guard: guard both court and shuttle fields
    const pricePerHour = sessionData.court?.pricePerHour ?? 0;
    const numberOfCourts = sessionData.court?.numberOfCourts ?? 1;
    const hours = sessionData.court?.hours ?? 0;
    const courtCost = pricePerHour * hours * numberOfCourts;
    const pricePerPiece = sessionData.shuttle?.pricePerPiece ?? 0;
    const usedQuantity = sessionData.shuttle?.usedQuantity ?? 0;
    const shuttleCost = pricePerPiece * usedQuantity;
    const profit = totalRevenue - (courtCost + shuttleCost);
    return { totalRevenue, totalCash, totalTransfer, courtCost, shuttleCost, profit };
};
// ================================================================
// POST /api/sessions — Tạo buổi host mới
// ================================================================
export const createSession = async (req, res) => {
    try {
        const { date, court, shuttle, feeSettings } = req.body;
        const newSession = new Session({
            status: "active",
            date,
            court,
            shuttle,
            feeSettings,
            players: [],
            currentStep: 2,
            userId: req.user._id,
        });
        const pricePerHour = court?.pricePerHour ?? 0;
        const numberOfCourts = court?.numberOfCourts ?? 1;
        const hours = court?.hours ?? 0;
        newSession.summary.courtCost = pricePerHour * hours * numberOfCourts;
        newSession.summary.profit = -newSession.summary.courtCost;
        await newSession.save();
        res.status(201).json({ success: true, data: newSession });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khởi tạo buổi host", error: getErrorMessage(error) });
    }
};
// ================================================================
// PUT /api/sessions/:id/players — Cập nhật danh sách người chơi
// ================================================================
export const updateSessionPlayers = async (req, res) => {
    try {
        const { id } = req.params;
        const { players, currentStep, feeSettings } = req.body;
        const currentSession = await Session.findOne({ _id: String(id), userId: req.user._id });
        if (!currentSession) {
            res.status(404).json({ success: false, message: "Không tìm thấy buổi host" });
            return;
        }
        if (feeSettings) {
            currentSession.feeSettings = feeSettings;
        }
        currentSession.players = players;
        currentSession.currentStep = typeof currentStep === "number" ? currentStep : 3;
        const updatedSummary = calculateSessionFinance(currentSession);
        currentSession.summary = updatedSummary;
        await currentSession.save();
        res.status(200).json({ success: true, data: currentSession });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi cập nhật danh sách người chơi", error: getErrorMessage(error) });
    }
};
// ================================================================
// PUT /api/sessions/:id/complete — Chốt báo cáo tài chính
// ================================================================
export const completeSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { usedQuantity, notes } = req.body;
        const currentSession = await Session.findOne({ _id: String(id), userId: req.user._id });
        if (!currentSession) {
            res.status(404).json({ success: false, message: "Không tìm thấy buổi host" });
            return;
        }
        currentSession.shuttle.usedQuantity = usedQuantity;
        if (notes !== undefined)
            currentSession.notes = notes;
        currentSession.status = "completed";
        currentSession.currentStep = 5;
        const finalSummary = calculateSessionFinance(currentSession);
        currentSession.summary = finalSummary;
        await currentSession.save();
        res.status(200).json({ success: true, data: currentSession });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi chốt báo cáo tài chính", error: getErrorMessage(error) });
    }
};
// ================================================================
// GET /api/sessions/:id — Lấy chi tiết buổi host
// ================================================================
export const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const foundSession = await Session.findOne({ _id: String(id), userId: req.user._id });
        if (!foundSession) {
            res.status(404).json({ success: false, message: "Không tìm thấy buổi host" });
            return;
        }
        res.status(200).json({ success: true, data: foundSession });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lấy chi tiết buổi host", error: getErrorMessage(error) });
    }
};
// ================================================================
// GET /api/sessions — Lấy toàn bộ danh sách buổi host
// ================================================================
export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: sessions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lấy danh sách buổi host", error: getErrorMessage(error) });
    }
};
//# sourceMappingURL=session.controller.js.map