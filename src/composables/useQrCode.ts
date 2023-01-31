import jsQR from 'jsqr'
import { ref, Ref, onMounted, onUnmounted } from 'vue'
import QRcode, { QRCodeOptions, QRCodeToDataURLOptions, QRCodeToStringOptions } from 'qrcode'
import { IUseScanningQrCodeObjectStore } from './useScanningQrCodeObjectStore'
import useEmitter from './useEmitter'

export interface IQrCodeHistory {
  id?: number
  data: string
  timestamp: number
}

const defaultOptions = {
  errorCorrectionLevel: 'H',
  quality: 1,
  margin: 1
} as QRCodeOptions

export interface IUseQrCode {
  qrInfo: {
    currentRawValue: Ref<string | null>,
    canvas: Ref<HTMLCanvasElement>,
    loop: Ref<boolean>
  }
  scannerLoop: () => void
  pGetSVGElementQrcode: (data: string, options?: QRCodeToStringOptions) => Promise<string>
  pGetImageDataQrCode: (data: string, options?: QRCodeToDataURLOptions) => Promise<string>
  getSVGElementQrcode: (data: string, options?: QRCodeToStringOptions, cb?: (result: string) => void) => void
  getImageDataQrCode: (data: string, options?: QRCodeToDataURLOptions, cb?: (result: string) => void) => void
}

export default function useQrCode (video?: Ref<HTMLVideoElement | null>, scanningQrCodeObjectStore?: IUseScanningQrCodeObjectStore) : IUseQrCode {
  const emitter = useEmitter()
  const currentRawValue: Ref<string | null> = ref(null)
  const canvas: Ref<HTMLCanvasElement> = ref(document.createElement('canvas'))
  const loop: Ref<boolean> = ref(true)
  const checkQr = (sourceData: any, w: number, h: number) => {
    const context = canvas.value.getContext('2d')
    canvas.value.width = w
    canvas.value.height = h
    context?.drawImage(sourceData, 0, 0, w, h)
    const data = context?.getImageData(0, 0, w, h)
    if (data) {
      const code = jsQR(data.data, w, h)
      if (code && code.data) {
        currentRawValue.value = code.data
        scanningQrCodeObjectStore?.writeScanningQrCodeItem(
          {
            data: code.data,
            timestamp: new Date().getTime()
          }
        )
        loop.value = false
      }
    }
  }
  const scannerLoop = () => {
    if (video?.value) {
      checkQr(video.value, 800, 600)
    }
    if (loop.value) {
      window.requestAnimationFrame(scannerLoop)
    }
  }
  const pGetSVGElementQrcode = async (data: string, options: QRCodeToStringOptions = {}) : Promise<string> => {
    return new Promise((resolve, reject) => {
      QRcode.toString(data, {
        ...defaultOptions,
        type: 'svg',
        ...options
      }, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  const getSVGElementQrcode = (data: string, options: QRCodeToStringOptions = {}, cb?: (result: string) => void) : void => {
    QRcode.toString(data, {
      ...defaultOptions,
      type: 'svg',
      ...options
    }, (error, result) => {
      if (error) {
        throw error
      }
      if (cb) {
        cb(result)
      }
    })
  }
  const pGetImageDataQrCode = async (data: string, options: QRCodeToDataURLOptions = {}) : Promise<string> => {
    return new Promise((resolve, reject) => {
      QRcode.toDataURL(data, {
        ...defaultOptions,
        type: 'image/webp',
        ...options
      }, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      })
    })
  }
  const getImageDataQrCode = (data: string, options: QRCodeToDataURLOptions = {}, cb?: (result: string) => void) : void => {
    QRcode.toDataURL(data, {
      ...defaultOptions,
      type: 'image/webp',
      ...options
    }, (error, result) => {
      if (error) {
        throw error
      }
      if (cb) {
        cb(result)
      }
    })
  }
  onMounted(() => {
    emitter.on('$qrcode:check-image-file', async (imageFile: any) => {
      try {
        const bmp = await createImageBitmap(imageFile)
        checkQr(bmp, bmp.width, bmp.height)
      } catch (e) {
        emitter.emit('$alert-popup:msg', 'Error to open the file')
        emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        emitter.emit('$alert-popup:timeout', 3000)
        emitter.emit('$alert-popup:show')
      }
    })
  })
  onUnmounted(() => {
    emitter.off('$qrcode:check-image-file')
  })
  return {
    qrInfo: {
      currentRawValue,
      canvas,
      loop
    },
    scannerLoop,
    pGetSVGElementQrcode,
    pGetImageDataQrCode,
    getSVGElementQrcode,
    getImageDataQrCode
  }
}
