import { motion } from "framer-motion";
import onboarding_img1 from "../../../assets/imgs/onboarding_img1.png";

interface GreetingCardProps {
   userName: string;
   scheduledHostsCount: number;
}

const GreetingCard = ({ userName, scheduledHostsCount }: GreetingCardProps) => {
   return (
      <motion.section
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         className="relative h-35 rounded-2xl bg-linear-to-br from-[#d8b4fe] to-[#ffadb5] p-6 overflow-hidden shadow-glass flex items-center"
      >
         {/* Background soft glow elements */}
         <div className="absolute top-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

         <div className="relative z-10 w-2/4">
            <h1 className="font-sans text-xl font-extrabold text-[#29074a] mb-1.5 tracking-tight leading-tight">Chào buổi sáng, {userName}!</h1>
            <p className="font-sans text-xs text-[#29074a]/85 font-medium">
               Hôm nay bạn có <span className="font-bold text-[#7b41b4]">{scheduledHostsCount} buổi host</span> được lên lịch
            </p>
         </div>

         {/* Beautiful 3D Floating Shuttlecock */}
         <div className="absolute -right-3.75 -top-2.5 w-44 h-44 opacity-95 drop-shadow-xl select-none pointer-events-none animate-float">
            <img alt="3D Shuttlecock" className="w-full h-full object-contain" src={onboarding_img1} />
         </div>
      </motion.section>
   );
};

export default GreetingCard;
