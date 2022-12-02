<template>
  <div
    v-if="info.show"
    class="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 h-screen overflow-hidden z-30"
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
      <div
        class="p-5 md:p-10 bg-gray-500 text-2xl text-white my-10 md:my-20"
        :class="{'h-[calc(100vh-10rem)] md:h-[calc(100vh-16rem)]': !busy && displayingList.length > 0}"
      >
        <template
          v-if="busy"
        >
          <div
            class="flex justify-center items-center w-full h-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 200 200"
              fill="none"
              class="text-red-600 animate-spin"
            >
              <g stroke="currentColor" stroke-width="10">
                <path opacity="1" d="M 191 70 A 96 96 0 0 1 196 100" />
                <path opacity="0.95" d="M 178 44 A 96 96 0 0 1 191 70" />
                <path opacity="0.90" d="M 156 22 A 96 96 0 0 1 178 44" />
                <path opacity="0.85" d="M 130 9 A 96 96 0 0 1 156 22" />
                <path opacity="0.80" d="M 100 4 A 96 96 0 0 1 130 9" />
                <path opacity="0.75" d="M 70 9 A 96 96 0 0 1 100 4" />
                <path opacity="0.70" d="M 44 22 A 96 96 0 0 1 70 9" />
                <path opacity="0.65" d="M 22 44 A 96 96 0 0 1 44 22" />
                <path opacity="0.60" d="M 9 70 A 96 96 0 0 1 22 44" />
                <path opacity="0.55" d="M 4 100 A 96 96 0 0 1 9 70" />
                <path opacity="0.50" d="M 9 130 A 96 96 0 0 1 4 100" />
                <path opacity="0.45" d="M 22 156 A 96 96 0 0 1 9 130" />
                <path opacity="0.40" d="M 44 178 A 96 96 0 0 1 22 156" />
                <path opacity="0.35" d="M 70 191 A 96 96 0 0 1 44 178" />
                <path opacity="0.30" d="M 100 196 A 96 96 0 0 1 70 191" />
                <path opacity="0.25" d="M 130 191 A 96 96 0 0 1 100 196" />
                <path opacity="0.20" d="M 156 178 A 96 96 0 0 1 130 191" />
                <path opacity="0.15" d="M 178 156 A 96 96 0 0 1 156 178" />
                <path opacity="0.10" d="M 191 130 A 96 96 0 0 1 178 156" />
                <path opacity="0.05" d="M 196 100 A 96 96 0 0 1 191 130" />
              </g>
            </svg>
          </div>
        </template>
        <template
          v-else
        >
          <template
            v-if="displayingList.length != 0"
          >
            <dynamic-scroller
              :items="displayingList"
              :min-item-size="100"
              class="h-full"
            >
              <template v-slot="{ item: qrcode, index, active }">
                <dynamic-scroller-item
                  :item="qrcode"
                  :active="active"
                  :size-dependencies="[
                    qrcode.data
                  ]"
                  :data-index="index"
                >
                  <div
                    class="wrapper"
                  >
                    <div
                      class="flex flex-col p-4"
                    >
                      <div
                        class="flex justify-center items-center w-full bg-white rounded-md shadow-xl"
                      >
                        <div
                          v-html="qrcode.html.svg"
                          class="lg:w-1/5 md:w-1/2 w-full"
                        />
                      </div>
                      <div
                        class="flex flex-col md:flex-row w-full my-4"
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
                          v-if="qrcode.action.isAbleToShareQrcode"
                          class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
                          @click="shareQrcode(index)"
                        >
                          <p
                            class="truncate"
                          >
                            Share
                          </p>
                        </div>
                        <div
                          class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
                          @click="saveQrcode(index)"
                        >
                          <p
                            class="truncate"
                          >
                            Save an Image
                          </p>
                        </div>
                        <div
                          class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
                          @click="deleteQrcode(index)"
                        >
                          <p
                            class="truncate"
                          >
                            Delete
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </dynamic-scroller-item>
              </template>
            </dynamic-scroller>
          </template>
          <template
            v-else
          >
            No History
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { IGeneratingHistoryDetailCard } from '@/assets/interface/generatingHistoryDetailCard'
import useUtils from '@/composables/useUtils'
import useQrCode, { IQrCodeHistory } from '@/composables/useQrCode'
import useGeneratingQrCodeObjectStore from '@/composables/useGeneratingQrCodeObjectStore'
import useIndexedDb from '@/composables/useIndexedDb'

interface IActionBlockItem {
  show: boolean,
  isAbleToShareQrcode: boolean
}

interface IActionBlock {
  action: IActionBlockItem
}

interface IHtmlBlockSvg {
  svg: string
}

interface IHtmlBlock {
  html: IHtmlBlockSvg
}

interface ShareData {
  files?: File[]
  text?: string
  title?: string
  url?: string
}

@Options({
  props: {
    info: {
      type: Object as PropType<IGeneratingHistoryDetailCard>,
      require: true
    }
  },
  data () {
    return {
      displayingList: [],
      busy: false
    }
  },
  watch: {
    async 'info.show' (val) {
      this.busy = true
      if (val) {
        this.displayingList = (this.info as IGeneratingHistoryDetailCard).historyList.map((value: IQrCodeHistory): IQrCodeHistory & IActionBlock & IHtmlBlock => {
          return {
            ...value,
            action: {
              show: false,
              isAbleToShareQrcode: false
            },
            html: {
              svg: ''
            }
          }
        })
        for (let index = 0; index < this.displayingList.length; index++) {
          this.displayingList[index].html.svg = await this.qrCode.pGetSVGElementQrcode(this.displayingList[index].data)
          this.displayingList[index].action.isAbleToShareQrcode = this.utils.canShare(await this.getQrcodeShareObject(this.displayingList[index].data))
        }
      } else {
        this.displayingList = []
      }
      this.busy = false
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
    async getQrcodeShareObject (value: string, scale = 1): Promise<ShareData> {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const qrCodeBase64 = await this.qrCode.pGetImageDataQrCode(value, {
            scale
          })
          const qrCodeBlob = await this.utils.getBlob(qrCodeBase64)
          const file = new File([qrCodeBlob], `qrcode-${new Date().getTime()}.webp`, { type: qrCodeBlob.type })
          resolve({
            title: 'Share Qrcode',
            files: [
              file
            ]
          })
        }, 300)
      })
    },
    async shareQrcode (index: number) {
      return await this.utils.share(await this.getQrcodeShareObject(this.displayingList[index].data, 50))
    },
    async saveQrcode (index: number) {
      const link = document.createElement('a')
      document.body.appendChild(link)
      link.setAttribute('type', 'hidden')
      link.href = await this.qrCode.pGetImageDataQrCode(this.displayingList[index].data, {
        scale: 50
      })
      link.download = `qrcode-${new Date().getTime()}.webp`
      link.click()
      document.body.removeChild(link)
    },
    async deleteQrcode (index: number) {
      try {
        await this.generatingQrCodeObjectStore.deleteGeneratingQrCodeItem(this.displayingList[index].id)
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
export default class GeneratingHistoryDetailCard extends Vue {
  indexedDb = useIndexedDb()
  utils = useUtils()
  qrCode = useQrCode()
  generatingQrCodeObjectStore = useGeneratingQrCodeObjectStore(this.indexedDb.db)
}
</script>

<style>
</style>
