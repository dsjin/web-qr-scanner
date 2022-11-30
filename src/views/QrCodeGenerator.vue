<template>
  <div
    class="qrcode-generator min-h-screen w-screen bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 pb-16"
    :class="{'h-screen': historyInfo.show, 'overflow-hidden': historyInfo.show}"
  >
    <h1
      class="pt-10 font-semibold text-6xl md:text-8xl text-white mix-blend-overlay"
    >
      Qrcode Generator
    </h1>
    <div class="absolute right-4 top-4 text-white font-bold text-md rounded-full h-10 w-30 md:w-auto truncate p-3 bg-gray-900 flex items-center justify-center cursor-pointer z-9" @click="openHistory">
      <p
        class="truncate"
      >
        History
      </p>
    </div>
    <div
      class="qrcode-form p-4 md:py-10 flex flex-col items-center"
    >
      <div
        v-if="qrCodeGenerator.qrCodeSvg || qrCodeGenerator.isProcessing"
        class="bg-white w-96 h-96 rounded-md shadow-xl mt-10 mb-5"
      >
        <div
          v-if="qrCodeGenerator.isProcessing"
          class="absolute w-96 h-96 bg-gray-500 opacity-80"
        />
        <div
          v-if="qrCodeGenerator.isProcessing"
          class="flex justify-center items-center absolute w-96 h-96"
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
        <div
          v-if="qrCodeGenerator.qrCodeSvg"
          v-html="qrCodeGenerator.qrCodeSvg"
        />
      </div>
      <div
        v-if="qrCodeGenerator.qrCodeSvg && !qrCodeGenerator.isProcessing"
        class="flex justify-end w-96 flex-grow flex-initial"
      >
        <div
          class="text-white font-bold text-md rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center cursor-pointer"
          @click="qrCodeGenerator.toggleShowAction"
        >
          <template
            v-if="!qrCodeGenerator.showAction"
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
      <div
        v-if="qrCodeGenerator.showAction && qrCodeGenerator.qrCodeSvg && !qrCodeGenerator.isProcessing"
        class="flex flex-col w-full md:w-96 mt-4"
      >
        <div
          v-if="qrCodeGenerator.isAbleToShareQrcode"
          class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4"
          @click="qrCodeGenerator.shareQrcode"
        >
          <p
            class="truncate"
          >
            Share
          </p>
        </div>
        <div class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4" @click="qrCodeGenerator.saveQrcode">
          <p
            class="truncate"
          >
            Save an image
          </p>
        </div>
        <div class="text-white font-bold text-md rounded-full h-10 w-auto p-3 bg-gray-900 flex items-center justify-center cursor-pointer mb-4" @click="qrCodeGenerator.saveQrcodeItemToHistoryList">
          <p
            class="truncate"
          >
            Save to the history list
          </p>
        </div>
      </div>
      <label for="qrcode-textarea" class="w-full md:w-3/5 lg:w-2/5 text-left text-white p-2 text-xl md:text-2xl">
        Input Data
      </label>
      <textarea
        v-model="qrCodeGenerator.qrCodeData"
        name="qrcode-textarea"
        class="p-4 w-full md:w-3/5 lg:w-2/5 h-52 md:h-96 rounded-md shadow-xl resize-none"
      />
    </div>
  </div>
  <generating-history-detail-card
    :info="historyInfo"
  />
</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import useUtils, { IUseUtils } from '@/composables/useUtils'
import useQrCode, { IUseQrCode } from '@/composables/useQrCode'
import { QRCodeToStringOptions } from 'qrcode'
import useEmitter from '@/composables/useEmitter'
import useIndexedDb from '@/composables/useIndexedDb'
import useGeneratingQrCodeObjectStore, { IUseGeneratingQrCodeObjectStore } from '@/composables/useGeneratingQrCodeObjectStore'
import { Emitter, EventType } from 'mitt'
import GeneratingHistoryDetailCard from '@/components/qrcode/GeneratingHistoryDetailCard.vue'

interface ShareData {
  files?: File[]
  text?: string
  title?: string
  url?: string
}

