<template>
  <div
    class="flex justify-center fixed w-full bottom-0 left-0 right-0 z-20"
  >
    <div
      class="flex w-full md:w-min mb-0 md:mb-5 p-4 transition-opacity rounded-none md:rounded-full shadow-lg bg-gray-900 text-white"
    >
      <router-link
        to="/"
        class="px-5 w-full md:w-min border-r-2 cursor-pointer"
        :class="{'text-gray-400': isActive('Home')}"
      >
        Scanner
      </router-link>
      <router-link
        to="/generator"
        class="px-5 w-full md:w-min cursor-pointer"
        :class="{'text-gray-400': isActive('QrCodeGenerator')}"
      >
        Generator
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

@Options({
  methods: {
    isActive (routeName: string) {
      return this.$route.name === routeName
    }
  }
})

export default class NaviBar extends Vue {
}
</script>
