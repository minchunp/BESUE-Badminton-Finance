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
   <div className="flex flex-col gap-6 w-full animate-pulse p-1">
      {/* Greeting Skeleton */}
      <div className="h-35 rounded-2xl bg-gray-200" />
      
      {/* Quick Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
         {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-26.25 rounded-2xl bg-gray-100" />
         ))}
      </div>
      
      {/* Action Button Skeleton */}
      <div className="h-18 rounded-2xl bg-gray-200" />
      
      {/* Recent Sessions Skeleton */}
      <div className="space-y-4">
         <div className="flex justify-between items-center px-1">
            <div className="h-6 w-36 bg-gray-200 rounded-md" />
            <div className="h-4 w-16 bg-gray-100 rounded-md" />
         </div>
         <div className="flex gap-4 overflow-x-auto pb-3">
            {[1, 2].map((i) => (
               <div key={i} className="min-w-70 w-70 h-32 bg-gray-100 rounded-2xl shrink-0" />
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
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold text-xl">
               !
            </div>
            <h3 className="font-sans font-black text-gray-800 text-base">Đã xảy ra lỗi tải dữ liệu</h3>
            <p className="font-sans text-xs text-gray-400 max-w-xs">
               Vui lòng kiểm tra lại kết nối mạng hoặc khởi động lại server.
            </p>
         </div>
      );
   }

   return (
      <motion.div
         variants={pageContainerVariants}
         initial="hidden"
         animate="show"
         className="flex flex-col gap-6 w-full"
      >
         {/* Greeting Section */}
         <GreetingCard
            userName={data.userName}
            scheduledHostsCount={data.scheduledHostsCount}
         />

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
