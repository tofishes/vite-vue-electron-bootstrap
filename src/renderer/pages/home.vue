<template>
  <div class="wapper">
    <header>
      <n-button-group>
        <n-button round>添加本地项目</n-button>
        <n-button round>添加Git</n-button>
      </n-button-group>
    </header>

    <main>
      <n-table title="项目列表"> </n-table>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<style lang="stylus">
body
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  color #2c3e50

.wapper
  padding 30px
</style>
