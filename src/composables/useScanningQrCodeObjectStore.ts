import { Ref } from 'vue'
import { IQrCodeHistory } from './useQrCode'

export interface IUseScanningQrCodeObjectStore {
  writeScanningQrCodeItem: (qrCodeItem: IQrCodeHistory) => void
  getAllScanningQrCode: () => Promise<Array<IQrCodeHistory>>
  deleteScanningQrCodeItem: (id: number) => Promise<undefined>
}

export default function useScanningQrCodeObjectStore (db: Ref<IDBDatabase | null>): IUseScanningQrCodeObjectStore {
  const writeScanningQrCodeItem = (qrCodeItem: IQrCodeHistory): Promise<IDBValidKey> => {
    return new Promise((resolve, reject) => {
      const scanningQrCodeObjectStore = db.value?.transaction('qrcode_histories', 'readwrite').objectStore('qrcode_histories')
      const scanningItem = scanningQrCodeObjectStore?.add(
        qrCodeItem
      )
      if (scanningItem) {
        scanningItem.onsuccess = (ev: any) => {
          resolve(ev.target.result)
        }
        scanningItem.onerror = (ev: any) => {
          reject(new Error(`Write failed: ${ev.target.errorCode}`))
        }
      } else {
        reject(new Error('DB is not ready.'))
      }
    })
  }
  const deleteScanningQrCodeItem = (id: number): Promise<undefined> => {
    return new Promise((resolve, reject) => {
      const scanningQrCodeObjectStore = db.value?.transaction('qrcode_histories', 'readwrite').objectStore('qrcode_histories')
      const deletingItem = scanningQrCodeObjectStore?.delete(id)
      if (deletingItem) {
        deletingItem.onsuccess = (ev: any) => {
          resolve(ev.target.result)
        }
        deletingItem.onerror = (ev: any) => {
          reject(new Error(`Delete failed: ${ev.target.errorCode}`))
        }
      } else {
        reject(new Error('DB is not ready.'))
      }
    })
  }
  const getAllScanningQrCode = (): Promise<Array<IQrCodeHistory>> => {
    return new Promise((resolve, reject) => {
      const qrcodeHistoryList: Array<IQrCodeHistory> = []
      const scanningQrCodeObjectStore = db.value?.transaction('qrcode_histories', 'readwrite').objectStore('qrcode_histories')
      const gettingAll = scanningQrCodeObjectStore?.getAll()
      if (gettingAll) {
        gettingAll.onsuccess = (ev: any) => {
          ev.target.result.forEach((element: any) => {
            qrcodeHistoryList.push(element)
          })
          resolve(qrcodeHistoryList)
        }
        gettingAll.onerror = (ev: any) => {
          reject(new Error(`Get failed: ${ev.target.errorCode}`))
        }
      } else {
        reject(new Error('DB is not ready.'))
      }
    })
  }
  return {
    writeScanningQrCodeItem,
    getAllScanningQrCode,
    deleteScanningQrCodeItem
  }
}
