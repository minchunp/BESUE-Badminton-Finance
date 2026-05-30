import { motion } from "framer-motion";

interface GreetingCardProps {
   userName: string;
   scheduledHostsCount: number;
}

const GreetingCard = ({ userName, scheduledHostsCount }: GreetingCardProps) => {
   return (
      <motion.section
         initial={{ opacity: 0, y: -12 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, ease: "easeOut" }}
         className="relative rounded-[20px] overflow-hidden flex items-center min-h-32"
         style={{ background: "#1C1C1E", border: "1px solid rgba(255,255,255,0.08)" }}
      >
         {/* Content */}
         <div className="relative z-10 w-3/5 px-5 py-5">
            <p
               style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "4px",
               }}
            >
               Xin chào
            </p>
            <h1 style={{ color: "#FFFFFF", fontSize: "22px", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "12px" }}>
               {userName}!
            </h1>
            <div
               style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(10,132,255,0.22)",
                  borderRadius: "100px",
                  padding: "4px 12px",
               }}
            >
               <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0A84FF", flexShrink: 0 }} />
               <span style={{ color: "#0A84FF", fontSize: "11px", fontWeight: 700 }}>{scheduledHostsCount} buổi hôm nay</span>
            </div>
         </div>
      </motion.section>
   );
};

export default GreetingCard;
