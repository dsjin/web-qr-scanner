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
        class="mt-10 font-semibold text-8xl text-white mix-blend-overlay"
      >
        Result
      </h1>
      <div class="p-10 bg-gray-500 text-2xl text-white mt-20 divide-y divide-dashed">
        <p
          v-for="qrcode in info.historyList"
          :key="qrcode.data"
          class="p-4"
        >
          {{ qrcode.data }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { IHistoryDetailCard } from '@/assets/interface/historyDetailCard'

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
}
</script>

<style>
</style>
