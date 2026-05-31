/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Spin, message, ConfigProvider, theme } from "antd";
import { ChevronLeft, HelpCircle, Share2, Plus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

import StepBasicInfo from "./components/StepBasicInfo";
import StepPlayerList from "./components/StepPlayerList";
import PlayerFormDrawer from "./components/PlayerFormDrawer";
import StepShuttleCount from "./components/StepShuttleCount";
import StepFinancialReport from "./components/StepFinancialReport";
import StepSuccess from "./components/StepSuccess";

import { courtApi, shuttleApi } from "../../api/services/categories.api";
import { sessionApi } from "../../api/services/session.api";
import type { IPlayer, ISession, IPersonPayment } from "../../api/services/session.api";
import {
   initIndividualMatches,
   resizeIndividualMatches,
   updateIndividualMatch,
   initIndividualPayments,
   resizeIndividualPayments,
   deriveGroupPaymentStatus,
   calcCollectedRevenue,
} from "../../utils/playerUtils";

// ================================================================
// Types
// ================================================================

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface PlayerFormValues {
   name?: string;
   maleCount?: number;
   femaleCount?: number;
   isPaid?: boolean;
   paymentMethod?: "cash" | "transfer";
}

interface AxiosErrorResponse {
   response?: {
      data?: {
         message?: string;
      };
   };
}

// ================================================================
// Component
// ================================================================

const HostPage = () => {
   const { isDarkMode } = useTheme();
   const navigate = useNavigate();
   const { id: routeId } = useParams<{ id: string }>();
   const [searchParams] = useSearchParams();
   const queryId = searchParams.get("id");
   const queryStep = searchParams.get("step");

   const activeId = routeId ?? queryId ?? null;
   const isViewOnly = !!routeId;

   // ==========================================
   // 1. WIZARD CORE STATE
   // ==========================================
   const [step, setStep] = useState<WizardStep>(1);
   const [sessionId, setSessionId] = useState<string | null>(null);
   const [sessionData, setSessionData] = useState<ISession | null>(null);

   // Step 1: Basic Info States
   const [date, setDate] = useState<string>(() => {
      const today = new Date();
      return today.toISOString().split("T")[0]!;
   });
   const [selectedCourtId, setSelectedCourtId] = useState<string>("");
   const [numberOfCourts, setNumberOfCourts] = useState<number>(2);
   const [hours, setHours] = useState<number>(2);
   const [selectedShuttleId, setSelectedShuttleId] = useState<string>("");
   const [feeMale, setFeeMale] = useState<number>(65000);
   const [feeFemale, setFeeFemale] = useState<number>(55000);

   // Step 2: Guest Player States
   const [playersList, setPlayersList] = useState<IPlayer[]>([]);
   const [isPlayerDrawerOpen, setIsPlayerDrawerOpen] = useState(false);
   const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);

   // Step 3: Shuttlecock & Cost States
   const [usedTubes, setUsedTubes] = useState<number>(3);
   const [usedPieces, setUsedPieces] = useState<number>(5);
   const [sessionNotes, setSessionNotes] = useState<string>("");

   // ==========================================
   // 2. BACKEND QUERY DATA (Courts & Shuttles)
   // ==========================================
   const { data: courtsResponse, isLoading: isLoadingCourts } = useQuery({
      queryKey: ["courts"],
      queryFn: courtApi.getAll,
   });

   const { data: shuttlesResponse, isLoading: isLoadingShuttles } = useQuery({
      queryKey: ["shuttles"],
      queryFn: shuttleApi.getAll,
   });

   const { data: fetchedSessionResponse, isLoading: isLoadingSession } = useQuery({
      queryKey: ["session", activeId],
      queryFn: () => sessionApi.getById(activeId!),
      enabled: !!activeId,
   });

   const courts = useMemo(() => courtsResponse?.data ?? [], [courtsResponse]);
   const shuttles = useMemo(() => shuttlesResponse?.data ?? [], [shuttlesResponse]);

   // Memoised derived lookups — avoid .find() on every render
   const activeCourt = useMemo(() => courts.find((c) => c._id === selectedCourtId), [courts, selectedCourtId]);
   const activeShuttle = useMemo(() => shuttles.find((s) => s._id === selectedShuttleId), [shuttles, selectedShuttleId]);

   // Auto-select first elements in lists if nothing selected yet
   useEffect(() => {
      if (courts.length > 0 && !selectedCourtId && !activeId) {
         setSelectedCourtId(courts[0]!._id!);
      }
   }, [courts, selectedCourtId, activeId]);

   useEffect(() => {
      if (shuttles.length > 0 && !selectedShuttleId && !activeId) {
         setSelectedShuttleId(shuttles[0]!._id!);
      }
   }, [shuttles, selectedShuttleId, activeId]);

   // Load and populate existing session if activeId is present
   useEffect(() => {
      if (fetchedSessionResponse?.data) {
         const session = fetchedSessionResponse.data;
         setSessionId(session._id!);
         setSessionData(session);

         if (session.date) {
            setDate(new Date(session.date).toISOString().split("T")[0]!);
         }
         if (session.court?.courtId) {
            setSelectedCourtId(String(session.court.courtId));
         }
         if (session.court?.numberOfCourts) {
            setNumberOfCourts(session.court.numberOfCourts);
         }
         if (session.court?.hours) {
            setHours(session.court.hours);
         }
         if (session.shuttle?.shuttleId) {
            setSelectedShuttleId(String(session.shuttle.shuttleId));
         }
         if (session.feeSettings?.male) {
            setFeeMale(session.feeSettings.male);
         }
         if (session.feeSettings?.female) {
            setFeeFemale(session.feeSettings.female);
         }
         if (session.players) {
            setPlayersList(session.players);
         }
         if (session.shuttle?.usedQuantity !== undefined) {
            const quantityPerTube = activeShuttle?.quantityPerTube ?? 12;
            const tubes = Math.floor(session.shuttle.usedQuantity / quantityPerTube);
            const pieces = session.shuttle.usedQuantity % quantityPerTube;
            setUsedTubes(tubes);
            setUsedPieces(pieces);
         }
         if (session.notes) {
            setSessionNotes(session.notes);
         }

         if (routeId) {
            setStep(4);
         } else if (queryStep) {
            const parsed = parseInt(queryStep, 10);
            if (parsed >= 1 && parsed <= 5) setStep(parsed as WizardStep);
         } else if (session.currentStep) {
            const cs = session.currentStep;
            if (cs >= 1 && cs <= 5) setStep(cs as WizardStep);
         } else if (session.status === "completed") {
            setStep(4);
         } else {
            setStep(2);
         }
      }
   }, [fetchedSessionResponse, activeShuttle, routeId, queryStep]);

   // ==========================================
   // 3. MUTATIONS (TanStack Query)
   // ==========================================
   const createSessionMutation = useMutation({
      mutationFn: sessionApi.create,
      onSuccess: (res) => {
         setSessionId(res.data._id!);
         setSessionData(res.data);
         setStep(2);
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi khởi tạo buổi host");
      },
   });

   const updatePlayersMutation = useMutation({
      mutationFn: ({ id, players }: { id: string; players: Omit<IPlayer, "_id">[] }) => sessionApi.updatePlayers(id, players, 3),
      onSuccess: (res) => {
         setSessionData(res.data);
         setStep(3);
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi cập nhật người chơi");
      },
   });

   const autoSavePlayersMutation = useMutation({
      mutationFn: ({ id, players }: { id: string; players: Omit<IPlayer, "_id">[] }) => sessionApi.updatePlayers(id, players, 2),
      onSuccess: (res) => {
         setSessionData(res.data);
      },
      onError: (err: AxiosErrorResponse) => {
         console.error("Lỗi tự động lưu danh sách người chơi:", err.response?.data?.message);
      },
   });

   const completeSessionMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: { usedQuantity: number; notes?: string } }) => sessionApi.complete(id, data),
      onSuccess: (res) => {
         setSessionData(res.data);
         setStep(4);
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi hoàn tất buổi host");
      },
   });

   // ==========================================
   // 4. BUSINESS LOGIC HANDLERS — useCallback để tránh re-render
   // ==========================================
   const handleNextStep1 = useCallback(() => {
      if (!selectedCourtId || !selectedShuttleId) {
         message.warning("Vui lòng chọn đầy đủ sân và quả cầu!");
         return;
      }

      const courtObj = courts.find((c) => c._id === selectedCourtId);
      const shuttleObj = shuttles.find((s) => s._id === selectedShuttleId);

      if (!courtObj || !shuttleObj) return;

      const pricePerHour = courtObj.timeSlots?.[0]?.pricePerHour ?? 80000;
      const pricePerPiece = shuttleObj.pricePerPiece ?? Math.round(shuttleObj.pricePerTube / shuttleObj.quantityPerTube);

      createSessionMutation.mutate({
         date,
         court: {
            courtId: selectedCourtId,
            name: courtObj.name,
            pricePerHour,
            numberOfCourts,
            hours,
         },
         shuttle: {
            shuttleId: selectedShuttleId,
            name: shuttleObj.name,
            pricePerPiece,
         },
         feeSettings: {
            male: feeMale,
            female: feeFemale,
         },
      });
   }, [selectedCourtId, selectedShuttleId, courts, shuttles, date, numberOfCourts, hours, feeMale, feeFemale, createSessionMutation]);

   const handleAddPlayerOpen = useCallback(() => {
      setEditingPlayerIndex(null);
      setIsPlayerDrawerOpen(true);
   }, []);

   const handleEditPlayerOpen = useCallback((index: number) => {
      setEditingPlayerIndex(index);
      setIsPlayerDrawerOpen(true);
   }, []);

   const handleSavePlayer = useCallback(
      (playerValues: PlayerFormValues) => {
         const newMaleCount = playerValues.maleCount ?? 0;
         const newFemaleCount = playerValues.femaleCount ?? 0;

         // Preserve or resize individualMatches/individualPayments when editing
         let individualMatches: number[];
         let individualPayments: IPersonPayment[];
         if (editingPlayerIndex !== null) {
            const existingMatches = playersList[editingPlayerIndex]?.individualMatches ?? [];
            individualMatches = resizeIndividualMatches(existingMatches, newMaleCount, newFemaleCount);

            const existingPayments = playersList[editingPlayerIndex]?.individualPayments ?? [];
            individualPayments = resizeIndividualPayments(existingPayments, newMaleCount, newFemaleCount);
         } else {
            individualMatches = initIndividualMatches(newMaleCount, newFemaleCount);
            individualPayments = initIndividualPayments(newMaleCount, newFemaleCount);
         }

         const { isPaid, paymentMethod } = deriveGroupPaymentStatus(individualPayments);

         const playerObj: IPlayer = {
            name: playerValues.name ?? "",
            maleCount: newMaleCount,
            femaleCount: newFemaleCount,
            isCheckedIn: editingPlayerIndex !== null ? (playersList[editingPlayerIndex]?.isCheckedIn ?? false) : false,
            isPaid: editingPlayerIndex !== null ? isPaid : false,
            paymentMethod: editingPlayerIndex !== null ? paymentMethod : undefined,
            individualMatches,
            individualPayments,
         };

         const newList = [...playersList];
         if (editingPlayerIndex !== null) {
            newList[editingPlayerIndex] = playerObj;
         } else {
            newList.push(playerObj);
         }
         setPlayersList(newList);
         setIsPlayerDrawerOpen(false);

         if (sessionId) {
            autoSavePlayersMutation.mutate({ id: sessionId, players: newList });
         }
      },
      [editingPlayerIndex, playersList, sessionId, autoSavePlayersMutation],
   );

   const handleConfirmPayment = useCallback(
      (index: number, isCheckedIn: boolean, payments: IPersonPayment[]) => {
         const newList = [...playersList];
         const { isPaid, paymentMethod } = deriveGroupPaymentStatus(payments);
         newList[index] = {
            ...newList[index]!,
            isCheckedIn,
            isPaid,
            paymentMethod,
            individualPayments: payments,
         };
         setPlayersList(newList);

         if (sessionId) {
            autoSavePlayersMutation.mutate({ id: sessionId, players: newList });
         }
      },
      [playersList, sessionId, autoSavePlayersMutation],
   );

   const handleDeletePlayer = useCallback(
      (index: number) => {
         const newList = [...playersList];
         newList.splice(index, 1);
         setPlayersList(newList);

         if (sessionId) {
            autoSavePlayersMutation.mutate({ id: sessionId, players: newList });
         }
      },
      [playersList, sessionId, autoSavePlayersMutation],
   );

   const handleUpdateMatches = useCallback(
      (playerIdx: number, personIdx: number, delta: number) => {
         const newList = [...playersList];
         const existing = newList[playerIdx]?.individualMatches ?? [];
         newList[playerIdx] = {
            ...newList[playerIdx]!,
            individualMatches: updateIndividualMatch(existing, personIdx, delta),
         };
         setPlayersList(newList);

         if (sessionId) {
            autoSavePlayersMutation.mutate({ id: sessionId, players: newList });
         }
      },
      [playersList, sessionId, autoSavePlayersMutation],
   );

   const handleNextStep2 = useCallback(() => {
      if (playersList.length === 0) {
         message.warning("Vui lòng thêm ít nhất một người chơi vãng lai!");
         return;
      }
      updatePlayersMutation.mutate({
         id: sessionId!,
         players: playersList,
      });
   }, [playersList, sessionId, updatePlayersMutation]);

   const handleNextStep3 = useCallback(() => {
      if (!activeShuttle) return;
      const quantityPerTube = activeShuttle.quantityPerTube ?? 12;
      const totalUsedQuantity = usedTubes * quantityPerTube + usedPieces;

      completeSessionMutation.mutate({
         id: sessionId!,
         data: {
            usedQuantity: totalUsedQuantity,
            notes: sessionNotes,
         },
      });
   }, [activeShuttle, usedTubes, usedPieces, sessionId, sessionNotes, completeSessionMutation]);

   // ==========================================
   // 5. HELPER STATS FOR RENDER — useMemo để không tính lại mỗi render
   // ==========================================
   const totalPlayersCount = useMemo(() => playersList.reduce((acc, curr) => acc + curr.maleCount + curr.femaleCount, 0), [playersList]);

   const totalExpectedRevenue = useMemo(
      () => playersList.reduce((acc, curr) => acc + curr.maleCount * feeMale + curr.femaleCount * feeFemale, 0),
      [playersList, feeMale, feeFemale],
   );

   const totalCollectedRevenue = useMemo(() => calcCollectedRevenue(playersList, feeMale, feeFemale), [playersList, feeMale, feeFemale]);

   const selectedPlayersCount = useMemo(
      () => playersList.filter((p) => p.isCheckedIn).reduce((acc, curr) => acc + curr.maleCount + curr.femaleCount, 0),
      [playersList],
   );

   const currentCourtCost = useMemo(
      () => (activeCourt ? (activeCourt.timeSlots?.[0]?.pricePerHour ?? 80000) * hours * numberOfCourts : 0),
      [activeCourt, hours, numberOfCourts],
   );

   const currentShuttlePricePerPiece = useMemo(
      () => (activeShuttle ? (activeShuttle.pricePerPiece ?? Math.round(activeShuttle.pricePerTube / activeShuttle.quantityPerTube)) : 0),
      [activeShuttle],
   );

   const currentShuttleCost = useMemo(
      () => currentShuttlePricePerPiece * (usedTubes * (activeShuttle?.quantityPerTube ?? 12) + usedPieces),
      [currentShuttlePricePerPiece, usedTubes, activeShuttle, usedPieces],
   );

   // ==========================================
   // 6. RENDER
   // ==========================================
   if (isLoadingCourts || isLoadingShuttles || (activeId && isLoadingSession)) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-[#F2F2F7] dark:bg-black">
            <Spin size="large" />
            <span className="text-sm font-semibold text-black/40 dark:text-white/40">Đang tải thông tin buổi host...</span>
         </div>
      );
   }

   return (
      <ConfigProvider
         theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
               colorPrimary: "#0A84FF",
               borderRadius: 16,
            },
         }}
      >
         <div className="w-full min-h-screen bg-[#F2F2F7] dark:bg-black relative overflow-x-hidden pb-20">
            {/* ── Progress indicator ── */}
            {step < 5 && (
               <div className="w-full h-0.5 bg-black/6 dark:bg-white/6">
                  <div className="h-full bg-[#0A84FF] transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
               </div>
            )}

            {/* ── SHARED HEADER ── */}
            {step < 5 && (
               <header className="sticky top-0 w-full z-50 bg-white/90 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border-b border-black/6 dark:border-white/6 flex items-center justify-between px-4 h-14 transition-all duration-300">
                  {step === 1 ? (
                     <button
                        onClick={() => navigate("/home")}
                        className="text-black/50 dark:text-white/50 text-sm font-semibold hover:text-black dark:hover:text-white transition-colors select-none cursor-pointer"
                     >
                        Hủy
                     </button>
                  ) : (
                     <button
                        onClick={() => {
                           if (isViewOnly) {
                              navigate("/history");
                           } else {
                              setStep((step - 1) as WizardStep);
                           }
                        }}
                        className="flex items-center text-[#0A84FF] text-sm font-semibold hover:opacity-80 transition-all select-none cursor-pointer"
                     >
                        <ChevronLeft size={16} strokeWidth={2.5} className="mr-0.5" />
                        {isViewOnly ? "Lịch sử" : "Quay lại"}
                     </button>
                  )}

                  <h1 className="text-[16px] font-bold tracking-tight text-black dark:text-white absolute left-1/2 -translate-x-1/2 select-none">
                     {step === 1 && "Tạo buổi host"}
                     {step === 2 && "Danh sách vãng lai"}
                     {step === 3 && "Số cầu sử dụng"}
                     {step === 4 && "Báo cáo tài chính"}
                  </h1>

                  {step === 2 ? (
                     <button
                        onClick={handleAddPlayerOpen}
                        className="flex items-center text-[#0A84FF] bg-[#0A84FF]/10 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#0A84FF]/16 active:scale-95 transition-all select-none cursor-pointer"
                     >
                        <Plus size={13} strokeWidth={2.5} className="mr-1" />
                        <span>Thêm</span>
                     </button>
                  ) : step === 4 ? (
                     <button className="text-[#0A84FF] hover:opacity-75 flex items-center justify-center h-9 w-9 rounded-full active:bg-[#0A84FF]/10 transition-colors">
                        <Share2 size={17} strokeWidth={2} />
                     </button>
                  ) : (
                     <button className="text-black/30 dark:text-white/30 hover:opacity-70 flex items-center justify-center h-9 w-9 rounded-full transition-colors">
                        <HelpCircle size={17} strokeWidth={2} />
                     </button>
                  )}
               </header>
            )}

            {/* DETAILED WIZARD STAGE ROUTER */}
            <main className={`pt-4 px-2 max-w-md mx-auto relative z-10 ${step === 5 ? "pt-10!" : ""}`}>
               <AnimatePresence mode="wait">
                  {step === 1 && (
                     <StepBasicInfo
                        date={date}
                        setDate={setDate}
                        courts={courts}
                        selectedCourtId={selectedCourtId}
                        setSelectedCourtId={setSelectedCourtId}
                        numberOfCourts={numberOfCourts}
                        setNumberOfCourts={setNumberOfCourts}
                        hours={hours}
                        setHours={setHours}
                        shuttles={shuttles}
                        selectedShuttleId={selectedShuttleId}
                        setSelectedShuttleId={setSelectedShuttleId}
                        feeMale={feeMale}
                        setFeeMale={setFeeMale}
                        feeFemale={feeFemale}
                        setFeeFemale={setFeeFemale}
                        activeCourt={activeCourt}
                        activeShuttle={activeShuttle}
                        onNext={handleNextStep1}
                        isPending={createSessionMutation.isPending}
                     />
                  )}

                  {step === 2 && (
                     <StepPlayerList
                        date={date}
                        numberOfCourts={numberOfCourts}
                        activeShuttle={activeShuttle}
                        playersList={playersList}
                        feeMale={feeMale}
                        feeFemale={feeFemale}
                        totalPlayersCount={totalPlayersCount}
                        totalExpectedRevenue={totalExpectedRevenue}
                        totalCollectedRevenue={totalCollectedRevenue}
                        selectedPlayersCount={selectedPlayersCount}
                        onAddPlayer={handleAddPlayerOpen}
                        onEditPlayer={handleEditPlayerOpen}
                        onDeletePlayer={handleDeletePlayer}
                        onConfirmPayment={handleConfirmPayment}
                        onUpdateMatches={handleUpdateMatches}
                        onNext={handleNextStep2}
                        isPending={updatePlayersMutation.isPending}
                     />
                  )}

                  {step === 3 && (
                     <StepShuttleCount
                        date={date}
                        courtCost={currentCourtCost}
                        totalPlayersCount={totalPlayersCount}
                        usedTubes={usedTubes}
                        setUsedTubes={setUsedTubes}
                        usedPieces={usedPieces}
                        setUsedPieces={setUsedPieces}
                        notes={sessionNotes}
                        setNotes={setSessionNotes}
                        activeShuttle={activeShuttle}
                        shuttleCost={currentShuttleCost}
                        onNext={handleNextStep3}
                        isPending={completeSessionMutation.isPending}
                     />
                  )}

                  {step === 4 && sessionData && (
                     <StepFinancialReport
                        sessionData={sessionData}
                        notes={sessionNotes}
                        onFinish={isViewOnly ? () => navigate("/history") : () => setStep(5)}
                        isViewOnly={isViewOnly}
                     />
                  )}

                  {step === 5 && sessionData && <StepSuccess date={date} sessionData={sessionData} onFinish={() => navigate("/home")} />}
               </AnimatePresence>
            </main>

            {/* PLAYER DRAWER FOR STEP 2 */}
            <PlayerFormDrawer
               isOpen={isPlayerDrawerOpen}
               onClose={() => setIsPlayerDrawerOpen(false)}
               editingIndex={editingPlayerIndex}
               onSave={handleSavePlayer}
               initialValues={
                  editingPlayerIndex !== null
                     ? {
                          name: playersList[editingPlayerIndex]?.name,
                          maleCount: playersList[editingPlayerIndex]?.maleCount,
                          femaleCount: playersList[editingPlayerIndex]?.femaleCount,
                          isPaid: playersList[editingPlayerIndex]?.isPaid,
                          paymentMethod: playersList[editingPlayerIndex]?.paymentMethod ?? "cash",
                       }
                     : {
                          maleCount: 1,
                          femaleCount: 0,
                          isPaid: false,
                          paymentMethod: "cash",
                       }
               }
            />
         </div>
      </ConfigProvider>
   );
};

export default HostPage;
