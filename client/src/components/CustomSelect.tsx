import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
   value?: string;
   label?: string;
}

interface CustomSelectProps {
   value?: string;
   onChange?: (value: string) => void;
   options: Option[];
   placeholder?: string;
   isDarkMode?: boolean;
   className?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder = "Chọn...", isDarkMode = false, className = "" }: CustomSelectProps) => {
   const [open, setOpen] = useState(false);
   const ref = useRef<HTMLDivElement>(null);

   const selected = options.find((o) => o.value === value);

   useEffect(() => {
      const handleClick = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
   }, []);

   return (
      <div ref={ref} className={`relative w-full ${className}`}>
         {/* Trigger */}
         <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{
               width: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               padding: "8px 4px",
               background: "transparent",
               border: "none",
               cursor: "pointer",
               color: isDarkMode ? "#ffffff" : "#000000",
               fontFamily: "Inter, sans-serif",
               fontSize: 13,
               fontWeight: 800,
               outline: "none",
            }}
         >
            <span
               style={{
                  color: selected ? (isDarkMode ? "#ffffff" : "#000000") : isDarkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                  fontWeight: selected ? 800 : 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
               }}
            >
               {selected ? selected.label : placeholder}
            </span>
            <ChevronDown
               size={14}
               style={{
                  color: isDarkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)",
                  flexShrink: 0,
                  marginLeft: 6,
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
               }}
            />
         </button>

         {/* Dropdown */}
         {open && (
            <div
               style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  zIndex: 9999,
                  backgroundColor: isDarkMode ? "#1c1c1e" : "#ffffff",
                  border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  boxShadow: isDarkMode ? "0 8px 32px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  maxHeight: 220,
                  overflowY: "auto",
               }}
            >
               {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                     <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                           onChange?.(opt.value || "");
                           setOpen(false);
                        }}
                        style={{
                           width: "100%",
                           display: "block",
                           textAlign: "left",
                           padding: "10px 14px",
                           background: isSelected ? (isDarkMode ? "rgba(10,132,255,0.15)" : "rgba(10,132,255,0.08)") : "transparent",
                           border: "none",
                           cursor: "pointer",
                           color: isSelected ? "#0A84FF" : isDarkMode ? "rgba(235,235,245,0.9)" : "#000000",
                           fontFamily: "Inter, sans-serif",
                           fontSize: 13,
                           fontWeight: isSelected ? 700 : 500,
                           transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                           if (!isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.background = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
                           }
                        }}
                        onMouseLeave={(e) => {
                           if (!isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                           }
                        }}
                     >
                        {opt.label}
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default CustomSelect;
