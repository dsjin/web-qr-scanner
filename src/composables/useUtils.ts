export interface IUseUtils {
  timestampToDateString: (val: number) => any
  isUrl: (val: string) => boolean
  copyToClipboard: (val: string) => Promise<boolean>
  canShare: (val: string) => boolean
  share: (val: string) => Promise<boolean>
}

export default function useUtils (): IUseUtils {
  const timestampToDateString = (val: number): any => {
    const targetDate = new Date(val)
    if (!val || targetDate.toString() === 'Invalid Date') {
      return val
    }
    return `${targetDate.getFullYear()}/${('0' + targetDate.getMonth() + 1).slice(-2)}/${('0' + targetDate.getDay()).slice(-2)} ${('0' + targetDate.getHours()).slice(-2)}:${('0' + targetDate.getMinutes()).slice(-2)}:${('0' + targetDate.getSeconds()).slice(-2)}`
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
    } catch {
      return false
    }
    return true
  }
  const canShare = (val: string): boolean => {
    if (!navigator.canShare) {
      return false
    }
    return navigator.canShare({
      text: val
    })
  }
  const share = async (val: string): Promise<boolean> => {
    try {
      await navigator.share({
        text: val
      })
    } catch {
      return false
    }
    return true
  }
  return {
    timestampToDateString,
    isUrl,
    copyToClipboard,
    canShare,
    share
  }
}
