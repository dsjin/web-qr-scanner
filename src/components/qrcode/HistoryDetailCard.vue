<template>
  <div
    v-if="info.show"
    class="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 min-h-screen z-30"
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
        History
      </h1>
      <div class="p-5 md:p-10 bg-gray-500 text-2xl text-white my-10 md:my-20 divide-y divide-dashed h-1/2">
        <template
          v-if="displayingList.length > 0"
        >
          <div
            v-for="(qrcode, index) in displayingList"
            :key="`${qrcode.data}-${qrcode.timestamp}`"
            class="flex flex-col p-4"
          >
            <div
              class="flex flex-col md:flex-row w-full mb-4"
            >
              <p
                class="flex-grow flex-initial w-full md:w-3/5 text-left break-all"
              >
                {{ qrcode.data }}
              </p>
              <p
                class="flex-grow flex-initial w-full md:w-2/5 md:text-center text-right"
              >
                {{ utils.timestampToDateString(qrcode.timestamp) }}
              </p>
              <div
                class="flex justify-end mt-4 md:mt-0 flex-grow flex-initial w-full md:w-10"
              >
                <div
                  class="text-white font-bold text-md rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center cursor-pointer"
                  @click="toggleShowAction(qrcode)"
                >
                  <template
                    v-if="!qrcode.action.show"
                  >
                    ▼
                  </template>
                  <template
                    v-else
                  >
                    ▲
                  </template>
                </div>
              </div>
            </div>
            <div
              v-if="qrcode.action.show"
              class="flex flex-col w-full"
            >
              <div
                v-if="utils.canShare({
                  text: qrcode.data
                })"
                class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
                @click="utils.share({
                  text: qrcode.data
                })"
              >
                <p
                  class="truncate"
                >
                  Share
                </p>
              </div>
              <div class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4" @click="utils.copyToClipboard(qrcode.data)">
                <p
                  class="truncate"
                >
                  Copy
                </p>
              </div>
              <a
                v-if="utils.isUrl(qrcode.data)"
                class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
                :href="qrcode.data"
                target="_blank"
              >
                <p
                  class="truncate"
                >
                  Open Link
                </p>
              </a>
              <div class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4" @click="deleteQrcode(index)">
                <p
                  class="truncate"
                >
                  Delete
                </p>
              </div>
            </div>
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
import { IQrCodeHistory } from '@/composables/useQrCode'
import useIndexedDb from '@/composables/useIndexedDb'
import useScanningQrCodeObjectStore from '@/composables/useScanningQrCodeObjectStore'

interface IActionBlockShow {
  show: boolean
}

interface IActionBlock {
  action: IActionBlockShow
}

@Options({
  props: {
    info: {
      type: Object as PropType<IHistoryDetailCard>,
      require: true
    }
  },
  data () {
    return {
      displayingList: []
    }
  },
  watch: {
    'info.show' (val) {
      if (val) {
        this.displayingList = (this.info as IHistoryDetailCard).historyList.map((value: IQrCodeHistory): IQrCodeHistory & IActionBlock => {
          return {
            ...value,
            action: {
              show: false
            }
          }
        })
      } else {
        this.displayingList = []
      }
    }
  },
  methods: {
    close () {
      this.info.historyList = []
      this.info.show = false
    },
    toggleShowAction (value: IQrCodeHistory & IActionBlock) {
      value.action.show = !value.action.show
    },
    async deleteQrcode (index: number) {
      try {
        await this.scanningQrCodeObjectStore.deleteScanningQrCodeItem(this.displayingList[index].id)
        this.displayingList.splice(index, 1)
        this.emitter.emit('$alert-popup:msg', 'Deleted')
        this.emitter.emit('$alert-popup:bgColor', 'bg-green-500')
        this.emitter.emit('$alert-popup:timeout', 3000)
        this.emitter.emit('$alert-popup:show')
      } catch (e: any) {
        this.emitter.emit('$alert-popup:msg', e.message)
        this.emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        this.emitter.emit('$alert-popup:timeout', 3000)
        this.emitter.emit('$alert-popup:show')
      }
    }
  }
})
export default class HistoryDetailCard extends Vue {
  utils = useUtils()
  indexDb = useIndexedDb()
  scanningQrCodeObjectStore = useScanningQrCodeObjectStore(this.indexDb.db)
}
</script>

<style>
</style>
