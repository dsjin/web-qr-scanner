import { Ref } from 'vue'
import { IQrCodeHistory } from './useQrCode'

export interface IUseGeneratingQrCodeObjectStore {
  writeGeneratingQrCodeItem: (qrCodeItem: IQrCodeHistory) => Promise<IDBValidKey>
  deleteGeneratingQrCodeItem: (id: number) => void
  getAllGeneratingQrCode: () => Promise<Array<IQrCodeHistory>>
  getGeneratingQrCode: (start?: number, limit?: number) => Promise<Array<IQrCodeHistory>>
}

export default function useGeneratingQrCodeObjectStore (db: Ref<IDBDatabase | null>): IUseGeneratingQrCodeObjectStore {
  const writeGeneratingQrCodeItem = (qrCodeItem: IQrCodeHistory): Promise<IDBValidKey> => {
    return new Promise((resolve, reject) => {
      const generatingQrCodeObjectStore = db.value?.transaction('qrcode_generating_histories', 'readwrite').objectStore('qrcode_generating_histories')
      const generatingItem = generatingQrCodeObjectStore?.add(
        qrCodeItem
      )
      if (generatingItem) {
        generatingItem.onsuccess = (ev: any) => {
          resolve(ev.target.result)
        }
        generatingItem.onerror = (ev: any) => {
          reject(new Error(`Write failed: ${ev.target.errorCode}`))
        }
      } else {
        reject(new Error('DB is not ready.'))
      }
    })
  }
  const deleteGeneratingQrCodeItem = (id: number): Promise<undefined> => {
    return new Promise((resolve, reject) => {
      const generatingQrCodeObjectStore = db.value?.transaction('qrcode_generating_histories', 'readwrite').objectStore('qrcode_generating_histories')
      const deletingItem = generatingQrCodeObjectStore?.delete(id)
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
  const getGeneratingQrCode = (start = 0, limit = 10): Promise<Array<IQrCodeHistory>> => {
    return new Promise((resolve, reject) => {
      const qrcodeHistoryList: Array<IQrCodeHistory> = []
      const generatingQrCodeObjectStore = db.value?.transaction('qrcode_generating_histories', 'readonly').objectStore('qrcode_generating_histories')
      const gettingOpenCursor = generatingQrCodeObjectStore?.openCursor()
      let hasSkipped = false
      if (gettingOpenCursor) {
        gettingOpenCursor.onsuccess = (ev: any) => {
          const cursor = ev.target.result
          if (cursor) {
            if (!hasSkipped && start > 0) {
              hasSkipped = true
              cursor.advance(start)
              return
            }
            qrcodeHistoryList.push(
              cursor.value
            )
            if (qrcodeHistoryList.length < limit) {
              cursor.continue()
            } else {
              resolve(qrcodeHistoryList)
            }
          } else {
            resolve(qrcodeHistoryList)
          }
        }
      } else {
        reject(new Error('DB is not ready.'))
      }
    })
  }
  const getAllGeneratingQrCode = (): Promise<Array<IQrCodeHistory>> => {
    return new Promise((resolve, reject) => {
      const qrcodeHistoryList: Array<IQrCodeHistory> = []
      const generatingQrCodeObjectStore = db.value?.transaction('qrcode_generating_histories', 'readwrite').objectStore('qrcode_generating_histories')
      const gettingAll = generatingQrCodeObjectStore?.getAll()
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
    writeGeneratingQrCodeItem,
    getAllGeneratingQrCode,
    deleteGeneratingQrCodeItem,
    getGeneratingQrCode
  }
}
