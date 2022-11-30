import { ref, onMounted, Ref } from 'vue'
import useEmitter from './useEmitter'

export interface IUseIndexedDb {
  db: Ref<IDBDatabase | null>
}

export default function useIndexedDb (): IUseIndexedDb {
  const emitter = useEmitter()
  const db: Ref<IDBDatabase | null> = ref(null)
  const initDb = () => {
    if (window) {
      if (!('indexedDB' in window)) {
        emitter.emit('$alert-popup:msg', 'This browser doesn\'t support IndexedDB.')
        emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        emitter.emit('$alert-popup:timeout', 3000)
        emitter.emit('$alert-popup:show')
      }
      const request: IDBOpenDBRequest = window.indexedDB.open('qrcode-dsjin-db', 2)
      request.onsuccess = (ev: any) => {
        db.value = ev.target.result
      }
      request.onerror = (ev: any) => {
        emitter.emit('$alert-popup:msg', `Database error: ${ev.target.errorCode}`)
        emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        emitter.emit('$alert-popup:timeout', 3000)
        emitter.emit('$alert-popup:show')
      }
      request.onblocked = () => {
        emitter.emit('$alert-popup:msg', 'Please close all other tabs with this site open!')
        emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        emitter.emit('$alert-popup:timeout', 3000)
        emitter.emit('$alert-popup:show')
      }
      request.onupgradeneeded = (ev: any) => {
        const upgradeDb = ev.target.result
        if (!upgradeDb.objectStoreNames.contains('qrcode_histories')) {
          const scanningQrcodesOS = upgradeDb.createObjectStore('qrcode_histories', { keyPath: 'id', autoIncrement: true })
          scanningQrcodesOS.createIndex('timestamp', 'timestamp', { unique: false })
        }
        if (!upgradeDb.objectStoreNames.contains('qrcode_generating_histories')) {
          const generatingQrcodesOS = upgradeDb.createObjectStore('qrcode_generating_histories', { keyPath: 'id', autoIncrement: true })
          generatingQrcodesOS.createIndex('timestamp', 'timestamp', { unique: false })
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