const useQrCodeGenerator = (utils: IUseUtils, qrCode: IUseQrCode, generatingQrCodeObjectStore: IUseGeneratingQrCodeObjectStore, emitter: Emitter<Record<EventType, unknown>>) => {
  const qrCodeSvg: Ref<string> = ref('')
  const qrCodeData: Ref<string> = ref('')
  const isProcessing: Ref<boolean> = ref(false)
  const showAction: Ref<boolean> = ref(false)
  const isAbleToShareQrcode: Ref<boolean> = ref(false)
  const debouncedGetSVGElementQrcode: {
    (data: string, options?: QRCodeToStringOptions, cb?: (result: string) => void): void
    clear(): void
  } = utils.debounce(qrCode.getSVGElementQrcode, 1000)
  const toggleShowAction = () => {
    showAction.value = !showAction.value
  }
  const getQrcodeShareObject = async (scale = 1): Promise<ShareData> => {
    const qrCodeBase64 = await qrCode.pGetImageDataQrCode(qrCodeData.value, {
      scale
    })
    const qrCodeBlob = await utils.getBlob(qrCodeBase64)
    const file = new File([qrCodeBlob], `qrcode-${new Date().getTime()}.webp`, { type: qrCodeBlob.type })
    return {
      title: 'Share Qrcode',
      files: [
        file
      ]
    }
  }
  const canShareQrcode = async () => {
    return utils.canShare(await getQrcodeShareObject())
  }
  const shareQrcode = async () => {
    await utils.share(await getQrcodeShareObject(50))
  }
  const saveQrcode = async () => {
    const link = document.createElement('a')
    document.body.appendChild(link)
    link.setAttribute('type', 'hidden')
    link.href = await qrCode.pGetImageDataQrCode(qrCodeData.value, {
      scale: 50
    })
    link.download = `qrcode-${new Date().getTime()}.webp`
    link.click()
    document.body.removeChild(link)
  }
  const saveQrcodeItemToHistoryList = async () => {
    try {
      await generatingQrCodeObjectStore.writeGeneratingQrCodeItem(
        {
          data: qrCodeData.value,
          timestamp: new Date().getTime()
        }
      )
      emitter.emit('$alert-popup:msg', 'Saved to the history list.')
      emitter.emit('$alert-popup:bgColor', 'bg-green-500')
      emitter.emit('$alert-popup:timeout', 3000)
      emitter.emit('$alert-popup:show')
    } catch (e: any) {
      emitter.emit('$alert-popup:msg', e.message)
      emitter.emit('$alert-popup:bgColor', 'bg-red-500')
      emitter.emit('$alert-popup:timeout', 3000)
      emitter.emit('$alert-popup:show')
    }
  }
  watch(showAction, async (value: boolean) => {
    if (value) {
      isAbleToShareQrcode.value = await canShareQrcode()
    }
  })
  watch(qrCodeData, (value: string) => {
    if (value) {
      isProcessing.value = true
      debouncedGetSVGElementQrcode(value, {}, (result: string) => {
        qrCodeSvg.value = result
        isProcessing.value = false
      })
    } else {
      qrCodeSvg.value = ''
      debouncedGetSVGElementQrcode.clear()
      isProcessing.value = false
      isAbleToShareQrcode.value = false
      showAction.value = false
    }
  })
  return {
    qrCodeSvg,
    qrCodeData,
    isProcessing,
    showAction,
    isAbleToShareQrcode,
    toggleShowAction,
    canShareQrcode,
    shareQrcode,
    saveQrcode,
    saveQrcodeItemToHistoryList
  }
}

@Options({
  components: {
    GeneratingHistoryDetailCard
  },
  data () {
    return {
      historyInfo: {
        historyList: [],
        show: false
      }
    }
  },
  methods: {
    async openHistory () {
      try {
        this.historyInfo.historyList = await this.generatingQrCodeObjectStore.getAllGeneratingQrCode()
        this.historyInfo.show = true
      } catch (e: any) {
        this.emitter.emit('$alert-popup:msg', e.message)
        this.emitter.emit('$alert-popup:bgColor', 'bg-red-500')
        this.emitter.emit('$alert-popup:timeout', 3000)
        this.emitter.emit('$alert-popup:show')
      }
    }
  }
})

export default class QrCodeGenerator extends Vue {
  emitter = useEmitter()
  indexDb = useIndexedDb()
  utils = useUtils()
  qrCode = useQrCode()
  generatingQrCodeObjectStore = useGeneratingQrCodeObjectStore(this.indexDb.db)
  qrCodeGenerator = useQrCodeGenerator(this.utils, this.qrCode, this.generatingQrCodeObjectStore, this.emitter)
}
</script>
