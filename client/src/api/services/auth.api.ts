import axiosInstance from "../axios";

export interface IUser {
   _id: string;
   username: string;
   email: string;
   fullName: string;
   createdAt: string;
}

export interface AuthResponseData {
   user: IUser;
   token: string;
}

interface ApiResponse<T> {
   success: boolean;
   message?: string;
   data: T;
}

export const authApi = {
   /**
    * POST /api/auth/register
    * Đăng ký tài khoản người dùng mới
    */
   register: async (data: { username: string; email: string; password?: string; fullName: string }): Promise<ApiResponse<AuthResponseData>> => {
      const response = await axiosInstance.post<ApiResponse<AuthResponseData>>("/auth/register", data);
      return response.data;
   },

   /**
    * POST /api/auth/login
    * Đăng nhập người dùng bằng email/username và mật khẩu
    */
   login: async (data: { emailOrUsername: string; password?: string }): Promise<ApiResponse<AuthResponseData>> => {
      const response = await axiosInstance.post<ApiResponse<AuthResponseData>>("/auth/login", data);
      return response.data;
   },

   /**
    * GET /api/auth/me
    * Lấy thông tin cá nhân của phiên đăng nhập hiện tại từ JWT
    */
   getMe: async (): Promise<ApiResponse<IUser>> => {
      const response = await axiosInstance.get<ApiResponse<IUser>>("/auth/me");
      return response.data;
   },
};
