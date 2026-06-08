import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/user.js";
import { config } from "../configs/env.config.js";

export interface AuthenticatedRequest extends Request {
   user?: IUser;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
   try {
      let token: string | undefined;

      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
         res.status(401).json({
            success: false,
            message: "Không tìm thấy token xác thực, vui lòng đăng nhập!",
         });
         return;
      }

      // Verify token — dùng config.jwtSecret (đã được validate lúc startup)
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

      // Find user from database
      const user = await User.findById(decoded.id);
      if (!user) {
         res.status(401).json({
            success: false,
            message: "Tài khoản người dùng không tồn tại trong hệ thống!",
         });
         return;
      }

      // Attach user to request
      req.user = user;
      next();
   } catch (error) {
      res.status(401).json({
         success: false,
         message: "Token xác thực không hợp lệ hoặc đã hết hạn!",
      });
   }
};
