interface Navigator {
  share: (data?: ShareData) => Promise<void>
  canShare: (data?: ShareData) => boolean
}
