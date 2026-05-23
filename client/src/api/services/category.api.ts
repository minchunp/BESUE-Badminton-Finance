import axiosInstance from "../axios";

export const categoryApi = {
   category: () => {
      return axiosInstance.get("/courts");
   },
};
