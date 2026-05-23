import session from "../models/session.js";
export const createSession = async (req, res) => {
    try {
        const { date, court, shuttle, players, feeSettings } = req.body;
        let totalRevenue = 0;
        let totalCast = 0;
        let totalTransfer = 0;
        players.forEach((player) => {
            if (player.isPresent) {
                const fee = player.gender === "male" ? feeSettings.male : feeSettings.female;
                const playTotal = fee * (player.quantity || 1);
                totalRevenue += playTotal;
                if (player.paymentMethod === "cash")
                    totalCast += playTotal;
                else
                    totalTransfer += playTotal;
            }
        });
        const courtCost = court.pricePerHour * court.hours * court.numberOfCourts;
        const shuttleCost = shuttle.pricePerPiece * shuttle.usedQuantity;
        const profit = totalRevenue - (courtCost + shuttleCost);
        const newSession = new session({
            date,
            court,
            shuttle,
            players,
            feeSettings,
            summary: {
                totalRevenue,
                totalCast,
                totalTransfer,
                courtCost,
                shuttleCost,
                profit,
            },
        });
        await newSession.save();
        res.status(201).json({ message: "Save the game session successfully!", data: newSession });
    }
    catch (error) {
        res.status(500).json({ message: "Error in calculating and saving the game session: ", error });
    }
};
export const getSessions = async (req, res) => {
    try {
        const sessions = await session.find().sort({ date: -1 });
        res.status(200).json(sessions);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving history: ", error });
    }
};
//# sourceMappingURL=session.controller.js.map