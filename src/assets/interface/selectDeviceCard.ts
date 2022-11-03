export interface ISelectDeviceCard {
  deviceList: Array<MediaDeviceInfo>
  selectedDeviceId: string
  nextSelectedDeviceId: string
  show: boolean
}
