/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Spin, message, ConfigProvider } from "antd";
import { ChevronLeft, HelpCircle, Share2, Plus } from "lucide-react";

import StepBasicInfo from "./components/StepBasicInfo";
import StepPlayerList from "./components/StepPlayerList";
import PlayerFormDrawer from "./components/PlayerFormDrawer";
import StepShuttleCount from "./components/StepShuttleCount";
import StepFinancialReport from "./components/StepFinancialReport";
import StepSuccess from "./components/StepSuccess";

import { courtApi, shuttleApi } from "../../api/services/categories.api";
import { sessionApi } from "../../api/services/session.api";
import type { IPlayer, ISession } from "../../api/services/session.api";

type WizardStep = 1 | 2 | 3 | 4 | 5;

const HostPage = () => {
   const navigate = useNavigate();

   // ==========================================
   // 1. WIZARD CORE STATE
   // ==========================================
   const [step, setStep] = useState<WizardStep>(1);
   const [sessionId, setSessionId] = useState<string | null>(null);
   const [sessionData, setSessionData] = useState<ISession | null>(null);

   // Step 1: Basic Info States
   const [date, setDate] = useState<string>(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
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

   const courts = courtsResponse?.data || [];
   const shuttles = shuttlesResponse?.data || [];

   const activeCourt = courts.find((c) => c._id === selectedCourtId);
   const activeShuttle = shuttles.find((s) => s._id === selectedShuttleId);

   // Auto-select first elements in lists if nothing selected yet
   useEffect(() => {
      if (courts.length > 0 && !selectedCourtId) {
         setSelectedCourtId(courts[0]._id!);
      }
   }, [courts, selectedCourtId]);

   useEffect(() => {
      if (shuttles.length > 0 && !selectedShuttleId) {
         setSelectedShuttleId(shuttles[0]._id!);
      }
   }, [shuttles, selectedShuttleId]);

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
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khởi tạo buổi host");
      },
   });

   const updatePlayersMutation = useMutation({
      mutationFn: ({ id, players }: { id: string; players: Omit<IPlayer, "_id">[] }) => sessionApi.updatePlayers(id, players),
      onSuccess: (res) => {
         setSessionData(res.data);
         setStep(3);
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi cập nhật người chơi");
      },
   });

   const completeSessionMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: { usedQuantity: number; notes?: string } }) => sessionApi.complete(id, data),
      onSuccess: (res) => {
         setSessionData(res.data);
         setStep(4);
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi hoàn tất buổi host");
      },
   });

   // ==========================================
   // 4. BUSINESS LOGIC HANDLERS
   // ==========================================
   const handleNextStep1 = () => {
      if (!selectedCourtId || !selectedShuttleId) {
         message.warning("Vui lòng chọn đầy đủ sân và quả cầu!");
         return;
      }

      const courtObj = courts.find((c) => c._id === selectedCourtId);
      const shuttleObj = shuttles.find((s) => s._id === selectedShuttleId);

      if (!courtObj || !shuttleObj) return;

      const pricePerHour = courtObj.timeSlots?.[0]?.pricePerHour || 80000;
      const pricePerPiece = shuttleObj.pricePerPiece || Math.round(shuttleObj.pricePerTube / shuttleObj.quantityPerTube);

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
   };

   // Step 2 Subform Handlers
   const handleAddPlayerOpen = () => {
      setEditingPlayerIndex(null);
      setIsPlayerDrawerOpen(true);
   };

   const handleEditPlayerOpen = (index: number) => {
      setEditingPlayerIndex(index);
      setIsPlayerDrawerOpen(true);
   };

   const handleSavePlayer = (playerValues: any) => {
      const playerObj: IPlayer = {
         name: playerValues.name,
         maleCount: playerValues.maleCount || 0,
         femaleCount: playerValues.femaleCount || 0,
         isCheckedIn: editingPlayerIndex !== null ? playersList[editingPlayerIndex].isCheckedIn : false,
         isPaid: editingPlayerIndex !== null ? playersList[editingPlayerIndex].isPaid : false,
         paymentMethod: editingPlayerIndex !== null ? playersList[editingPlayerIndex].paymentMethod : undefined,
      };

      if (editingPlayerIndex !== null) {
         const newList = [...playersList];
         newList[editingPlayerIndex] = playerObj;
         setPlayersList(newList);
      } else {
         setPlayersList([...playersList, playerObj]);
      }
      setIsPlayerDrawerOpen(false);
   };

   const handleTogglePlayerStatus = (
      index: number,
      isCheckedIn: boolean,
      isPaid: boolean,
      paymentMethod?: "cash" | "transfer"
   ) => {
      const newList = [...playersList];
      newList[index] = {
         ...newList[index],
         isCheckedIn,
         isPaid,
         paymentMethod,
      };
      setPlayersList(newList);
   };

   const handleDeletePlayer = (index: number) => {
      const newList = [...playersList];
      newList.splice(index, 1);
      setPlayersList(newList);
   };

   const handleNextStep2 = () => {
      if (playersList.length === 0) {
         message.warning("Vui lòng thêm ít nhất một người chơi vãng lai!");
         return;
      }
      updatePlayersMutation.mutate({
         id: sessionId!,
         players: playersList,
      });
   };

   // Step 3 Handlers
   const handleNextStep3 = () => {
      if (!activeShuttle) return;
      const quantityPerTube = activeShuttle.quantityPerTube || 12;
      const totalUsedQuantity = usedTubes * quantityPerTube + usedPieces;

      completeSessionMutation.mutate({
         id: sessionId!,
         data: {
            usedQuantity: totalUsedQuantity,
            notes: sessionNotes,
         },
      });
   };

   // ==========================================
   // 5. HELPER STATS FOR RENDER
   // ==========================================
   const totalPlayersCount = playersList.reduce((acc, curr) => acc + curr.maleCount + curr.femaleCount, 0);
   const totalExpectedRevenue = playersList.reduce((acc, curr) => acc + curr.maleCount * feeMale + curr.femaleCount * feeFemale, 0);
   const totalCollectedRevenue = playersList.reduce(
      (acc, curr) => (curr.isPaid ? acc + curr.maleCount * feeMale + curr.femaleCount * feeFemale : acc),
      0,
   );
   const selectedPlayersCount = playersList.filter((p) => p.isCheckedIn).reduce((acc, curr) => acc + curr.maleCount + curr.femaleCount, 0);

   const currentCourtCost = activeCourt ? (activeCourt.timeSlots?.[0]?.pricePerHour || 80000) * hours * numberOfCourts : 0;
   const currentShuttlePricePerPiece = activeShuttle
      ? activeShuttle.pricePerPiece || Math.round(activeShuttle.pricePerTube / activeShuttle.quantityPerTube)
      : 0;
   const currentShuttleCost = currentShuttlePricePerPiece * (usedTubes * (activeShuttle?.quantityPerTube || 12) + usedPieces);

   if (isLoadingCourts || isLoadingShuttles) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen gap-3">
            <Spin size="large" className="text-[#7b41b4]" />
            <span className="text-sm font-semibold text-gray-400">Đang khởi tạo thuật thuật wizard...</span>
         </div>
      );
   }

   return (
      <ConfigProvider
         theme={{
            token: {
               colorPrimary: "#7b41b4",
               borderRadius: 16,
            },
         }}
      >
         <div className="ronded-2xl! w-full min-h-screen bg-[#F9F9F9] relative overflow-x-hidden pb-20">
            {/* Background glass glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-linear-to-br from-[#c185fd]/20 to-transparent blur-[80px] pointer-events-none z-0" />
            <div className="fixed bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#ffb2b9]/10 blur-[100px] pointer-events-none z-0" />

            {/* SHARED HEADER RENDERING */}
            {step < 5 && (
               <header className="rounded-tr-xl rounded-tl-xl sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm flex items-center justify-between px-4 h-16 transition-all duration-300">
                  {step === 1 ? (
                     <button
                        onClick={() => navigate("/home")}
                        className="text-gray-500 font-sans text-sm font-bold hover:opacity-85 transition-all select-none cursor-pointer"
                     >
                        Hủy
                     </button>
                  ) : (
                     <button
                        onClick={() => setStep((step - 1) as WizardStep)}
                        className="flex items-center text-[#7b41b4] font-sans text-sm font-bold hover:opacity-85 transition-all select-none cursor-pointer"
                     >
                        <ChevronLeft size={16} strokeWidth={2.5} className="mr-0.5" />
                        Quay lại
                     </button>
                  )}

                  <h1 className="font-sans text-base font-extrabold tracking-tight text-gray-900 absolute left-1/2 -translate-x-1/2 select-none">
                     {step === 1 && "Tạo buổi host"}
                     {step === 2 && "Danh sách vãng lai"}
                     {step === 3 && "Số cầu sử dụng"}
                     {step === 4 && "Báo cáo tài chính"}
                  </h1>

                  {step === 2 ? (
                     <button
                        onClick={handleAddPlayerOpen}
                        className="flex items-center text-[#7b41b4] bg-purple-50/70 border border-purple-100 px-3 py-1.5 rounded-full font-sans text-xs font-bold hover:bg-[#efdbff] active:scale-95 transition-all select-none cursor-pointer"
                     >
                        <Plus size={14} strokeWidth={2.5} className="mr-1" />
                        <span>Thêm</span>
                     </button>
                  ) : step === 4 ? (
                     <button className="text-[#7b41b4] hover:opacity-80 flex items-center justify-center h-10 w-10 rounded-full active:bg-purple-50 transition-colors">
                        <Share2 size={18} strokeWidth={2} />
                     </button>
                  ) : (
                     <button className="text-gray-400 hover:opacity-80 flex items-center justify-center h-10 w-10 rounded-full active:bg-gray-100 transition-colors">
                        <HelpCircle size={18} strokeWidth={2} />
                     </button>
                  )}
               </header>
            )}

            {/* DETAILED WIZARD STAGE ROUTER */}
            <main className={`pt-5 px-4 max-w-md mx-auto relative z-10 ${step === 5 ? "pt-10!" : ""}`}>
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
                        onTogglePlayerStatus={handleTogglePlayerStatus}
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

                  {step === 4 && sessionData && <StepFinancialReport sessionData={sessionData} notes={sessionNotes} onFinish={() => setStep(5)} />}

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
                          name: playersList[editingPlayerIndex].name,
                          maleCount: playersList[editingPlayerIndex].maleCount,
                          femaleCount: playersList[editingPlayerIndex].femaleCount,
                          isPaid: playersList[editingPlayerIndex].isPaid,
                          paymentMethod: playersList[editingPlayerIndex].paymentMethod || "cash",
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
