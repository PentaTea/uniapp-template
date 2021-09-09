<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from './mixins'

@Component({
  components: {},
})
export default class extends Vue {
  mounted() {
    this.hashBus.use('提交', () => {
      console.log('提交!', this.muya)
    })
  }
}
</script>

<style lang="scss" scoped></style>
