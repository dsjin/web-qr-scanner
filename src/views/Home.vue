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
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { Options, Vue, setup } from 'vue-class-component'

import useCamera, { IUseCamera } from '@/composables/useCamera'

const homeSetup = (camera: IUseCamera) => setup(() => {
  const video : Ref<HTMLMediaElement | null> = ref(null)
  const playVideo = () => {
    if (!video.value) {
      video.value = document.getElementById('video') as HTMLMediaElement
    }
    video.value.srcObject = camera.cameraInfo.stream.value
    video.value.play()
  }
  watch(camera.cameraInfo.stream, () => {
    console.log(camera.cameraInfo.stream.value)
    playVideo()
  })
  return {
    video
  }
})

@Options({
  data () {
    return {
      canvas: null,
      image: null
    }
  },
  mounted () {
    this.canvas = document.createElement('canvas')
  },
  methods: {
    takePhoto () {
      var context = this.canvas.getContext('2d')
      this.canvas.width = 800
      this.canvas.height = 600
      context.drawImage(this.home.video, 0, 0, 800, 600)
      var data = this.canvas.toDataURL('image/png')
      this.image = data
    }
  }
})
export default class Home extends Vue {
  camera = useCamera()
  home = homeSetup(this.camera)
}
</script>
