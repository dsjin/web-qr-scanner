import useEmitter from './useEmitter'

export type DebouncingFunction = (...args: any[]) => void
export type DebouncedFunction = {
  (...args: any[]): void,
  clear(): void
}

export interface IUseUtils {
  timestampToDateString: (val: number) => any
  isUrl: (val: string) => boolean
  copyToClipboard: (val: string) => Promise<boolean>
  canShare: (val: ShareData) => boolean
  share: (val: ShareData) => Promise<boolean>
  getBlob: (base64: string) => Promise<Blob>
  debounce: (fn: DebouncingFunction, delay: number) => DebouncedFunction
}

export default function useUtils (): IUseUtils {
  const emitter = useEmitter()
  const timestampToDateString = (val: number): any => {
    const targetDate = new Date(val)
    if (!val || targetDate.toString() === 'Invalid Date') {
      return val
    }
    return `${targetDate.getFullYear()}/${(`0${targetDate.getMonth() + 1}`).slice(-2)}/${(`0${targetDate.getDate()}`).slice(-2)} ${(`0${targetDate.getHours()}`).slice(-2)}:${(`0${targetDate.getMinutes()}`).slice(-2)}:${(`0${targetDate.getSeconds()}`).slice(-2)}`
  }
  const isUrl = (val: string): boolean => {
    try {
      new URL(val) // eslint-disable-line no-new
    } catch {
      return false
    }
    return true
  }
  const copyToClipboard = async (val: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(val)
      emitter.emit('$alert-popup:msg', 'Copied')
      emitter.emit('$alert-popup:bgColor', 'bg-green-500')
      emitter.emit('$alert-popup:timeout', 3000)
      emitter.emit('$alert-popup:show')
    } catch {
      emitter.emit('$alert-popup:msg', 'Copying Failed')
      emitter.emit('$alert-popup:bgColor', 'bg-red-500')
      emitter.emit('$alert-popup:timeout', 3000)
      emitter.emit('$alert-popup:show')
      return false
    }
    return true
  }
  const canShare = (val: ShareData): boolean => {
    if (!navigator.canShare) {
      return false
    }
    return navigator.canShare(val)
  }
  const share = async (val: ShareData): Promise<boolean> => {
    try {
      await navigator.share(val)
      emitter.emit('$alert-popup:msg', 'Shared')
      emitter.emit('$alert-popup:bgColor', 'bg-green-500')
      emitter.emit('$alert-popup:timeout', 3000)
      emitter.emit('$alert-popup:show')
    } catch {
      emitter.emit('$alert-popup:msg', 'Sharing Failed')
      emitter.emit('$alert-popup:bgColor', 'bg-red-500')
      emitter.emit('$alert-popup:timeout', 3000)
      emitter.emit('$alert-popup:show')
      return false
    }
    return true
  }
  const getBlob = async (base64: string): Promise<Blob> => {
    return await (await fetch(base64)).blob()
  }
  const debounce = (fn: DebouncingFunction, delay: number): DebouncedFunction => {
    let executedFucntion: number
    const wrappedFn = (...args: any[]) => {
      clearTimeout(executedFucntion)
      executedFucntion = setTimeout(() => {
        fn(...args)
      }, delay)
    }
    wrappedFn.clear = () => {
      clearTimeout(executedFucntion)
    }
    return wrappedFn
  }
  return {
    timestampToDateString,
    isUrl,
    copyToClipboard,
    canShare,
    share,
    debounce,
    getBlob
  }
}
