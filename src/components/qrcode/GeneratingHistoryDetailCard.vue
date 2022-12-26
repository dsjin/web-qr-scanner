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
        class="relative p-5 md:p-10 bg-gray-500 text-2xl text-white my-10 md:my-20"
        :class="{'h-[calc(100vh-10rem)] md:h-[calc(100vh-16rem)]': !firstInit && displayingList.length > 0}"
      >
        <template
          v-if="busy && firstInit"
        >
          <div
            class="flex justify-center items-center w-full h-full"
          >
            <loading />
          </div>
        </template>
        <template
          v-else
        >
          <template
            v-if="displayingList.length !== 0"
          >
            <div
              class="flex justify-center items-center w-full h-full absolute left-0 top-0 bg-gray-500 bg-opacity-70 z-20"
              v-if="busy && !firstInit"
            >
              <loading />
            </div>
            <dynamic-scroller
              ref="scroller"
              :items="displayingList"
              :min-item-size="400"
              class="h-full"
            >
              <template v-slot="{ item: qrcode, index, active }">
                <dynamic-scroller-item
                  :item="qrcode"
                  :active="active"
                  :size-dependencies="[
                    qrcode
                  ]"
                  :data-index="qrcode.id"
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
                          {{ qrcode.id }}
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
              <template #after>
                <div
                  class="w-full px-0 md:px-10"
                >
                  <button
                    class="text-white font-bold text-md rounded-full h-10 w-full bg-gray-900 flex items-center justify-center cursor-pointer"
                    @click="$emit('fetch-data')"
                  >
                    Load more
                  </button>
                </div>
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
      busy: false,
      firstInit: true
    }
  },
  watch: {
    async 'info.show' (val) {
      this.busy = true
      if (val && this.firstInit) {
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
        this.firstInit = false
      } else {
        this.displayingList = []
      }
      this.busy = false
    },
    async 'info.historyList' (val) {
      this.busy = true
      if (val.length > 0 && !this.firstInit) {
        const currentIndex = this.displayingList.length
        for (let index = currentIndex; index < (this.info as IGeneratingHistoryDetailCard).historyList.length; index++) {
          this.displayingList.push(
            {
              ...(this.info as IGeneratingHistoryDetailCard).historyList[index],
              action: {
                show: false,
                isAbleToShareQrcode: false
              },
              html: {
                svg: ''
              }
            }
          )
        }
        for (let index = currentIndex; index < this.displayingList.length; index++) {
          this.displayingList[index].html.svg = await this.qrCode.pGetSVGElementQrcode(this.displayingList[index].data)
          this.displayingList[index].action.isAbleToShareQrcode = this.utils.canShare(await this.getQrcodeShareObject(this.displayingList[index].data))
        }
        this.$refs.scroller.onScrollerResize()
      }
      this.busy = false
    }
  },
  methods: {
    close () {
      this.info.historyList = []
      this.info.show = false
      this.firstInit = true
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
