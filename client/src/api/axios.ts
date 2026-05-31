import axios from "axios";

// Kiểm tra xem ứng dụng đang chạy ở môi trường Production (đã deploy) hay Local (development)
const isProd = import.meta.env.PROD;

// Nếu ở Production, dùng relative path "/api" để tận dụng định tuyến của vercel.json
// Nếu ở Local, dùng biến môi trường VITE_API_BASE_URL hoặc fallback về port 5001
const BASE_URL = isProd ? "/api" : import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({
   baseURL: BASE_URL,
   timeout: 10000, // Thêm timeout 10s bảo vệ request không bị treo vô hạn
   headers: {
      "Content-Type": "application/json",
   },
});

// Tự động inject JWT authorization header nếu token tồn tại
axiosInstance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("besue_token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error: unknown) => {
      return Promise.reject(error);
   },
);

export default axiosInstance;
