import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Volume2, Info, Film } from "lucide-react";
import { VIDEO_CONFIG } from "@/lib/videoConfig";
import devImage from "@/assets/dev.jpg";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(VIDEO_CONFIG.heroVideos[0].url);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [selectedVideoUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-4xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/50">
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  {VIDEO_CONFIG.introVideoTitle}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                  {VIDEO_CONFIG.introVideoDescription}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Switcher between the two videos */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                  {VIDEO_CONFIG.heroVideos.map((vid) => (
                    <button
                      key={vid.id}
                      onClick={() => setSelectedVideoUrl(vid.url)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        selectedVideoUrl === vid.url
                          ? "bg-white text-black shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {vid.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close video player"
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-2 flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Player Area */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                poster={devImage}
                className="w-full h-full object-contain"
              >
                <source src={selectedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Footer with note */}
            <div className="px-6 py-3 bg-[#0c0d0f] border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Info size={13} className="text-zinc-500" />
                <span>Playing from <code className="text-zinc-300 font-mono">public{selectedVideoUrl}</code></span>
              </span>

              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-xs font-sans"
              >
                Done Watching
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default VideoModal;
