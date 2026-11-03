/**
 * Video configuration for Devon Stank-style cinematic video presentation.
 * Uses the local videos placed inside `frontend/public/` (back.mp4 & bakcs.mp4).
 */
const publicBase = import.meta.env.BASE_URL.replace(/\/$/, "");
const backVideoUrl = `${publicBase}/back.mp4`;
const bakcsVideoUrl = `${publicBase}/bakcs.mp4`;

export const VIDEO_CONFIG = {
  // Background videos for the home screen
  heroVideos: [
    { id: "back", label: "Scene 01", url: backVideoUrl },
    { id: "bakcs", label: "Scene 02", url: bakcsVideoUrl },
  ],
  heroVideoUrl: backVideoUrl,
  secondaryVideoUrl: bakcsVideoUrl,

  // Video Introduction Modal (Dedicated player with sound & controls)
  introVideoUrl: bakcsVideoUrl,
  alternateIntroVideoUrl: backVideoUrl,

  // Captions (optional WebVTT file)
  captionsUrl: "",

  // Title for the video modal
  introVideoTitle: "Beka Bayecha — Introduction",
  introVideoDescription:
    "An overview of my full-stack development workflow, engineering standards, and featured projects.",
};
