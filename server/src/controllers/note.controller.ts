import { type Response } from "express";
import Note from "../models/note.js";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";

// ================================================================
// Helper: extract error message safely (no `any`)
// ================================================================
const getErrorMessage = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return String(error);
};

// ================================================================
// 1. GET ALL NOTES - Lấy danh sách ghi chú của người dùng
// ================================================================
export const getNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   try {
      const notes = await Note.find({ userId: req.user!._id }).sort({
         updatedAt: -1,
      });

      res.status(200).json({
         success: true,
         data: notes,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi máy chủ khi lấy danh sách ghi chú!",
         error: getErrorMessage(error),
      });
   }
};

// ================================================================
// 2. CREATE NOTE - Tạo ghi chú trống mới
// ================================================================
export const createNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   try {
      const note = await Note.create({
         title: "Ghi chú mới",
         content: "",
         userId: req.user!._id,
      });

      res.status(201).json({
         success: true,
         message: "Tạo ghi chú mới thành công!",
         data: note,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi máy chủ khi tạo ghi chú mới!",
         error: getErrorMessage(error),
      });
   }
};

// ================================================================
// 3. UPDATE NOTE - Cập nhật thông tin ghi chú (Tiêu đề / Nội dung)
// ================================================================
export const updateNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const { title, content } = req.body as { title?: string; content?: string };

      // Find the note and ensure it belongs to the authenticated user
      const note = await Note.findOne({ _id: String(id), userId: req.user!._id });

      if (!note) {
         res.status(404).json({
            success: false,
            message: "Không tìm thấy ghi chú hoặc bạn không có quyền cập nhật!",
         });
         return;
      }

      // Update fields if provided
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;

      await note.save();

      res.status(200).json({
         success: true,
         message: "Cập nhật ghi chú thành công!",
         data: note,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi máy chủ khi cập nhật ghi chú!",
         error: getErrorMessage(error),
      });
   }
};

// ================================================================
// 4. DELETE NOTE - Xóa ghi chú khỏi hệ thống
// ================================================================
export const deleteNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   try {
      const { id } = req.params;

      // Find and delete, ensuring it belongs to the authenticated user
      const note = await Note.findOneAndDelete({ _id: String(id), userId: req.user!._id });

      if (!note) {
         res.status(404).json({
            success: false,
            message: "Không tìm thấy ghi chú hoặc bạn không có quyền xóa!",
         });
         return;
      }

      res.status(200).json({
         success: true,
         message: "Xóa ghi chú thành công!",
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Lỗi máy chủ khi xóa ghi chú!",
         error: getErrorMessage(error),
      });
   }
};
