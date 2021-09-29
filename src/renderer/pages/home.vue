<template>
  <img alt="Vue logo" src="../assets/logo.png" />

  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite + Electron" />
  <el-button>I am ElButton</el-button>
  <n-button type="primary">Primary</n-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  text-align center
  color #2c3e50
  margin-top 60px
</style>
