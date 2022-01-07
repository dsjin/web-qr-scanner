import { ref, Ref, onMounted, onBeforeUnmount } from 'vue'

export interface IUseCamera {
  cameraInfo: {
    stream: Ref<MediaStream | null>
    selectedDevice: Ref<string | null>
    devices: Ref<Array<MediaDeviceInfo>>
    error: Ref<string>
  }
  initVideoDevice: () => Promise<void>
  stopTracks: () => void
  changeCamera: () => Promise<void>
}

export default function useCamera () : IUseCamera {
  const stream: Ref<MediaStream | null> = ref(null)
  const selectedDevice: Ref<string | null> = ref(null)
  const devices: Ref<Array<MediaDeviceInfo>> = ref([])
  const error: Ref<string> = ref('')
  const initVideoDevice = async () => {
    try {
      // Grain Permission First
      await navigator.mediaDevices.getUserMedia(
        {
          audio: false,
          video: true
        }
      )
      // Get All of Video Type Devices
      devices.value = (await navigator.mediaDevices.enumerateDevices()).filter((device: MediaDeviceInfo) => {
        return device.kind === 'videoinput'
      })
      if (devices.value.length > 0) {
        const backCamera: MediaDeviceInfo | undefined = devices.value.find((device: MediaDeviceInfo) => {
          return device.label.includes('back')
        })
        selectedDevice.value = backCamera ? backCamera.deviceId : devices.value[0].deviceId
        stream.value = await navigator.mediaDevices.getUserMedia(
          {
            video: {
              deviceId: { exact: selectedDevice.value }
            }
          }
        )
      }
    } catch (e: any) {
      console.error(e)
      error.value = e
    }
  }
  const stopTracks = () => {
    stream.value?.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop()
    })
  }
  const changeCamera = async () => {
    try {
      if (devices.value.length === 1) {
        return
      }
      stopTracks()
      const untargetDevices = devices.value.filter((device: MediaDeviceInfo) => {
        return device.deviceId !== selectedDevice.value
      })
      selectedDevice.value = untargetDevices[0].deviceId
      stream.value = await navigator.mediaDevices.getUserMedia(
        {
          video: {
            deviceId: { exact: selectedDevice.value }
          }
        }
      )
    } catch (e: any) {
      console.error(e)
      error.value = e
    }
  }
  onMounted(() => {
    initVideoDevice()
  })
  onBeforeUnmount(() => {
    stopTracks()
  })
  return {
    cameraInfo: {
      stream,
      selectedDevice,
      devices,
      error
    },
    initVideoDevice,
    stopTracks,
    changeCamera
  }
}
