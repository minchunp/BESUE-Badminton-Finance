import {} from "express";
import jwt from "jsonwebtoken";
import User, {} from "../models/user.js";
import { config } from "../server.js";
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
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
        const decoded = jwt.verify(token, config.jwtSecret);
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
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Token xác thực không hợp lệ hoặc đã hết hạn!",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map