import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ScreenOne from "./partials/screenOne";
import ScreenTwo from "./partials/screenTwo";
import ScreenThree from "./partials/screenThree";
import "../../index.css";

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
   const [step, setStep] = useState(0);

   const handleNext = () => {
      if (step < 2) {
         setStep(step + 1);
      } else {
         onComplete();
      }
   };

   const bgClass = step === 0 ? "bg-mesh-0" : step === 1 ? "bg-mesh-1" : "bg-mesh-2";

   return (
      <div className={`fixed inset-0 ${bgClass} transition-colors duration-700 ease-in-out font-sans overflow-hidden`}>
         <AnimatePresence mode="wait">
            {step === 0 && <ScreenOne onNextPage={handleNext} />}
            {step === 1 && <ScreenTwo onNextPage={handleNext} onComplete={onComplete} />}
            {step === 2 && <ScreenThree onComplete={onComplete} />}
         </AnimatePresence>
      </div>
   );
};

export default Onboarding;
