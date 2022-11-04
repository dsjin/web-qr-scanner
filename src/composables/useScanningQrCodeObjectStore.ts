import { Ref } from 'vue'
import { IQrCodeHistory } from './useQrCode'

export interface IUseScanningQrCodeObjectStore {
  writeScanningQrCodeItem: (qrCodeItem: IQrCodeHistory) => void
  getAllScanningQrCode: () => Promise<Array<IQrCodeHistory>>
}

export default function useScanningQrCodeObjectStore (db: Ref<IDBDatabase | null>): IUseScanningQrCodeObjectStore {
  const writeScanningQrCodeItem = (qrCodeItem: IQrCodeHistory) => {
    const scanningQrCodeObjectStore = db.value?.transaction('qrcode_histories', 'readwrite').objectStore('qrcode_histories')
    scanningQrCodeObjectStore?.add(
      qrCodeItem
    )
  }
  const getAllScanningQrCode = (): Promise<Array<IQrCodeHistory>> => {
    return new Promise((resolve) => {
      const qrcodeHistoryList: Array<IQrCodeHistory> = []
      const scanningQrCodeObjectStore = db.value?.transaction('qrcode_histories', 'readwrite').objectStore('qrcode_histories')
      // eslint-disable-next-line
      scanningQrCodeObjectStore!.getAll().onsuccess = (ev: any) => {
        ev.target.result.forEach((element: any) => {
          qrcodeHistoryList.push(element)
        })
        resolve(qrcodeHistoryList)
      }
    })
  }
  return {
    writeScanningQrCodeItem,
    getAllScanningQrCode
  }
}
