import { motion } from "framer-motion";
import GreetingCard from "./components/GreetingCard";
import QuickStats from "./components/QuickStats";
import PrimaryAction from "./components/PrimaryAction";
import RecentHosts from "./components/RecentHosts";
import type { HomePageData } from "./types";

// High-fidelity Mock Data complying strictly with HomePageData interface from types.ts
const mockHomePageData: HomePageData = {
   userName: "Suee Nguyen",
   scheduledHostsCount: 2,
   stats: [
      {
         id: "stat-revenue",
         icon: "revenue",
         label: "Thu nhập",
         value: 12500000,
         unit: "đ",
      },
      {
         id: "stat-sessions",
         icon: "sessions",
         label: "Buổi host",
         value: 24,
         unit: "buổi",
      },
      {
         id: "stat-shuttles",
         icon: "shuttles",
         label: "Cầu đã dùng",
         value: 48,
         unit: "ống",
      },
      {
         id: "stat-hours",
         icon: "hours",
         label: "Giờ đã host",
         value: 96,
         unit: "giờ",
      },
   ],
   recentSessions: [
      {
         id: "session-1",
         date: "12 Tháng 10, 2023",
         courtName: "Sân Olympic",
         profit: 450000,
         status: "complete",
         quantityPlayer: 8,
      },
      {
         id: "session-2",
         date: "10 Tháng 10, 2023",
         courtName: "Sân Viettel",
         profit: 320000,
         status: "complete",
         quantityPlayer: 5,
      },
      {
         id: "session-3",
         date: "08 Tháng 10, 2023",
         courtName: "Sân Thống Nhất",
         profit: 180000,
         status: "complete",
         quantityPlayer: 3,
      },
      {
         id: "session-4",
         date: "05 Tháng 10, 2023",
         courtName: "Sân Bình Thạnh",
         profit: 290000,
         status: "complete",
         quantityPlayer: 6,
      },
   ],
};

const pageContainerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
      },
   },
};

const HomePage = () => {
   const handleCreateHost = () => {
      console.log("Navigating to create new badminton host session...");
      // In a real application, we would navigate to a form or open a modal
   };

   return (
      <motion.div variants={pageContainerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 w-full">
         {/* Greeting Section */}
         <GreetingCard userName={mockHomePageData.userName} scheduledHostsCount={mockHomePageData.scheduledHostsCount} />

         {/* Quick Statistics Grid */}
         <QuickStats stats={mockHomePageData.stats} />

         {/* Primary Call to Action */}
         <PrimaryAction onClick={handleCreateHost} />

         {/* Recent Host Sessions list */}
         <RecentHosts sessions={mockHomePageData.recentSessions} />
      </motion.div>
   );
};

export default HomePage;
