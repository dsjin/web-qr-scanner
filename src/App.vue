<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view />
  <alert-popup />
  <navi-bar />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import AlertPopup from '@/components/common/AlertPopup.vue'
import NaviBar from '@/components/common/NaviBar.vue'

@Options({
  components: {
    AlertPopup,
    NaviBar
  }
})

export default class App extends Vue {
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
