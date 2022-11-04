import { ref, onMounted, Ref } from 'vue'

export interface IUseIndexedDb {
  db: Ref<IDBDatabase | null>
}

export default function useIndexedDb(): IUseIndexedDb {
  const db: Ref<IDBDatabase | null> = ref(null)
  const initDb = () => {
    if (window) {
      if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB.")
      }
      const request: IDBOpenDBRequest = window.indexedDB.open('qrcode-dsjin-db', 1)
      request.onsuccess = (ev: any) => {
        db.value = ev.target.result
      }
      request.onerror = (ev: any) => {
        console.error(`Database error: ${ev.target.errorCode}`)
      }
      request.onblocked = () => {
        console.log('Please close all other tabs with this site open!')
      }
      request.onupgradeneeded = (ev: any) => {
        const upgradeDb = ev.target.result
        if (!upgradeDb.objectStoreNames.contains('qrcode_histories')) {
          const scanningQrcodesOS = upgradeDb.createObjectStore('qrcode_histories', { keyPath: 'id', autoIncrement: true })
          scanningQrcodesOS.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    }
  }
  onMounted(() => {
    initDb()
  })
  return {
    db
  }
}
