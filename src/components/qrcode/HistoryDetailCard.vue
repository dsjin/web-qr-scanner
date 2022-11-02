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
        Result
      </h1>
      <div class="p-10 bg-gray-500 text-2xl text-white my-20 divide-y divide-dashed h-1/2">
        <template
          v-if="info.historyList.length > 0"
        >
          <div
            v-for="qrcode in info.historyList"
            :key="`${qrcode.data}-${qrcode.timestamp}`"
            class="flex flex-row p-4 w-full"
          >
            <p
              class="flex-grow flex-initial w-3/5 text-left"
            >
              {{ qrcode.data }}
            </p>
            <p
              class="flex-grow flex-initial w-2/5"
            >
              {{ utils.timestampToDateString(qrcode.timestamp) }}
            </p>
          </div>
        </template>
        <template
          v-else
        >
          No History
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { IHistoryDetailCard } from '@/assets/interface/historyDetailCard'
import useUtils from '@/composables/useUtils'

@Options({
  props: {
    info: {
      type: Object as PropType<IHistoryDetailCard>,
      require: true
    }
  },
  computed: {
  },
  methods: {
    close () {
      this.info.historyList = []
      this.info.show = false
    }
  }
})
export default class HistoryDetailCard extends Vue {
  utils = useUtils()
}
</script>

<style>
</style>
