/**
 * Client-side high-performance image compression using HTML5 Canvas.
 * Automatically resizes large images (e.g. 10MB-15MB phone photos) down to web-optimized dimensions (max 1920px)
 * and compresses them to ~300KB-500KB before uploading to the server.
 * This makes uploads 20x to 30x faster and prevents network timeouts.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = options;

  // If not an image (or gif/svg which shouldn't be canvas compressed), return as-is
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  // If file is already small (< 300KB), return as-is
  if (file.size <= 300 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Preserve aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const outputType = 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              return resolve(file); // Keep original if compression didn't reduce size
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}

/**
 * Batch compressor with progress reporting
 */
export async function compressImagesBatch(
  files: FileList | File[],
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const fileArray = Array.from(files);
  const total = fileArray.length;
  const compressed: File[] = [];

  for (let i = 0; i < total; i++) {
    const original = fileArray[i];
    const comp = await compressImage(original);
    compressed.push(comp);
    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  return compressed;
}
