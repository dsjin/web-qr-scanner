<template>
  <div
    v-if="props.show"
    class="flex justify-center fixed w-full bottom-0 left-0 right-0 z-50"
  >
    <div
      class="flex w-full md:w-1/2 mb-0 md:mb-5 p-4 text-left transition-opacity rounded-none md:rounded-md shadow-lg opacity-0"
      :class="[`${props.bgColor} ${props.textColor}`, {'opacity-100': appearedPopup}]"
    >
      <p
        class="w-11/12 break-words"
      >
        {{ props.msg }}
      </p>
      <div
        class="flex justify-center items-center w-1/12 cursor-pointer"
        @click="close"
      >
        X
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { IAlertPopupProps } from '@/assets/interface/alertPopup'

interface Data {
  props: IAlertPopupProps
  executedHandler: number | null
  appearedPopup: boolean
}

@Options({
  data () : Data {
    return {
      props: {
        msg: '',
        show: false,
        bgColor: 'bg-gray-700',
        textColor: 'text-white',
        timeout: 0
      },
      executedHandler: null,
      appearedPopup: false
    }
  },
  methods: {
    close () {
      this.appearedPopup = false
      if (this.executedHandler) {
        clearTimeout(this.executedHandler)
        this.executedHandler = null
      }
      setTimeout(() => {
        this.props.show = false
        this.props.msg = ''
        this.props.bgColor = 'bg-gray-700'
        this.props.textColor = 'text-white'
      }, 100)
    }
  },
  mounted () {
    this.emitter.on('$alert-popup:show', () => {
      this.props.show = true
      setTimeout(() => {
        if (this.executedHandler) {
          clearTimeout(this.executedHandler)
          this.executedHandler = null
        }
        if (this.props.timeout !== 0) {
          this.executedHandler = setTimeout(() => {
            this.close()
          }, this.props.timeout)
        }
        this.appearedPopup = true
      }, 100)
    })
    this.emitter.on('$alert-popup:close', () => {
      this.close()
    })
    this.emitter.on('$alert-popup:msg', (msg: string) => {
      this.props.msg = msg
    })
    this.emitter.on('$alert-popup:bgColor', (val: string) => {
      this.props.bgColor = val
    })
    this.emitter.on('$alert-popup:textColor', (val: string) => {
      this.props.textColor = val
    })
    this.emitter.on('$alert-popup:timeout', (val: number) => {
      this.props.timeout = val
    })
  },
  unmounted () {
    this.emitter.off('$alert-popup:show')
    this.emitter.off('$alert-popup:msg')
    this.emitter.off('$alert-popup:bgColor')
    this.emitter.off('$alert-popup:textColor')
    this.emitter.off('$alert-popup:timeout')
  }
})

export default class AlertPopup extends Vue {
}
</script>
