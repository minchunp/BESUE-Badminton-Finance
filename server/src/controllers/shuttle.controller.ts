import type { Request, Response } from "express";
import Shuttle from "../models/shuttle.js";

// GET /api/shuttles (Lấy danh sách quả cầu)
export const getShuttles = async (req: Request, res: Response): Promise<void> => {
   try {
      const shuttles = await Shuttle.find().sort({ createdAt: -1 });
      res.status(200).json({
         success: true,
         message: "Retrieved the shuttle list successfully!",
         data: shuttles,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error retrieving the shuttle list: " + error.message,
         error,
      });
   }
};

// GET /api/shuttles/:id (Lấy chi tiết quả cầu)
export const getShuttleById = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const shuttle = await Shuttle.findById(id);

      if (!shuttle) {
         res.status(404).json({
            success: false,
            message: "Shuttle not found!",
         });
         return;
      }

      res.status(200).json({
         success: true,
         message: "Retrieved shuttle details successfully!",
         data: shuttle,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error retrieving shuttle details: " + error.message,
         error,
      });
   }
};

// POST /api/shuttles (Tạo loại quả cầu mới)
export const createShuttle = async (req: Request, res: Response): Promise<void> => {
   try {
      const { name, pricePerTube, quantityPerTube } = req.body;

      if (!name || pricePerTube === undefined) {
         res.status(400).json({
            success: false,
            message: "Shuttle name and pricePerTube are required!",
         });
         return;
      }

      const newShuttle = new Shuttle({
         name,
         pricePerTube,
         quantityPerTube: quantityPerTube !== undefined ? quantityPerTube : 12,
      });

      // Saving will automatically trigger the pre('save') hook to calculate pricePerPiece
      await newShuttle.save();

      res.status(201).json({
         success: true,
         message: "Successful creation of shuttle type!",
         data: newShuttle,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error while creating shuttle: " + error.message,
         error,
      });
   }
};

// PUT /api/shuttles/:id (Cập nhật loại quả cầu)
export const updateShuttle = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const { name, pricePerTube, quantityPerTube } = req.body;

      const shuttle = await Shuttle.findById(id);

      if (!shuttle) {
         res.status(404).json({
            success: false,
            message: "Shuttle not found for update!",
         });
         return;
      }

      // Update fields dynamically
      if (name !== undefined) shuttle.name = name;
      if (pricePerTube !== undefined) shuttle.pricePerTube = pricePerTube;
      if (quantityPerTube !== undefined) shuttle.quantityPerTube = quantityPerTube;

      // Calling .save() will trigger the pre('save') hook to recalculate pricePerPiece
      await shuttle.save();

      res.status(200).json({
         success: true,
         message: "The shuttle was updated successfully!",
         data: shuttle,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error while updating shuttle: " + error.message,
         error,
      });
   }
};

// DELETE /api/shuttles/:id (Xóa loại quả cầu)
export const deleteShuttle = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const deletedShuttle = await Shuttle.findByIdAndDelete(id);

      if (!deletedShuttle) {
         res.status(404).json({
            success: false,
            message: "Shuttle not found for deletion!",
         });
         return;
      }

      res.status(200).json({
         success: true,
         message: "The shuttle was deleted successfully!",
         data: deletedShuttle,
      });
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: "Error while deleting shuttle: " + error.message,
         error,
      });
   }
};
