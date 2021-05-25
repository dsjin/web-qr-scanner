<template>
  <div class="home">
    <button
      class="fixed left-10 bottom-1 bg-blue-300 p-2"
      @click="camera.changeCamera"
    >
      Change Camera
    </button>
    <button
      class="fixed right-10 bottom-1 bg-blue-300 p-2"
      @click="takePhoto"
    >
      Capture
    </button>
    <div
      class="flex justify-center"
    >
      <video id="video" />
    </div>
    <div
      class="flex justify-center mt-10"
    >
      <img :src="image">
      {{ qrCode.qrInfo.currentRawValue }}
    </div>
    <detail-card
      :info="detailInfo"
    />
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'

import useCamera, { IUseCamera } from '@/composables/useCamera'
import useQrCode from '@/composables/useQrCode'
import DetailCard from '@/components/common/DetailCard.vue'

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
    console.log(camera.cameraInfo.stream.value)
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
    DetailCard
  },
  data () {
    return {
      canvas: null,
      image: null,
      detailInfo: {
        qrcode: '',
        show: false
      }
    }
  },
  watch: {
    'qrCode.qrInfo.currentRawValue' (value) {
      this.detailInfo.qrcode = value
      this.detailInfo.show = true
    }
  },
  mounted () {
    this.canvas = document.createElement('canvas')
    window.requestAnimationFrame(this.qrCode.scannerLoop)
  },
  methods: {
    takePhoto () {
      var context = this.canvas.getContext('2d')
      this.canvas.width = 800
      this.canvas.height = 600
      context.drawImage(this.home.homeInfo.video, 0, 0, 800, 600)
      var data = this.canvas.toDataURL('image/png')
      this.image = data
    }
  }
})
export default class Home extends Vue {
  camera = useCamera()
  home = useHome(this.camera)
  qrCode = useQrCode(this.home.homeInfo.video)
}
</script>
