<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    (if using
    <code>&lt;script setup&gt;</code>)
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <router-link to="/one">Page one</router-link>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup: () => {
    const count = ref(0)

    return { count }
  },
})
</script>

<style lang="stylus" scoped>
a
  color #42b983

label
  margin 0 0.5em
  font-weight bold

code
  background-color #eee
  padding 2px 4px
  border-radius 4px
  color #304455
</style>
