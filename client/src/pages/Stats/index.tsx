import { ConfigProvider } from "antd";
import { motion } from "framer-motion";
import { useStatsPeriod } from "./hooks/useStatsPeriod";
import { useStatsOverview, useRevenueTrend, useCostBreakdown, useSessionsTable } from "./hooks/useStatsQueries";

import StatsHeader from "./components/StatsHeader";
import HeroMetricsCard from "./components/HeroMetricsCard";
import MetricsPillRow from "./components/MetricsPillRow";
import RevenueTrendChart from "./components/RevenueTrendChart";
import CostBreakdownCard from "./components/CostBreakdownCard";
import PaymentMethodCard from "./components/PaymentMethodCard";
import InsightsCard from "./components/InsightsCard";
import SessionsTable from "./components/SessionsTable";
import EmptyStatsState from "./components/EmptyStatsState";

const pageVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
   },
};

const StatsPage = () => {
   const { activePeriod, customRange, dateRange, setActivePeriod, setCustomRange, periodLabel } = useStatsPeriod("30d");

   // Queries
   const overviewQuery = useStatsOverview(dateRange);
   const trendQuery = useRevenueTrend(dateRange);
   const costQuery = useCostBreakdown(dateRange);
   const tableQuery = useSessionsTable(dateRange);

   const overview = overviewQuery.data ?? null;
   const trendData = trendQuery.data ?? [];
   const costData = costQuery.data ?? null;
   const tableData = tableQuery.data ?? [];

   const isOverviewLoading = overviewQuery.isLoading;
   const isTrendLoading = trendQuery.isLoading;
   const isCostLoading = costQuery.isLoading;
   const isTableLoading = tableQuery.isLoading;

   const isEmpty = !isOverviewLoading && (overview?.sessionCount ?? 0) === 0;

   return (
      <ConfigProvider theme={{ token: { colorPrimary: "#7b41b4", borderRadius: 16 } }}>
         <motion.div variants={pageVariants} initial="hidden" animate="show" className="flex flex-col gap-5 pb-10 select-none font-sans">
            {/* Header + Period Selector */}
            <StatsHeader
               activePeriod={activePeriod}
               onPeriodChange={setActivePeriod}
               customRange={customRange}
               onCustomRangeChange={setCustomRange}
            />

            {/* Empty State */}
            {isEmpty ? (
               <EmptyStatsState periodLabel={periodLabel} />
            ) : (
               <>
                  {/* Hero profit card */}
                  <HeroMetricsCard overview={overview} isLoading={isOverviewLoading} />

                  {/* 3 metric pills */}
                  <MetricsPillRow overview={overview} isLoading={isOverviewLoading} />

                  {/* Revenue trend chart */}
                  <RevenueTrendChart data={trendData} isLoading={isTrendLoading} period={activePeriod} />

                  {/* Cost breakdown + Payment method in 2-col on wide screens */}
                  <CostBreakdownCard data={costData} isLoading={isCostLoading} />

                  <PaymentMethodCard
                     totalCash={overview?.totalCash ?? 0}
                     totalTransfer={overview?.totalTransfer ?? 0}
                     isLoading={isOverviewLoading}
                  />

                  {/* Insights card */}
                  <InsightsCard overview={overview} isLoading={isOverviewLoading} periodLabel={periodLabel} />

                  {/* Sessions detail table */}
                  <SessionsTable data={tableData} isLoading={isTableLoading} />
               </>
            )}
         </motion.div>
      </ConfigProvider>
   );
};

export default StatsPage;
