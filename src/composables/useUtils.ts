export interface IUseUtils {
  timestampToDateString: (val: number) => any
}

export default function useUtils (): IUseUtils {
  const timestampToDateString = (val: number): any => {
    const targetDate = new Date(val)
    if (!val || targetDate.toString() === 'Invalid Date') {
      return val
    }
    return `${targetDate.getFullYear()}/${('0' + targetDate.getMonth() + 1).slice(-2)}/${('0' + targetDate.getDay()).slice(-2)} ${('0' + targetDate.getHours()).slice(-2)}:${('0' + targetDate.getMinutes()).slice(-2)}:${('0' + targetDate.getSeconds()).slice(-2)}`
  }
  return {
    timestampToDateString
  }
}
