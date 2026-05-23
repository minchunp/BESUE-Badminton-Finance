import {} from "express";
import session from "../models/session.js";
export const getStatistics = async (req, res) => {
    try {
        const { type } = req.query;
        const now = new Date();
        let startDate = new Date();
        if (type === "weekly") {
            startDate.setDate(now.getDate() - 7);
        }
        else {
            startDate.setMonth(now.getMonth() - 1);
        }
        const stats = await session.aggregate([
            {
                $match: {
                    date: { $gte: startDate },
                },
            },
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
        res.status(500).json({ message: "Error when retrieving statistics: ", error });
    }
};
//# sourceMappingURL=stats.controller.js.map