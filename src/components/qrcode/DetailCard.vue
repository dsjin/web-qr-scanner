<template>
  <div
    v-if="info.show"
    class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
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
        Result
      </h1>
      <p class="p-10 bg-gray-500 text-2xl text-white my-10 md:my-20">
        {{ info.qrcode }}
      </p>
      <div
        class="flex flex-col md:flex-row md:justify-end"
      >
        <div
          v-if="utils.canShare(info.qrcode)"
          class="text-white font-bold text-md rounded-full h-10 md:w-24 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer md:mr-4 mb-4 md:mt-0"
          @click="utils.share(info.qrcode)"
        >
          <p
            class="truncate"
          >
            Share
          </p>
        </div>
        <div class="text-white font-bold text-md rounded-full h-10 md:w-24 mw-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer md:mr-4 mb-4 md:mt-0" @click="utils.copyToClipboard(info.qrcode)">
          <p
            class="truncate"
          >
            Copy
          </p>
        </div>
        <a
          v-if="utils.isUrl(info.qrcode)"
          class="text-white font-bold text-md rounded-full h-10 md:w-26 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer"
          :href="info.qrcode"
          target="_blank"
        >
          <p
            class="truncate"
          >
            Open Link
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { IDetailCard } from '@/assets/interface/detailCard'
import useUtils from '@/composables/useUtils'

@Options({
  props: {
    info: {
      type: Object as PropType<IDetailCard>,
      require: true
    }
  },
  computed: {
  },
  methods: {
    close () {
      this.info.qrcode = ''
      this.info.show = false
    }
  }
})
export default class DetailCard extends Vue {
  utils = useUtils()
}
</script>

<style>
</style>
