<template>
  <BasePage customNav>
    <Editor></Editor>
  </BasePage>
</template>

<script lang="ts">
import { Vue, Component } from '@app/mixins'
import Editor from './components/muya/index.vue'

@Component({
  components: { Editor },
})
export default class extends Vue {}
</script>

<style lang="scss" scoped></style>
