import {} from "express";
import mongoose from "mongoose";
import Session from "../models/session.js";
import {} from "../middlewares/auth.middleware.js";
// ================================================================
// Helpers
// ================================================================
/** Parse query params `from` / `to` into Date objects.
 *  Defaults: to = now, from = 30 days ago.
 */
const parseDateRange = (req) => {
    const now = new Date();
    const to = req.query.to ? new Date(req.query.to) : now;
    // Default 30 days
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    const from = req.query.from ? new Date(req.query.from) : defaultFrom;
    // Ensure `to` covers end of day
    to.setHours(23, 59, 59, 999);
    from.setHours(0, 0, 0, 0);
    return { from, to };
};
/** Calculate the same-length period immediately before `from` */
const getPreviousPeriod = (from, to) => {
    const diff = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime() - 1);
    const prevFrom = new Date(prevTo.getTime() - diff);
    return { prevFrom, prevTo };
};
// ================================================================
// 1. Overview — KPI tổng quan
// ================================================================
export const getOverview = async (req, res) => {
    try {
        const { from, to } = parseDateRange(req);
        const { prevFrom, prevTo } = getPreviousPeriod(from, to);
        const userId = new mongoose.Types.ObjectId(String(req.user._id));
        const matchCurrent = {
            status: "completed",
            date: { $gte: from, $lte: to },
            userId,
        };
        const matchPrev = {
            status: "completed",
            date: { $gte: prevFrom, $lte: prevTo },
            userId,
        };
        const aggregatePeriod = async (match) => {
            const result = await Session.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$summary.totalRevenue" },
                        totalCash: { $sum: "$summary.totalCash" },
                        totalTransfer: { $sum: "$summary.totalTransfer" },
                        courtCost: { $sum: "$summary.courtCost" },
                        shuttleCost: { $sum: "$summary.shuttleCost" },
                        totalProfit: { $sum: "$summary.profit" },
                        sessionCount: { $sum: 1 },
                        totalShuttleUsed: { $sum: "$shuttle.usedQuantity" },
                    },
                },
            ]);
            return (result[0] ?? {
                totalRevenue: 0,
                totalCash: 0,
                totalTransfer: 0,
                courtCost: 0,
                shuttleCost: 0,
                totalProfit: 0,
                sessionCount: 0,
                totalShuttleUsed: 0,
            });
        };
        const [current, prev] = await Promise.all([aggregatePeriod(matchCurrent), aggregatePeriod(matchPrev)]);
        const totalCost = (current.courtCost ?? 0) + (current.shuttleCost ?? 0);
        const profitMargin = current.totalRevenue > 0 ? Math.round((current.totalProfit / current.totalRevenue) * 100) : 0;
        const revenueChange = prev.totalRevenue > 0 ? Math.round(((current.totalRevenue - prev.totalRevenue) / prev.totalRevenue) * 100) : null;
        const profitChange = prev.totalProfit > 0 ? Math.round(((current.totalProfit - prev.totalProfit) / Math.abs(prev.totalProfit)) * 100) : null;
        res.status(200).json({
            success: true,
            data: {
                totalRevenue: current.totalRevenue,
                totalCash: current.totalCash,
                totalTransfer: current.totalTransfer,
                courtCost: current.courtCost,
                shuttleCost: current.shuttleCost,
                totalCost,
                totalProfit: current.totalProfit,
                profitMargin,
                sessionCount: current.sessionCount,
                totalShuttleUsed: current.totalShuttleUsed,
                revenueChange,
                profitChange,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lấy dữ liệu thống kê tổng quan", error });
    }
};
// ================================================================
// 2. Revenue Trend — xu hướng thu/chi theo thời gian
// ================================================================
export const getRevenueTrend = async (req, res) => {
    try {
        const { from, to } = parseDateRange(req);
        const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
        const userId = new mongoose.Types.ObjectId(String(req.user._id));
        // Decide grouping format: daily ≤ 90 days, monthly otherwise
        const groupFormat = diffDays <= 90 ? "%Y-%m-%d" : "%Y-%m";
        const trend = await Session.aggregate([
            {
                $match: {
                    status: "completed",
                    date: { $gte: from, $lte: to },
                    userId,
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: "$date" } },
                    revenue: { $sum: "$summary.totalRevenue" },
                    cost: {
                        $sum: {
                            $add: ["$summary.courtCost", "$summary.shuttleCost"],
                        },
                    },
                    profit: { $sum: "$summary.profit" },
                    sessionCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    revenue: 1,
                    cost: 1,
                    profit: 1,
                    sessionCount: 1,
                },
            },
        ]);
        res.status(200).json({ success: true, data: trend });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lấy dữ liệu xu hướng doanh thu", error });
    }
};
// ================================================================
// 3. Cost Breakdown — phân bổ chi phí
// ================================================================
export const getCostBreakdown = async (req, res) => {
    try {
        const { from, to } = parseDateRange(req);
        const userId = new mongoose.Types.ObjectId(String(req.user._id));
        const result = await Session.aggregate([
            {
                $match: {
                    status: "completed",
                    date: { $gte: from, $lte: to },
                    userId,
                },
            },
            {
                $group: {
                    _id: null,
                    courtCost: { $sum: "$summary.courtCost" },
                    shuttleCost: { $sum: "$summary.shuttleCost" },
                },
            },
        ]);
        const data = result[0] ?? { courtCost: 0, shuttleCost: 0 };
        const total = data.courtCost + data.shuttleCost;
        res.status(200).json({
            success: true,
            data: {
                courtCost: data.courtCost,
                shuttleCost: data.shuttleCost,
                total,
                courtPct: total > 0 ? Math.round((data.courtCost / total) * 100) : 0,
                shuttlePct: total > 0 ? Math.round((data.shuttleCost / total) * 100) : 0,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Lỗi lấy dữ liệu phân bổ chi phí", error });
    }
};
// ================================================================
// 4. Sessions Table — bảng chi tiết từng buổi
// ================================================================
export const getSessionsTable = async (req, res) => {
    try {
        const { from, to } = parseDateRange(req);
        const sessions = await Session.find({
            status: "completed",
            date: { $gte: from, $lte: to },
            userId: req.user._id,
        })
            .sort({ date: -1 })
            .select("date court shuttle players feeSettings summary notes")
            .lean();
        const rows = sessions.map((s) => {
            const playerCount = (s.players ?? []).reduce((acc, p) => acc + (p.maleCount ?? 0) + (p.femaleCount ?? 0), 0);
            return {
                _id: String(s._id),
                date: s.date,
                courtName: s.court?.name ?? "—",
                shuttleName: s.shuttle?.name ?? "—",
                shuttleUsed: s.shuttle?.usedQuantity ?? 0,
                playerCount,
                revenue: s.summary?.totalRevenue ?? 0,
                courtCost: s.summary?.courtCost ?? 0,
                shuttleCost: s.summary?.shuttleCost ?? 0,
                totalCost: (s.summary?.courtCost ?? 0) + (s.summary?.shuttleCost ?? 0),
                profit: s.summary?.profit ?? 0,
                totalCash: s.summary?.totalCash ?? 0,
                totalTransfer: s.summary?.totalTransfer ?? 0,
                notes: s.notes ?? "",
            };
        });
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Lỗi lấy danh sách buổi host", error: msg });
    }
};
// ================================================================
// Legacy (kept for backward compat)
// ================================================================
export const getStatistics = async (req, res) => {
    try {
        const { type } = req.query;
        const now = new Date();
        const startDate = new Date();
        const userId = new mongoose.Types.ObjectId(String(req.user._id));
        if (type === "weekly") {
            startDate.setDate(now.getDate() - 7);
        }
        else {
            startDate.setMonth(now.getMonth() - 1);
        }
        const stats = await Session.aggregate([
            { $match: { date: { $gte: startDate }, userId } },
            {
                $group: {
                    _id: type === "weekly" ? { $dateToString: { format: "%Y-%W", date: "$date" } } : { $dateToString: { format: "%Y-%m", date: "$date" } },
                    totalRevenue: { $sum: "$summary.totalRevenue" },
                    totalCourtCost: { $sum: "$summary.courtCost" },
                    totalShuttleCost: { $sum: "$summary.shuttleCost" },
                    totalProfit: { $sum: "$summary.profit" },
                    totalCash: { $sum: "$summary.totalCash" },
                    totalTransfer: { $sum: "$summary.totalTransfer" },
                    shuttleUsed: { $sum: "$shuttle.usedQuantity" },
                    sessionCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.status(200).json(stats);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: "Error when retrieving statistics: " + msg });
    }
};
//# sourceMappingURL=stats.controller.js.map