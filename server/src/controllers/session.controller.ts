import type { Request, Response } from "express";
import Session from "../models/session.js";

const calculateSessionFinance = (sessionData: any) => {
   let totalRevenue = 0;
   let totalCash = 0;
   let totalTransfer = 0;

   sessionData.players.forEach((player: any) => {
      const playerTotal = player.maleCount * sessionData.feeSettings.male + player.femaleCount * sessionData.feeSettings.female;

      if (player.isPaid) {
         totalRevenue += playerTotal;
         if (player.paymentMethod === "cash") totalCash += playerTotal;
         if (player.paymentMethod === "transfer") totalTransfer += playerTotal;
      }
   });

   const courtCost = sessionData.court.pricePerHour * sessionData.court.hours * sessionData.court.numberOfCourts;
   const shuttleCost = sessionData.shuttle.pricePerPiece * sessionData.shuttle.usedQuantity;
   const profit = totalRevenue - (courtCost + shuttleCost);

   return { totalRevenue, totalCash, totalTransfer, courtCost, shuttleCost, profit };
};

export const createSession = async (req: Request, res: Response) => {
   try {
      const { date, court, shuttle, feeSettings } = req.body;

      const newSession = new Session({
         status: "active",
         date,
         court,
         shuttle,
         feeSettings,
         players: [],
      });

      newSession.summary.courtCost = court.pricePerHour * court.hours * court.numberOfCourts;
      newSession.summary.profit = -newSession.summary.courtCost;

      await newSession.save();
      res.status(201).json({ success: true, data: newSession });
   } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khởi tạo buổi host", error });
   }
};

export const updateSessionPlayers = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { players } = req.body;

      const currentSession = await Session.findById(id);
      if (!currentSession) return res.status(404).json({ success: false, message: "Không tìm thấy buổi host" });

      currentSession.players = players;

      const updatedSummary = calculateSessionFinance(currentSession);
      currentSession.summary = updatedSummary;

      await currentSession.save();
      res.status(200).json({ success: true, data: currentSession });
   } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi cập nhật danh sách người chơi", error });
   }
};

export const completeSession = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { usedQuantity, notes } = req.body;

      const currentSession = await Session.findById(id);
      if (!currentSession) return res.status(404).json({ success: false, message: "Không tìm thấy buổi host" });

      currentSession.shuttle.usedQuantity = usedQuantity;
      currentSession.notes = notes;
      currentSession.status = "completed";

      const finalSummary = calculateSessionFinance(currentSession);
      currentSession.summary = finalSummary;

      await currentSession.save();
      res.status(200).json({ success: true, data: currentSession });
   } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi chốt báo cáo tài chính", error });
   }
};
