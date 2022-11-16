import jsQR from 'jsqr'
import { ref, Ref } from 'vue'
import QRcode, { QRCodeOptions, QRCodeToDataURLOptions, QRCodeToStringOptions } from 'qrcode'
import { IUseScanningQrCodeObjectStore } from './useScanningQrCodeObjectStore'

export interface IQrCodeHistory {
  data: string,
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
  getSVGElementQrcode: (data: string, options?: QRCodeToStringOptions) => Promise<string>
  getImageDataQrCode: (data: string, options?: QRCodeToDataURLOptions) => Promise<string>
}

export default function useQrCode (video: Ref<HTMLVideoElement | null>, scanningQrCodeObjectStore: IUseScanningQrCodeObjectStore) : IUseQrCode {
  const currentRawValue: Ref<string | null> = ref(null)
  const canvas: Ref<HTMLCanvasElement> = ref(document.createElement('canvas'))
  const loop: Ref<boolean> = ref(true)
  const scannerLoop = () => {
    if (video.value) {
      const context = canvas.value.getContext('2d')
      canvas.value.width = 800
      canvas.value.height = 600
      context?.drawImage(video.value, 0, 0, 800, 600)
      const data = context?.getImageData(0, 0, 800, 600)
      if (data) {
        const code = jsQR(data.data, 800, 600)
        if (code && code.data) {
          currentRawValue.value = code.data
          scanningQrCodeObjectStore.writeScanningQrCodeItem(
            {
              data: code.data,
              timestamp: new Date().getTime()
            }
          )
          loop.value = false
        }
      }
    }
    if (loop.value) {
      window.requestAnimationFrame(scannerLoop)
    }
  }
  const getSVGElementQrcode = async (data: string, options: QRCodeToStringOptions = {}) : Promise<string> => {
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
  const getImageDataQrCode = async (data: string, options: QRCodeToDataURLOptions = {}) : Promise<string> => {
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
  return {
    qrInfo: {
      currentRawValue,
      canvas,
      loop
    },
    scannerLoop,
    getSVGElementQrcode,
    getImageDataQrCode
  }
}
