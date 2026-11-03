import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Play, Pause, ArrowRight, Film } from "lucide-react";
import { VIDEO_CONFIG } from "@/lib/videoConfig";
import VideoModal from "@/components/common/VideoModal";

export const Hero = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax Scroll Animation Setup
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Scroll transforms for cinematic depth without adding any dark overlay
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Ensure video autoplays reliably with zero muted policy issues
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.warn("Video playback attempt:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeVideoIndex, isPlaying]);

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Switch video scene
  const switchScene = (idx: number) => {
    setActiveVideoIndex(idx);
    setIsPlaying(true);
  };

  return (
    <>
      <section
        id="home"
        ref={heroRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Fullscreen Video Background Layer with Scroll Parallax (ZERO DARK OPACITY OVERLAYS) */}
        <motion.div
          style={{ scale: videoScale, y: videoY }}
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none will-change-transform z-0"
        >
          <video
            ref={videoRef}
            key={VIDEO_CONFIG.heroVideos[activeVideoIndex].url}
            src={VIDEO_CONFIG.heroVideos[activeVideoIndex].url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Hero Foreground Content with Scroll Parallax */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="container mx-auto px-6 sm:px-10 relative z-20 pt-28 pb-24 flex flex-col justify-center min-h-screen will-change-transform"
        >
          <div className="max-w-3xl">
            {/* Eyebrow Label with pulse indicator */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 mb-5 shadow-2xl"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                Full-Stack Developer
              </span>
            </motion.div>

            {/* Primary Bold Headline with Strong Readable Text Shadow */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,1)] [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%),_0_4px_24px_rgb(0_0_0_/_80%)]"
            >
              Building fast, scalable{" "}
              <span className="italic font-light text-zinc-100 underline decoration-white underline-offset-8">
                web systems.
              </span>
            </motion.h1>

            {/* Confident Personal Introduction - Short & Direct */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-white text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] [text-shadow:_0_2px_10px_rgb(0_0_0_/_90%)]"
            >
              Hi, I'm <strong className="text-white font-bold">Beka Bayecha</strong>. I engineer dependable digital products and robust full-stack architectures.
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Primary Action leading to work */}
              <a
                href="#work"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-zinc-200 transition-all duration-200 shadow-2xl group hover:scale-105 active:scale-98"
              >
                <span>View Projects</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              {/* Secondary Action for Introduction Video */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-black/80 hover:bg-black text-white font-bold text-sm uppercase tracking-wider backdrop-blur-md border border-white/40 transition-all duration-200 group hover:scale-105 active:scale-98 shadow-2xl"
              >
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play size={9} className="fill-black ml-0.5" />
                </div>
                <span>Watch Intro</span>
              </button>
            </motion.div>
          </div>

          {/* Bottom Bar: Scroll Indicator & Video Controls */}
          <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-10 flex items-end justify-between pointer-events-auto">
            {/* Left: Animated Scroll Indicator with Mouse Pill */}
            <motion.div
              style={{ opacity: scrollPromptOpacity }}
              className="flex items-center gap-3 text-white pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
            >
              {/* Animated Mouse Wheel Pill */}
              <div className="w-5 h-8 rounded-full border-2 border-white flex items-start justify-center p-1 bg-black/60 backdrop-blur-sm shadow-xl">
                <motion.div
                  animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="w-1.5 h-2 rounded-full bg-white shadow-sm"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">
                  Scroll down
                </span>
                <span className="text-[9px] font-mono text-zinc-200">
                  Explore portfolio
                </span>
              </div>
            </motion.div>

            {/* Right: Background Video Scene Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-2 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/25 text-xs font-mono shadow-2xl"
            >
              {/* Play/Pause background video button */}
              <button
                onClick={togglePlay}
                title={isPlaying ? "Pause background video" : "Play background video"}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                aria-label="Toggle background video playback"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>

              <span className="pl-1 pr-1 text-[10px] text-zinc-300 uppercase tracking-widest hidden sm:inline-flex items-center gap-1 font-semibold">
                <Film size={11} /> Video:
              </span>

              {/* Scene Switcher Buttons */}
              {VIDEO_CONFIG.heroVideos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => switchScene(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    activeVideoIndex === idx
                      ? "bg-white text-black shadow-lg"
                      : "text-zinc-300 hover:text-white hover:bg-white/20"
                  }`}
                >
                  {vid.label}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Video Modal Overlay */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </>
  );
};

export default Hero;
