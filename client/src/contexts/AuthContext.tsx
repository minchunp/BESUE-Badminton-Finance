/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, type IUser } from "../api/services/auth.api";

interface AuthContextType {
   user: IUser | null;
   token: string | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   login: (emailOrUsername: string, password?: string) => Promise<void>;
   register: (username: string, email: string, password?: string, fullName?: string) => Promise<void>;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<IUser | null>(null);
   const [token, setToken] = useState<string | null>(() => localStorage.getItem("besue_token"));
   const [isLoading, setIsLoading] = useState<boolean>(true);

   // Load current user profile if token is present
   useEffect(() => {
      const loadUser = async () => {
         if (!token) {
            setIsLoading(false);
            return;
         }

         try {
            const res = await authApi.getMe();
            if (res.success && res.data) {
               setUser(res.data);
            } else {
               // Token invalid
               handleLogout();
            }
         } catch (error) {
            console.error("Failed to load user profile:", error);
            handleLogout();
         } finally {
            setIsLoading(false);
         }
      };

      loadUser();
   }, [token]);

   const handleLogout = () => {
      localStorage.removeItem("besue_token");
      setToken(null);
      setUser(null);
   };

   const login = async (emailOrUsername: string, password?: string) => {
      setIsLoading(true);
      try {
         const res = await authApi.login({ emailOrUsername, password });
         if (res.success && res.data) {
            const { user: loggedUser, token: authToken } = res.data;
            localStorage.setItem("besue_token", authToken);
            setToken(authToken);
            setUser(loggedUser);
         } else {
            throw new Error(res.message || "Đăng nhập thất bại");
         }
      } catch (error: any) {
         setIsLoading(false);
         throw error;
      }
   };

   const register = async (username: string, email: string, password?: string, fullName?: string) => {
      setIsLoading(true);
      try {
         const res = await authApi.register({
            username,
            email,
            password,
            fullName: fullName || username,
         });
         if (res.success && res.data) {
            const { user: registeredUser, token: authToken } = res.data;
            localStorage.setItem("besue_token", authToken);
            setToken(authToken);
            setUser(registeredUser);
         } else {
            throw new Error(res.message || "Đăng ký thất bại");
         }
      } catch (error: any) {
         setIsLoading(false);
         throw error;
      }
   };

   const logout = () => {
      handleLogout();
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
