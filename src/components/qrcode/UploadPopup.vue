<template>
  <input ref="file" type="file" class="hidden" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  methods: {
    launchFilePicker () {
      this.$refs.file.click()
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
