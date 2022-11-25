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
        v-if="qrCodeGenerator.qrCodeSvg"
        class="bg-white w-96 h-96 rounded-md shadow-xl my-10"
      >
        <div
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
  const debouncedGetSVGElementQrcode: {
    (data: string, options?: QRCodeToStringOptions, cb?: (result: string) => void): void
    clear(): void
  } = utils.debounce(qrCode.getSVGElementQrcode, 1000)
  watch(qrCodeData, (value: string) => {
    if (value) {
      debouncedGetSVGElementQrcode(value, {}, (result: string) => {
        if (value) {
          qrCodeSvg.value = result
        }
      })
    } else {
      qrCodeSvg.value = ''
      debouncedGetSVGElementQrcode.clear()
    }
  })
  return {
    qrCodeSvg,
    qrCodeData
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
