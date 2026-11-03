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
        // Copy beki.jpg from assets to public as favicon files
        try {
          const publicDir = path.resolve(__dirname, 'public');
          if (!existsSync(publicDir)) {
            mkdirSync(publicDir, { recursive: true });
          }
          const sourceFile = path.resolve(__dirname, 'src/assets/beki.jpg');
          const faviconJpg = path.resolve(publicDir, 'favicon.jpg');
          const bekiJpg = path.resolve(publicDir, 'beki.jpg');
          
          if (existsSync(sourceFile)) {
            copyFileSync(sourceFile, faviconJpg);
            copyFileSync(sourceFile, bekiJpg);
            console.log('✅ Favicon copied from assets/beki.jpg to public/favicon.jpg and public/beki.jpg');
          } else {
            console.warn('⚠️ Source file not found:', sourceFile);
          }
        } catch (error) {
          console.warn('⚠️ Could not copy favicon:', error.message);
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
