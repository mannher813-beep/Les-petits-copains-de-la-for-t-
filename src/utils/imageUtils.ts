// Cache for processed transparent cutout image URLs
const cutoutCache = new Map<string, string>();

/**
 * Dynamically converts solid/near-white backgrounds from 3D studio renders into 100% transparent PNGs.
 * This guarantees a clean, borderless, cutout (détouré) 3D character pop-out effect without rectangular frames.
 */
export function getCutoutImage(src: string): Promise<string> {
  if (!src) return Promise.resolve(src);
  if (cutoutCache.has(src)) {
    return Promise.resolve(cutoutCache.get(src)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Check top-left corner pixel to sample the studio background color
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        // Only apply automatic background removal if background is bright/light (typical studio 3D render)
        const isLightBg = bgR > 200 && bgG > 200 && bgB > 200;

        if (!isLightBg) {
          cutoutCache.set(src, src);
          resolve(src);
          return;
        }

        // Process pixels to make studio background transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate color difference from sampled background color
          const diffR = Math.abs(r - bgR);
          const diffG = Math.abs(g - bgG);
          const diffB = Math.abs(b - bgB);
          const maxDiff = Math.max(diffR, diffG, diffB);
          const totalDiff = diffR + diffG + diffB;

          // If pixel matches the light studio background
          if (maxDiff < 38 && totalDiff < 75) {
            data[i + 3] = 0; // Completely transparent
          } else if (maxDiff < 60 && totalDiff < 120) {
            // Smooth edge pixels for clean anti-aliased cutout
            const factor = (maxDiff - 38) / 22;
            data[i + 3] = Math.floor(255 * Math.max(0, Math.min(1, factor)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL("image/png");
        cutoutCache.set(src, transparentDataUrl);
        resolve(transparentDataUrl);
      } catch (err) {
        console.warn("Cutout image processing fallback:", err);
        resolve(src);
      }
    };

    img.onerror = () => resolve(src);
    img.src = src;
  });
}
