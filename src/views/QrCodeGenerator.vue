<template>
  <div class="qrcode-generator min-h-screen w-screen bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 pb-16">
    <h1
      class="pt-10 font-semibold text-6xl md:text-8xl text-white mix-blend-overlay"
    >
      Qrcode Generator
    </h1>
    <div
      class="qrcode-form p-4 md:py-10 flex flex-col items-center"
    >
      <div
        v-if="qrCodeGenerator.qrCodeSvg || qrCodeGenerator.isProcessing"
        class="bg-white w-96 h-96 rounded-md shadow-xl my-10"
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
      <label for="qrcode-textarea" class="w-full md:w-2/5 text-left text-white p-2 text-xl md:text-2xl">
        Input Data
      </label>
      <textarea
        v-model="qrCodeGenerator.qrCodeData"
        name="qrcode-textarea"
        class="p-4 w-full md:w-2/5 h-52 md:h-96 rounded-md shadow-xl resize-none"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import useUtils, { IUseUtils } from '@/composables/useUtils'
import useQrCode, { IUseQrCode } from '@/composables/useQrCode'
import { QRCodeToStringOptions } from 'qrcode'

const useQrCodeGenerator = (utils: IUseUtils, qrCode: IUseQrCode) => {
  const qrCodeSvg: Ref<string> = ref('')
  const qrCodeData: Ref<string> = ref('')
  const isProcessing: Ref<boolean> = ref(false)
  const debouncedGetSVGElementQrcode: {
    (data: string, options?: QRCodeToStringOptions, cb?: (result: string) => void): void
    clear(): void
  } = utils.debounce(qrCode.getSVGElementQrcode, 1000)
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
    }
  })
  return {
    qrCodeSvg,
    qrCodeData,
    isProcessing
  }
}

@Options({
  data () {
    return {}
  }
})
export default class QrCodeGenerator extends Vue {
  utils = useUtils()
  qrCode = useQrCode()
  qrCodeGenerator = useQrCodeGenerator(this.utils, this.qrCode)
}
</script>
