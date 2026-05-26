/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
   theme: Theme;
   isDarkMode: boolean;
   toggleTheme: () => void;
   setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [theme, setThemeState] = useState<Theme>(() => {
      const savedTheme = localStorage.getItem("besue_theme");
      return (savedTheme as Theme) || "light";
   });

   useEffect(() => {
      const root = window.document.documentElement;

      if (theme === "dark") {
         root.classList.add("dark");
      } else {
         root.classList.remove("dark");
      }

      localStorage.setItem("besue_theme", theme);
   }, [theme]);

   const toggleTheme = () => {
      setThemeState((prev) => (prev === "light" ? "dark" : "light"));
   };

   const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
   };

   return (
      <ThemeContext.Provider
         value={{
            theme,
            isDarkMode: theme === "dark",
            toggleTheme,
            setTheme,
         }}
      >
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => {
   const context = useContext(ThemeContext);
   if (context === undefined) {
      throw new Error("useTheme must be used within a ThemeProvider");
   }
   return context;
};
