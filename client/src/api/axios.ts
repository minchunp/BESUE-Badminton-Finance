import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "http://localhost:5001/api",
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
   (error) => {
      return Promise.reject(error);
   },
);

export default axiosInstance;
