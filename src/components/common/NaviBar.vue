<template>
  <div
    class="flex justify-center items-center fixed w-full bottom-0 left-0 right-0 z-10 flex-col md:flex-row"
  >
    <div
      class="md:absolute flex w-full md:w-min mb-0 md:mb-5 p-4 transition-opacity rounded-none md:rounded-full shadow-lg bg-gray-900 text-white z-0"
    >
      <router-link
        to="/"
        class="px-5 w-full md:w-min border-r-2 cursor-pointer"
        :class="{'text-gray-400': !isActive('Home')}"
      >
        Scanner
      </router-link>
      <router-link
        to="/generator"
        class="px-5 w-full md:w-min cursor-pointer"
        :class="{'text-gray-400': !isActive('QrCodeGenerator')}"
      >
        Generator
      </router-link>
    </div>
    <div
      ref="popupWrap"
      class="relative left-42 md:left-36 order-first rounded-full w-10 h-10 text-white font-bold p-2 bg-gray-900 mb-5 md:ml-5 ml-auto md:mr-0 mr-5 z-15 cursor-pointer"
      :class="{'cursor-not-allowed bg-gray-600': !popup.containerShow}"
      @click="() => {if (popup.containerShow) popup.show = !popup.show }"
    >
      <template
        v-if="!popup.show"
      >
        ▲
      </template>
      <template
        v-else
      >
        ▼
      </template>
      <div
        v-if="popup.show"
        class="md:left-[-5.2rem] left-[-10.5rem] absolute bottom-11 bg-gray-500 w-52 px-5 py-2 rounded-md shadow-md z-15 text-left divide-y divide-dashed"
        style="scrollbar-width: thin;"
      >
        <p
          :key="`${menu.label}-${index}`"
          v-for="menu, index in popup.menus"
          class="py-2 cursor-pointer"
          @click="menu.cb"
        >
          {{ menu.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { Vue, Options } from 'vue-class-component'
import { useRoute } from 'vue-router'
import useEmitter from '@/composables/useEmitter'
import { Emitter, EventType } from 'mitt'

interface IMenu {
  label: string
  cb: any
}

const usePopupMenu = (emitter: Emitter<Record<EventType, unknown>>) => {
  const route = useRoute()
  const show : Ref<boolean> = ref(false)
  const containerShow : Ref<boolean> = ref(true)
  const menus : Ref<IMenu[]> = ref([])
  watch(route, (newRoute) => {
    if (newRoute.name === 'Home') {
      show.value = false
      containerShow.value = true
      menus.value.push(
        {
          label: 'Upload Image',
          cb () {
            emitter.emit('$upload-popup:open')
          }
        }
      )
    } else {
      show.value = false
      containerShow.value = false
      menus.value = []
    }
  })
  return {
    show,
    menus,
    containerShow
  }
}

@Options({
  methods: {
    isActive (routeName: string) {
      return this.$route.name === routeName
    },
    close (e: any) {
      if (!this.$refs.popupWrap.contains(e.target)) {
        this.popup.show = false
      }
    }
  },
  watch: {
    'popup.containerShow' (value: boolean) {
      if (value) {
        document.addEventListener('click', this.close)
      } else {
        document.removeEventListener('click', this.close)
      }
    }
  },
  mounted () {
    if (this.popup.containerShow) {
      document.addEventListener('click', this.close)
    }
  },
  beforeDestroy () {
    if (this.popup.containerShow) {
      document.removeEventListener('click', this.close)
    }
  }
})

export default class NaviBar extends Vue {
  emitter = useEmitter()
  popup = usePopupMenu(this.emitter)
}
</script>
