import axios from "axios";

// Vite expose biến môi trường qua import.meta.env
// Prefix VITE_ là bắt buộc để Vite inject vào bundle
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE_URL) {
   console.warn("[axios] VITE_API_BASE_URL chưa được khai báo trong .env — fallback về localhost");
}

const axiosInstance = axios.create({
   baseURL: BASE_URL || "http://localhost:5001/api",
   headers: {
      "Content-Type": "application/json",
   },
});

// Automatically inject JWT authorization header if token is present
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
