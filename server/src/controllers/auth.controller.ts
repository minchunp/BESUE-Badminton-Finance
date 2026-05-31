import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { config } from "../server.js";

// ================================================================
// Helper: extract error message safely (no `any`)
// ================================================================
const getErrorMessage = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return String(error);
};

/** Generate a secure JWT token for the user */
const generateToken = (userId: string): string => {
   return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
   });
};

// ================================================================
// 1. REGISTER - Đăng ký người dùng mới
// ================================================================
export const register = async (req: Request, res: Response): Promise<void> => {
   try {
      const { username, email, password, fullName } = req.body as {
         username: string;
         email: string;
         password: string;
         fullName: string;
      };

      // 1. Validate fields
      if (!username || !email || !password || !fullName) {
         res.status(400).json({
            success: false,
            message: "Vui lòng nhập đầy đủ tất cả thông tin yêu cầu!",
         });
         return;
      }

      // 2. Check email/username duplicates
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
         res.status(400).json({
            success: false,
            message: "Địa chỉ email này đã được sử dụng!",
         });
         return;
      }

      const usernameExists = await User.findOne({ username: username.toLowerCase().trim() });
      if (usernameExists) {
         res.status(400).json({
            success: false,
            message: "Tên đăng nhập này đã tồn tại!",
         });
         return;
      }

      // 3. Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Create new user
      const user = await User.create({
         username: username.toLowerCase().trim(),
         email: email.toLowerCase().trim(),
         password: hashedPassword,
         fullName: fullName.trim(),
      });

      // 5. Generate token & respond
      const token = generateToken(String(user._id));

      res.status(201).json({
         success: true,
         message: "Đăng ký tài khoản thành công!",
         data: {
            user,
            token,
         },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Đã xảy ra lỗi trên máy chủ khi đăng ký tài khoản!",
         error: getErrorMessage(error),
      });
   }
};

// ================================================================
// 2. LOGIN - Đăng nhập tài khoản
// ================================================================
export const login = async (req: Request, res: Response): Promise<void> => {
   try {
      const { emailOrUsername, password } = req.body as {
         emailOrUsername: string;
         password: string;
      };

      // 1. Validate fields
      if (!emailOrUsername || !password) {
         res.status(400).json({
            success: false,
            message: "Vui lòng cung cấp đầy đủ tên đăng nhập/email và mật khẩu!",
         });
         return;
      }

      const searchKey = emailOrUsername.toLowerCase().trim();

      // 2. Find user in database
      const user = await User.findOne({
         $or: [{ email: searchKey }, { username: searchKey }],
      });

      if (!user) {
         res.status(401).json({
            success: false,
            message: "Tên đăng nhập, email hoặc mật khẩu không chính xác!",
         });
         return;
      }

      // 3. Verify password
      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
         res.status(401).json({
            success: false,
            message: "Tên đăng nhập, email hoặc mật khẩu không chính xác!",
         });
         return;
      }

      // 4. Generate token & respond
      const token = generateToken(String(user._id));

      res.status(200).json({
         success: true,
         message: "Đăng nhập thành công!",
         data: {
            user,
            token,
         },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Đã xảy ra lỗi trên máy chủ khi đăng nhập!",
         error: getErrorMessage(error),
      });
   }
};

// ================================================================
// 3. GET PROFILE - Xem thông tin tài khoản hiện tại
// ================================================================
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   try {
      res.status(200).json({
         success: true,
         data: req.user,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Đã xảy ra lỗi trên máy chủ khi lấy thông tin người dùng!",
         error: getErrorMessage(error),
      });
   }
};
