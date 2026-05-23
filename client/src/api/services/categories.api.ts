import axiosInstance from "../axios";
import type { IShuttle, ICourt } from "../../pages/Categories/types";

// Dynamic response wrapper
interface ApiResponse<T> {
   success: boolean;
   message: string;
   data: T;
}

export const shuttleApi = {
   getAll: async (): Promise<ApiResponse<IShuttle[]>> => {
      const response = await axiosInstance.get<ApiResponse<IShuttle[]>>("/shuttles");
      return response.data;
   },
   create: async (data: Omit<IShuttle, "_id">): Promise<ApiResponse<IShuttle>> => {
      const response = await axiosInstance.post<ApiResponse<IShuttle>>("/shuttles", data);
      return response.data;
   },
   update: async (id: string, data: Partial<IShuttle>): Promise<ApiResponse<IShuttle>> => {
      const response = await axiosInstance.put<ApiResponse<IShuttle>>(`/shuttles/${id}`, data);
      return response.data;
   },
   delete: async (id: string): Promise<ApiResponse<IShuttle>> => {
      const response = await axiosInstance.delete<ApiResponse<IShuttle>>(`/shuttles/${id}`);
      return response.data;
   },
};

export const courtApi = {
   getAll: async (): Promise<ApiResponse<ICourt[]>> => {
      const response = await axiosInstance.get<ApiResponse<ICourt[]>>("/courts");
      return response.data;
   },
   create: async (data: Omit<ICourt, "_id">): Promise<ApiResponse<ICourt>> => {
      const response = await axiosInstance.post<ApiResponse<ICourt>>("/courts", data);
      return response.data;
   },
   update: async (id: string, data: Partial<ICourt>): Promise<ApiResponse<ICourt>> => {
      const response = await axiosInstance.put<ApiResponse<ICourt>>(`/courts/${id}`, data);
      return response.data;
   },
   delete: async (id: string): Promise<ApiResponse<ICourt>> => {
      const response = await axiosInstance.delete<ApiResponse<ICourt>>(`/courts/${id}`);
      return response.data;
   },
};
