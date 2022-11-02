<template>
  <div class="home h-screen overflow-hidden">
    <!-- <button
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
    </button> -->
    <div
      class="flex justify-center w-screen"
    >
      <template v-if="!camera.cameraInfo.error">
        <!-- <div
          class="wrap h-full w-full z-20 absolute"
          style="--left: 30%; --top: 30%; --width: 40%; --height: 40%;"
        /> -->
        <video id="video" class="w-full h-full absolute left-1/2 object-cover object-center" style="margin-left: -50%"/>
      </template>
      <template v-else>
        {{ camera.cameraInfo.error }}
      </template>
      <div class="absolute right-4 top-4 text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer z-9" @click="historyOpen">
        History
      </div>
    </div>
    <!-- <div
      class="flex justify-center mt-10"
    >
      <img :src="image">
      {{ qrCode.qrInfo.currentRawValue }}
    </div> -->
    <detail-card
      :info="detailInfo"
    />
    <history-detail-card
      :info="historyInfo"
    />
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'

import useCamera, { IUseCamera } from '@/composables/useCamera'
import useQrCode from '@/composables/useQrCode'
import DetailCard from '@/components/qrcode/DetailCard.vue'
import HistoryDetailCard from '@/components/qrcode/HistoryDetailCard.vue'

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
    DetailCard,
    HistoryDetailCard
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
      }
    }
  },
  watch: {
    'qrCode.qrInfo.currentRawValue' (value) {
      if (value) {
        this.detailInfo.qrcode = value
        this.detailInfo.show = true
      }
    },
    'detailInfo.show' (value) {
      if (!value) {
        this.detailInfo.qrcode = ''
        this.qrCode.qrInfo.currentRawValue = ''
        this.qrCode.qrInfo.loop = true
        window.requestAnimationFrame(this.qrCode.scannerLoop)
      }
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
    },
    historyOpen () {
      // this.historyInfo.historyList = this.qrCode.qrInfo.historyList
      this.historyInfo.historyList = []
      for (let index = 0; index < 30; index++) {
        this.historyInfo.historyList.push(
          {
            data: `testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest-${index + 1}`,
            timestamp: new Date().getTime() + (1000 * index)
          }
        )
      }
      this.historyInfo.show = true
    }
  }
})
export default class Home extends Vue {
  camera = useCamera()
  home = useHome(this.camera)
  qrCode = useQrCode(this.home.homeInfo.video)
}
</script>

<style lang="scss" scoped>
  // .wrap::before {
  //   content: '';
  //   display: block;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   z-index: 1;
  //   clip-path: polygon(
  //     0% 0%,
  //     0% 100%,
  //     var(--left) 100%,
  //     var(--left) var(--top),
  //     calc(var(--left) + var(--width)) var(--top),
  //     calc(var(--left) + var(--width)) calc(var(--top) + var(--height)),
  //     var(--left) calc(var(--top) + var(--height)),
  //     var(--left) 100%,
  //     100% 100%,
  //     100% 0
  //   );
  // }
</style>
