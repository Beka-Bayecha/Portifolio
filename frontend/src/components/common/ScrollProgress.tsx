import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-slate-200 dark:bg-white/10 z-50 pointer-events-none"
      style={{ scaleX, transformOrigin: "0%" }}
    >
      <motion.div
        className="h-full bg-slate-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{ scaleX }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
