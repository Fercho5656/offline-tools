import * as avif from '@jsquash/avif'
import * as jpeg from '@jsquash/jpeg'
import * as jxl from '@jsquash/jxl'
import * as png from '@jsquash/png'
import * as webp from '@jsquash/webp'
import { loadWasm } from '../utils/wasm'
import type { ImgType } from '@models/imageTypes'

let isConverting = false;

/**
 * Decode the given image buffer to an ImageData object.
 * @param imgType The type of the image to decode.
 * @param imgBuffer The image buffer to decode.
 * @returns The decoded ImageData object.
 */
async function decode(imgType: ImgType, imgBuffer: ArrayBuffer): Promise<ImageData> {
  await loadWasm(imgType as ImgType)

  try {
    switch (imgType) {
      case 'avif':
        return await avif.decode(imgBuffer);
      case 'jpeg':
      case 'jpg':
        return await jpeg.decode(imgBuffer);
      case 'jxl':
        return await jxl.decode(imgBuffer);
      case 'png':
        return await png.decode(imgBuffer);
      case 'webp':
        return await webp.decode(imgBuffer);
      default:
        throw new Error(`Unsupported image type: ${imgType}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to decode image: ${error.message}`)
  }
}

/**
 * Encode the given ImageData object to an image buffer.
 * @param imgType The type of the image to encode.
 * @param imgData The ImageData object to encode.
 * @returns The encoded image buffer.
 */
async function encode(imgType: ImgType, imgData: ImageData): Promise<ArrayBuffer> {
  await loadWasm(imgType as ImgType)

  try {
    switch (imgType) {
      case 'avif':
        return await avif.encode(imgData);
      case 'jpeg':
      case 'jpg':
        return await jpeg.encode(imgData);
      case 'jxl':
        return await jxl.encode(imgData);
      case 'png':
        return await png.encode(imgData);
      case 'webp':
        return await webp.encode(imgData);
      default:
        throw new Error(`Unsupported image type: ${imgType}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to encode image: ${error.message}`)
  }
}

export async function convert(sourceType: ImgType, outputType: ImgType, imgBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const imgData = await decode(sourceType, imgBuffer)
  return await encode(outputType, imgData)
}

addEventListener('message', async (event) => {
  const { sourceType, outputType, imgBuffer } = event.data

  if (isConverting) {
    throw new Error('Worker Bussy: Already converting an image')
  }

  if (!sourceType || !outputType || !imgBuffer) {
    throw new Error('Worker Error: Missing parameters')
  }

  isConverting = true

  try {
    const convertedImgBuffer = await convert(sourceType, outputType, imgBuffer)
    postMessage({ data: convertedImgBuffer })
  } catch (error: any) {
    postMessage({ error: error.message })
  } finally {
    isConverting = false
  }
})