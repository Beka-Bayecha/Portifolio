import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 12 + 6;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (!doneRef.current) {
            doneRef.current = true;
            setTimeout(() => onComplete(), 400);
          }
          return 100;
        }
        return next;
      });
    }, 80);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0c0e] text-white select-none"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Monogram */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-full bg-white text-black font-heading font-black text-lg flex items-center justify-center tracking-wider shadow-2xl"
        >
          BB
        </motion.div>

        {/* Name & Title */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading font-bold text-2xl tracking-wider uppercase text-white"
          >
            Beka Bayecha
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1 font-medium"
          >
            Full-Stack Developer
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="w-44 flex flex-col items-center gap-2 mt-2">
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {Math.round(Math.min(progress, 100))}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
