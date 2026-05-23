export interface QuickStatItem {
   id: string;
   icon: string;
   label: string;
   value: string | number;
   unit?: string;
}

export interface RecentSession {
   id: string;
   date: string;
   courtName: string;
   profit: number;
   status: "complete" | "reject";
   quantityPlayer: number;
}

export interface HomePageData {
   userName: string;
   scheduledHostsCount: number;
   stats: QuickStatItem[];
   recentSessions: RecentSession[];
}
