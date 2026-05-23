/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPlayer, ISession } from "../../api/services/session.api";
import type { ICourt, IShuttle } from "../Categories/types";

export interface StepBasicInfoProps {
   date: string;
   setDate: (date: string) => void;
   courts: ICourt[];
   selectedCourtId: string;
   setSelectedCourtId: (id: string) => void;
   numberOfCourts: number;
   setNumberOfCourts: (count: number) => void;
   hours: number;
   setHours: (hours: number) => void;
   shuttles: IShuttle[];
   selectedShuttleId: string;
   setSelectedShuttleId: (id: string) => void;
   feeMale: number;
   setFeeMale: (fee: number) => void;
   feeFemale: number;
   setFeeFemale: (fee: number) => void;
   activeCourt?: ICourt;
   activeShuttle?: IShuttle;
   onNext: () => void;
   isPending: boolean;
}

export interface StepPlayerListProps {
   date: string;
   numberOfCourts: number;
   activeShuttle?: IShuttle;
   playersList: IPlayer[];
   feeMale: number;
   feeFemale: number;
   totalPlayersCount: number;
   totalExpectedRevenue: number;
   totalCollectedRevenue: number;
   selectedPlayersCount: number;
   onAddPlayer: () => void;
   onEditPlayer: (index: number) => void;
   onDeletePlayer: (index: number) => void;
   onTogglePlayerStatus: (index: number, isCheckedIn: boolean, isPaid: boolean, paymentMethod?: "cash" | "transfer") => void;
   onNext: () => void;
   isPending: boolean;
}

export interface PlayerFormDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   editingIndex: number | null;
   onSave: (values: any) => void;
   initialValues: any;
}

export interface StepShuttleCountProps {
   date: string;
   courtCost: number;
   totalPlayersCount: number;
   usedTubes: number;
   setUsedTubes: (tubes: number) => void;
   usedPieces: number;
   setUsedPieces: (pieces: number) => void;
   notes: string;
   setNotes: (notes: string) => void;
   activeShuttle?: IShuttle;
   shuttleCost: number;
   onNext: () => void;
   isPending: boolean;
}

export interface StepFinancialReportProps {
   sessionData: ISession;
   notes?: string;
   onFinish: () => void;
}

export interface StepSuccessProps {
   date: string;
   sessionData: ISession;
   onFinish: () => void;
}
