import type { Request, Response } from "express";
import Court from "../models/court.js";

// GET /api/courts (Lấy danh sách sân)
export const getCourts = async (req: Request, res: Response): Promise<void> => {
   try {
      const courts = await Court.find().sort({ createdAt: -1 });
      res.status(200).json({
         success: true,
         message: "Retrieved the court list successfully!",
         data: courts,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error retrieving the court list: " + error.message,
         error,
      });
   }
};

// GET /api/courts/:id (Lấy chi tiết sân)
export const getCourtById = async (req: Request, res: Response): Promise<void> => {
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
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error retrieving court details: " + error.message,
         error,
      });
   }
};

// POST /api/courts (Tạo sân mới)
export const createCourt = async (req: Request, res: Response): Promise<void> => {
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
         timeSlots: timeSlots || [],
         description,
      });

      await newCourt.save();

      res.status(201).json({
         success: true,
         message: "The court was set up successfully!",
         data: newCourt,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error while creating court: " + error.message,
         error,
      });
   }
};

// PUT /api/courts/:id (Cập nhật sân)
export const updateCourt = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const { name, address, timeSlots, description } = req.body;

      const updatedCourt = await Court.findByIdAndUpdate(
         id,
         { name, address, timeSlots, description },
         { new: true, runValidators: true }
      );

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
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error while updating court: " + error.message,
         error,
      });
   }
};

// DELETE /api/courts/:id (Xóa sân)
export const deleteCourt = async (req: Request, res: Response): Promise<void> => {
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
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error while deleting court: " + error.message,
         error,
      });
   }
};
