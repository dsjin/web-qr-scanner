<template>
  <div class="home h-screen overflow-hidden">
    <div
      class="flex justify-center w-screen"
    >
      <template v-if="!camera.cameraInfo.error">
        <video id="video" class="w-full h-full absolute left-1/2 object-cover object-center" style="margin-left: -50%"/>
      </template>
      <div class="absolute left-4 top-4 text-white font-bold text-md rounded-full h-10 w-24 md:w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer z-9" @click="selectCameraOpen">
        <p
          class="truncate"
        >
          Switch the camera
        </p>
      </div>
      <div class="absolute right-4 top-4 text-white font-bold text-md rounded-full h-10 w-30 md:w-auto truncate p-3 bg-gray-900 flex items-center justify-center cursor-pointer z-9" @click="historyOpen">
        <p
          class="truncate"
        >
          History
        </p>
      </div>
    </div>
    <detail-card
      :info="detailInfo"
    />
    <history-detail-card
      :info="historyInfo"
      @fetch-data="getHistory"
    />
    <select-camera-card
      :info="selectCameraInfo"
      @on-change-camera="camera.changeCameraByDeviceId"
    />
  </div>
  <upload-popup />
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'

import useCamera, { IUseCamera } from '@/composables/useCamera'
import useQrCode from '@/composables/useQrCode'
import useIndexedDb from '@/composables/useIndexedDb'
import useScanningQrCodeObjectStore from '@/composables/useScanningQrCodeObjectStore'
import DetailCard from '@/components/qrcode/DetailCard.vue'
import UploadPopup from '@/components/qrcode/UploadPopup.vue'
import HistoryDetailCard from '@/components/qrcode/HistoryDetailCard.vue'
import SelectCameraCard from '@/components/qrcode/SelectCameraCard.vue'

const useHome = (camera: IUseCamera) => {
  const video : Ref<HTMLVideoElement | null> = ref(null)
  const playVideo = () => {
    if (!video.value) {
      video.value = document.getElementById('video') as HTMLVideoElement
    }
    video.value.srcObject = camera.cameraInfo.stream.value
    video.value.play()
  }
  watch(camera.cameraInfo.stream, () => {
    playVideo()
  })
  return {
    homeInfo: {
      video
    }
  }
}

@Options({
  components: {
    DetailCard,
    HistoryDetailCard,
    SelectCameraCard,
    UploadPopup
  },
  data () {
    return {
      canvas: null,
      image: null,
      detailInfo: {
        qrcode: '',
        show: false
      },
      historyInfo: {
        historyList: [],
        show: false
      },
      selectCameraInfo: {
        deviceList: [],
        selectedDeviceId: '',
        nextSelectedDeviceId: '',
        show: false
      }
    }
  },
  watch: {
    'camera.cameraInfo.error' (value) {
      if (value) {
        this.emitter.emit('$alert-popup:msg', value)
        this.emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        this.emitter.emit('$alert-popup:timeout', 0)
        this.emitter.emit('$alert-popup:show')
      }
    },
    'qrCode.qrInfo.currentRawValue' (value) {
      if (value) {
        this.detailInfo.qrcode = value
        this.detailInfo.show = true
      }
    },
    'detailInfo.show' (value) {
      if (!value) {
        this.continueQrScanner()
      }
    },
    'historyInfo.show' (value) {
      if (!value) {
        this.continueQrScanner()
      }
    },
    'selectCameraInfo.show' (value) {
      if (!value) {
        this.continueQrScanner()
      }
    }
  },
  mounted () {
    this.canvas = document.createElement('canvas')
    window.requestAnimationFrame(this.qrCode.scannerLoop)
  },
  methods: {
    continueQrScanner () {
      this.detailInfo.qrcode = ''
      this.qrCode.qrInfo.currentRawValue = ''
      this.qrCode.qrInfo.loop = true
      window.requestAnimationFrame(this.qrCode.scannerLoop)
    },
    takePhoto () {
      var context = this.canvas.getContext('2d')
      this.canvas.width = 800
      this.canvas.height = 600
      context.drawImage(this.home.homeInfo.video, 0, 0, 800, 600)
      var data = this.canvas.toDataURL('image/png')
      this.image = data
    },
    async historyOpen () {
      try {
        this.qrCode.qrInfo.loop = false
        await this.getHistory(true)
        this.historyInfo.show = true
      } catch (e: any) {
        this.qrCode.qrInfo.loop = true
        window.requestAnimationFrame(this.qrCode.scannerLoop)
        this.emitter.emit('$alert-popup:msg', e.message)
        this.emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        this.emitter.emit('$alert-popup:timeout', 3000)
        this.emitter.emit('$alert-popup:show')
      }
    },
    selectCameraOpen () {
      this.qrCode.qrInfo.loop = false
      this.selectCameraInfo.deviceList = this.camera.cameraInfo.devices
      this.selectCameraInfo.selectedDeviceId = this.camera.cameraInfo.selectedDevice
      this.selectCameraInfo.nextSelectedDeviceId = this.camera.cameraInfo.selectedDevice
      this.selectCameraInfo.show = true
    },
    async getHistory (firstInit = false) {
      const data = await this.scanningQrCodeObjectStore.getScanningQrCode(
        this.historyInfo.historyList.length > 0 ? this.historyInfo.historyList.length : 0
      )

      if (data.length > 0) {
        this.historyInfo.historyList = [
          ...this.historyInfo.historyList,
          ...data
        ]
      } else if (!firstInit) {
        this.emitter.emit('$alert-popup:msg', 'No more items in database')
        this.emitter.emit('$alert-popup:bgColor', 'bg-yellow-500')
        this.emitter.emit('$alert-popup:timeout', 3000)
        this.emitter.emit('$alert-popup:show')
      }
    }
  }
})
export default class Home extends Vue {
  indexDb = useIndexedDb()
  scanningQrCodeObjectStore = useScanningQrCodeObjectStore(this.indexDb.db)
  camera = useCamera()
  home = useHome(this.camera)
  qrCode = useQrCode(this.home.homeInfo.video, this.scanningQrCodeObjectStore)
}
</script>

<style lang="scss" scoped>
</style>
