import axiosInstance from "../axios";

export interface INote {
   _id: string;
   title: string;
   content: string;
   userId: string;
   createdAt: string;
   updatedAt: string;
}

interface ApiResponse<T> {
   success: boolean;
   message?: string;
   data: T;
}

export const notesApi = {
   /**
    * GET /api/notes
    * Lấy toàn bộ ghi chú của người dùng đăng nhập hiện tại
    */
   getAll: async (): Promise<ApiResponse<INote[]>> => {
      const response = await axiosInstance.get<ApiResponse<INote[]>>("/notes");
      return response.data;
   },

   /**
    * POST /api/notes
    * Khởi tạo ghi chú trống mới
    */
   create: async (): Promise<ApiResponse<INote>> => {
      const response = await axiosInstance.post<ApiResponse<INote>>("/notes");
      return response.data;
   },

   /**
    * PUT /api/notes/:id
    * Cập nhật tiêu đề hoặc nội dung ghi chú
    */
   update: async (id: string, data: { title?: string; content?: string }): Promise<ApiResponse<INote>> => {
      const response = await axiosInstance.put<ApiResponse<INote>>(`/notes/${id}`, data);
      return response.data;
   },

   /**
    * DELETE /api/notes/:id
    * Xóa ghi chú dựa trên ID
    */
   delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
      const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(`/notes/${id}`);
      return response.data;
   },
};
