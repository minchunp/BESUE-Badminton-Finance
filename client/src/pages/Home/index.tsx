import { motion } from "framer-motion";
import GreetingCard from "./components/GreetingCard";
import QuickStats from "./components/QuickStats";
import PrimaryAction from "./components/PrimaryAction";
import RecentHosts from "./components/RecentHosts";
import { useHomeData } from "./hooks/useHomeData";

const pageContainerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
      },
   },
};

const HomeSkeleton = () => (
   <div className="flex flex-col gap-5 w-full animate-pulse px-0.5">
      {/* Greeting Skeleton */}
      <div className="h-32.5 rounded-[28px] bg-black/6 dark:bg-white/6" />

      {/* Quick Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3">
         {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-26.5 rounded-[20px] bg-black/4 dark:bg-white/4" />
         ))}
      </div>

      {/* Action Button Skeleton */}
      <div className="h-17 rounded-2xl bg-black/6 dark:bg-white/6" />

      {/* Recent Sessions Skeleton */}
      <div className="space-y-3">
         <div className="flex justify-between items-center">
            <div className="h-5 w-36 bg-black/6 dark:bg-white/6 rounded-lg" />
            <div className="h-4 w-16 bg-black/4 dark:bg-white/4 rounded-lg" />
         </div>
         <div className="flex gap-3 overflow-x-auto pb-3">
            {[1, 2].map((i) => (
               <div key={i} className="min-w-68 w-68 h-30 bg-black/4 dark:bg-white/4 rounded-[20px] shrink-0" />
            ))}
         </div>
      </div>
   </div>
);

const HomePage = () => {
   const { data, isLoading, error } = useHomeData();

   if (isLoading) {
      return <HomeSkeleton />;
   }

   if (error || !data) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30] font-bold text-xl">!</div>
            <h3 className="font-bold text-black dark:text-white text-[15px]">Đã xảy ra lỗi tải dữ liệu</h3>
            <p className="text-xs font-medium text-black/40 dark:text-white/40 max-w-xs leading-relaxed">
               Vui lòng kiểm tra lại kết nối mạng hoặc khởi động lại server.
            </p>
         </div>
      );
   }

   return (
      <motion.div variants={pageContainerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 w-full">
         {/* Greeting Section */}
         <GreetingCard userName={data.userName} scheduledHostsCount={data.scheduledHostsCount} />

         {/* Quick Statistics Grid */}
         <QuickStats stats={data.stats} />

         {/* Primary Call to Action */}
         <PrimaryAction />

         {/* Recent Host Sessions list */}
         <RecentHosts sessions={data.recentSessions} />
      </motion.div>
   );
};

export default HomePage;
