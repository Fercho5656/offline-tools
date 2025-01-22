import type { ImgType } from '@models/imageTypes';

const importedWasm = new Map<ImgType, boolean>();

/**
 * Load the WASM module for the given image type if it hasn't been loaded yet.
 * @param imgType The image type to load the wasm module for.
 */
export async function loadWasm(imgType: ImgType): Promise<void> {
  if (importedWasm.has(imgType)) return;

  try {
    switch (imgType) {
      case 'avif':
        await import('@jsquash/avif');
        break;
      case 'jpeg':
      case 'jpg':
        await import('@jsquash/jpeg');
        break;
      case 'jxl':
        await import('@jsquash/jxl');
        break;
      case 'png':
        await import('@jsquash/png');
        break;
      case 'webp':
        await import('@jsquash/webp');
        break;
      default:
        throw new Error(`Unsupported image type: ${imgType}`);
    }
    importedWasm.set(imgType, true);
  } catch (error: any) {
    throw new Error(`Failed to load wasm module: ${error.message}`);
  }
}