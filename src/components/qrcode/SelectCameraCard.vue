<template>
  <div
    v-if="info.show"
    class="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 min-h-screen h-screen z-30 overflow-hidden"
  >
    <div
      class="absolute right-4 top-4 text-white font-bold text-md rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center cursor-pointer z-40"
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
      <div
        class="p-5 md:p-10 bg-gray-500 text-2xl text-white my-10 md:my-20"
        :class="{'h-[calc(100vh-10rem)] md:h-[calc(100vh-16rem)]': info.deviceList.length > 0}"
      >
        <template
          v-if="info.deviceList.length > 0"
        >
          <dynamic-scroller
            :items="info.deviceList"
            :min-item-size="100"
            keyField="deviceId"
            class="h-full"
          >
            <template v-slot="{ item: device, index, active }">
              <dynamic-scroller-item
                :item="device"
                :active="active"
                :size-dependencies="[
                  device.label
                ]"
                :data-index="index"
              >
                <div
                  class="wrapper pb-5"
                >
                  <div
                    class="p-4 w-full rounded-full cursor-pointer truncate"
                    :class="{'bg-red-400': device.deviceId !== info.nextSelectedDeviceId, 'bg-red-600': device.deviceId === info.nextSelectedDeviceId}"
                    @click="selectCamera(device.deviceId)"
                  >
                    {{ device.label }}
                  </div>
                </div>
              </dynamic-scroller-item>
            </template>
          </dynamic-scroller>
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
