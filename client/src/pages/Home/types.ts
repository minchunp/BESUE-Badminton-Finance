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

export interface ActiveSession {
   id: string;
   date: string;
   courtName: string;
   playersCount: number;
   currentStep: number; // 1 | 2 | 3
   status: "active" | "draft";
}

export interface HomePageData {
   userName: string;
   scheduledHostsCount: number;
   stats: QuickStatItem[];
   recentSessions: RecentSession[];
   activeSession: ActiveSession | null;
}
