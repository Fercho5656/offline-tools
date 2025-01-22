import type { ImgType } from "@models/imageTypes"

/**
  * Get the image type from the given image blob.
 * @param image  The image blob to get the type from.
 * @returns The image type.
 */
export function getImgType(image: Blob): ImgType {
  const extension = image.type.split('/')[1]
  return extension as ImgType
}

/**
 * Convert the given image buffer to the specified output type.
 * @param sourceType The type of the source image.
 * @param outputType The type of the output image.
 * @param imgBuffer The image buffer to convert.
 * @returns The converted image buffer.
 */
export async function convert(sourceType: ImgType, outputType: ImgType, imgBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  if (!window.Worker) return Promise.reject(new Error('Web Workers are not supported'))
  const worker = new Worker(new URL('@workers/imageProcessingWorker.ts', import.meta.url), { type: 'module' })

  worker.postMessage({ sourceType, outputType, imgBuffer })

  return new Promise((resolve, reject) => {
    worker.addEventListener('message', (event) => {
      resolve(event.data)
    })
    worker.addEventListener('error', (error) => {
      reject(error)
    })
  })
}