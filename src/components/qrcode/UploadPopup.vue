<template>
  <input ref="file" type="file" class="hidden" @change="handleFile"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  methods: {
    launchFilePicker () {
      this.$refs.file.click()
    },
    handleFile (e: any) {
      const fileInfo = e.target.files[0]
      if (fileInfo) {
        if (!fileInfo.type.match('image.*')) {
          this.emitter.emit('$alert-popup:msg', 'Invalid File Format')
          this.emitter.emit('$alert-popup:bgColor', 'bg-red-500')
          this.emitter.emit('$alert-popup:timeout', 3000)
          this.emitter.emit('$alert-popup:show')
          return
        }
        this.emitter.emit('$qrcode:check-image-file', fileInfo)
      }
    }
  },
  mounted () {
    this.emitter.on('$upload-popup:open', () => {
      this.$refs.file.click()
    })
  },
  unmounted () {
    this.emitter.off('$upload-popup:open')
  }
})

export default class UploadPopup extends Vue {
}
</script>

<style>
</style>
