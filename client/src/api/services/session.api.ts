import axiosInstance from "../axios";

export interface IPersonPayment {
   isPaid: boolean;
   paymentMethod?: "cash" | "transfer";
}

export interface IPlayer {
   _id?: string;
   name: string;
   maleCount: number;
   femaleCount: number;
   isCheckedIn: boolean;
   isPaid: boolean;
   paymentMethod?: "cash" | "transfer";
   individualMatches: number[];
   individualPayments: IPersonPayment[];
}

export interface ISession {
   _id?: string;
   status: "draft" | "active" | "completed";
   date: string;
   court: {
      courtId: string;
      name: string;
      pricePerHour: number;
      numberOfCourts: number;
      hours: number;
   };
   shuttle: {
      shuttleId: string;
      name: string;
      pricePerPiece: number;
      usedQuantity: number;
   };
   players: IPlayer[];
   feeSettings: {
      male: number;
      female: number;
   };
   notes?: string;
   currentStep?: number;
   summary: {
      totalRevenue: number;
      totalCash: number;
      totalTransfer: number;
      courtCost: number;
      shuttleCost: number;
      profit: number;
   };
}

interface ApiResponse<T> {
   success: boolean;
   message?: string;
   data: T;
}

export const sessionApi = {
   create: async (data: {
      date: string;
      court: {
         courtId: string;
         name: string;
         pricePerHour: number;
         numberOfCourts: number;
         hours: number;
      };
      shuttle: {
         shuttleId: string;
         name: string;
         pricePerPiece: number;
      };
      feeSettings: {
         male: number;
         female: number;
      };
   }): Promise<ApiResponse<ISession>> => {
      const response = await axiosInstance.post<ApiResponse<ISession>>("/sessions", data);
      return response.data;
   },

   updatePlayers: async (id: string, players: Omit<IPlayer, "_id">[], currentStep?: number): Promise<ApiResponse<ISession>> => {
      const response = await axiosInstance.put<ApiResponse<ISession>>(`/sessions/${id}/players`, {
         players,
         currentStep,
      });
      return response.data;
   },

   complete: async (
      id: string,
      data: {
         usedQuantity: number;
         notes?: string;
      },
   ): Promise<ApiResponse<ISession>> => {
      const response = await axiosInstance.put<ApiResponse<ISession>>(`/sessions/${id}/complete`, data);
      return response.data;
   },

   getAll: async (): Promise<ApiResponse<ISession[]>> => {
      const response = await axiosInstance.get<ApiResponse<ISession[]>>("/sessions");
      return response.data;
   },

   getById: async (id: string): Promise<ApiResponse<ISession>> => {
      const response = await axiosInstance.get<ApiResponse<ISession>>(`/sessions/${id}`);
      return response.data;
   },
};
