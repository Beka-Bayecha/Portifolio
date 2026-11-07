import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export interface CompressionResult {
  dataUrl: string;
  sizeKb: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Resizes and compresses an image file using an HTML5 Canvas,
 * keeping aspect ratio within maxWidth / maxHeight.
 * Uses URL.createObjectURL for fast decoding, with FileReader fallback.
 * Guaranteed to resolve quickly without hanging.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 800,
  quality = 0.8
): Promise<CompressionResult> {
  return new Promise((resolve) => {
    // Safety fallback: if anything hangs, resolve raw data URL after 2.5s
    const fallbackTimer = setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        const rawUrl = reader.result as string;
        resolve({
          dataUrl: rawUrl,
          sizeKb: Math.round((rawUrl.length * 3) / 4 / 1024),
          width: 800,
          height: 600,
          format: "jpeg",
        });
      };
      reader.onerror = () => {
        resolve({ dataUrl: "", sizeKb: 0, width: 0, height: 0, format: "none" });
      };
      reader.readAsDataURL(file);
    }, 2500);

    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      // FileReader fallback
    }

    const img = new Image();

    img.onload = () => {
      clearTimeout(fallbackTimer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width || 800;
      let height = img.naturalHeight || img.height || 600;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Fall back to reader
        const reader = new FileReader();
        reader.onload = () => {
          const rawUrl = reader.result as string;
          resolve({
            dataUrl: rawUrl,
            sizeKb: Math.round((rawUrl.length * 3) / 4 / 1024),
            width,
            height,
            format: "jpeg",
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first, fallback to JPEG
      let dataUrl = "";
      let format = "webp";
      try {
        dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          format = "jpeg";
        }
      } catch {
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        format = "jpeg";
      }

      const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
      resolve({ dataUrl, sizeKb, width, height, format });
    };

    img.onerror = () => {
      clearTimeout(fallbackTimer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => {
        const rawUrl = reader.result as string;
        resolve({
          dataUrl: rawUrl,
          sizeKb: Math.round((rawUrl.length * 3) / 4 / 1024),
          width: 800,
          height: 600,
          format: "jpeg",
        });
      };
      reader.onerror = () => {
        resolve({ dataUrl: "", sizeKb: 0, width: 0, height: 0, format: "none" });
      };
      reader.readAsDataURL(file);
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = () => {
        clearTimeout(fallbackTimer);
        resolve({ dataUrl: "", sizeKb: 0, width: 0, height: 0, format: "none" });
      };
      reader.readAsDataURL(file);
    }
  });
}

/**
 * Converts a data URL string to a Blob
 */
function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1] || "image/jpeg";
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

/**
 * Fast, resilient image upload:
 * 1. Instantly compresses image into lightweight WebP/JPEG data URL (~30-70KB).
 * 2. Attempts Firebase Storage upload with a strict 2-second timeout race.
 * 3. If Cloud Storage fails, times out, or isn't enabled, instantly returns the compressed data URL.
 * NEVER hangs or blocks the UI!
 */
export async function uploadImageSmart(
  file: File,
  folder = "portfolio",
  onProgress?: (status: string) => void
): Promise<string> {
  onProgress?.("Optimizing image…");
  const compressed = await compressImageFile(file, 1000, 800, 0.8);

  if (!compressed.dataUrl) {
    throw new Error("Unable to read image file.");
  }

  // Attempt Firebase Storage in a strict 2-second timeout race
  try {
    const uploadWithTimeout = async () => {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storage, storagePath);
      const blob = dataURLToBlob(compressed.dataUrl);

      await uploadBytes(storageRef, blob, {
        contentType: compressed.format === "webp" ? "image/webp" : "image/jpeg",
      });

      return await getDownloadURL(storageRef);
    };

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Cloud storage timeout")), 2000)
    );

    const downloadUrl = await Promise.race([uploadWithTimeout(), timeoutPromise]);
    onProgress?.("Uploaded to cloud!");
    return downloadUrl;
  } catch (err) {
    // Cloud storage timed out or bucket is not enabled/configured
    // Silently and safely use the optimized compressed data URL
    console.info("Using optimized embedded image format (instant & offline safe)");
    onProgress?.("Ready!");
    return compressed.dataUrl;
  }
}
