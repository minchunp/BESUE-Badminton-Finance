/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            "primary-fixed-dim": "#dbb8ff",
            "surface-variant": "#e2e2e2",
            surface: "#f9f9f9",
            primary: "#6f5092",
            "secondary-container": "#c185fd",
            "primary-container": "#d8b4fe",
            "outline-variant": "#cdc3d0",
            tertiary: "#a93349",
            "surface-container-lowest": "#ffffff",
            "on-surface": "#1a1c1c",
            "on-surface-variant": "#4a454f",
            "on-primary": "#ffffff",
         },
         fontFamily: {
            "headline-lg-mobile": ["Inter", "sans-serif"],
            "headline-md": ["Inter", "sans-serif"],
            "body-md": ["Inter", "sans-serif"],
            "label-md": ["Inter", "sans-serif"],
            "label-sm": ["Inter", "sans-serif"],
         },
         fontSize: {
            "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
            "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
            "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
            "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
            "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
         },
         boxShadow: {
            glass: "0 8px 32px rgba(216, 180, 254, 0.15)",
            "glass-inner": "inset 1px 1px 0px 0px rgba(255, 255, 255, 0.4)",
         },
         animation: {
            float: "float 6s ease-in-out infinite",
            shine: "shine 1.5s ease-in-out infinite",
         },
         keyframes: {
            float: {
               "0%, 100%": { transform: "translateY(0)" },
               "50%": { transform: "translateY(-15px)" },
            },
            shine: {
               "100%": { left: "200%" },
            },
         },
      },
   },
   plugins: [],
};
