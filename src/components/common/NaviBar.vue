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
      @click="popup.show = !popup.show"
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
import { Ref, ref } from 'vue'
import { Vue, Options } from 'vue-class-component'

interface IMenu {
  label: string
  cb: any
}

const usePopupMenu = () => {
  const show : Ref<boolean> = ref(false)
  const menus : Ref<IMenu[]> = ref([])
  menus.value.push(
    {
      label: 'Upload Image',
      cb () {
        console.log('test')
      }
    }
  )
  return {
    show,
    menus
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
  mounted () {
    document.addEventListener('click', this.close)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.close)
  }
})

export default class NaviBar extends Vue {
  popup = usePopupMenu()
}
</script>
