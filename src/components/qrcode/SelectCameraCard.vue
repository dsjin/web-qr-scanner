<template>
  <div
    v-if="info.show"
    class="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 min-h-screen"
  >
    <div
      class="absolute right-4 top-4 text-white font-bold text-md rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center cursor-pointer z-10"
      @click="close"
    >
      X
    </div>
    <div
      class="container mx-auto px-4"
    >
      <h1
        class="mt-10 font-semibold text-6xl md:text-8xl text-white mix-blend-overlay"
      >
        Camera
      </h1>
      <div class="p-5 md:p-10 bg-gray-500 text-2xl text-white my-10 md:my-20 h-1/2">
        <template
          v-if="info.deviceList.length > 0"
        >
          <div
            v-for="device, index in info.deviceList"
            :key="device.deviceId"
            class="p-4 w-full rounded-full cursor-pointer truncate"
            :class="{'bg-red-400': device.deviceId !== info.nextSelectedDeviceId, 'bg-red-600': device.deviceId === info.nextSelectedDeviceId, 'mb-4': index !== info.deviceList.length - 1}"
            @click="selectCamera(device.deviceId)"
          >
            {{ device.label }}
          </div>
        </template>
        <template
          v-else
        >
          No Device
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { ISelectDeviceCard } from '@/assets/interface/selectDeviceCard'

@Options({
  props: {
    info: {
      type: Object as PropType<ISelectDeviceCard>,
      require: true
    }
  },
  computed: {
  },
  methods: {
    selectCamera (cameraId: string) {
      this.info.nextSelectedDeviceId = cameraId
    },
    close () {
      if (this.info.nextSelectedDeviceId !== this.info.selectedDeviceId) {
        this.$emit('onChangeCamera', this.info.nextSelectedDeviceId)
      }
      this.info.show = false
    }
  }
})
export default class SelectCameraCard extends Vue {
}
</script>

<style>
</style>
