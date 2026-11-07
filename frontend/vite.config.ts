import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync, existsSync, mkdirSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: 'copy-favicon',
      buildStart() {
        try {
          const publicDir = path.resolve(__dirname, 'public');
          if (!existsSync(publicDir)) {
            mkdirSync(publicDir, { recursive: true });
          }
          const sourceLogo = path.resolve(__dirname, 'src/assets/logo.png');
          const sourceFavicon = path.resolve(__dirname, 'src/assets/favicon.png');
          const sourceEmblem = path.resolve(__dirname, 'src/assets/logo-emblem.png');
          const destLogo = path.resolve(publicDir, 'logo.png');
          const destFavicon = path.resolve(publicDir, 'favicon.png');
          const destApple = path.resolve(publicDir, 'apple-touch-icon.png');
          const destEmblem = path.resolve(publicDir, 'logo-emblem.png');
          const bePng = path.resolve(publicDir, 'be.png');
          
          if (existsSync(sourceFavicon)) {
            copyFileSync(sourceFavicon, destFavicon);
            copyFileSync(sourceFavicon, destApple);
            copyFileSync(sourceFavicon, bePng);
          }
          if (existsSync(sourceLogo)) {
            copyFileSync(sourceLogo, destLogo);
          }
          if (existsSync(sourceEmblem)) {
            copyFileSync(sourceEmblem, destEmblem);
          }
          console.log('✅ Black background favicon and logo copied to public directory');
        } catch (error: unknown) {
          console.warn('⚠️ Could not copy favicon:', (error as Error)?.message);
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  publicDir: 'public',
});
